import { useState, type SubmitEvent } from 'react';
import { apiFetch, ApiError } from '../lib/api';
import { AuthResponseSchema } from '../schemas/customer';
import FormError from './ui/FormError';
import FieldError from './ui/FieldError';

interface FieldErrors { 
    email?: string; 
    password?: string; 
}

const CLAVE_FAVORITOS_INVITADO = 'favoritos_invitado';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const errorFor = (field: keyof FieldErrors) => fieldErrors[field];

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFieldErrors({}); 
        setGeneralError(null);
        setLoading(true);

        try {
            const data = await apiFetch('/store/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            },
            AuthResponseSchema 
        );

            localStorage.setItem('token', data.token);
            const favoritosGuardados = localStorage.getItem( CLAVE_FAVORITOS_INVITADO ); 
            
            if (favoritosGuardados) { 
                try { 
                    const ids: unknown = JSON.parse(favoritosGuardados); 
                    if ( 
                        Array.isArray(ids) && 
                        ids.every( 
                            (id) => Number.isInteger(id) && id > 0 
                        ) 
                    ) { 
                        await Promise.all( 
                            [...new Set(ids)].map((id: number) => 
                                apiFetch( 
                                    `/store/favoritos/${id}`, 
                                    { method: 'POST' } 
                                ) 
                            ) 
                        ); 
                        localStorage.removeItem(CLAVE_FAVORITOS_INVITADO); 
                    } 
                } catch (err) { 
                    console.error( 
                        'No se pudieron migrar todos los favoritos de invitado.', 
                        err 
                    ); 
                } 
            } 
            
            window.location.href = '/mi-cuenta';
        } catch (err) {
            if (err instanceof ApiError && err.status === 422 && err.data) {
                const data = err.data as {
                    errors?: Record<string, string[]>;
                    message?: string;
                };

                const errors = data.errors ?? {};

                setFieldErrors({
                    email: errors.email?.[0],
                    password: errors.password?.[0],
                });

                if (data.message && !Object.keys(errors).length) {
                    setGeneralError(data.message);
                }
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

    return (
        <>
        <form 
            onSubmit={handleSubmit} 
            noValidate
            className="mx-auto max-w-sm space-y-6"
        >
            <div> 
                <h2 className="text-xl font-poppins font-semibold text-stone-800"> 
                    Iniciar sesión
                </h2> 
                <p className="mt-1 text-sm text-stone-500"> 
                    Ingresá a tu cuenta para continuar. 
                </p> 
            </div>
            
            <FormError message={generalError} />

            <div className="space-y-5">

                <div>
                    <label 
                        htmlFor="login-email"
                        className="block text-sm font-medium text-stone-700 mb-1"
                    >
                        Email
                    </label>

                    <input
                        id="login-email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        placeholder="tuemail@ejemplo.com"
                        autoComplete="email"
                        className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-stone-100"
                    />
                    <FieldError message={errorFor('email')} />
                </div>

                <div>
                    <label 
                        htmlFor="login-password"
                        className="block text-sm font-medium text-stone-700 mb-1"
                    >
                        Contraseña
                    </label>

                    <input
                        id="login-password"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading} 
                        placeholder="Ingresá tu contraseña"
                        autoComplete="current-password"
                        required
                        className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-stone-100"
                    />

                    <FieldError message={errorFor('password')} />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-violet-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? 'Ingresando...' : 'Ingresar'}
                </button>
            </div>
        </form>

        <div className='mt-3 font-poppins text-sm text-stone-700 '>
            <a 
                href="/register"
                className="border-b border-transparent transition-colors duration-200 hover:border-violet-800 hover:text-violet-800"
            >
                ¿No tenés cuenta? Creá una.
            </a>
        </div>
        </>
    );
}