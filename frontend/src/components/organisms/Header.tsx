import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';

const HeaderContainer = styled.header<{ $theme: any }>`
  background-color: ${props => props.$theme.colors.headerBackground};
  border-bottom: 1px solid ${props => props.$theme.colors.headerBorder};
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${props => props.$theme.shadows.small};
  transition: ${props => props.$theme.transitions.medium};
`;

const Title = styled.h1<{ $theme: any }>`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.$theme.colors.headerText};
  transition: ${props => props.$theme.transitions.medium};
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ThemeToggle = styled.button<{ $theme: any }>`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: ${props => props.$theme.transitions.fast};
  color: ${props => props.$theme.colors.headerText};

  &:hover {
    background-color: ${props => props.$theme.colors.backgroundTertiary};
  }
`;

const Header: React.FC = () => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <HeaderContainer $theme={theme}>
      <Title $theme={theme}>Farm Project - Gestão Rural</Title>
      <HeaderActions>
        <ThemeToggle $theme={theme} onClick={toggleTheme}>
          {isDark ? '☀️' : '🌙'}
        </ThemeToggle>
      </HeaderActions>
    </HeaderContainer>
  );
};

export default Header; 