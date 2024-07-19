import { z } from 'zod';

const schema = z.object({
  environment: z.enum(['development', 'production']).default('development'),
  SERVER_PORT: z.coerce.number().positive(),
  WEB_URL: z.string().url(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
  MAILER_HOST: z.string(),
  MAILER_PORT: z.coerce.number().positive(),
  MAILER_USER: z.string(),
  MAILER_PASSWORD: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CALLBACK_URL: z.string().url(),
});

export const config = schema.parse(process.env);
