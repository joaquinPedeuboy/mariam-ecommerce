import { useStore } from '@nanostores/react';
import { $cartCount } from '../stores/cart';

export default function CartIndicator() {
    const count = useStore($cartCount);

    return (
        <a href="/carrito" className="relative inline-flex items-center text-stone-700 hover:text-stone-900">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>

            {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-violet-700 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {count}
                </span>
            )}
        </a>
    );
}