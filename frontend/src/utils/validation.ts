export interface ValidationError {
  field: string;
  message: string;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

export const validateNumber = (value: string): boolean => {
  return !isNaN(Number(value));
};

export const validateCustomer = (data: {
  name: string;
  email: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!validateRequired(data.name)) {
    errors.push({
      field: 'name',
      message: 'Name is required',
    });
  }

  if (!validateRequired(data.email)) {
    errors.push({
      field: 'email',
      message: 'Email is required',
    });
  } else if (!validateEmail(data.email)) {
    errors.push({
      field: 'email',
      message: 'Invalid email format',
    });
  }

  return errors;
};

export const validateSegment = (data: {
  name: string;
  description: string;
  rules: any;
}): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!validateRequired(data.name)) {
    errors.push({
      field: 'name',
      message: 'Name is required',
    });
  }

  if (!validateRequired(data.description)) {
    errors.push({
      field: 'description',
      message: 'Description is required',
    });
  }

  if (!data.rules || !data.rules.rules || data.rules.rules.length === 0) {
    errors.push({
      field: 'rules',
      message: 'At least one rule is required',
    });
  }

  return errors;
};

export const validateCampaign = (data: {
  name: string;
  description: string;
  segmentId: string;
  message: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!validateRequired(data.name)) {
    errors.push({
      field: 'name',
      message: 'Name is required',
    });
  }

  if (!validateRequired(data.description)) {
    errors.push({
      field: 'description',
      message: 'Description is required',
    });
  }

  if (!validateRequired(data.segmentId)) {
    errors.push({
      field: 'segmentId',
      message: 'Segment is required',
    });
  }

  if (!validateRequired(data.message)) {
    errors.push({
      field: 'message',
      message: 'Message is required',
    });
  } else if (!validateMinLength(data.message, 10)) {
    errors.push({
      field: 'message',
      message: 'Message must be at least 10 characters long',
    });
  }

  return errors;
}; 