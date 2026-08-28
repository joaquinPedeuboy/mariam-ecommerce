import { useState } from 'react';
import { addToCart } from '../stores/cart';
import type { ProductoDetalle } from '../schemas/producto';

interface Props {
    producto: ProductoDetalle;
    imagen: string | null;
}

export default function AddToCartButton({ producto, imagen }: Props) {
    const [cantidad, setCantidad] = useState(1);
    const [agregado, setAgregado] = useState(false);

    const handleAdd = () => {
        addToCart(
            {
                productoEcommerceId: producto.id,
                slug: producto.slug,
                nombre: producto.nombre,
                precio: producto.precio,
                imagen,
                stockDisponible: producto.stock,
            },
            cantidad
        );

        setAgregado(true);
        setTimeout(() => setAgregado(false), 1500);
    };

    if (producto.stock === 0) {
        return (
            <button disabled className="mt-4 w-full bg-stone-200 text-stone-400 text-sm font-medium py-3 rounded-md cursor-not-allowed">
                Sin stock
            </button>
        );
    }

    return (
        <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3">
                <label className="text-sm text-stone-600">Cantidad:</label>
                <select
                    value={cantidad}
                    onChange={(e) => setCantidad(Number(e.target.value))}
                    className="border border-stone-300 rounded-md px-2 py-1 text-sm"
                >
                    {Array.from({ length: Math.min(producto.stock, 10) }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>{n}</option>
                    ))}
                </select>
            </div>

            <button
                onClick={handleAdd}
                className="w-full bg-stone-900 text-white text-sm font-medium py-3 rounded-md hover:bg-stone-800 transition-colors"
            >
                {agregado ? '✓ Agregado' : 'Agregar al carrito'}
            </button>
        </div>
    );
}