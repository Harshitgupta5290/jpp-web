'use client'

import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  rightElement?: React.ReactNode
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  rows?: number
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, rightElement, className = '', id, ...props }, ref) => {
    const inputId = id ?? `input-${Math.random().toString(36).slice(2)}`

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              input-base
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon || rightElement ? 'pr-10' : ''}
              ${error ? 'error' : ''}
              ${className}
            `}
            {...props}
          />
          {rightIcon && !rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
              {rightIcon}
            </div>
          )}
          {rightElement && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-error flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
        {!error && hint && (
          <p className="mt-1.5 text-xs text-text-secondary">{hint}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, rows = 4, className = '', id, ...props }, ref) => {
    const textareaId = id ?? `textarea-${Math.random().toString(36).slice(2)}`

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`
            input-base resize-none
            ${error ? 'error' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-error flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
        {!error && hint && (
          <p className="mt-1.5 text-xs text-text-secondary">{hint}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export { Input, Textarea }
export default Input
