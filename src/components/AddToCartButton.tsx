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

    const cantidadMaxima = Math.min(producto.stock, 10);

    const disminuir = () => { setCantidad((actual) => Math.max(1, actual - 1)); }; 
    const aumentar = () => { setCantidad((actual) => Math.min(cantidadMaxima, actual + 1)); };

    const handleAdd = () => {
        addToCart(
            {
                productoEcommerceId: producto.id,
                slug: producto.slug,
                nombre: producto.nombre,
                precio: producto.precio_actual,
                precioLista: producto.precio,
                porcentajeDescuento: producto.porcentaje_descuento,
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
            <button disabled className="mt-4 w-full bg-red-200 text-red-800 text-sm font-medium py-3 rounded-md cursor-not-allowed">
                Sin stock
            </button>
        );
    }

    return (
        <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3">
                <span className="text-sm text-stone-600"> Cantidad </span>

                <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden">
                    <button 
                        type="button" 
                        onClick={disminuir} 
                        disabled={cantidad === 1} 
                        aria-label="Disminuir cantidad" 
                        className="w-10 h-10 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors disabled:text-stone-300 disabled:cursor-not-allowed cursor-pointer" 
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4" > <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" /> </svg>
                    </button>
                    <span className="w-10 h-10 flex items-center justify-center text-sm font-medium text-stone-800 border-x border-stone-300" aria-live="polite" > 
                        {cantidad} 
                    </span>

                    <button 
                        type="button" 
                        onClick={aumentar} 
                        disabled={cantidad === cantidadMaxima} 
                        aria-label="Aumentar cantidad" 
                        className="w-10 h-10 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors disabled:text-stone-300 disabled:cursor-not-allowed cursor-pointer" 
                    > 
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4" > <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" /> </svg> 
                    </button>
                </div>

            </div>

            <button 
                type="button" 
                onClick={handleAdd} 
                className="flex items-center justify-center gap-2 w-full bg-stone-900 text-white text-sm font-medium py-3 rounded-md hover:bg-stone-800 transition-colors cursor-pointer" 
            > 
                {agregado ? '✓ Agregado' : 'Agregar al carrito'} 
                
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5" > <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 1 1-.75 0Z" /> </svg> 
            </button>
            
            <div className="mt-6 space-y-3 text-sm text-stone-600"> 
                <div className="flex items-center gap-3"> 
                    <span className="text-base text-green-500">✓</span> 
                    <span>Disponible en tienda fisica</span> 
                </div> 
                <div className="flex items-center gap-3"> 
                    <span className="text-base">🚚</span> 
                    <span>Envíos a todo el país</span> 
                </div> 
            </div>
        </div>
        
    );
}