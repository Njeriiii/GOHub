export function Card({ className, children }) {
    return <div className={`rounded-lg border bg-white shadow-sm ${className}`}>{children}</div>;
}

export function VolunteerMainCard({ className, children }) {
    return (
        <div className={`${className}`}>
            {children}
        </div>
    );
}
    
export function CardHeader({ className, children }) {
    return <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>;
}

export function CardTitle({ className, children }) {
    return <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
}

export function CardContent({ className, children }) {
    return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
}

export function CardDescription({ className, children }) {
    return <p className={`text-gray-600 ${className}`}>{children}</p>;
}
