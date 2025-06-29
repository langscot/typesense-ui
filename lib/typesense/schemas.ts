import { z } from "zod";

export const typesenseConnectionSchema = z.object({
  name: z.string().min(1),
  host: z.string().min(1),
  port: z.number().min(1),
  protocol: z.enum(["http", "https"]),
  apiKey: z.string().min(1),
});
