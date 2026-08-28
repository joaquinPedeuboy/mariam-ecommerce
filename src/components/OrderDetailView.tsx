import { useEffect, useState } from 'react';
import { apiFetch, ApiError } from '../lib/api';
import { OrderSchema, CancelOrderResponseSchema, type Order } from '../schemas/order';

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

const PASOS_ENVIO = [
    { key: 'pendiente', label: 'Confirmado' },
    { key: 'preparando', label: 'Preparando' },
    { key: 'enviado', label: 'Enviado' },
    { key: 'entregado', label: 'Entregado' },
] as const;

interface Props {
    orderId: number;
}

function SeguimientoPedido({ order }: { order: Order }) {
    if (order.estado === 'cancelado') {
        return (
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 mb-4 text-center">
                <p className="text-sm font-medium text-stone-600">
                    Este pedido fue cancelado
                    {order.cancelado_at &&
                        ` el ${new Date(order.cancelado_at).toLocaleDateString('es-AR')}`}
                    .
                </p>
            </div>
        );
    }

    if (order.estado === 'fallido') {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-center">
                <p className="text-sm font-medium text-red-700">
                    El pago de este pedido no se pudo procesar.
                </p>
            </div>
        );
    }

    if (order.estado === 'pendiente_pago') {
        return (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 text-center">
                <p className="text-sm font-medium text-amber-700">
                    Esperando la confirmación del pago.
                </p>
            </div>
        );
    }

    const indiceActual = PASOS_ENVIO.findIndex((p) => p.key === (order.estado_envio ?? 'pendiente'));

    return (
        <div className="bg-white border border-stone-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
                {PASOS_ENVIO.map((paso, i) => (
                    <div key={paso.key} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                                    i <= indiceActual
                                        ? 'bg-stone-900 text-white'
                                        : 'bg-stone-100 text-stone-400'
                                }`}
                            >
                                {i < indiceActual ? '✓' : i + 1}
                            </div>
                            <span
                                className={`mt-1 text-xs text-center whitespace-nowrap ${
                                    i <= indiceActual ? 'text-stone-800 font-medium' : 'text-stone-400'
                                }`}
                            >
                                {paso.label}
                            </span>
                        </div>
                        {i < PASOS_ENVIO.length - 1 && (
                            <div
                                className={`flex-1 h-0.5 mx-1 mb-4 ${
                                    i < indiceActual ? 'bg-stone-900' : 'bg-stone-200'
                                }`}
                            />
                        )}
                    </div>
                ))}
            </div>
            {order.numero_seguimiento && (
                <p className="text-sm text-stone-600 mt-4 text-center">
                    {order.transportista ? `${order.transportista} — ` : ''}
                    Código de seguimiento: <span className="font-medium">{order.numero_seguimiento}</span>
                </p>
            )}
        </div>
    );
}

export default function OrderDetailView({ orderId }: Props) {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cancelando, setCancelando] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            window.location.href = '/login';
            return;
        }

        setLoading(true);
        apiFetch(`/store/orders/${orderId}`, {}, OrderSchema)
            .then(setOrder)
            .catch((err) => {
                if (err instanceof ApiError && err.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    return;
                }
                setError('No pudimos cargar este pedido.');
            })
            .finally(() => setLoading(false));
    }, [orderId]);

    const cancelarPedido = async () => {
        if (!order) return;

        const confirmado = confirm(
            order.estado === 'pagado'
                ? 'Vamos a cancelar tu pedido. Si ya lo pagaste, el reembolso se procesa por separado y te vamos a contactar.'
                : '¿Cancelar este pedido?'
        );

        if (!confirmado) return;

        setCancelando(true);
        try {
            const res = await apiFetch(
                `/store/orders/${orderId}/cancelar`,
                { method: 'POST' },
                CancelOrderResponseSchema
            );
            setOrder(res.order);
        } catch (err) {
            if (err instanceof ApiError) {
                alert(err.data?.message ?? 'No pudimos cancelar el pedido.');
            }
        } finally {
            setCancelando(false);
        }
    };

    if (loading) {
        return <p className="text-center text-stone-500">Cargando...</p>;
    }

    if (error || !order) {
        return <p className="text-center text-red-600">{error ?? 'Pedido no encontrado.'}</p>;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <a href="/mis-pedidos" className="text-sm text-stone-500 hover:underline">
                ← Volver a mis pedidos
            </a>

            <div className="flex items-center justify-between mt-2 mb-6">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-semibold">{order.numero}</h1>
                    <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            ESTADO_COLORES[order.estado] ?? 'bg-stone-100 text-stone-600'
                        }`}
                    >
                        {ESTADO_LABELS[order.estado] ?? order.estado}
                    </span>
                </div>
                <span className="text-sm text-stone-500">
                    {new Date(order.created_at).toLocaleDateString('es-AR')}
                </span>
            </div>

            <SeguimientoPedido order={order} />

            <div className="bg-white border border-stone-200 rounded-lg p-4 mb-4">
                <h2 className="text-sm font-semibold text-stone-700 mb-2">Productos</h2>
                <div className="divide-y divide-stone-100">
                    {order.items.map((item) => (
                        <div key={item.id} className="py-2 flex items-center justify-between text-sm">
                            <span>
                                {item.nombre_producto}{' '}
                                <span className="text-stone-400">x{item.cantidad}</span>
                            </span>
                            <span className="text-stone-600">
                                ${item.subtotal.toLocaleString('es-AR')}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-between text-sm font-medium pt-3 mt-1 border-t border-stone-200">
                    <span>Total</span>
                    <span>${order.total.toLocaleString('es-AR')}</span>
                </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-lg p-4">
                <h2 className="text-sm font-semibold text-stone-700 mb-2">Datos de entrega</h2>
                <p className="text-sm text-stone-600">
                    {order.nombre_contacto} — {order.telefono_contacto}
                </p>
                <p className="text-sm text-stone-600">
                    {order.direccion_envio}, {order.ciudad}, {order.provincia}
                </p>
                {order.referencia_direccion && (
                    <p className="text-sm text-stone-500">{order.referencia_direccion}</p>
                )}
            </div>

            {order.puede_cancelarse && (
                <button
                    onClick={cancelarPedido}
                    disabled={cancelando}
                    className="mt-4 text-sm text-red-600 hover:underline disabled:opacity-50"
                >
                    {cancelando ? 'Cancelando...' : 'Cancelar pedido'}
                </button>
            )}
        </div>
    );
}