export function Alert({ className, children }) {
    return <div className={`rounded-lg border p-4 ${className}`}>{children}</div>;
}

export function AlertDescription({ className, children }) {
    return <div className={`text-sm ${className}`}>{children}</div>;
}
