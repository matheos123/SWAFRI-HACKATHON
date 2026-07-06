import { DatabaseConfig } from './database.config.interface';

export default (): DatabaseConfig => ({
  database: {
    url: process.env.DATABASE_URL as string,
  },
});
