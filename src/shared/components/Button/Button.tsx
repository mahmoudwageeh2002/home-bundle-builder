import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import './Button.css'

type ButtonVariant = 'primary' | 'outline' | 'ghost'

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant
  }
>

export function Button({ children, className = '', variant = 'primary', ...props }: ButtonProps) {
  return (
    <button className={`btn btn--${variant} ${className}`.trim()} type="button" {...props}>
      {children}
    </button>
  )
}
