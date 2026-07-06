import { JwtConfig } from './jwt.config.interface';

export default (): JwtConfig => ({
  jwt: {
    secret: process.env.JWT_SECRET as string,
    expiresIn: '1h',
  },
});
