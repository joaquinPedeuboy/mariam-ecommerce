import { useState } from 'react';
import { addToCart } from '../stores/cart';
import type { ProductoListItem } from '../schemas/producto';

interface Props {
    producto: ProductoListItem;
}

export default function AddToCartButtonCard({ producto }: Props) {
    const [agregado, setAgregado] = useState(false);

    const handleAdd = (e: React.MouseEvent) => {
        // La card entera es un <a> — sin esto, el click navegaría al producto.
        e.preventDefault();
        e.stopPropagation();

        addToCart(
            {
                productoEcommerceId: producto.id,
                slug: producto.slug,
                nombre: producto.nombre,
                precio: producto.precio_oferta ?? producto.precio,
                precioLista: producto.precio,
                porcentajeDescuento: producto.porcentaje_descuento,
                imagen: producto.imagen,
                stockDisponible: producto.stock,
            },
            1
        );

        setAgregado(true);
        setTimeout(() => setAgregado(false), 1500);
    };

    if (producto.stock === 0) {
        return (
            <button
                disabled
                className="w-full bg-stone-100 text-stone-400 text-xs font-medium py-2 rounded-md cursor-not-allowed"
            >
                Sin stock
            </button>
        );
    }

    return (
        <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-1.5 w-full bg-stone-900 text-white text-xs font-medium py-2 rounded-md hover:bg-stone-800 transition-colors cursor-pointer"
        >
            {agregado ? '✓ Agregado' : 'Agregar'}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
            </svg>
        </button>
    );
}
