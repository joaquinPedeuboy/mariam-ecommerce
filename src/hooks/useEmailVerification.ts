import { useEffect, useState } from 'react';
import { apiFetch, ApiError } from '../lib/api';
import { EmailVerificationResponseSchema } from '../schemas/customer';

const RESEND_COOLDOWN = Number(
    import.meta.env.PUBLIC_EMAIL_VERIFICATION_RESEND_COOLDOWN ?? 60
);

const STORAGE_KEY = 'mariam_email_verification_last_sent';

export function useEmailVerification() {
    const [sending, setSending] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const lastSent = localStorage.getItem(STORAGE_KEY);

        if (!lastSent) {
            return;
        }

        const elapsed = Math.floor(
            (Date.now() - Number(lastSent)) / 1000
        );

        const remaining = RESEND_COOLDOWN - elapsed;

        if (remaining > 0) {
            setSecondsLeft(remaining);
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, []);

    useEffect(() => {
        if (secondsLeft <= 0) {
            return;
        }

        const interval = window.setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    window.clearInterval(interval);
                    localStorage.removeItem(STORAGE_KEY);
                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => window.clearInterval(interval);
    }, [secondsLeft]);

    const resend = async () => {
        if (sending || secondsLeft > 0) {
            return;
        }

        setSending(true);
        setMessage(null);
        setError(null);

        try {
            const response = await apiFetch(
                '/store/email/verification-notification',
                {
                    method: 'POST',
                },
                EmailVerificationResponseSchema
            );

            setMessage(response.message);

            localStorage.setItem(
                STORAGE_KEY,
                Date.now().toString()
            );

            setSecondsLeft(RESEND_COOLDOWN);
        } catch (err) {
            if (err instanceof ApiError) {
                if (err.status === 422) {
                    setMessage(
                        err.data?.message ??
                            'Tu email ya está verificado.'
                    );
                } else if (err.status === 429) {
                    setError(
                        'Esperá un momento antes de solicitar otro email.'
                    );
                } else if (err.status === 401) {
                    window.location.href = '/login';
                    return;
                } else {
                    setError(
                        'No se pudo enviar el email. Intentá nuevamente.'
                    );
                }
            } else {
                setError('No se pudo conectar con el servidor.');
            }
        } finally {
            setSending(false);
        }
    };

    return {
        sending,
        secondsLeft,
        message,
        error,
        resend,
    };
}