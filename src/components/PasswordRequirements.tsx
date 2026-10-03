interface Props {
    password: string;
}

export default function PasswordRequirements({ password }: Props) {
    const requirements = [
        {
            label: 'Al menos 8 caracteres',
            valid: password.length >= 8,
        },
        {
            label: 'Al menos una letra mayúscula',
            valid: /[A-Z]/.test(password),
        },
        {
            label: 'Al menos un número',
            valid: /[0-9]/.test(password),
        },
        {
            label: 'Al menos un símbolo',
            valid: /[^A-Za-z0-9]/.test(password),
        },
    ];

    return (
        <div className="mt-3 space-y-1.5">
            {requirements.map((requirement) => (
                <div
                    key={requirement.label}
                    className={`flex items-center gap-2 text-xs ${
                        requirement.valid
                            ? 'text-green-600'
                            : 'text-gray-500'
                    }`}
                >
                    <span className="flex h-4 w-4 items-center justify-center">
                        {requirement.valid ? '✓' : '○'}
                    </span>

                    <span>{requirement.label}</span>
                </div>
            ))}
        </div>
    );
}