import { useEffect, useState } from 'react';
import { apiFetch, ApiError } from '../lib/api';
import { ProductoListItemSchema } from '../schemas/producto';
import { z } from 'zod';

const CLAVE_LOCAL = 'favoritos_invitado';

function leerLocales(): number[] {
    try {
        const raw = localStorage.getItem(CLAVE_LOCAL);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function guardarLocales(ids: number[]) {
    localStorage.setItem(CLAVE_LOCAL, JSON.stringify(ids));
}

interface Props {
    productoEcommerceId: number;
}

export default function FavoritoButton({ productoEcommerceId }: Props) {
    const [esFavorito, setEsFavorito] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [listo, setListo] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            apiFetch('/store/favoritos', {}, z.array(ProductoListItemSchema))
                .then((favoritos) => {
                    setEsFavorito(favoritos.some((f) => f.id === productoEcommerceId));
                })
                .catch(() => {})
                .finally(() => setListo(true));
        } else {
            setEsFavorito(leerLocales().includes(productoEcommerceId));
            setListo(true);
        }
    }, [productoEcommerceId]);

    const alternar = async (e: React.MouseEvent) => {
        // El botón suele vivir dentro de un <a> (la card del producto) —
        // no queremos navegar al tocarlo.
        e.preventDefault();
        e.stopPropagation();

        if (cargando) return;
        setCargando(true);

        const token = localStorage.getItem('token');
        const nuevoEstado = !esFavorito;

        try {
            if (token) {
                await apiFetch(`/store/favoritos/${productoEcommerceId}`, {
                    method: nuevoEstado ? 'POST' : 'DELETE',
                });
            } else {
                const actuales = leerLocales();
                const nuevos = nuevoEstado
                    ? [...actuales, productoEcommerceId]
                    : actuales.filter((id) => id !== productoEcommerceId);
                guardarLocales(nuevos);
            }
            setEsFavorito(nuevoEstado);
        } catch (err) {
            if (err instanceof ApiError && err.status === 401) {
                // El token venció justo ahora: lo tratamos como invitado
                // para esta acción, en vez de perder el toque del usuario.
                localStorage.removeItem('token');
                const actuales = leerLocales();
                const nuevos = nuevoEstado
                    ? [...actuales, productoEcommerceId]
                    : actuales.filter((id) => id !== productoEcommerceId);
                guardarLocales(nuevos);
                setEsFavorito(nuevoEstado);
            }
        } finally {
            setCargando(false);
        }
    };

    return (
        <button
            onClick={alternar}
            disabled={cargando || !listo}
            aria-label={esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            className="bg-white/90 backdrop-blur rounded-full p-1.5 text-stone-600 hover:text-red-600 disabled:opacity-50 shadow-sm"
        >
            
            <svg xmlns="http://www.w3.org/2000/svg" fill={esFavorito ? '#dc2626' : 'none'} viewBox="0 0 24 24" stroke-width="1.5" stroke={esFavorito ? '#dc2626' : 'currentColor'} className="size-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>

        </button>
    );
}
