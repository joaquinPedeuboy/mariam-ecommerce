import { useEffect, useState } from 'react';
import { apiFetch, ApiError } from '../lib/api';
import { z } from 'zod';

const PreferenceSchema = z.object({
    preference_id: z.string(),
    init_point: z.string(),
    sandbox_init_point: z.string(),
});

interface Props {
    orderId: number;
}

export default function RedirectToPayment({ orderId }: Props) {
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        apiFetch(`/store/orders/${orderId}/pagar`, { method: 'POST' }, PreferenceSchema)
            .then((data) => {
                // En producción, usar data.init_point en vez de sandbox_init_point
                window.location.href = data.init_point;
            })
            .catch((err) => {
                setError(err instanceof ApiError ? err.message : 'No se pudo iniciar el pago.');
            });
    }, [orderId]);

    if (error) {
        return (
            <div className="text-center py-16">
                <p className="text-red-600 mb-4">{error}</p>
                <a href="/carrito" className="text-stone-900 underline text-sm">Volver al carrito</a>
            </div>
        );
    }

    return (
        <div className="text-center py-16">
            <p className="text-stone-500">Redirigiendo a Mercado Pago...</p>
        </div>
    );
}