import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

const StyledButton = styled.button<{
  $variant?: 'primary' | 'secondary' | 'danger' | 'success';
  $size?: 'small' | 'medium' | 'large';
  $fullWidth?: boolean;
  $theme: any;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: ${props => props.$theme.transitions.fast};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  /* Size variants */
  ${({ $size }) => {
    switch ($size) {
      case 'small':
        return `
          padding: 8px 16px;
          font-size: 14px;
        `;
      case 'large':
        return `
          padding: 16px 32px;
          font-size: 18px;
        `;
      default:
        return `
          padding: 12px 24px;
          font-size: 16px;
        `;
    }
  }}

  /* Color variants */
  ${({ $variant, disabled, $theme }) => {
    if (disabled) {
      return `
        background-color: ${$theme.colors.backgroundTertiary};
        color: ${$theme.colors.textMuted};
        cursor: not-allowed;
      `;
    }

    switch ($variant) {
      case 'secondary':
        return `
          background-color: ${$theme.colors.backgroundSecondary};
          color: ${$theme.colors.text};
          border: 1px solid ${$theme.colors.border};
          &:hover {
            background-color: ${$theme.colors.backgroundTertiary};
          }
        `;
      case 'danger':
        return `
          background-color: ${$theme.colors.buttonDanger};
          color: ${$theme.colors.buttonText};
          &:hover {
            background-color: ${$theme.colors.danger};
          }
        `;
      case 'success':
        return `
          background-color: ${$theme.colors.buttonSuccess};
          color: ${$theme.colors.buttonText};
          &:hover {
            background-color: ${$theme.colors.success};
          }
        `;
      default:
        return `
          background-color: ${$theme.colors.buttonPrimary};
          color: ${$theme.colors.buttonText};
          &:hover {
            background-color: ${$theme.colors.primary};
          }
        `;
    }
  }}

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => props.$theme.colors.primary}40;
  }
`;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  type = 'button',
  fullWidth = false,
  ...props
}) => {
  const { theme } = useTheme();

  return (
    <StyledButton
      $variant={variant}
      $size={size}
      disabled={disabled}
      onClick={onClick}
      type={type}
      $fullWidth={fullWidth}
      $theme={theme}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button; 