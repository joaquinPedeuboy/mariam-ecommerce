import { useEffect, useState } from 'react';
import { apiFetch, ApiError } from '../lib/api';
import { ProductoListItemSchema, PaginatedSchema, type ProductoListItem } from '../schemas/producto';
import { z } from 'zod';

const CLAVE_LOCAL = 'favoritos_invitado';

export default function FavoritosView() {
    const [productos, setProductos] = useState<ProductoListItem[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const cargar = async () => {
            const token = localStorage.getItem('token');

            try {
                if (token) {
                    const data = await apiFetch(
                        '/store/favoritos',
                        {},
                        z.array(ProductoListItemSchema)
                    );
                    setProductos(data);
                    return;
                }

                const raw = localStorage.getItem(CLAVE_LOCAL);
                const ids: number[] = raw ? JSON.parse(raw) : [];

                if (ids.length === 0) {
                    setProductos([]);
                    return;
                }

                const data = await apiFetch(
                    `/store/productos?ids=${ids.join(',')}`,
                    {},
                    PaginatedSchema(ProductoListItemSchema)
                );
                setProductos(data.data);
            } catch (err) {
                if (err instanceof ApiError && err.status === 401) {
                    localStorage.removeItem('token');
                    setProductos([]);
                    return;
                }
                setError('No pudimos cargar tus favoritos.');
            } finally {
                setLoading(false);
            }
        };

        cargar();
    }, []);

    if (loading) {
        return <p className="text-center text-stone-500">Cargando...</p>;
    }

    if (error) {
        return <p className="text-center text-red-600">{error}</p>;
    }

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-semibold mb-6">Mis favoritos</h1>

            {productos && productos.length === 0 && (
                <p className="text-stone-500">
                    Todavía no tenés favoritos. Tocá el corazón en cualquier producto para guardarlo acá.
                </p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {productos?.map((p) => (
                    <a
                        key={p.id}
                        href={`/productos/${p.slug}`}
                        className="block bg-white border border-stone-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                        <div className="aspect-square bg-stone-100 relative">
                            {p.porcentaje_descuento && (
                                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                                    -{p.porcentaje_descuento}%
                                </span>
                            )}
                            {p.imagen && (
                                <img
                                    src={`${import.meta.env.PUBLIC_API_URL.replace('/api', '')}/storage/${p.imagen}`}
                                    alt={p.nombre}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="text-sm font-medium text-stone-900 line-clamp-2">
                                {p.nombre}
                            </h3>
                            <p className="text-lg font-semibold text-stone-900 mt-1">
                                {p.precio_oferta ? (
                                    <>
                                        <span className="line-through text-stone-500 mr-2">
                                            ${p.precio.toLocaleString('es-AR')}
                                        </span>
                                        <span className="text-black font-bold">
                                            ${p.precio_oferta.toLocaleString('es-AR')}
                                        </span>
                                    </>
                                ) : (
                                    <>${p.precio.toLocaleString('es-AR')}</>
                                )}
                            </p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
