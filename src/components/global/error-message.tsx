import { AlertCircle } from "lucide-react"

export const ErrorMessage = ({ message }: { message: string }) => {
    return (
        <div className="flex items-center gap-2 bg-coral-500/10 rounded-lg p-4 mt-4 border border-coral-500/20">
            <AlertCircle className="h-4 w-4 text-coral-500" />
            <p className="text-sm text-coral-500">{message}</p>
        </div>
    );
};