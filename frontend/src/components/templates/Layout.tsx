import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';
import Sidebar from '../organisms/Sidebar';
import Header from '../organisms/Header';

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutContainer = styled.div<{ $theme: any }>`
  display: flex;
  min-height: 100vh;
  background-color: ${props => props.$theme.colors.background};
  color: ${props => props.$theme.colors.text};
  transition: ${props => props.$theme.transitions.medium};
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div<{ $theme: any }>`
  flex: 1;
  padding: 24px;
  background-color: ${props => props.$theme.colors.backgroundSecondary};
  transition: ${props => props.$theme.transitions.medium};
`;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <LayoutContainer $theme={theme}>
      <Sidebar />
      <MainContent>
        <Header />
        <Content $theme={theme}>{children}</Content>
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout; 