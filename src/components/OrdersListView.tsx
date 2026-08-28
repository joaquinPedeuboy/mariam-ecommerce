import { useEffect, useState } from 'react';
import { apiFetch, ApiError } from '../lib/api';
import { OrdersPaginatedSchema, type Order } from '../schemas/order';

const ESTADO_LABELS: Record<string, string> = {
    pendiente_pago: 'Pendiente de pago',
    pagado: 'Pagado',
    fallido: 'Fallido',
    cancelado: 'Cancelado',
};

const ESTADO_COLORES: Record<string, string> = {
    pendiente_pago: 'bg-amber-100 text-amber-800',
    pagado: 'bg-green-100 text-green-800',
    fallido: 'bg-red-100 text-red-800',
    cancelado: 'bg-stone-200 text-stone-600',
};

export default function OrdersListView() {
    const [orders, setOrders] = useState<Order[] | null>(null);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            window.location.href = '/login';
            return;
        }

        setLoading(true);
        apiFetch(`/store/orders?page=${page}`, {}, OrdersPaginatedSchema)
            .then((res) => {
                setOrders(res.data);
                setLastPage(res.last_page);
            })
            .catch((err) => {
                if (err instanceof ApiError && err.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    return;
                }
                setError('No pudimos cargar tus pedidos. Probá de nuevo en un momento.');
            })
            .finally(() => setLoading(false));
    }, [page]);

    if (loading && !orders) {
        return <p className="text-center text-stone-500">Cargando...</p>;
    }

    if (error) {
        return <p className="text-center text-red-600">{error}</p>;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Mis pedidos</h1>

            {orders && orders.length === 0 && (
                <p className="text-stone-500">Todavía no hiciste ningún pedido.</p>
            )}

            <div className="space-y-3">
                {orders?.map((order) => (
                    <a
                        key={order.id}
                        href={`/mis-pedidos/${order.id}`}
                        className="block bg-white border border-stone-200 rounded-lg p-4 hover:border-stone-300 transition-colors"
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{order.numero}</span>
                            <span
                                className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                                    ESTADO_COLORES[order.estado] ?? 'bg-stone-100 text-stone-600'
                                }`}
                            >
                                {ESTADO_LABELS[order.estado] ?? order.estado}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-stone-500">
                            <span>{new Date(order.created_at).toLocaleDateString('es-AR')}</span>
                            <span>${order.total.toLocaleString('es-AR')}</span>
                        </div>
                    </a>
                ))}
            </div>

            {lastPage > 1 && (
                <div className="flex items-center justify-center gap-3 mt-6">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="text-sm text-stone-600 hover:underline disabled:opacity-40 disabled:no-underline"
                    >
                        ← Anterior
                    </button>
                    <span className="text-sm text-stone-400">
                        Página {page} de {lastPage}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                        disabled={page === lastPage}
                        className="text-sm text-stone-600 hover:underline disabled:opacity-40 disabled:no-underline"
                    >
                        Siguiente →
                    </button>
                </div>
            )}
        </div>
    );
}
