import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
  min?: string | number;
  max?: string | number;
  step?: string | number;
}

const InputContainer = styled.div<{ $fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
`;

const Label = styled.label<{ $theme: any }>`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.$theme.colors.text};
  margin-bottom: 4px;
  transition: ${props => props.$theme.transitions.medium};
`;

const StyledInput = styled.input<{
  $size?: 'small' | 'medium' | 'large';
  $error?: string;
  $theme: any;
}>`
  padding: ${({ $size }) => {
    switch ($size) {
      case 'small':
        return '8px 12px';
      case 'large':
        return '16px 20px';
      default:
        return '12px 16px';
    }
  }};
  font-size: ${({ $size }) => {
    switch ($size) {
      case 'small':
        return '14px';
      case 'large':
        return '18px';
      default:
        return '16px';
    }
  }};
  border: 2px solid ${({ $error, $theme }) => ($error ? $theme.colors.inputError : $theme.colors.inputBorder)};
  border-radius: 8px;
  background-color: ${({ disabled, $theme }) => (disabled ? $theme.colors.backgroundTertiary : $theme.colors.inputBackground)};
  color: ${({ disabled, $theme }) => (disabled ? $theme.colors.textMuted : $theme.colors.text)};
  transition: ${props => props.$theme.transitions.fast};
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${({ $error, $theme }) => ($error ? $theme.colors.inputError : $theme.colors.inputFocus)};
    box-shadow: 0 0 0 3px ${({ $error, $theme }) =>
      $error ? `${$theme.colors.inputError}40` : `${$theme.colors.inputFocus}40`};
  }

  &::placeholder {
    color: ${props => props.$theme.colors.textMuted};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span<{ $theme: any }>`
  color: ${props => props.$theme.colors.inputError};
  font-size: 12px;
  margin-top: 4px;
  transition: ${props => props.$theme.transitions.medium};
`;

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  error,
  label,
  required = false,
  fullWidth = false,
  size = 'medium',
  ...props
}) => {
  const { theme } = useTheme();

  return (
    <InputContainer $fullWidth={fullWidth}>
      {label && (
        <Label $theme={theme}>
          {label}
          {required && <span style={{ color: theme.colors.inputError }}> *</span>}
        </Label>
      )}
      <StyledInput
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        $error={error}
        $size={size}
        $theme={theme}
        {...props}
      />
      {error && <ErrorMessage $theme={theme}>{error}</ErrorMessage>}
    </InputContainer>
  );
};

export default Input; 