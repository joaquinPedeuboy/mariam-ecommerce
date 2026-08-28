import { useState, type SubmitEvent } from 'react';
import { apiFetch, ApiError } from '../lib/api';
import { AuthResponseSchema } from '../schemas/customer';

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

    const updateField = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFieldErrors({});
        setGeneralError(null);
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
            if (err instanceof ApiError && err.status === 422) {
                // Laravel manda: { message: "...", errors: { campo: ["mensaje"] } }
                setFieldErrors(err.data?.errors ?? {});
            } else {
                setGeneralError(err instanceof ApiError ? err.message : 'No se pudo conectar con el servidor.');
            }
        } finally {
            setLoading(false);
        }
    };

    const errorFor = (field: string) => fieldErrors[field]?.[0];

    return (
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Nombre</label>
                    <input
                        type="text"
                        value={form.nombre}
                        onChange={updateField('nombre')}
                        required
                        className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                    />
                    {errorFor('nombre') && <p className="text-red-600 text-xs mt-1">{errorFor('nombre')}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Apellido</label>
                    <input
                        type="text"
                        value={form.apellido}
                        onChange={updateField('apellido')}
                        className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                <input
                    type="email"
                    value={form.email}
                    onChange={updateField('email')}
                    required
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                />
                {errorFor('email') && <p className="text-red-600 text-xs mt-1">{errorFor('email')}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Teléfono (opcional)</label>
                <input
                    type="tel"
                    value={form.telefono}
                    onChange={updateField('telefono')}
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Contraseña</label>
                <input
                    type="password"
                    value={form.password}
                    onChange={updateField('password')}
                    required
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                />
                {errorFor('password') && <p className="text-red-600 text-xs mt-1">{errorFor('password')}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Confirmar contraseña</label>
                <input
                    type="password"
                    value={form.password_confirmation}
                    onChange={updateField('password_confirmation')}
                    required
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                />
            </div>

            {generalError && <p className="text-red-600 text-sm">{generalError}</p>}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-stone-900 text-white text-sm font-medium py-2 rounded-md hover:bg-stone-800 transition-colors disabled:opacity-50"
            >
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
        </form>
    );
}