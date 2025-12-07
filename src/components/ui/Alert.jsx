import { AlertCircle, CheckCircle, X, AlertTriangle, Info } from 'lucide-react';

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

export function Alert({ variant = 'info', title, message, className = '', onDismiss }) {
  const Icon = iconMap[variant] || Info;
  
  const variantClasses = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  const iconColors = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
  };

  return (
    <div 
      className={`rounded-md border p-4 ${variantClasses[variant]} ${className} relative`}
      role="alert"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${iconColors[variant]}`} aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          {title && <h3 className="text-sm font-medium">{title}</h3>}
          {message && <div className="mt-1 text-sm">{message}</div>}
        </div>
        {onDismiss && (
          <div className="ml-4">
            <button
              type="button"
              className="inline-flex text-gray-500 hover:text-gray-600 focus:outline-none"
              onClick={onDismiss}
            >
              <span className="sr-only">Tutup</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Alert;
