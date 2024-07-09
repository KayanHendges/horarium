import { z } from 'zod';

const schema = z.object({
  SERVER_PORT: z.coerce.number().positive(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
});

export const config = schema.parse(process.env);
