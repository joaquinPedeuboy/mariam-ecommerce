import { useEffect, useState } from 'react';
import { apiFetch, ApiError } from '../../lib/api';
import { CustomerSchema, type Customer } from '../../schemas/customer';
import ProfileSection from '@/components/account/ProfileSection'; 
import EditProfileForm from '@/components/account/EditProfileForm'; 
import ChangeEmailForm from '@/components/account/ChangeEmailForm'; 
import ChangePasswordForm from '@/components/account/ChangePasswordForm'; 
import AccountSidebar from './AccountSidebar';
import EmailVerificationStatus from './EmailVerificationStatus';

type Section = | 'perfil' | 'datos' | 'email' | 'seguridad';

export default function AccountView() {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);

    const [section, setSection] = useState<Section>('perfil');


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

    const handleCustomerUpdated = (
        updatedCustomer: Customer
    ) => {
        setCustomer(updatedCustomer);
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-sm text-stone-500">
                    Cargando tu cuenta...
                </p>
            </div>
        );
    }

    if (!customer) {
        return null; // ya se disparó la redirección
    }

    return (
        <div className="mx-auto w-full max-w-6xl">
            <div className="mb-8">
                <p className="text-sm font-poppins text-violet-700">
                    Mi cuenta
                </p>

                <h1 className="mt-1 text-3xl font-poppins font-semibold text-stone-800">
                    Hola, {customer.nombre}
                </h1>

                <p className="mt-2 font-mono text-sm text-stone-500">
                    Administrá tus datos, pedidos y seguridad.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
                {/* Sidebar */}
                <AccountSidebar
                    activeSection={section}
                    onSectionChange={setSection}
                    onLogout={handleLogout}
                    loggingOut={loggingOut}
                />

                {/* Contenido */}
                <section className="min-w-0 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
                    {section === 'perfil' && (
                        <div className="space-y-7">
                            <div>
                                <h2 className="text-xl font-semibold text-stone-800">
                                    Mi perfil
                                </h2>

                                <p className="mt-1 text-sm text-stone-500">
                                    Información general de tu cuenta.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-xl bg-stone-50 p-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                                        Nombre
                                    </p>

                                    <p className="mt-1 text-sm text-stone-800">
                                        {customer.nombre}{' '}
                                        {customer.apellido}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-stone-50 p-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                                        Email
                                    </p>

                                    <p className="mt-1 break-all text-sm text-stone-800">
                                        {customer.email}
                                    </p>

                                    <EmailVerificationStatus 
                                    emailVerifiedAt={customer.email_verified_at} 
                                    />
                                </div>

                                <div className="rounded-xl bg-stone-50 p-4 sm:col-span-2">
                                    <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                                        Teléfono
                                    </p>

                                    <p className="mt-1 text-sm text-stone-800">
                                        {customer.telefono || 'Sin especificar'}
                                    </p>
                                </div>
                            </div>

                            <div className="border-t border-stone-200 pt-5">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSection('datos')
                                    }
                                    className="rounded-lg bg-violet-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-800"
                                >
                                    Editar datos personales
                                </button>
                            </div>
                        </div>
                    )}

                    {section === 'datos' && (
                        <EditProfileForm
                            customer={customer}
                            onUpdated={handleCustomerUpdated}
                            onCancel={() => setSection('perfil')}
                        />
                    )}

                    {section === 'email' && (
                        <ChangeEmailForm
                            customer={customer}
                            onUpdated={handleCustomerUpdated}
                        />
                    )}

                    {section === 'seguridad' && (
                        <ChangePasswordForm />
                    )}
                </section>
            </div>
        </div> 
    );
}