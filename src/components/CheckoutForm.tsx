import { useState, type SubmitEvent } from 'react';
import { useStore } from '@nanostores/react';
import { $cart, $cartTotal, clearCart } from '../stores/cart';
import { apiFetch, ApiError } from '../lib/api';
import { CreateOrderResponseSchema } from '../schemas/order';
import { useEmailVerification } from '../hooks/useEmailVerification';

export default function CheckoutForm() {
    const items = useStore($cart);
    const total = useStore($cartTotal);

    const { 
        sending: sendingVerification, 
        secondsLeft, 
        message: verificationMessage, 
        error: verificationError, 
        resend, 
    } = useEmailVerification();

    const [form, setForm] = useState({
        nombre_contacto: '',
        telefono_contacto: '',
        direccion_envio: '',
        email_contacto: '',
        ciudad: '',
        provincia: '',
        codigo_postal: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [emailNotVerified, setEmailNotVerified] = useState(false);

    const updateField = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setEmailNotVerified(false);

        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login?redirect=/checkout';
            return;
        }

        setLoading(true);

        try {
            const data = await apiFetch(
                '/store/orders',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        items: items.map((item) => ({
                            producto_ecommerce_id: item.productoEcommerceId,
                            cantidad: item.cantidad,
                        })),
                        ...form,
                    }),
                },
                CreateOrderResponseSchema
            );

            clearCart();
            window.location.href = `/checkout/pago?order=${data.order.id}`;
        } catch (err) {
            if (err instanceof ApiError) {
                if (err.status === 401) {
                    window.location.href = '/login?redirect=/checkout';
                    return;
                }
                if (err.status === 403) { 
                    setEmailNotVerified(true); 
                } else if (err.status === 404) {
                    setError('Uno de los productos de tu carrito ya no está disponible. Revisá tu carrito.');
                } else if (err.status === 422) {
                    setError(err.data?.message ?? 'Revisá los datos ingresados.');
                } else {
                    setError('No se pudo procesar el pedido. Intentá de nuevo.');
                }
            } else {
                setError('No se pudo conectar con el servidor.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-stone-500 mb-4">Tu carrito está vacío.</p>
                <a href="/productos" className="text-stone-900 underline text-sm">Ver productos</a>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-lg font-semibold">Datos de envío</h2>

                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Nombre y apellido</label>
                    <input
                        type="text"
                        value={form.nombre_contacto}
                        onChange={updateField('nombre_contacto')}
                        required
                        className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Teléfono</label>
                    <input
                        type="tel"
                        value={form.telefono_contacto}
                        onChange={updateField('telefono_contacto')}
                        required
                        className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Dirección</label>
                    <input
                        type="text"
                        value={form.direccion_envio}
                        onChange={updateField('direccion_envio')}
                        required
                        className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Email de Contacto</label>
                    <input
                        type="text"
                        value={form.email_contacto}
                        onChange={updateField('email_contacto')}
                        required
                        className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Ciudad</label>
                        <input
                            type="text"
                            value={form.ciudad}
                            onChange={updateField('ciudad')}
                            required
                            className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Provincia</label>
                        <input
                            type="text"
                            value={form.provincia}
                            onChange={updateField('provincia')}
                            required
                            className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Código postal (opcional)</label>
                    <input
                        type="text"
                        value={form.codigo_postal}
                        onChange={updateField('codigo_postal')}
                        className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                    />
                </div>

                {/* Verificacion de email */}
                {emailNotVerified && ( 
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4"> 
                        <p className="text-sm font-medium text-amber-800"> 
                            Email sin verificar 
                        </p> 
                        <p className="mt-1 text-sm leading-5 text-amber-700"> 
                            Necesitás verificar tu email para poder continuar con la compra. 
                        </p> 
                        <button 
                            type="button" 
                            onClick={resend} 
                            disabled={ sendingVerification || secondsLeft > 0 } 
                            className="mt-3 rounded-lg bg-violet-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50" 
                        > 
                            {sendingVerification 
                                ? 'Enviando...' 
                                : secondsLeft > 0 
                                    ? `Reenviar en ${secondsLeft}s` 
                                    : 'Reenviar email de verificación'
                            } 
                        </button> 
                        {verificationMessage && ( 
                            <p className="mt-3 text-sm text-[#6b9a5e]"> 
                                {verificationMessage} 
                            </p> 
                        )} 
                        
                        {verificationError && ( 
                            <p className="mt-3 text-sm text-red-600"> 
                                {verificationError} 
                            </p> 
                        )} 
                    </div> 
                )}
                
                {error && (
                    <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-3">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-stone-900 text-white text-sm font-medium py-3 rounded-md hover:bg-stone-800 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Procesando...' : 'Continuar al pago'}
                </button>
            </form>

            <div>
                <h2 className="text-lg font-semibold mb-4">Tu pedido</h2>
                <div className="bg-white border border-stone-200 rounded-lg divide-y divide-stone-100">
                    {items.map((item) => (
                        <div key={item.productoEcommerceId} className="flex justify-between p-3 text-sm">
                            <span>{item.nombre} × {item.cantidad}</span>
                            <span className="font-medium">
                                ${(item.precio * item.cantidad).toLocaleString('es-AR')}
                            </span>
                        </div>
                    ))}
                    <div className="flex justify-between p-3 font-semibold">
                        <span>Total</span>
                        <span>${total.toLocaleString('es-AR')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}