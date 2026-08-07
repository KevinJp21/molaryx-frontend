export const InputErrorMessage = ({ message }: { message?: string }) => {
    return (
        <p className="mt-1 text-xs font-medium text-coral-500">
            {message}
        </p>
    );
};