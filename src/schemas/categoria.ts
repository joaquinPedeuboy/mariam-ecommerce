import { z } from 'zod';

export interface Categoria {
    nombre: string;
    slug: string;
    subcategorias: Categoria[];
}

export const CategoriaSchema: z.ZodType<Categoria> = z.lazy(() =>
    z.object({
        nombre: z.string(),
        slug: z.string(),
        subcategorias: z.array(CategoriaSchema),
    })
);

export const CategoriasResponseSchema = z.array(CategoriaSchema);