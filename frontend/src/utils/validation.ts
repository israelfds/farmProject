import { cpf, cnpj } from 'cpf-cnpj-validator';

export const validateCpfCnpj = (document: string): boolean => {
  if (!document) return false;
  
  // Remove formatação
  const cleanDocument = document.replace(/[^\d]/g, '');
  
  // Valida CPF ou CNPJ
  return cpf.isValid(cleanDocument) || cnpj.isValid(cleanDocument);
};

export const formatCpfCnpj = (document: string): string => {
  if (!document) return '';
  
  const cleanDocument = document.replace(/[^\d]/g, '');
  
  if (cleanDocument.length === 11) {
    // Formata CPF
    return cleanDocument.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else if (cleanDocument.length === 14) {
    // Formata CNPJ
    return cleanDocument.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  return document;
};

export const validateFarmAreas = (
  totalArea: number,
  arableArea: number,
  vegetationArea: number
): { isValid: boolean; message?: string } => {
  const sum = arableArea + vegetationArea;
  
  if (sum > totalArea) {
    return {
      isValid: false,
      message: `A soma das áreas agricultável (${arableArea} ha) e vegetação (${vegetationArea} ha) não pode ultrapassar a área total (${totalArea} ha). Soma atual: ${sum} ha`
    };
  }
  
  return { isValid: true };
};

export const validateRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePositiveNumber = (value: number): boolean => {
  return typeof value === 'number' && value > 0;
}; 