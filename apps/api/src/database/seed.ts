import 'reflect-metadata';
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');
import { join } from 'path';

dotenv.config({ path: join(__dirname, '../../.env') });
dotenv.config({ path: join(__dirname, '../../../../env/.env.example') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodconnect';
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@foodconnect.local';
const DEFAULT_PASSWORD = process.env.SEED_DEFAULT_PASSWORD || 'Password123!';

async function seed() {
  console.log('🌱 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected');

  const db = mongoose.connection.db!;
  const hash = await bcrypt.hash(DEFAULT_PASSWORD, 12);

  // Clear existing data
  const collections = ['users','donor_profiles','ngo_profiles','volunteer_profiles','donations','hotspots','routes','notifications','audit_logs','refresh_tokens','recurring_support_plans'];
  for (const col of collections) {
    try { await db.collection(col).deleteMany({}); } catch { /* ok */ }
  }
  console.log('🗑️  Cleared existing data');

  // Create users
  const usersCol = db.collection('users');
  const ngosCol = db.collection('ngo_profiles');
  const donorsCol = db.collection('donor_profiles');
  const volunteersCol = db.collection('volunteer_profiles');
  const donationsCol = db.collection('donations');
  const hotspotsCol = db.collection('hotspots');

  // Admin
  const admin = await usersCol.insertOne({ fullName: 'Super Admin', email: ADMIN_EMAIL, passwordHash: hash, role: 'admin', isActive: true, createdAt: new Date(), updatedAt: new Date() });

  // Donors
  const donor1 = await usersCol.insertOne({ fullName: 'Rahul Mehta', email: 'donor1@foodconnect.local', passwordHash: hash, role: 'donor', isActive: true, phone: '+919876543210', createdAt: new Date(), updatedAt: new Date() });
  const donor2 = await usersCol.insertOne({ fullName: 'Priya Restaurant', email: 'donor2@foodconnect.local', passwordHash: hash, role: 'donor', isActive: true, createdAt: new Date(), updatedAt: new Date() });
  const donor3 = await usersCol.insertOne({ fullName: 'Ananya Hotel', email: 'donor3@foodconnect.local', passwordHash: hash, role: 'donor', isActive: true, createdAt: new Date(), updatedAt: new Date() });
  const donor4 = await usersCol.insertOne({ fullName: 'Vikram Catering', email: 'donor4@foodconnect.local', passwordHash: hash, role: 'donor', isActive: true, createdAt: new Date(), updatedAt: new Date() });

  await donorsCol.insertMany([
    { userId: donor1.insertedId, donorType: 'individual', defaultAddress: { street: 'Linking Road', city: 'Mumbai', pincode: '400050', state: 'Maharashtra' }, geoPoint: { type: 'Point', coordinates: [72.8295, 19.0607] }, preferredRadiusKm: 10, preferredDonationTypes: ['cooked_meal'], wantsImpactReports: true, anonymityPreference: 'public' },
    { userId: donor2.insertedId, donorType: 'restaurant', defaultAddress: { street: 'Hill Road', city: 'Mumbai', pincode: '400050', state: 'Maharashtra' }, geoPoint: { type: 'Point', coordinates: [72.8183, 19.0542] }, preferredRadiusKm: 15, preferredDonationTypes: ['cooked_meal', 'mixed_pack'], wantsImpactReports: true, anonymityPreference: 'semi_anonymous' },
    { userId: donor3.insertedId, donorType: 'hotel', defaultAddress: { street: 'Nariman Point', city: 'Mumbai', pincode: '400021', state: 'Maharashtra' }, geoPoint: { type: 'Point', coordinates: [72.8236, 18.9245] }, preferredRadiusKm: 20, preferredDonationTypes: ['ration_kit', 'dry_food'], wantsImpactReports: false, anonymityPreference: 'anonymous' },
    { userId: donor4.insertedId, donorType: 'caterer', defaultAddress: { street: 'Powai', city: 'Mumbai', pincode: '400076', state: 'Maharashtra' }, geoPoint: { type: 'Point', coordinates: [72.9081, 19.1176] }, preferredRadiusKm: 12, preferredDonationTypes: ['cooked_meal', 'ration_kit'], wantsImpactReports: true, anonymityPreference: 'public' },
  ]);

  // NGO Managers
  const ngoUser1 = await usersCol.insertOne({ fullName: 'Anna Roth - Annapoorna', email: 'ngo1@foodconnect.local', passwordHash: hash, role: 'ngo_manager', isActive: true, createdAt: new Date(), updatedAt: new Date() });
  const ngoUser2 = await usersCol.insertOne({ fullName: 'Suresh Patel - Roti Bank', email: 'ngo2@foodconnect.local', passwordHash: hash, role: 'ngo_manager', isActive: true, createdAt: new Date(), updatedAt: new Date() });
  const ngoUser3 = await usersCol.insertOne({ fullName: 'Fatima Khan - Aashray', email: 'ngo3@foodconnect.local', passwordHash: hash, role: 'ngo_manager', isActive: true, createdAt: new Date(), updatedAt: new Date() });
  const ngoUser4 = await usersCol.insertOne({ fullName: 'Ramesh Das - Sewa', email: 'ngo4@foodconnect.local', passwordHash: hash, role: 'ngo_manager', isActive: true, createdAt: new Date(), updatedAt: new Date() });
  const ngoUser5 = await usersCol.insertOne({ fullName: 'Meera Joshi - Hunger Free', email: 'ngo5@foodconnect.local', passwordHash: hash, role: 'ngo_manager', isActive: true, createdAt: new Date(), updatedAt: new Date() });
  const ngoUser6 = await usersCol.insertOne({ fullName: 'Arjun Singh - RapidRelief', email: 'ngo6@foodconnect.local', passwordHash: hash, role: 'ngo_manager', isActive: true, createdAt: new Date(), updatedAt: new Date() });

  const ngoInserts = await ngosCol.insertMany([
    { ownerUserId: ngoUser1.insertedId, name: 'Annapoorna Trust', slug: 'annapoorna-trust', description: 'Serving cooked meals across Mumbai since 2005. Trusted partner with cold storage.', verificationStatus: 'trusted', registrationNumber: 'NGO/MH/2005/001', contactPhone: '+912222334455', contactEmail: 'info@annapoorna.org', serviceAreas: [{ label: 'Bandra', radiusKm: 8 }, { label: 'Kurla', radiusKm: 10 }], acceptedDonationTypes: ['cooked_meal', 'mixed_pack', 'fresh_produce'], pickupSupported: true, averagePickupEtaMinutes: 25, averageResponseMinutes: 15, currentNeedLevel: 'high', dailyCapacity: 500, currentAvailableCapacity: 320, coldStorage: true, reliabilityScore: 0.95, mealsServedCount: 50000, isActive: true, geoPoint: { type: 'Point', coordinates: [72.8295, 19.0607] }, address: { street: 'Turner Road', city: 'Bandra', pincode: '400050', state: 'Maharashtra' }, createdAt: new Date(), updatedAt: new Date() },
    { ownerUserId: ngoUser2.insertedId, name: 'Roti Bank Mumbai', slug: 'roti-bank-mumbai', description: 'Focused on collecting and distributing rotis and dry rations across central Mumbai.', verificationStatus: 'verified', registrationNumber: 'NGO/MH/2012/045', contactPhone: '+912222334456', contactEmail: 'info@rotibank.org', serviceAreas: [{ label: 'Dadar', radiusKm: 7 }, { label: 'Matunga', radiusKm: 6 }], acceptedDonationTypes: ['dry_food', 'ration_kit', 'packaged_food'], pickupSupported: true, averagePickupEtaMinutes: 40, averageResponseMinutes: 20, currentNeedLevel: 'critical', dailyCapacity: 300, currentAvailableCapacity: 280, coldStorage: false, reliabilityScore: 0.88, mealsServedCount: 28000, isActive: true, geoPoint: { type: 'Point', coordinates: [72.8427, 19.0187] }, address: { street: 'Senapati Bapat Marg', city: 'Dadar', pincode: '400028', state: 'Maharashtra' }, createdAt: new Date(), updatedAt: new Date() },
    { ownerUserId: ngoUser3.insertedId, name: 'Aashray Shelter Kitchen', slug: 'aashray-shelter', description: 'Shelter-focused kitchen providing daily meals to homeless individuals.', verificationStatus: 'verified', registrationNumber: 'NGO/MH/2015/112', contactPhone: '+912222334457', contactEmail: 'connect@aashray.org', serviceAreas: [{ label: 'Dharavi', radiusKm: 5 }, { label: 'Sion', radiusKm: 4 }], acceptedDonationTypes: ['cooked_meal', 'dry_food'], pickupSupported: false, averagePickupEtaMinutes: 60, averageResponseMinutes: 45, currentNeedLevel: 'critical', dailyCapacity: 200, currentAvailableCapacity: 175, coldStorage: false, reliabilityScore: 0.75, mealsServedCount: 12000, isActive: true, geoPoint: { type: 'Point', coordinates: [72.8543, 19.0443] }, address: { street: 'Dharavi Main Road', city: 'Dharavi', pincode: '400017', state: 'Maharashtra' }, createdAt: new Date(), updatedAt: new Date() },
    { ownerUserId: ngoUser4.insertedId, name: 'Sewa Ration Centre', slug: 'sewa-ration', description: 'Monthly ration kits for underprivileged families in suburban Mumbai.', verificationStatus: 'unverified', contactPhone: '+912222334458', contactEmail: 'sewa@foodhelp.org', serviceAreas: [{ label: 'Borivali', radiusKm: 10 }], acceptedDonationTypes: ['ration_kit', 'dry_food', 'packaged_food'], pickupSupported: true, averagePickupEtaMinutes: 90, averageResponseMinutes: 60, currentNeedLevel: 'medium', dailyCapacity: 150, currentAvailableCapacity: 90, coldStorage: false, reliabilityScore: 0.60, mealsServedCount: 3000, isActive: true, geoPoint: { type: 'Point', coordinates: [72.8500, 19.2307] }, address: { street: 'LT Road', city: 'Borivali', pincode: '400092', state: 'Maharashtra' }, createdAt: new Date(), updatedAt: new Date() },
    { ownerUserId: ngoUser5.insertedId, name: 'Hunger Free Foundation', slug: 'hunger-free', description: 'City-wide zero hunger initiative. Students and volunteers serve construction sites.', verificationStatus: 'verified', registrationNumber: 'NGO/MH/2018/200', contactPhone: '+912222334459', contactEmail: 'hello@hungerfree.in', serviceAreas: [{ label: 'Vikhroli', radiusKm: 8 }, { label: 'Powai', radiusKm: 8 }], acceptedDonationTypes: ['cooked_meal', 'mixed_pack', 'fresh_produce'], pickupSupported: true, averagePickupEtaMinutes: 35, averageResponseMinutes: 25, currentNeedLevel: 'high', dailyCapacity: 350, currentAvailableCapacity: 200, coldStorage: true, reliabilityScore: 0.82, mealsServedCount: 18000, isActive: true, geoPoint: { type: 'Point', coordinates: [72.9088, 19.1177] }, address: { street: 'Hiranandani Gardens', city: 'Powai', pincode: '400076', state: 'Maharashtra' }, createdAt: new Date(), updatedAt: new Date() },
    { ownerUserId: ngoUser6.insertedId, name: 'RapidRelief Emergency Kitchen', slug: 'rapid-relief', description: 'Emergency food response team. Deploys within 2 hours for disaster relief and urgent requests.', verificationStatus: 'trusted', registrationNumber: 'NGO/MH/2020/301', contactPhone: '+912222334460', contactEmail: 'sos@rapidrelief.org', serviceAreas: [{ label: 'All of Mumbai', radiusKm: 30 }], acceptedDonationTypes: ['cooked_meal', 'ration_kit', 'dry_food', 'mixed_pack', 'fresh_produce', 'packaged_food'], pickupSupported: true, averagePickupEtaMinutes: 20, averageResponseMinutes: 10, currentNeedLevel: 'medium', dailyCapacity: 1000, currentAvailableCapacity: 600, coldStorage: true, reliabilityScore: 0.97, mealsServedCount: 75000, isActive: true, geoPoint: { type: 'Point', coordinates: [72.8777, 19.0760] }, address: { street: 'BKC', city: 'Mumbai', pincode: '400051', state: 'Maharashtra' }, createdAt: new Date(), updatedAt: new Date() },
  ]);

  const ngoIds = Object.values(ngoInserts.insertedIds);
  const [ngo1Id, ngo2Id, ngo3Id, ngo4Id, ngo5Id, ngo6Id] = ngoIds;

  // Volunteers
  const vol1 = await usersCol.insertOne({ fullName: 'Arjun Bike', email: 'volunteer1@foodconnect.local', passwordHash: hash, role: 'volunteer', isActive: true, createdAt: new Date(), updatedAt: new Date() });
  const vol2 = await usersCol.insertOne({ fullName: 'Deepa Walker', email: 'volunteer2@foodconnect.local', passwordHash: hash, role: 'volunteer', isActive: true, createdAt: new Date(), updatedAt: new Date() });
  const vol3 = await usersCol.insertOne({ fullName: 'Karan Van', email: 'volunteer3@foodconnect.local', passwordHash: hash, role: 'volunteer', isActive: true, createdAt: new Date(), updatedAt: new Date() });
  const vol4 = await usersCol.insertOne({ fullName: 'Sneha Moto', email: 'volunteer4@foodconnect.local', passwordHash: hash, role: 'volunteer', isActive: true, createdAt: new Date(), updatedAt: new Date() });

  await volunteersCol.insertMany([
    { userId: vol1.insertedId, linkedNgoId: ngo1Id, availabilityStatus: 'available', vehicleType: 'motorcycle', currentAreaLabel: 'Bandra', geoPoint: { type: 'Point', coordinates: [72.8295, 19.0607] }, canPickup: true, canDeliver: true },
    { userId: vol2.insertedId, linkedNgoId: ngo2Id, availabilityStatus: 'available', vehicleType: 'on_foot', currentAreaLabel: 'Dadar', geoPoint: { type: 'Point', coordinates: [72.8427, 19.0187] }, canPickup: false, canDeliver: true },
    { userId: vol3.insertedId, linkedNgoId: ngo6Id, availabilityStatus: 'available', vehicleType: 'van', currentAreaLabel: 'BKC', geoPoint: { type: 'Point', coordinates: [72.8777, 19.0760] }, canPickup: true, canDeliver: true },
    { userId: vol4.insertedId, linkedNgoId: ngo5Id, availabilityStatus: 'busy', vehicleType: 'motorcycle', currentAreaLabel: 'Powai', geoPoint: { type: 'Point', coordinates: [72.9088, 19.1177] }, canPickup: true, canDeliver: true },
  ]);

  // Hotspots
  await hotspotsCol.insertMany([
    { ngoId: ngo1Id, name: 'Bandra Station Underpass', areaLabel: 'Bandra', geoPoint: { type: 'Point', coordinates: [72.8361, 19.0544] }, activeTimeWindows: [{ window: 'morning' }, { window: 'evening' }], averagePeopleCount: 150, tags: ['urban', 'transit'], status: 'active', displacementRisk: false, lastVerifiedAt: new Date() },
    { ngoId: ngo1Id, name: 'Kurla Flyover Shelter', areaLabel: 'Kurla', geoPoint: { type: 'Point', coordinates: [72.8826, 19.0728] }, activeTimeWindows: [{ window: 'afternoon' }, { window: 'night' }], averagePeopleCount: 80, tags: ['shelter', 'transit'], status: 'active', displacementRisk: false, lastVerifiedAt: new Date() },
    { ngoId: ngo2Id, name: 'Dadar Hospital Perimeter', areaLabel: 'Dadar', geoPoint: { type: 'Point', coordinates: [72.8448, 19.0197] }, activeTimeWindows: [{ window: 'morning' }, { window: 'afternoon' }], averagePeopleCount: 60, tags: ['hospital', 'families'], status: 'active', displacementRisk: false, lastVerifiedAt: new Date() },
    { ngoId: ngo2Id, name: 'Matunga Market Back Lane', areaLabel: 'Matunga', geoPoint: { type: 'Point', coordinates: [72.8408, 19.0271] }, activeTimeWindows: [{ window: 'evening' }], averagePeopleCount: 45, tags: ['market', 'local'], status: 'low_activity', displacementRisk: true, lastVerifiedAt: new Date() },
    { ngoId: ngo3Id, name: 'Dharavi Junction Camp', areaLabel: 'Dharavi', geoPoint: { type: 'Point', coordinates: [72.8543, 19.0443] }, activeTimeWindows: [{ window: 'morning' }, { window: 'afternoon' }, { window: 'evening' }], averagePeopleCount: 200, tags: ['dense', 'daily'], status: 'active', displacementRisk: false, lastVerifiedAt: new Date() },
    { ngoId: ngo3Id, name: 'Sion Night Shelter', areaLabel: 'Sion', geoPoint: { type: 'Point', coordinates: [72.866, 19.0391] }, activeTimeWindows: [{ window: 'night' }], averagePeopleCount: 120, tags: ['night', 'homeless'], status: 'active', displacementRisk: false, lastVerifiedAt: new Date() },
    { ngoId: ngo5Id, name: 'Vikhroli Construction Camp A', areaLabel: 'Vikhroli', geoPoint: { type: 'Point', coordinates: [72.9222, 19.0994] }, activeTimeWindows: [{ window: 'morning' }, { window: 'afternoon' }], averagePeopleCount: 250, tags: ['workers', 'construction'], status: 'active', displacementRisk: false, lastVerifiedAt: new Date() },
    { ngoId: ngo5Id, name: 'Powai Overflow Point', areaLabel: 'Powai', geoPoint: { type: 'Point', coordinates: [72.9088, 19.1177] }, activeTimeWindows: [{ window: 'evening' }], averagePeopleCount: 90, tags: ['urban', 'mixed'], status: 'displaced', displacementRisk: false, lastVerifiedAt: new Date() },
    { ngoId: ngo6Id, name: 'BKC Emergency Station', areaLabel: 'BKC', geoPoint: { type: 'Point', coordinates: [72.8777, 19.0760] }, activeTimeWindows: [{ window: 'morning' }, { window: 'afternoon' }, { window: 'evening' }, { window: 'night' }], averagePeopleCount: 400, tags: ['emergency', '24x7'], status: 'active', displacementRisk: false, lastVerifiedAt: new Date() },
    { ngoId: ngo6Id, name: 'Andheri Shelter Overflow', areaLabel: 'Andheri', geoPoint: { type: 'Point', coordinates: [72.8479, 19.1197] }, activeTimeWindows: [{ window: 'morning' }, { window: 'night' }], averagePeopleCount: 180, tags: ['shelter', 'families'], status: 'active', displacementRisk: false, lastVerifiedAt: new Date() },
  ]);

  // Donations
  const now = new Date();
  const in3h = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  const in8h = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const donor1Profile = await donorsCol.findOne({ userId: donor1.insertedId });
  const donor2Profile = await donorsCol.findOne({ userId: donor2.insertedId });

  await donationsCol.insertMany([
    { donorUserId: donor1.insertedId, donorProfileId: donor1Profile?._id, selectedNgoId: ngo1Id, selectedVolunteerId: vol1.insertedId, donationType: 'cooked_meal', foodType: 'veg', quantity: 50, quantityUnit: 'servings', preparedAt: now, expiresAt: in3h, pickupRequired: true, donorAddress: { street: 'Linking Road', city: 'Mumbai', pincode: '400050', state: 'Maharashtra' }, donorGeoPoint: { type: 'Point', coordinates: [72.8295, 19.0607] }, notes: 'Rice and dal — very fresh', status: 'volunteer_assigned', createdAt: now, updatedAt: now },
    { donorUserId: donor2.insertedId, donorProfileId: donor2Profile?._id, selectedNgoId: ngo2Id, donationType: 'ration_kit', foodType: 'mixed', quantity: 20, quantityUnit: 'boxes', preparedAt: now, expiresAt: in24h, pickupRequired: false, donorAddress: { street: 'Hill Road', city: 'Mumbai', pincode: '400050', state: 'Maharashtra' }, donorGeoPoint: { type: 'Point', coordinates: [72.8183, 19.0542] }, notes: '20 ration kits — rice, dal, oil', status: 'accepted', createdAt: now, updatedAt: now },
    { donorUserId: donor3.insertedId, donorProfileId: donor1Profile?._id, donationType: 'cooked_meal', foodType: 'non_veg', quantity: 30, quantityUnit: 'servings', preparedAt: now, expiresAt: in3h, pickupRequired: true, donorAddress: { street: 'Nariman Point', city: 'Mumbai', pincode: '400021', state: 'Maharashtra' }, donorGeoPoint: { type: 'Point', coordinates: [72.8236, 18.9245] }, notes: 'Chicken biryani from event', status: 'posted', createdAt: now, updatedAt: now },
    { donorUserId: donor4.insertedId, donorProfileId: donor1Profile?._id, selectedNgoId: ngo6Id, selectedVolunteerId: vol3.insertedId, donationType: 'cooked_meal', foodType: 'veg', quantity: 100, quantityUnit: 'servings', preparedAt: now, expiresAt: in8h, pickupRequired: true, donorAddress: { street: 'Powai', city: 'Mumbai', pincode: '400076', state: 'Maharashtra' }, donorGeoPoint: { type: 'Point', coordinates: [72.9081, 19.1176] }, notes: 'Wedding leftovers — sabzi, roti, rice', status: 'delivered', createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), updatedAt: now },
  ]);

  console.log('\n✅ Seed completed successfully!\n');
  console.log('📋 Seeded accounts (all use password: ' + DEFAULT_PASSWORD + ')');
  console.log('  Admin:     ' + ADMIN_EMAIL);
  console.log('  Donors:    donor1@foodconnect.local ... donor4@foodconnect.local');
  console.log('  NGOs:      ngo1@foodconnect.local ... ngo6@foodconnect.local');
  console.log('  Volunteers: volunteer1@foodconnect.local ... volunteer4@foodconnect.local');
  console.log('\n🍽️  Seeded: 6 NGOs, 10 hotspots, 4 donors, 4 donations, 4 volunteers\n');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
