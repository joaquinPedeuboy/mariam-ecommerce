import { useEffect, useState } from 'react';
import { apiFetch, ApiError } from '../lib/api';
import { CustomerSchema, type Customer } from '../schemas/customer';

export default function AccountView() {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            window.location.href = '/login';
            return;
        }

        apiFetch('/store/me', {}, CustomerSchema)
            .then(setCustomer)
            .catch((err) => {
                if (err instanceof ApiError && err.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await apiFetch('/store/logout', { method: 'POST' });
        } catch {
            // Aunque falle la llamada al servidor, igual queremos cerrar sesión localmente
        } finally {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    };

    if (loading) {
        return <p className="text-center text-stone-500">Cargando...</p>;
    }

    if (!customer) {
        return null; // ya se disparó la redirección
    }

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Mi cuenta</h1>
            <div className="bg-white border border-stone-200 rounded-lg p-4 space-y-2">
                <p><span className="text-stone-500">Nombre:</span> {customer.nombre} {customer.apellido}</p>
                <p><span className="text-stone-500">Email:</span> {customer.email}</p>
            </div>

            <a
                href="/mis-pedidos"
                className="mt-4 block bg-stone-900 text-white text-sm font-medium text-center px-4 py-2 rounded-md hover:bg-stone-800 transition-colors"
            >
                Mis pedidos
            </a>

            <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="mt-4 text-sm text-red-600 hover:underline disabled:opacity-50"
            >
                {loggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
            </button>
        </div>
    );
}