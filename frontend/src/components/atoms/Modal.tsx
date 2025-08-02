import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div<{ $size: string; $theme: any }>`
  background: ${props => props.$theme.colors.cardBackground};
  border: 1px solid ${props => props.$theme.colors.cardBorder};
  border-radius: 8px;
  padding: 24px;
  max-width: ${props => {
    switch (props.$size) {
      case 'small': return '400px';
      case 'large': return '800px';
      default: return '600px';
    }
  }};
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${props => props.$theme.shadows.large};
  transition: ${props => props.$theme.transitions.medium};
`;

const ModalHeader = styled.div<{ $theme: any }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.$theme.colors.border};
  transition: ${props => props.$theme.transitions.medium};
`;

const ModalTitle = styled.h3<{ $theme: any }>`
  margin: 0;
  color: ${props => props.$theme.colors.text};
  font-size: 20px;
  font-weight: 600;
  transition: ${props => props.$theme.transitions.medium};
`;

const CloseButton = styled.button<{ $theme: any }>`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${props => props.$theme.colors.textSecondary};
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: ${props => props.$theme.transitions.fast};

  &:hover {
    background-color: ${props => props.$theme.colors.backgroundTertiary};
    color: ${props => props.$theme.colors.text};
  }
`;

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'medium' }) => {
  const { theme } = useTheme();
  
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContent $size={size} $theme={theme}>
        <ModalHeader $theme={theme}>
          <ModalTitle $theme={theme}>{title}</ModalTitle>
          <CloseButton $theme={theme} onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal; 