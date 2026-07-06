import { RedisConfig } from './redis.config.interface';

export default (): RedisConfig => ({
  redis: {
    url: process.env.REDIS_URL as string,
  },
});
