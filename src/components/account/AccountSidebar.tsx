import type { ReactNode } from 'react';

type Section =
    | 'perfil'
    | 'datos'
    | 'email'
    | 'seguridad';

interface Props {
    activeSection: Section;
    onSectionChange: (section: Section) => void;
    onLogout: () => void;
    loggingOut: boolean;
}

interface MenuItem {
    id: Section;
    label: string;
    icon: ReactNode;
}

function UserIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
            />
        </svg>
    );
}

function UserEditIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 20.25a7.5 7.5 0 0 1 15 0"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m17.25 13.5 3.25 3.25-4.5 4.5-3.25-3.25 4.5-4.5Z"
            />
        </svg>
    );
}

function EmailIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >
            <rect
                width="18"
                height="14"
                x="3"
                y="5"
                rx="2"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m3 7 9 6 9-6"
            />
        </svg>
    );
}

function ShieldIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3 4.5 6v5.5c0 4.75 3.15 7.9 7.5 9.5 4.35-1.6 7.5-4.75 7.5-9.5V6L12 3Z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9.5 12 1.75 1.75L14.5 10.5"
            />
        </svg>
    );
}

function ShoppingBagIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 8.5h14l-1 11H6l-1-11Z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 8.5V6a3 3 0 0 1 6 0v2.5"
            />
        </svg>
    );
}

function LogoutIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H10"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 8l4 4-4 4"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 12H9"
            />
        </svg>
    );
}

const menuItems: MenuItem[] = [
    {
        id: 'perfil',
        label: 'Mi perfil',
        icon: <UserIcon />,
    },
    {
        id: 'datos',
        label: 'Datos personales',
        icon: <UserEditIcon />,
    },
    {
        id: 'email',
        label: 'Cambiar email',
        icon: <EmailIcon />,
    },
    {
        id: 'seguridad',
        label: 'Seguridad',
        icon: <ShieldIcon />,
    },
];

export default function AccountSidebar({
    activeSection,
    onSectionChange,
    onLogout,
    loggingOut,
}: Props) {
    return (
        <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-3 shadow-sm">
            <nav aria-label="Navegación de mi cuenta">
                <div className="space-y-1">
                    {menuItems.map((item) => {
                        const active =
                            activeSection === item.id;

                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() =>
                                    onSectionChange(item.id)
                                }
                                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                                    active
                                        ? 'bg-violet-100 text-violet-800'
                                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                                }`}
                            >
                                <span
                                    className={
                                        active
                                            ? 'text-violet-700'
                                            : 'text-stone-400'
                                    }
                                >
                                    {item.icon}
                                </span>

                                <span>{item.label}</span>
                            </button>
                        );
                    })}

                    <a
                        href="/mis-pedidos"
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-stone-600 transition hover:bg-stone-50 hover:text-stone-900"
                    >
                        <span className="text-stone-400">
                            <ShoppingBagIcon />
                        </span>

                        <span>Mis pedidos</span>
                    </a>
                </div>

                <div className="my-3 border-t border-stone-200" />

                <button
                    type="button"
                    onClick={onLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <LogoutIcon />

                    <span>
                        {loggingOut
                            ? 'Cerrando sesión...'
                            : 'Cerrar sesión'}
                    </span>
                </button>
            </nav>
        </aside>
    );
}