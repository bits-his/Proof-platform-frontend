import { useRef } from 'react';
import { cn } from '../../lib/utils';

export function InputOTP({ maxLength = 6, value, onChange, className }) {
  const inputRefs = useRef([]);

  const handleChange = (index, digitValue) => {
    // Only allow digits
    if (digitValue && !/^\d$/.test(digitValue)) return;

    const newValue = value.split('');
    newValue[index] = digitValue;
    const updatedValue = newValue.join('').slice(0, maxLength);
    
    onChange(updatedValue);

    // Auto-focus next input
    if (digitValue && index < maxLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Handle left arrow
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Handle right arrow
    if (e.key === 'ArrowRight' && index < maxLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, maxLength);
    if (/^\d+$/.test(pastedData)) {
      onChange(pastedData);
      // Focus the last filled input
      const nextIndex = Math.min(pastedData.length, maxLength - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className={cn('flex gap-2 justify-center', className)}>
      {Array.from({ length: maxLength }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={cn(
            'w-12 h-14 text-center text-2xl font-semibold',
            'bg-white border-2 border-gray-300 rounded-lg',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'transition-all duration-200',
            value[index] && 'border-primary-500'
          )}
        />
      ))}
    </div>
  );
}

export function InputOTPGroup({ children }) {
  return <div className="flex gap-2">{children}</div>;
}

export function InputOTPSlot({ index }) {
  return null; // Not used in our implementation
}
