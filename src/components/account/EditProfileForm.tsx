import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { apiFetch, ApiError } from '../../lib/api';
import { CustomerUpdateResponseSchema, type Customer } from '../../schemas/customer';

interface Props {
    customer: Customer;
    onUpdated: (customer: Customer) => void;
    onCancel: () => void;
}

interface FieldErrors {
    nombre?: string;
    apellido?: string;
    telefono?: string;
}

export default function EditProfileForm({
    customer,
    onUpdated,
    onCancel,
}: Props) {
    const [form, setForm] = useState({
        nombre: customer.nombre ?? '',
        apellido: customer.apellido ?? '',
        telefono: customer.telefono ?? '',
    });

    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setFieldErrors({});
        setGeneralError(null);
        setSuccess(null);
        setLoading(true);

        try {
            const response = await apiFetch(
                '/store/me',
                {
                    method: 'PUT',
                    body: JSON.stringify(form),
                },
                CustomerUpdateResponseSchema
            );

            setSuccess('Tus datos fueron actualizados correctamente.');

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
                    nombre: errors.nombre?.[0],
                    apellido: errors.apellido?.[0],
                    telefono: errors.telefono?.[0],
                });

                setGeneralError(
                    data.message && !Object.keys(errors).length
                        ? data.message
                        : null
                );
            } else {
                setGeneralError(
                    'No se pudieron actualizar los datos. Intentá nuevamente.'
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
                    Datos personales
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                    Actualizá la información de tu cuenta.
                </p>
            </div>

            {generalError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {generalError}
                </div>
            )}

            {success && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {success}
                </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="nombre"
                        className="mb-2 block text-sm font-medium text-stone-700"
                    >
                        Nombre
                    </label>

                    <input
                        id="nombre"
                        name="nombre"
                        type="text"
                        value={form.nombre}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-stone-100"
                    />

                    {fieldErrors.nombre && (
                        <p className="mt-1.5 text-xs text-red-600">
                            {fieldErrors.nombre}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="apellido"
                        className="mb-2 block text-sm font-medium text-stone-700"
                    >
                        Apellido
                    </label>

                    <input
                        id="apellido"
                        name="apellido"
                        type="text"
                        value={form.apellido}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-stone-100"
                    />

                    {fieldErrors.apellido && (
                        <p className="mt-1.5 text-xs text-red-600">
                            {fieldErrors.apellido}
                        </p>
                    )}
                </div>

                <div className="sm:col-span-2">
                    <label
                        htmlFor="telefono"
                        className="mb-2 block text-sm font-medium text-stone-700"
                    >
                        Teléfono
                    </label>

                    <input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        value={form.telefono}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Ej. 2324 123456"
                        className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-stone-100"
                    />

                    {fieldErrors.telefono && (
                        <p className="mt-1.5 text-xs text-red-600">
                            {fieldErrors.telefono}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="rounded-lg border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:opacity-50"
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-violet-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? 'Guardando...' : 'Guardar cambios'}
                </button>
            </div>
        </form>
    );
}
