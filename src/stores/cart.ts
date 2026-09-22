import { persistentAtom } from '@nanostores/persistent';
import { computed } from 'nanostores';

export interface CartItem {
    productoEcommerceId: number;
    slug: string;
    nombre: string;
    precio: number;
    precioLista: number;
    porcentajeDescuento: number | null;
    imagen: string | null;
    cantidad: number;
    stockDisponible: number;
}

export const $cart = persistentAtom<CartItem[]>('cart', [], {
    encode: JSON.stringify,
    decode: JSON.parse,
});

export function addToCart(item: Omit<CartItem, 'cantidad'>, cantidad = 1) {
    const items = $cart.get();
    const existente = items.find((i) => i.productoEcommerceId === item.productoEcommerceId);

    if (existente) {
        const nuevaCantidad = Math.min(existente.cantidad + cantidad, existente.stockDisponible);
        $cart.set(
            items.map((i) =>
                i.productoEcommerceId === item.productoEcommerceId
                    ? { ...i, cantidad: nuevaCantidad }
                    : i
            )
        );
    } else {
        $cart.set([...items, { ...item, cantidad: Math.min(cantidad, item.stockDisponible) }]);
    }
}

export function updateQuantity(productoEcommerceId: number, cantidad: number) {
    const items = $cart.get();

    if (cantidad <= 0) {
        removeFromCart(productoEcommerceId);
        return;
    }

    $cart.set(
        items.map((i) =>
            i.productoEcommerceId === productoEcommerceId
                ? { ...i, cantidad: Math.min(cantidad, i.stockDisponible) }
                : i
        )
    );
}

export function removeFromCart(productoEcommerceId: number) {
    $cart.set($cart.get().filter((i) => i.productoEcommerceId !== productoEcommerceId));
}

export function clearCart() {
    $cart.set([]);
}

export const $cartCount = computed($cart, (items) =>
    items.reduce((total, item) => total + item.cantidad, 0)
);

export const $cartTotal = computed($cart, (items) =>
    items.reduce((total, item) => total + item.precio * item.cantidad, 0)
);

// Cuánto se está ahorrando en total por los ítems en oferta. Con `?? item.precio`
// por las dudas de que haya carritos guardados de antes de este cambio, sin
// precioLista — en ese caso, simplemente no suman ahorro (no rompen).
export const $cartAhorro = computed($cart, (items) =>
    items.reduce(
        (total, item) => total + ((item.precioLista ?? item.precio) - item.precio) * item.cantidad,
        0
    )
);