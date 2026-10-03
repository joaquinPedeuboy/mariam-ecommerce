import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { apiFetch, ApiError } from '../lib/api';
import { AuthResponseSchema } from '../schemas/customer';
import PasswordRequirements from './PasswordRequirements';
import FormError from './ui/FormError';
import FieldError from './ui/FieldError';

interface FieldErrors {
    [key: string]: string[];
}

export default function RegisterForm() {
    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        password_confirmation: '',
        telefono: '',
    });
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const updateField =
        (field: keyof typeof form) =>
        (e: ChangeEvent<HTMLInputElement>) => {
            setForm((prev) => ({
                ...prev,
                [field]: e.target.value,
            }));

            setFieldErrors((prev) => ({
                ...prev,
                [field]: [],
            }));

            setGeneralError(null);
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

        if (!passwordIsValid) {
            setFieldErrors({
                password: [
                    'La contraseña no cumple con todos los requisitos de seguridad.',
                ],
            });

            return;
        }

        if (form.password !== form.password_confirmation) {
            setFieldErrors({
                password_confirmation: [
                    'Las contraseñas no coinciden.',
                ],
            });
            return;
        }

        setLoading(true);

        try {
            const data = await apiFetch(
                '/store/register',
                { method: 'POST', body: JSON.stringify(form) },
                AuthResponseSchema
            );

            localStorage.setItem('token', data.token);
            window.location.href = '/mi-cuenta';
        } catch (err) {
            if (
                err instanceof ApiError &&
                err.status === 422
            ) {
                setFieldErrors(
                    err.data?.errors ?? {}
                );
            } else if (err instanceof ApiError && err.status === 429) {
                setGeneralError(
                    'Demasiados intentos. Esperá unos minutos antes de volver a intentar.'
                );
            } else if (err instanceof ApiError && err.data?.message) {
                setGeneralError(err.data.message);
            } else {
                setGeneralError(
                    'No se pudo iniciar sesión. Intentá nuevamente.'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const errorFor = (field: string) => fieldErrors[field]?.[0];

    return (
        <form 
            onSubmit={handleSubmit} 
            noValidate
            className="mx-auto max-w-sm space-y-5"
        >
            <div>
                <h2 className="text-xl font-poppins font-semibold text-stone-800">
                    Crear cuenta
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                    Creá tu cuenta para comprar en Perfumería Mariam.
                </p>
            </div>

            <FormError message={generalError} />

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label 
                        htmlFor="register-nombre"
                        className="block text-sm font-medium text-stone-700 mb-1"
                    >
                        Nombre
                    </label>

                    <input
                        id="register-nombre"
                        type="text"
                        value={form.nombre}
                        onChange={updateField('nombre')}
                        disabled={loading}
                        required
                        autoComplete="given-name"
                        className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-stone-100"
                    />

                    <FieldError message={errorFor('nombre')} />
                </div>
                <div>
                    <label 
                        htmlFor="register-apellido"
                        className="block text-sm font-medium text-stone-700 mb-1"
                    >
                        Apellido
                    </label>

                    <input
                        id="register-apellido"
                        type="text"
                        value={form.apellido}
                        onChange={updateField('apellido')}
                        disabled={loading}
                        autoComplete="family-name"
                        className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-stone-100"
                    />

                    <FieldError message={errorFor('apellido')} />
                </div>
            </div>

            <div>
                <label 
                    htmlFor="register-email"
                    className="block text-sm font-medium text-stone-700 mb-1"
                >
                    Email
                </label>

                <input
                    id="register-email"
                    type="email"
                    value={form.email}
                    onChange={updateField('email')}
                    disabled={loading}
                    required
                    autoComplete="email"
                    placeholder="tuemail@ejemplo.com"
                    className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-stone-100"
                />
                
                <FieldError message={errorFor('email')} />
            </div>

            <div>
                <label 
                    htmlFor="register-telefono"
                    className="block text-sm font-medium text-stone-700 mb-1"
                >
                    Teléfono <span className="font-normal text-stone-400">(opcional)</span>
                </label>
                <input
                    id="register-telefono"
                    type="tel"
                    value={form.telefono}
                    onChange={updateField('telefono')}
                    disabled={loading}
                    autoComplete="tel"
                    className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-stone-100"
                />

                <FieldError message={errorFor('telefono')} />
            </div>

            <div>
                <label 
                    htmlFor="register-password"
                    className="mb-1 block text-sm font-medium text-stone-700"
                >
                    Contraseña
                </label>
                <input
                    id="register-password"
                    type="password"
                    value={form.password}
                    onChange={updateField('password')}
                    disabled={loading}
                    required
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-stone-100"
                />
                <PasswordRequirements
                    password={form.password}
                />
                <FieldError message={errorFor('password')} />
            </div>

            <div>
                <label 
                    htmlFor="register-password-confirmation"
                    className="block text-sm font-medium text-stone-700 mb-1"
                >
                    Confirmar contraseña
                </label>

                <input
                    id="register-password-confirmation"
                    type="password"
                    value={form.password_confirmation}
                    onChange={updateField('password_confirmation')}
                    disabled={loading}
                    required
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-stone-100"
                />

                <FieldError message={errorFor('password_confirmation')} />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-violet-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>

            <p className="text-center text-sm text-stone-600">
                ¿Ya tenés cuenta?{' '}
                <a
                    href="/login"
                    className="border-b border-transparent text-stone-800 transition-colors duration-200 hover:border-violet-800 hover:text-violet-800"
                >
                    Ingresá acá
                </a>
            </p>
        </form>
    );
}