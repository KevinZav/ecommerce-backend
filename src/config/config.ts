import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    port: parseInt(process.env.PORT),
    database: {
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      database: process.env.POSTGRES_DB,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    },
    jwtSeed: {
      public: process.env.JWT_SEED_PUBLIC,
      secret: process.env.JWT_SEED_SECRET,
    },
    emaillApiKey: process.env.EMAIL_API_KEY,
  };
});
