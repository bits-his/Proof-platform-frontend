import { cn } from '../../lib/utils';

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
        className
      )}
      {...props}
    />
  );
}

export function Label({ children, htmlFor, className }) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn('block text-sm font-medium text-gray-700 mb-2', className)}
    >
      {children}
    </label>
  );
}

export function Select({ children, className, ...props }) {
  return (
    <select
      className={cn(
        'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
