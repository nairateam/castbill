'use client'

import React, { forwardRef, useState } from 'react';
import {
    Eye,
    EyeOff,
    AlertCircle,
    CheckCircle,
    HelpCircle
} from 'lucide-react';

export type InputType =
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'tel'
    | 'url'
    | 'search'
    | 'date'
    | 'time'
    | 'datetime-local';

export type InputVariant = 'default' | 'filled' | 'outline' | 'ghost';
export type InputSize = 'sm' | 'md' | 'lg';

export interface InputFieldProps extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'size' | 'prefix'
> {
    label?: string;
    description?: string;
    error?: string;
    success?: boolean;
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    fullWidth?: boolean;
    type?: InputType;
    variant?: InputVariant;
    size?: InputSize;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    clearable?: boolean;
    onClear?: () => void;
    showPasswordToggle?: boolean;
    helperText?: string;
    className?: string;
    containerClassName?: string;
    labelClassName?: string;
    inputClassName?: string;
    errorClassName?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
    (
        {
            label,
            description,
            error,
            success = false,
            required = false,
            disabled = false,
            readOnly = false,
            fullWidth = false,
            type = 'text',
            variant = 'default',
            size = 'md',
            leftIcon,
            rightIcon,
            prefix,
            suffix,
            clearable = false,
            onClear,
            showPasswordToggle = type === 'password',
            helperText,
            className = '',
            containerClassName = '',
            labelClassName = '',
            inputClassName = '',
            errorClassName = '',
            value,
            onChange,
            onBlur,
            onFocus,
            ...props
        },
        ref
    ) => {
        const [isFocused, setIsFocused] = useState(false);
        const [showPassword, setShowPassword] = useState(false);
        const [internalValue, setInternalValue] = useState(value || '');

        const isPasswordType = type === 'password';
        const inputType = isPasswordType && showPassword ? 'text' : type;
        const hasError = !!error;
        const hasSuccess = success && !hasError && internalValue;
        const hasLeftContent = !!leftIcon || !!prefix;
        const hasRightContent = !!rightIcon || !!suffix || clearable || showPasswordToggle;

        // Size classes
        const sizeClasses = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2.5 text-base',
            lg: 'px-5 py-3 text-lg',
        };

        // Variant classes
        const variantClasses = {
            default: `bg-white border border-gray-300 focus:border-primary/90 focus:ring-2 focus:ring-primary/200 ${disabled ? 'bg-gray-50 text-gray-400' : 'text-gray-900'
                }`,
            filled: `bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${disabled ? 'bg-gray-100 text-gray-400' : 'text-gray-900'
                }`,
            outline: `bg-transparent border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${disabled ? 'text-gray-400 border-gray-200' : 'text-gray-900'
                }`,
            ghost: `bg-transparent border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 ${disabled ? 'text-gray-400 border-gray-200' : 'text-gray-900'
                }`,
        };

        // Error/Success state classes
        const stateClasses = hasError
            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
            : hasSuccess
                ? 'border-green-500 focus:border-green-500 focus:ring-green-200'
                : '';

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true);
            onFocus?.(e);
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false);
            onBlur?.(e);
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setInternalValue(e.target.value);
            onChange?.(e);
        };

        const handleClear = () => {
            setInternalValue('');
            onClear?.();
            // Create a synthetic change event
            const event = {
                target: { value: '' },
            } as React.ChangeEvent<HTMLInputElement>;
            onChange?.(event);
        };

        const togglePasswordVisibility = () => {
            setShowPassword(!showPassword);
        };

        return (
            <div className={`${fullWidth ? 'w-full' : ''} ${containerClassName}`}>
                {/* Label */}
                {label && (
                    <label
                        className={`block text-sm font-medium text-gray-700 mb-1.5 ${disabled ? 'text-gray-400' : ''
                            } ${labelClassName}`}
                    >
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                {/* Description */}
                {description && (
                    <p className="text-sm text-gray-500 mb-2">{description}</p>
                )}

                {/* Input Container */}
                <div className="relative">
                    {/* Left Icon or Prefix */}
                    {hasLeftContent && (
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center text-gray-400">
                            {prefix || leftIcon}
                        </div>
                    )}

                    {/* Input Field */}
                    <input
                        ref={ref}
                        type={inputType}
                        value={value !== undefined ? value : internalValue}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        disabled={disabled}
                        readOnly={readOnly}
                        required={required}
                        className={`
              ${sizeClasses[size]}
              ${variantClasses[variant]}
              ${stateClasses}
              ${hasLeftContent ? 'pl-10' : ''}
              ${hasRightContent ? 'pr-10' : ''}
              ${fullWidth ? 'w-full' : ''}
              rounded-lg transition-all duration-200
              placeholder:text-gray-400
              focus:outline-none
              disabled:cursor-not-allowed
              read-only:bg-gray-50 read-only:cursor-default
              ${inputClassName}
              ${className}
            `}
                        aria-invalid={hasError}
                        aria-describedby={
                            error ? 'error-message' : helperText ? 'helper-text' : undefined
                        }
                        {...props}
                    />

                    {/* Right Content */}
                    {hasRightContent && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                            {/* Success Icon */}
                            {hasSuccess && (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            )}

                            {/* Error Icon */}
                            {hasError && (
                                <AlertCircle className="w-5 h-5 text-red-500" />
                            )}

                            {/* Clear Button */}
                            {clearable && internalValue && !disabled && (
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                    aria-label="Clear input"
                                >
                                    ×
                                </button>
                            )}

                            {/* Password Toggle */}
                            {showPasswordToggle && isPasswordType && !disabled && (
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            )}

                            {/* Custom Right Icon */}
                            {rightIcon}

                            {/* Suffix */}
                            {suffix}
                        </div>
                    )}
                </div>

                {/* Helper Text */}
                {helperText && !hasError && (
                    <p
                        id="helper-text"
                        className="mt-1.5 text-sm text-gray-500 flex items-center gap-1"
                    >
                        <HelpCircle className="w-4 h-4" />
                        {helperText}
                    </p>
                )}

                {/* Error Message */}
                {hasError && (
                    <p
                        id="error-message"
                        className={`mt-1.5 text-sm text-red-600 flex items-center gap-1 ${errorClassName}`}
                        role="alert"
                    >
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

InputField.displayName = 'InputField';

export default InputField;