import { useState, type ChangeEvent, type SubmitEvent, } from 'react';
import { apiFetch, ApiError } from '../../lib/api';
import PasswordRequirements from '../PasswordRequirements';
import FieldError from '../ui/FieldError';
import FormError from '../ui/FormError';
import FormSuccess from '../ui/FormSuccess';

interface FieldErrors {
    current_password?: string;
    password?: string;
    password_confirmation?: string;
}

export default function ChangePasswordForm() {
    const [form, setForm] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const errorFor = (field: keyof FieldErrors) => fieldErrors[field];

    const handleChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setFieldErrors((prev) => ({
            ...prev,
            [name]: undefined,
        }));

        setGeneralError(null);
        setSuccess(null);
    };

    const passwordIsValid =
        form.password.length >= 8 &&
        /[A-Z]/.test(form.password) &&
        /[0-9]/.test(form.password) &&
        /[^A-Za-z0-9]/.test(form.password);

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setFieldErrors({});
        setGeneralError(null);
        setSuccess(null);

        if (!form.current_password) {
            setFieldErrors({
                current_password:
                    'Ingresá tu contraseña actual.',
            });

            return;
        }

        if (!passwordIsValid) {
            setFieldErrors({
                password:
                    'La contraseña no cumple con todos los requisitos de seguridad.',
            });

            return;
        }

        if (form.password !== form.password_confirmation) {
            setFieldErrors({
                password_confirmation:
                    'Las contraseñas no coinciden.',
            });

            return;
        }

        setLoading(true);

        try {
            await apiFetch('/store/me/password', {
                method: 'PUT',
                body: JSON.stringify(form),
            });

            setForm({
                current_password: '',
                password: '',
                password_confirmation: '',
            });

            setSuccess(
                'Tu contraseña se actualizó correctamente.'
            );
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
                    current_password:
                        errors.current_password?.[0],
                    password:
                        errors.password?.[0],
                    password_confirmation:
                        errors.password_confirmation?.[0],
                });

                if (
                    data.message &&
                    !Object.keys(errors).length
                ) {
                    setGeneralError(data.message);
                }
            } else {
                setGeneralError(
                    'No se pudo actualizar la contraseña. Intentá nuevamente.'
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
                    Seguridad
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                    Cambiá la contraseña para mantener segura tu cuenta.
                </p>
            </div>

            <FormError message={generalError} />

            <FormSuccess message={success} />

            <div className="space-y-5">
                <div>
                    <label
                        htmlFor="current-password"
                        className="mb-2 block text-sm font-medium text-stone-700"
                    >
                        Contraseña actual
                    </label>

                    <input
                        id="current-password"
                        name="current_password"
                        type="password"
                        value={form.current_password}
                        onChange={handleChange}
                        disabled={loading}
                        autoComplete="current-password"
                        className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-stone-100"
                    />

                    <FieldError message={errorFor('current_password')} />
                </div>

                <div>
                    <label
                        htmlFor="new-password"
                        className="mb-2 block text-sm font-medium text-stone-700"
                    >
                        Nueva contraseña
                    </label>

                    <input
                        id="new-password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        disabled={loading}
                        autoComplete="new-password"
                        className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-stone-100"
                    />
                    <PasswordRequirements password={form.password} />

                    <FieldError message={errorFor('password')} />
                </div>

                <div>
                    <label
                        htmlFor="password-confirmation"
                        className="mb-2 block text-sm font-medium text-stone-700"
                    >
                        Repetir nueva contraseña
                    </label>

                    <input
                        id="password-confirmation"
                        name="password_confirmation"
                        type="password"
                        value={form.password_confirmation}
                        onChange={handleChange}
                        disabled={loading}
                        autoComplete="new-password"
                        className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-stone-100"
                    />

                    <FieldError message={errorFor('password_confirmation')} />
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-violet-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                    {loading
                        ? 'Actualizando...'
                        : 'Cambiar contraseña'}
                </button>
            </div>
        </form>
    );
}