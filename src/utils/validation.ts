// src/utils/validation.ts

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateWorkEmail = (email: string): boolean => {
  if (!validateEmail(email)) return false;
  
  // Block common personal email domains
  const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
  const domain = email.split('@')[1]?.toLowerCase();
  
  return !personalDomains.includes(domain);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};