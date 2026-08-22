import { AlertCircle } from "lucide-react"

export const ErrorMessage = ({ message, error }: { message?: string, error?: string }) => {
    return (
        <div className="flex flex-col items-center gap-2 bg-coral-500/10 rounded-lg p-4 mt-4 border border-coral-500/20 text-coral-500">
            <AlertCircle className="size-4" />
            <span className="text-sm">{message}</span>
            {error && <span className="text-xs">{error}</span>}
        </div>
    );
};