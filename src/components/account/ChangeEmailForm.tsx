import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { apiFetch, ApiError } from '../../lib/api';
import { CustomerUpdateResponseSchema, type Customer } from '../../schemas/customer';
import FieldError from '../ui/FieldError';
import FormError from '../ui/FormError';
import FormSuccess from '../ui/FormSuccess';

interface Props {
    customer: Customer;
    onUpdated: (customer: Customer) => void;
}

interface FieldErrors {
    email?: string;
    password?: string;
}

export default function ChangeEmailForm({
    customer,
    onUpdated,
}: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const errorFor = (field: keyof FieldErrors) => fieldErrors[field];

    const handleEmailChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        setEmail(e.target.value);

        setFieldErrors((prev) => ({
            ...prev,
            email: undefined,
        }));

        setGeneralError(null);
        setSuccess(null);
    };

    const handlePasswordChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        setPassword(e.target.value);

        setFieldErrors((prev) => ({
            ...prev,
            password: undefined,
        }));

        setGeneralError(null);
        setSuccess(null);
    };

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setFieldErrors({});
        setGeneralError(null);
        setSuccess(null);
        setLoading(true);

        try {
            const response = await apiFetch(
                '/store/me/email',
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                },
                CustomerUpdateResponseSchema
            );

            setSuccess('Tu email fue actualizado correctamente.');
            setPassword('');
            setEmail('');

            onUpdated(response.customer);
        } catch (error) {
            if (
                error instanceof ApiError &&
                error.status === 422 &&
                error.data
            ) {
                const data = error.data as {
                    errors?: Record<string, string[]>;
                    message?: string;
                };

                const errors = data.errors ?? {};

                setFieldErrors({
                    email: errors.email?.[0],
                    password: errors.password?.[0],
                });

                if (
                    data.message &&
                    !Object.keys(errors).length
                ) {
                    setGeneralError(data.message);
                }
            } else {
                setGeneralError(
                    'No se pudo actualizar el email. Intentá nuevamente.'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-stone-800">
                    Cambiar email
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                    Actualizá el email asociado a tu cuenta.
                </p>
            </div>

            <div className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                    Email actual
                </p>

                <p className="mt-1 break-all text-sm text-stone-800">
                    {customer.email}
                </p>
            </div>

            <FormError message={generalError} />

            <FormSuccess message={success} />

            <div className="space-y-5">
                <div>
                    <label
                        htmlFor="new-email"
                        className="mb-2 block text-sm font-medium text-stone-700"
                    >
                        Nuevo email
                    </label>

                    <input
                        id="new-email"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        disabled={loading}
                        placeholder="tuemail@ejemplo.com"
                        autoComplete="email"
                        className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-stone-100"
                    />

                    <FieldError message={errorFor('email')} />
                </div>

                <div>
                    <label
                        htmlFor="email-password"
                        className="mb-2 block text-sm font-medium text-stone-700"
                    >
                        Contraseña actual
                    </label>

                    <input
                        id="email-password"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        disabled={loading}
                        placeholder="Ingresá tu contraseña actual"
                        autoComplete="current-password"
                        className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-stone-100"
                    />

                    <FieldError message={errorFor('password')} />

                    <p className="mt-2 text-xs text-stone-500">
                        Necesitamos tu contraseña actual para confirmar el cambio.
                    </p>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-violet-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                    {loading ? 'Actualizando...' : 'Actualizar email'}
                </button>
            </div>
        </form>
    );
}