import { z } from 'zod';

const schema = z.object({
  SERVER_PORT: z.coerce.number().positive(),
});

export const config = schema.parse(process.env);
