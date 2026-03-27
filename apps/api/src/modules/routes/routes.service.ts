import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Route, RouteDocument } from './schemas/route.schema';
import { AuditService } from '../audit/audit.service';
import { RouteStatus, RouteStopStatus, AuditAction, UserRole } from '@foodconnect/types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RoutesService {
  constructor(
    @InjectModel(Route.name) private routeModel: Model<RouteDocument>,
    private auditService: AuditService,
  ) {}

  async create(data: any) {
    const routeCode = `RT-${uuidv4().slice(0, 8).toUpperCase()}`;
    return this.routeModel.create({ ...data, routeCode });
  }

  async findAll(filter: Record<string, unknown> = {}) {
    return this.routeModel.find(filter).populate('donationId', 'donationType status').lean();
  }

  async findById(id: string) {
    const r = await this.routeModel.findById(id)
      .populate('donationId', 'donationType status quantity')
      .populate('volunteerId', 'fullName')
      .lean();
    if (!r) throw new NotFoundException({ code: 'ROUTE_NOT_FOUND', message: 'Route not found' });
    return r;
  }

  async start(id: string, actorId: string) {
    const route = await this.routeModel.findById(id);
    if (!route) throw new NotFoundException({ code: 'ROUTE_NOT_FOUND', message: 'Route not found' });
    if (route.status !== RouteStatus.PLANNED) {
      throw new BadRequestException({ code: 'ROUTE_INVALID_STATE', message: 'Route is not in planned state' });
    }
    route.status = RouteStatus.IN_PROGRESS;
    route.actualStartAt = new Date();
    await route.save();
    return route;
  }

  async complete(id: string, actorId: string) {
    const route = await this.routeModel.findById(id);
    if (!route) throw new NotFoundException({ code: 'ROUTE_NOT_FOUND', message: 'Route not found' });
    const pendingStops = route.stops.filter(s => s.status === RouteStopStatus.PENDING);
    if (pendingStops.length > 0) {
      throw new BadRequestException({ code: 'ROUTE_STOPS_INCOMPLETE', message: 'All mandatory stops must be resolved' });
    }
    route.status = RouteStatus.COMPLETED;
    route.actualEndAt = new Date();
    await route.save();
    return route;
  }

  async reroute(id: string, reason: string, newStops: any[], actorId: string) {
    const route = await this.routeModel.findById(id);
    if (!route) throw new NotFoundException({ code: 'ROUTE_NOT_FOUND', message: 'Route not found' });

    const oldStopIds = route.stops.map(s => s.hotspotId.toString());
    route.rerouteHistory.push({
      triggeredAt: new Date(),
      reason,
      oldStopIds,
      newStopIds: newStops.map(s => s.hotspotId),
      actorId,
    });
    route.stops = newStops;
    await route.save();

    await this.auditService.log({
      actorUserId: actorId,
      actorRole: UserRole.NGO_MANAGER,
      action: AuditAction.ROUTE_REROUTED,
      entityType: 'Route',
      entityId: id,
      reason,
      after: { newStops: newStops.length },
    });

    return route;
  }

  async arriveAtStop(routeId: string, stopId: string, actorId: string) {
    const route = await this.routeModel.findById(routeId);
    if (!route) throw new NotFoundException({ code: 'ROUTE_NOT_FOUND', message: 'Route not found' });
    const stop = route.stops.find((_, i) => i.toString() === stopId || (route.stops[parseInt(stopId)] !== undefined && parseInt(stopId).toString() === stopId));
    if (!stop) throw new NotFoundException({ code: 'STOP_NOT_FOUND', message: 'Stop not found' });
    stop.status = RouteStopStatus.ARRIVED;
    stop.actualArrivalAt = new Date();
    await route.save();
    return route;
  }

  async completeStop(routeId: string, stopIndex: string, data: any, actorId: string) {
    const route = await this.routeModel.findById(routeId);
    if (!route) throw new NotFoundException({ code: 'ROUTE_NOT_FOUND', message: 'Route not found' });
    const idx = parseInt(stopIndex);
    if (isNaN(idx) || !route.stops[idx]) throw new NotFoundException({ code: 'STOP_NOT_FOUND', message: 'Stop not found' });
    route.stops[idx].status = RouteStopStatus.COMPLETED;
    route.stops[idx].completedAt = new Date();
    route.stops[idx].quantityDelivered = data.quantityDelivered;
    route.stops[idx].fieldNotes = data.fieldNotes;
    await route.save();
    return route;
  }

  async reportIssue(id: string, description: string, reportedBy: string) {
    const route = await this.routeModel.findById(id);
    if (!route) throw new NotFoundException({ code: 'ROUTE_NOT_FOUND', message: 'Route not found' });
    route.issueLog.push({ reportedAt: new Date(), reportedBy, description, resolved: false });
    route.status = RouteStatus.ISSUE_REPORTED;
    await route.save();

    await this.auditService.log({
      actorUserId: reportedBy,
      actorRole: UserRole.VOLUNTEER,
      action: AuditAction.ROUTE_ISSUE_REPORTED,
      entityType: 'Route',
      entityId: id,
      after: { description },
    });

    return route;
  }
}
