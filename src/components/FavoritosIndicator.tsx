import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $favoritosCount, setFavoritos } from '../stores/favoritos';
import { apiFetch } from '../lib/api';
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

export default function FavoritosIndicator() {
    const cantidad = useStore($favoritosCount);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            apiFetch(
                '/store/favoritos',
                {},
                z.array(ProductoListItemSchema)
            )
                .then((favoritos) => {
                    setFavoritos(
                        favoritos.map((favorito) => favorito.id)
                    );
                })
                .catch(() => {});
        } else {
            setFavoritos(leerLocales());
        }
    }, []);

    return (
        <a
            href="/favoritos"
            className="relative text-stone-600 hover:text-stone-900"
            aria-label={
                cantidad > 0
                    ? `Favoritos: ${cantidad}`
                    : 'Favoritos'
            }
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
            </svg>

            {cantidad > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold leading-none text-white">
                    {cantidad > 99 ? '99+' : cantidad}
                </span>
            )}
        </a>
    );
}