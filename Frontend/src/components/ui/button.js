// components/ui/button.jsx
import { Link } from 'react-router-dom';

export function Button({ 
    className = '',
    variant = 'default',
    size = 'default',
    isLoading = false,
    to = null, // for React Router navigation
    href = null, // for external links
    disabled = false,
    children,
    ...props 
}) {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:pointer-events-none disabled:opacity-50';
    
    const variants = {
        default: 'bg-teal-600 text-white hover:bg-teal-700',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
        outline: 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-900',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        ghost: 'hover:bg-gray-100 text-gray-600 hover:text-gray-900',
        link: 'text-teal-600 hover:text-teal-700 p-0 h-auto underline-offset-4 hover:underline bg-transparent',
        info: "bg-teal-950/20 text-white text-xl hover:bg-teal-950/20 cursor-default" // New variant

    };

    const sizes = {
        default: 'h-9 px-4 py-2 text-sm',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-8 text-base',
        icon: 'h-9 w-9'
    };

    const variantStyles = variants[variant] || variants.default;
    const sizeStyles = variant === 'link' ? '' : (sizes[size] || sizes.default);
    const loadingStyles = isLoading ? 'cursor-not-allowed' : '';
    const combinedClassName = `${baseStyles} ${variantStyles} ${sizeStyles} ${loadingStyles} ${className}`;

    // If 'to' prop is provided, use React Router's Link
    if (to) {
        return (
            <Link 
                to={to} 
                className={combinedClassName}
                {...props}
            >
                {children}
            </Link>
        );
    }

    // If 'href' prop is provided, use regular anchor tag
    if (href) {
        return (
            <a 
                href={href}
                className={combinedClassName}
                {...props}
            >
                {children}
            </a>
        );
    }

    // Default to button
    return (
        <button 
            className={combinedClassName}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading ? (
                <>
                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle 
                            className="opacity-25" 
                            cx="12" 
                            cy="12" 
                            r="10" 
                            stroke="currentColor" 
                            strokeWidth="4"
                            fill="none"
                        />
                        <path 
                            className="opacity-75" 
                            fill="currentColor" 
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    {children}
                </>
            ) : children}
        </button>
    );
}

export function IconButton({ 
    className = '',
    variant = 'default',
    children,
    ...props 
}) {
    return (
        <Button 
            className={`p-0 w-9 h-9 ${className}`}
            variant={variant}
            {...props}
        >
            {children}
        </Button>
    );
}