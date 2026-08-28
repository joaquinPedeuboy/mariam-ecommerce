import { useStore } from '@nanostores/react';
import { $cartCount } from '../stores/cart';

export default function CartIndicator() {
    const count = useStore($cartCount);

    return (
        <a href="/carrito" className="relative inline-flex items-center text-stone-700 hover:text-stone-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.98-4.706 2.57-7.19a1.125 1.125 0 00-1.11-1.36H5.25M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-stone-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {count}
                </span>
            )}
        </a>
    );
}