import { useState, type SubmitEvent } from 'react';
import { apiFetch, ApiError } from '../lib/api';
import { AuthResponseSchema } from '../schemas/customer';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const data = await apiFetch('/store/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            },
            AuthResponseSchema 
        );

            localStorage.setItem('token', data.token);
            window.location.href = '/mi-cuenta';
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'No se pudo conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4">
            <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Contraseña</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-stone-900 text-white text-sm font-medium py-2 rounded-md hover:bg-stone-800 transition-colors disabled:opacity-50"
            >
                {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
        </form>
    );
}