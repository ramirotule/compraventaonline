// validations.ts - Utilidades de validación para formularios

export interface ValidationErrors {
  [key: string]: string;
}

export interface FormData {
  // Datos personales
  nombre: string;
  apellido: string;
  dni: string;
  fechaNacimiento: Date | null;
  
  // Contacto
  email: string;
  telefono: string;
  
  // Dirección
  direccion: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  
  // Credenciales
  password: string;
  confirmPassword: string;
  
  // Aceptación de términos
  aceptaTerminos: boolean;
  aceptaPrivacidad: boolean;
}

/**
 * Valida el nombre o apellido
 */
export const validateName = (value: string, fieldName: string): string => {
  if (!value.trim()) {
    return `${fieldName} es obligatorio`;
  }
  if (value.trim().length < 2) {
    return `${fieldName} debe tener al menos 2 caracteres`;
  }
  return '';
};

/**
 * Valida el formato del DNI argentino
 */
export const validateDNI = (dni: string): string => {
  if (!dni.trim()) {
    return 'El DNI es obligatorio';
  }
  
  const dniNumbers = dni.replace(/\./g, '');
  if (!/^\d{7,8}$/.test(dniNumbers)) {
    return 'El DNI debe tener entre 7 y 8 dígitos';
  }
  
  return '';
};

/**
 * Valida la fecha de nacimiento (mayor de 18 años)
 */
export const validateBirthDate = (fechaNacimiento: Date | null): string => {
  if (!fechaNacimiento) {
    return 'La fecha de nacimiento es obligatoria';
  }

  const hoy = new Date();
  const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const mesActual = hoy.getMonth();
  const diaActual = hoy.getDate();
  const mesNacimiento = fechaNacimiento.getMonth();
  const diaNacimiento = fechaNacimiento.getDate();
  
  // Ajustar edad si aún no ha pasado el cumpleaños este año
  let edadFinal = edad;
  if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
    edadFinal--;
  }
  
  if (edadFinal < 18) {
    return 'Debes ser mayor de 18 años para registrarte';
  }
  
  return '';
};

/**
 * Valida el formato del email
 */
export const validateEmail = (email: string): string => {
  if (!email.trim()) {
    return 'El email es obligatorio';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'El formato del email no es válido';
  }
  
  return '';
};

/**
 * Valida el formato del teléfono argentino
 */
export const validatePhone = (telefono: string): string => {
  if (!telefono.trim()) {
    return 'El teléfono es obligatorio';
  }
  
  // Remover espacios y guiones para validar solo números
  const phoneNumbers = telefono.replace(/[\s-]/g, '');
  const phoneRegex = /^(\+54)?(\d{2,4})\d{6,8}$/;
  
  if (!phoneRegex.test(phoneNumbers)) {
    return 'El formato del teléfono no es válido (ej: +54 11 1234-5678)';
  }
  
  return '';
};

/**
 * Valida la dirección
 */
export const validateAddress = (direccion: string): string => {
  if (!direccion.trim()) {
    return 'La dirección es obligatoria';
  }
  return '';
};

/**
 * Valida la selección de ciudad
 */
export const validateCity = (ciudad: string): string => {
  if (!ciudad) {
    return 'La ciudad es obligatoria';
  }
  return '';
};

/**
 * Valida la selección de provincia
 */
export const validateProvince = (provincia: string): string => {
  if (!provincia) {
    return 'La provincia es obligatoria';
  }
  return '';
};

/**
 * Valida el código postal argentino (4 dígitos)
 */
export const validatePostalCode = (codigoPostal: string): string => {
  if (!codigoPostal.trim()) {
    return 'El código postal es obligatorio';
  }
  
  if (!/^\d{4}$/.test(codigoPostal)) {
    return 'El código postal debe tener 4 dígitos';
  }
  
  return '';
};

/**
 * Valida la fortaleza de la contraseña
 */
export const validatePassword = (password: string): string => {
  if (!password) {
    return 'La contraseña es obligatoria';
  }
  
  if (password.length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres';
  }
  
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
  }
  
  return '';
};

/**
 * Valida que las contraseñas coincidan
 */
export const validatePasswordConfirmation = (password: string, confirmPassword: string): string => {
  if (password !== confirmPassword) {
    return 'Las contraseñas no coinciden';
  }
  return '';
};

/**
 * Valida la aceptación de términos y condiciones
 */
export const validateTermsAcceptance = (aceptaTerminos: boolean): string => {
  if (!aceptaTerminos) {
    return 'Debes aceptar los términos y condiciones';
  }
  return '';
};

/**
 * Valida la aceptación de la política de privacidad
 */
export const validatePrivacyAcceptance = (aceptaPrivacidad: boolean): string => {
  if (!aceptaPrivacidad) {
    return 'Debes aceptar la política de privacidad';
  }
  return '';
};

/**
 * Función principal para validar todo el formulario de registro
 */
export const validateRegistrationForm = (formData: FormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Validar nombre y apellido
  const nombreError = validateName(formData.nombre, 'El nombre');
  if (nombreError) errors.nombre = nombreError;
  
  const apellidoError = validateName(formData.apellido, 'El apellido');
  if (apellidoError) errors.apellido = apellidoError;

  // Validar DNI
  const dniError = validateDNI(formData.dni);
  if (dniError) errors.dni = dniError;

  // Validar fecha de nacimiento
  const birthDateError = validateBirthDate(formData.fechaNacimiento);
  if (birthDateError) errors.fechaNacimiento = birthDateError;

  // Validar email
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  // Validar teléfono
  const phoneError = validatePhone(formData.telefono);
  if (phoneError) errors.telefono = phoneError;

  // Validar dirección
  const addressError = validateAddress(formData.direccion);
  if (addressError) errors.direccion = addressError;

  // Validar ciudad
  const cityError = validateCity(formData.ciudad);
  if (cityError) errors.ciudad = cityError;

  // Validar provincia
  const provinceError = validateProvince(formData.provincia);
  if (provinceError) errors.provincia = provinceError;

  // Validar código postal
  const postalCodeError = validatePostalCode(formData.codigoPostal);
  if (postalCodeError) errors.codigoPostal = postalCodeError;

  // Validar contraseña
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;

  // Validar confirmación de contraseña
  const passwordConfirmationError = validatePasswordConfirmation(formData.password, formData.confirmPassword);
  if (passwordConfirmationError) errors.confirmPassword = passwordConfirmationError;

  // Validar términos y condiciones
  const termsError = validateTermsAcceptance(formData.aceptaTerminos);
  if (termsError) errors.aceptaTerminos = termsError;

  // Validar política de privacidad
  const privacyError = validatePrivacyAcceptance(formData.aceptaPrivacidad);
  if (privacyError) errors.aceptaPrivacidad = privacyError;

  return errors;
};

/**
 * Utilidad para verificar si hay errores en la validación
 */
export const hasValidationErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};

/**
 * Utilidad para limpiar un error específico
 */
export const clearFieldError = (errors: ValidationErrors, fieldName: string): ValidationErrors => {
  const newErrors = { ...errors };
  delete newErrors[fieldName];
  return newErrors;
};