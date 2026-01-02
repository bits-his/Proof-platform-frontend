import { Toaster as Sonner } from "sonner"

const Toaster = ({ ...props }) => {
    return (
        <Sonner
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-950 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg",
                    description: "group-[.toast]:text-gray-500",
                    actionButton: "group-[.toast]:bg-primary-600 group-[.toast]:text-primary-50",
                    cancelButton: "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-500",
                    success: "group-[.toaster]:bg-green-50 group-[.toaster]:text-green-800 group-[.toaster]:border-green-200",
                    error: "group-[.toaster]:bg-red-50 group-[.toaster]:text-red-800 group-[.toaster]:border-red-200",
                },
            }}
            {...props}
        />
    )
}

export { Toaster }
