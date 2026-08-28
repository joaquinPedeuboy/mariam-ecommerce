import { z } from 'zod';

const API_URL = import.meta.env.PUBLIC_API_URL;

export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {},
    schema?: z.ZodType<T>
): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new ApiError(response.status, error);
    }

    const json = await response.json();

    if (!schema) {
        return json as T;
    }

    const result = schema.safeParse(json);

    if (!result.success) {
        console.error('La API devolvió datos con forma inesperada:', result.error.format());
        throw new ApiError(response.status, {
            message: 'La respuesta del servidor no tiene el formato esperado.',
        });
    }

    return result.data;
}

export class ApiError extends Error {
    constructor(public status: number, public data: any) {
        super(data?.message ?? 'Error de API');
    }
}