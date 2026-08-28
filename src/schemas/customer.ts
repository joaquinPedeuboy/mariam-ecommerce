import { z } from 'zod';

export const CustomerSchema = z.object({
    id: z.number(),
    nombre: z.string(),
    apellido: z.string().nullable(),
    email: z.string().email(),
    telefono: z.string().nullable(),
});

export const AuthResponseSchema = z.object({
    customer: CustomerSchema,
    token: z.string(),
});

export type Customer = z.infer<typeof CustomerSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;