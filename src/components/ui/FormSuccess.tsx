interface Props {
    message?: string | null;
}

export default function FormSuccess({ message }: Props) {
    if (!message) {
        return null;
    }

    return (
        <div
            role="status"
            className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
            {message}
        </div>
    );
}