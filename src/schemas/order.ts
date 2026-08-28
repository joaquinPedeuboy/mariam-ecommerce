import { z } from 'zod';

export const OrderItemSchema = z.object({
    id: z.number(),
    nombre_producto: z.string(),
    precio_unitario: z.number(),
    cantidad: z.number(),
    subtotal: z.number(),
});

const ESTADOS = ['pendiente_pago', 'pagado', 'fallido', 'cancelado'] as const;
const ESTADOS_ENVIO = ['pendiente', 'preparando', 'enviado', 'entregado'] as const;

export const OrderSchema = z.object({
    id: z.number(),
    numero: z.string(),
    estado: z.enum(ESTADOS),
    estado_envio: z.enum(ESTADOS_ENVIO).nullable(),
    subtotal: z.number(),
    total: z.number(),
    nombre_contacto: z.string(),
    telefono_contacto: z.string(),
    email_contacto: z.string(),
    direccion_envio: z.string(),
    referencia_direccion: z.string().nullable(),
    ciudad: z.string(),
    provincia: z.string(),
    codigo_postal: z.string().nullable(),
    transportista: z.string().nullable(),
    numero_seguimiento: z.string().nullable(),
    mercado_pago_payment_id: z.string().nullable(),
    pagado_at: z.string().nullable(),
    enviado_at: z.string().nullable(),
    entregado_at: z.string().nullable(),
    cancelado_at: z.string().nullable(),
    created_at: z.string(),
    puede_cancelarse: z.boolean(),
    items: z.array(OrderItemSchema),
});

export const CreateOrderResponseSchema = z.object({
    order: OrderSchema,
});

export const CancelOrderResponseSchema = z.object({
    order: OrderSchema,
});

const PaginationLinkSchema = z.object({
    url: z.string().nullable(),
    label: z.string(),
    active: z.boolean(),
});

export const OrdersPaginatedSchema = z.object({
    data: z.array(OrderSchema),
    current_page: z.number(),
    last_page: z.number(),
    links: z.array(PaginationLinkSchema),
});

export type Order = z.infer<typeof OrderSchema>;
export type EstadoOrder = Order['estado'];
export type EstadoEnvio = NonNullable<Order['estado_envio']>;