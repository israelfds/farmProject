import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  padding?: 'small' | 'medium' | 'large';
  shadow?: 'none' | 'small' | 'medium' | 'large';
  borderRadius?: 'small' | 'medium' | 'large';
  hover?: boolean;
  onClick?: () => void;
}

const StyledCard = styled.div<{
  $padding?: 'small' | 'medium' | 'large';
  $shadow?: 'none' | 'small' | 'medium' | 'large';
  $borderRadius?: 'small' | 'medium' | 'large';
  $hover?: boolean;
  $theme: any;
}>`
  background-color: ${props => props.$theme.colors.cardBackground};
  border: 1px solid ${props => props.$theme.colors.cardBorder};
  border-radius: ${({ $borderRadius }) => {
    switch ($borderRadius) {
      case 'small':
        return '4px';
      case 'large':
        return '16px';
      default:
        return '8px';
    }
  }};
  padding: ${({ $padding }) => {
    switch ($padding) {
      case 'small':
        return '12px';
      case 'large':
        return '32px';
      default:
        return '24px';
    }
  }};
  box-shadow: ${({ $shadow, $theme }) => {
    switch ($shadow) {
      case 'small':
        return $theme.shadows.small;
      case 'large':
        return $theme.shadows.large;
      case 'none':
        return 'none';
      default:
        return $theme.shadows.medium;
    }
  }};
  transition: ${props => props.$theme.transitions.medium};
  cursor: ${({ onClick, $hover }) => (onClick || $hover ? 'pointer' : 'default')};

  ${({ $hover, onClick, $theme }) => {
    if ($hover || onClick) {
      return `
        &:hover {
          transform: translateY(-2px);
          box-shadow: ${$theme.shadows.large};
        }
      `;
    }
    return '';
  }}
`;

const Card: React.FC<CardProps> = ({
  children,
  padding = 'medium',
  shadow = 'medium',
  borderRadius = 'medium',
  hover = false,
  onClick,
  ...props
}) => {
  const { theme } = useTheme();

  return (
    <StyledCard
      $padding={padding}
      $shadow={shadow}
      $borderRadius={borderRadius}
      $hover={hover}
      onClick={onClick}
      $theme={theme}
      {...props}
    >
      {children}
    </StyledCard>
  );
};

export default Card; 