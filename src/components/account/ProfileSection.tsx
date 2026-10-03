
import type { Customer } from '../../schemas/customer';

interface Props {
    customer: Customer;
    onEdit: () => void;
}

export default function ProfileSection({
    customer,
    onEdit,
}: Props) {
    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-xl font-semibold text-stone-900">
                        Mi perfil
                    </h2>

                    <p className="text-sm text-stone-500 mt-1">
                        Información de tu cuenta.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onEdit}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg border border-stone-300 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                >
                    Editar datos
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="border border-stone-200 rounded-xl p-4">
                    <p className="text-xs text-stone-500 mb-1">
                        Nombre
                    </p>

                    <p className="text-sm font-medium text-stone-900">
                        {customer.nombre} {customer.apellido}
                    </p>
                </div>

                <div className="border border-stone-200 rounded-xl p-4">
                    <p className="text-xs text-stone-500 mb-1">
                        Email
                    </p>

                    <p className="text-sm font-medium text-stone-900 break-all">
                        {customer.email}
                    </p>
                </div>

                <div className="border border-stone-200 rounded-xl p-4">
                    <p className="text-xs text-stone-500 mb-1">
                        Teléfono
                    </p>

                    <p className="text-sm font-medium text-stone-900">
                        {customer.telefono || 'No especificado'}
                    </p>
                </div>

            </div>

            <div className="mt-8 pt-6 border-t border-stone-100">
                <h3 className="text-sm font-medium text-stone-900">
                    Seguridad de la cuenta
                </h3>

                <p className="text-sm text-stone-500 mt-1">
                    Podés cambiar tu email o contraseña desde las opciones
                    de seguridad.
                </p>
            </div>
        </div>
    );
}