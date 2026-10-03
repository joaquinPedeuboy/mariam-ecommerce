interface Props {
    message?: string;
}

export default function FieldError({ message }: Props) {
    if (!message) {
        return null;
    }

    return (
        <p className="mt-1.5 text-xs text-red-800 border-red-600 border-l-4 bg-red-100 p-2 font-mono">
            {message}
        </p>
    );
}