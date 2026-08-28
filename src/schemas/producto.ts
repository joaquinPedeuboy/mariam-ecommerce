import { z } from 'zod';

export const ProductoListItemSchema = z.object({
    id: z.number(),
    slug: z.string(),
    nombre:z.string(),
    precio: z.number(),
    precio_oferta: z.number().nullable(),
    porcentaje_descuento: z.number().nullable(),
    stock: z.number(),
    imagen: z.string().nullable(),
    categorias: z.array(z.string()),
});

export const PaginatedSchema = <T extends z.ZodType>(itemSchema: T) =>
    z.object({
        data: z.array(itemSchema),
        current_page: z.number(),
        last_page: z.number(),
        total: z.number(),
    });

export const VarianteTamanoSchema = z.object({
    valor: z.string(),
    slug: z.string().nullable(),
    disponible: z.boolean(),
});

export const VarianteColorSchema = z.object({
    valor: z.string(),
    hex: z.string().nullable(),
    slug: z.string().nullable(),
    disponible: z.boolean(),
});

export const VariantesSchema = z
    .object({
        tamanos: z.array(VarianteTamanoSchema),
        colores: z.array(VarianteColorSchema),
    })
    .nullable();

export const ProductoDetalleSchema = z.object({
    id: z.number(),
    slug: z.string(),
    nombre: z.string(),
    descripcion: z.string().nullable(),
    precio: z.number(),
    precio_oferta: z.number().nullable(),
    porcentaje_descuento: z.number().nullable(),
    stock: z.number(),
    meta_title: z.string().nullable(),
    meta_description: z.string().nullable(),
    imagenes: z.array(z.object({ url: z.string(), principal: z.boolean() })),
    categorias: z.array(z.object({ nombre: z.string(), slug: z.string() })),
    variante_tamano: z.string().nullable(),
    variante_color_nombre: z.string().nullable(),
    variantes: VariantesSchema,
});

export type ProductoListItem = z.infer<typeof ProductoListItemSchema>;
export type ProductoDetalle = z.infer<typeof ProductoDetalleSchema>;
export type Variantes = z.infer<typeof VariantesSchema>;