export const appConfig = () => ({
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  webAppUrl: process.env.WEB_APP_URL || 'http://localhost:3000',
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/foodconnect',
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'fallback_access_secret_change_in_prod',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_change_in_prod',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  upload: {
    driver: process.env.UPLOAD_DRIVER || 'local',
    localDir: process.env.UPLOAD_LOCAL_DIR || 'uploads',
    maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10),
  },
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL || '60', 10),
    limit: parseInt(process.env.THROTTLE_LIMIT || '30', 10),
  },
  seed: {
    adminEmail: process.env.SEED_ADMIN_EMAIL || 'admin@foodconnect.local',
    defaultPassword: process.env.SEED_DEFAULT_PASSWORD || 'Password123!',
  },
});
