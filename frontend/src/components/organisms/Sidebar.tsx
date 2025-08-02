import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const SidebarContainer = styled.nav<{ $theme: any }>`
  width: 250px;
  background-color: ${props => props.$theme.colors.sidebarBackground};
  color: ${props => props.$theme.colors.sidebarText};
  padding: 20px 0;
  box-shadow: ${props => props.$theme.shadows.small};
  transition: ${props => props.$theme.transitions.medium};
`;

const Logo = styled.div<{ $theme: any }>`
  padding: 0 20px 20px;
  border-bottom: 1px solid ${props => props.$theme.colors.border};
  margin-bottom: 20px;
  
  h1 {
    margin: 0;
    font-size: 24px;
    font-weight: bold;
    color: ${props => props.$theme.colors.sidebarText};
    transition: ${props => props.$theme.transitions.medium};
  }
  
  p {
    margin: 5px 0 0;
    font-size: 14px;
    color: ${props => props.$theme.colors.textSecondary};
    transition: ${props => props.$theme.transitions.medium};
  }
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin: 0;
`;

const NavLink = styled(Link)<{ $active: boolean; $theme: any }>`
  display: block;
  padding: 12px 20px;
  color: ${({ $active, $theme }) => ($active ? $theme.colors.primary : $theme.colors.sidebarText)};
  text-decoration: none;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  background-color: ${({ $active, $theme }) => ($active ? $theme.colors.sidebarHover : 'transparent')};
  border-left: 3px solid ${({ $active, $theme }) => ($active ? $theme.colors.primary : 'transparent')};
  transition: ${({ $theme }) => $theme.transitions.fast};

  &:hover {
    background-color: ${({ $theme }) => $theme.colors.sidebarHover};
    color: ${({ $theme }) => $theme.colors.primary};
  }
`;

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { theme } = useTheme();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/producers', label: 'Produtores', icon: '👨‍🌾' },
    { path: '/farms', label: 'Fazendas', icon: '🏡' },
  ];

  return (
    <SidebarContainer $theme={theme}>
      <Logo $theme={theme}>
        <h1>Farm Project</h1>
        <p>Gestão Rural</p>
      </Logo>
      <NavList>
        {navItems.map((item) => (
          <NavItem key={item.path}>
            <NavLink to={item.path} $active={location.pathname === item.path} $theme={theme}>
              {item.icon} {item.label}
            </NavLink>
          </NavItem>
        ))}
      </NavList>
    </SidebarContainer>
  );
};

export default Sidebar; 