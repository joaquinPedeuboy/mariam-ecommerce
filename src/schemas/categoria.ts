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

export type CategoriaMenuPrincipal = Categoria;

export const CategoriaMenuPrincipalSchema = CategoriaSchema;

export const CategoriasResponseSchema = z.object({
    menu_principal: z.array(CategoriaMenuPrincipalSchema),
    hamburguesa: z.array(CategoriaSchema),
});

export type CategoriasResponse = z.infer<
    typeof CategoriasResponseSchema
>;