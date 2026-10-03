import { useEmailVerification } from '../../hooks/useEmailVerification';

interface Props {
    emailVerifiedAt: string | null;
}

const RESEND_COOLDOWN = Number(
    import.meta.env.PUBLIC_EMAIL_VERIFICATION_RESEND_COOLDOWN ?? 60
);
const STORAGE_KEY = 'mariam_email_verification_last_sent';

export default function EmailVerificationStatus({ emailVerifiedAt } : Props) {

    const { sending, secondsLeft, message, error, resend, } = useEmailVerification();

    if (emailVerifiedAt) { 
        return ( 
        <div className="mt-3 flex items-center gap-2 text-sm text-[#6b9a5e]"> 
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#a8cc90]/30"> 
                ✓ 
            </span> 
            <span>verificado</span> 
        </div> 
        ); 
    }

    return (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4"> 
            <p className="text-sm font-medium text-amber-800"> 
                Email sin verificar 
            </p> 
            <p className="mt-1 text-sm leading-5 text-amber-700"> 
                Necesitás verificar tu email para poder realizar compras. 
            </p> 
            
            <button 
                type="button" 
                onClick={resend} 
                disabled={sending || secondsLeft > 0}
                className="mt-3 rounded-lg bg-violet-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50" 
            > 
                {sending ? 
                    'Enviando...' 
                    : secondsLeft > 0 
                        ? `Reenviar en ${secondsLeft}s` 
                        : 'Reenviar email de verificación'
                }
            </button>
            
            {message && ( 
                <p className="mt-3 text-sm text-[#6b9a5e]"> 
                    {message} 
                </p> 
            )} 
            
            {error && ( 
                <p className="mt-3 text-sm text-red-600"> 
                    {error} 
                </p> 
            )} 
        </div>
    )
}
