import { useStore } from '@nanostores/react';
import { $cart, $cartTotal, updateQuantity, removeFromCart } from '../stores/cart';

export default function CartView() {
    const items = useStore($cart);
    const total = useStore($cartTotal);
    const apiUrl = import.meta.env.PUBLIC_API_URL.replace('/api', '');

    if (items.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-stone-500 mb-4">Tu carrito está vacío.</p>
                <a href="/productos" className="text-stone-900 underline text-sm">Ver productos</a>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-4">
            {items.map((item) => (
                <div key={item.productoEcommerceId} className="flex items-center gap-4 bg-white border border-stone-200 rounded-lg p-3">
                    {item.imagen && (
                        <img
                            src={`${apiUrl}/storage/${item.imagen}`}
                            alt={item.nombre}
                            className="w-16 h-16 object-cover rounded-md"
                        />
                    )}
                    <div className="flex-1">
                        <p className="text-sm font-medium">{item.nombre}</p>
                        <p className="text-sm text-stone-500">${item.precio.toLocaleString('es-AR')}</p>
                    </div>
                    <select
                        value={item.cantidad}
                        onChange={(e) => updateQuantity(item.productoEcommerceId, Number(e.target.value))}
                        className="border border-stone-300 rounded-md px-2 py-1 text-sm"
                    >
                        {Array.from({ length: Math.min(item.stockDisponible, 10) }, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                    <p className="text-sm font-medium w-20 text-right">
                        ${(item.precio * item.cantidad).toLocaleString('es-AR')}
                    </p>
                    <button
                        onClick={() => removeFromCart(item.productoEcommerceId)}
                        className="text-red-600 text-sm hover:underline"
                    >
                        Quitar
                    </button>
                </div>
            ))}

            <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                <p className="text-lg font-semibold">Total: ${total.toLocaleString('es-AR')}</p>
                <a
                    href="/checkout"
                    className="bg-stone-900 text-white text-sm font-medium px-6 py-3 rounded-md hover:bg-stone-800 transition-colors"
                >
                    Ir a pagar
                </a>
            </div>
        </div>
    );
}