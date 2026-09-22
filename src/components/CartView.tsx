import { useStore } from '@nanostores/react';
import { $cart, $cartTotal, $cartAhorro, updateQuantity, removeFromCart } from '../stores/cart';

export default function CartView() {
    const items = useStore($cart);
    const total = useStore($cartTotal);
    const ahorro = useStore($cartAhorro);
    const apiUrl = import.meta.env.PUBLIC_API_URL.replace('/api', '');

    const formatPrice = (price: number) => `$${price.toLocaleString('es-AR')}`;
    const sinImpuestos = (price: number) =>
        `$${(price / 1.21).toLocaleString('es-AR', { maximumFractionDigits: 0 })}`;

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center py-20 sm:py-28">

                <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mb-6">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-9 h-9 text-stone-400" > <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835L5.52 6.75m0 0h13.73c.69 0 1.2.64 1.03 1.309l-1.5 6A1.125 1.125 0 0117.688 15H8.25a1.125 1.125 0 01-1.091-.848L5.52 6.75zm0 0L4.5 4.5M8.25 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm10.5 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /> </svg>
                </div>

                <h2 className="text-xl font-poppins text-stone-900"> 
                    Tu carrito está vacío 
                </h2>

                <p className="mt-2 text-sm text-stone-500 max-w-sm"> 
                    Todavía no agregaste ningún producto. Explorá nuestro catálogo y encontrá algo que te guste. 
                </p>

                <a href="/productos" className="mt-7 inline-flex items-center justify-center rounded-full bg-stone-900 px-7 py-3 text-sm font-poppins text-white transition hover:bg-stone-800" > 
                    Ver productos 
                </a>

            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-12 items-start">

                {/* PRODUCTOS */}
                <section>
                    <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                        <h2 className="text-sm font-poppins uppercase tracking-wider text-stone-500"> 
                            Productos 
                        </h2> 
                        <span className="text-sm text-stone-500 font-poppins"> 
                            {items.length} {items.length === 1 ? 'producto' : 'productos'} 
                        </span>
                    </div>

                    <div className="divide-y divide-stone-200">
                        {items.map((item) => (
                            <article
                                key={item.productoEcommerceId}
                                className="py-5 sm:py-6"
                            >
                                <div className="flex gap-4 sm:gap-5">

                                    {/* IMAGEN */}
                                    <a 
                                        href={`/productos/${item.slug ?? item.productoEcommerceId}`} 
                                        className="shrink-0" 
                                    > 
                                        {item.imagen ? ( 
                                            <img src={`${apiUrl}/storage/${item.imagen}`} 
                                            alt={item.nombre} 
                                            className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl bg-stone-100" 
                                            /> 
                                            ) : ( 
                                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-stone-100 flex items-center justify-center"> 
                                                <span className="text-xs text-stone-400"> 
                                                Sin imagen 
                                                </span> 
                                            </div> 
                                        )} 
                                    </a>

                                    {/* INFORMACION */}
                                    <div className="flex-1 min-w-0">

                                        <div className="flex justify-between gap-4"> 
                                            <div className="min-w-0"> 
                                                <h3 className="text-sm sm:text-base font-poppins text-stone-900 truncate"> 
                                                    {item.nombre} 
                                                </h3>
                                                <div className="mt-1 flex items-center gap-2 flex-wrap">
                                                    {item.porcentajeDescuento ? (
                                                        <>
                                                            <span className="text-xs text-stone-400 line-through">
                                                                {formatPrice(item.precioLista)}
                                                            </span>
                                                            <span className="text-sm text-stone-900 font-medium">
                                                                {formatPrice(item.precio)}
                                                            </span>
                                                            <span className="bg-violet-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                                                -{item.porcentajeDescuento}%
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-sm text-stone-500">
                                                            {formatPrice(item.precio)}
                                                        </span>
                                                    )}
                                                    <span className="text-xs text-stone-400">c/u</span>
                                                </div>
                                                <p className="text-[11px] text-stone-400 mt-0.5">
                                                    Precio sin impuestos nacionales: {sinImpuestos(item.precio)} c/u
                                                </p>
                                            </div>
                                        
                                    
                                            {/* ELIMINAR */}
                                            <button
                                                type="button" 
                                                onClick={() => removeFromCart(item.productoEcommerceId) } 
                                                className="shrink-0 text-stone-400 hover:text-red-600 transition cursor-pointer" 
                                                aria-label={`Eliminar ${item.nombre}`}
                                            >
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" > 
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5h12m-10.5 0v11.25A1.125 1.125 0 008.625 19.875h6.75a1.125 1.125 0 001.125-1.125V7.5M9 7.5V5.625A1.125 1.125 0 0110.125 4.5h3.75A1.125 1.125 0 0115 5.625V7.5m-4.5 3v6m3-6v6" /> 
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="mt-5 flex items-center justify-between gap-4">
                                            {/* CANTIDAD */}
                                            <div className="inline-flex items-center border border-stone-300 rounded-full h-9"> 
                                                <button 
                                                    type="button" 
                                                    onClick={() => updateQuantity( item.productoEcommerceId, Math.max(1, item.cantidad - 1) ) } 
                                                    disabled={item.cantidad <= 1} 
                                                    className={`${item.cantidad <= 1 === true ? 'cursor-not-allowed' : 'cursor-pointer' } w-9 h-full flex items-center justify-center text-stone-500 hover:text-stone-900 disabled:opacity-30 transition`}
                                                    aria-label="Disminuir cantidad" 
                                                > 
                                                    − 
                                                </button>

                                                <span className="w-8 text-center text-sm font-medium text-stone-800"> {item.cantidad} </span>

                                                <button 
                                                    type="button" 
                                                    onClick={() => updateQuantity( item.productoEcommerceId, Math.min( item.stockDisponible, item.cantidad + 1 ) ) } 
                                                    disabled={ item.cantidad >= item.stockDisponible } 
                                                    className={`${item.cantidad >= item.stockDisponible === true ? 'cursor-not-allowed' : 'cursor-pointer' } w-9 h-full flex items-center justify-center text-stone-500 hover:text-stone-900 disabled:opacity-30 transition`}
                                                    aria-label="Aumentar cantidad" 
                                                > 
                                                    + 
                                                </button>
                                            </div>

                                            {/* SUBTOTAL */}
                                            <p className="text-sm sm:text-base font-medium text-stone-900"> 
                                                {formatPrice( item.precio * item.cantidad )} 
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                {/* RESUMEN */}
                <aside className="lg:sticky lg:top-24">
                    <div className="rounded-2xl bg-stone-50 border border-stone-200 p-5 sm:p-6">

                        <h2 className="text-lg font-semibold text-stone-900 font-poppins"> 
                            Resumen de compra 
                        </h2>

                        <div className="mt-6 space-y-4 text-sm"> 

                            <div className="flex justify-between gap-4 text-stone-600"> 
                                <span>Subtotal</span> 
                                <span>{formatPrice(total)}</span> 
                            </div>

                            {ahorro > 0 && (
                                <div className="flex justify-between gap-4 text-stone-600">
                                    <span>Descuento</span>
                                    <span>-{formatPrice(ahorro)}</span>
                                </div>
                            )}

                            <div className="flex justify-between gap-4 text-stone-600"> 
                                <span>Envío</span> 
                                <span className="text-stone-500"> Se calcula al finalizar </span> 
                            </div> 
                        </div>

                        <div className="border-t border-stone-200 mt-6 pt-5"> 
                            <div className="flex items-end justify-between gap-4"> 
                                <span className="text-base font-medium text-stone-900"> Total </span> 
                                <span className="text-xl font-semibold text-stone-900"> {formatPrice(total)} </span> 
                            </div>
                            <p className="text-[11px] text-stone-400 mt-1 text-right">
                                Precio sin impuestos nacionales: {sinImpuestos(total)}
                            </p> 
                        </div>

                        <a 
                            href="/checkout" 
                            className="mt-6 flex w-full items-center justify-center rounded-full bg-green-900 px-6 py-3.5 text-sm font-poppins text-white transition hover:bg-green-700" 
                        > 
                            Continuar con la compra 
                        </a> 
                        
                        <a 
                            href="/productos" 
                            className="mt-4 flex w-full items-center justify-center rounded-full border border-stone-300 px-6 py-3.5 text-sm font-poppins text-stone-600 hover:text-violet-900 transition"
                        > 
                            <span className="flex items-center"> 
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"> 
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /> 
                                </svg> 
                                Seguir comprando 
                            </span> 
                        </a>
                    </div>
                </aside>
        </div>
    );
}