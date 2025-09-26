// productValidations.ts - Utilidades de validación específicas para productos

export interface ProductValidationErrors {
  [key: string]: string;
}

export interface ProductFormData {
  titulo: string;
  descripcion: string;
  precio: string;
  categoria: string;
  estado: string;
  provincia: string;
  ciudad: string;
  codigoPostal: string;
  ubicacion: string;
  fotos: File[];
}

/**
 * Valida el título del producto
 */
export const validateProductTitle = (titulo: string): string => {
  if (!titulo.trim()) {
    return 'El título es obligatorio';
  }
  
  if (titulo.trim().length < 5) {
    return 'El título debe tener al menos 5 caracteres';
  }
  
  if (titulo.trim().length > 100) {
    return 'El título no puede exceder los 100 caracteres';
  }
  
  return '';
};

/**
 * Valida la descripción del producto
 */
export const validateProductDescription = (descripcion: string): string => {
  if (!descripcion.trim()) {
    return 'La descripción es obligatoria';
  }
  
  if (descripcion.trim().length < 20) {
    return 'La descripción debe tener al menos 20 caracteres';
  }
  
  if (descripcion.trim().length > 2000) {
    return 'La descripción no puede exceder los 2000 caracteres';
  }
  
  return '';
};

/**
 * Valida el precio del producto
 */
export const validateProductPrice = (precio: string): string => {
  if (!precio.trim()) {
    return 'El precio es obligatorio';
  }
  
  const priceNumber = parseFloat(precio.replace(/[$.]/g, ''));
  
  if (isNaN(priceNumber)) {
    return 'El precio debe ser un número válido';
  }
  
  if (priceNumber <= 0) {
    return 'El precio debe ser mayor a 0';
  }
  
  if (priceNumber > 999999999) {
    return 'El precio es demasiado alto';
  }
  
  return '';
};

/**
 * Valida la categoría del producto
 */
export const validateProductCategory = (categoria: string): string => {
  if (!categoria.trim()) {
    return 'La categoría es obligatoria';
  }
  return '';
};

/**
 * Valida el estado del producto
 */
export const validateProductCondition = (estado: string): string => {
  if (!estado.trim()) {
    return 'El estado del producto es obligatorio';
  }
  return '';
};

/**
 * Valida la ubicación del producto (provincia)
 */
export const validateProductProvince = (provincia: string): string => {
  if (!provincia.trim()) {
    return 'La provincia es obligatoria';
  }
  return '';
};

/**
 * Valida la ciudad del producto
 */
export const validateProductCity = (ciudad: string): string => {
  if (!ciudad.trim()) {
    return 'La ciudad es obligatoria';
  }
  return '';
};

/**
 * Valida el código postal del producto
 */
export const validateProductPostalCode = (codigoPostal: string): string => {
  if (!codigoPostal.trim()) {
    return 'El código postal es obligatorio';
  }
  
  // Validación flexible: permite 4-8 dígitos para adaptarse a diferentes sistemas
  if (!/^\d{4,8}$/.test(codigoPostal)) {
    return 'El código postal debe tener entre 4 y 8 dígitos';
  }
  
  return '';
};

/**
 * Valida las fotos del producto
 */
export const validateProductPhotos = (fotos: File[]): string => {
  if (fotos.length === 0) {
    return 'Debes subir al menos una foto del producto';
  }
  
  if (fotos.length > 10) {
    return 'No puedes subir más de 10 fotos';
  }
  
  // Validar tamaño de archivos (máximo 5MB por foto)
  const maxSize = 5 * 1024 * 1024; // 5MB
  for (const foto of fotos) {
    if (foto.size > maxSize) {
      return `La foto "${foto.name}" es demasiado grande. Máximo 5MB por foto`;
    }
  }
  
  // Validar tipos de archivo
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  for (const foto of fotos) {
    if (!allowedTypes.includes(foto.type)) {
      return `La foto "${foto.name}" no tiene un formato válido. Formatos permitidos: JPG, PNG, WEBP`;
    }
  }
  
  return '';
};

/**
 * Función principal para validar todo el formulario de producto
 */
export const validateProductForm = (formData: ProductFormData): ProductValidationErrors => {
  const errors: ProductValidationErrors = {};

  // Validar título
  const titleError = validateProductTitle(formData.titulo);
  if (titleError) errors.titulo = titleError;

  // Validar descripción
  const descriptionError = validateProductDescription(formData.descripcion);
  if (descriptionError) errors.descripcion = descriptionError;

  // Validar precio
  const priceError = validateProductPrice(formData.precio);
  if (priceError) errors.precio = priceError;

  // Validar categoría
  const categoryError = validateProductCategory(formData.categoria);
  if (categoryError) errors.categoria = categoryError;

  // Validar estado
  const conditionError = validateProductCondition(formData.estado);
  if (conditionError) errors.estado = conditionError;

  // Validar provincia
  const provinceError = validateProductProvince(formData.provincia);
  if (provinceError) errors.provincia = provinceError;

  // Validar ciudad
  const cityError = validateProductCity(formData.ciudad);
  if (cityError) errors.ciudad = cityError;

  // Validar código postal
  const postalCodeError = validateProductPostalCode(formData.codigoPostal);
  if (postalCodeError) errors.codigoPostal = postalCodeError;

  // Validar fotos
  const photosError = validateProductPhotos(formData.fotos);
  if (photosError) errors.fotos = photosError;

  return errors;
};

/**
 * Utilidad para verificar si hay errores en la validación de productos
 */
export const hasProductValidationErrors = (errors: ProductValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};

/**
 * Utilidad para limpiar un error específico de producto
 */
export const clearProductFieldError = (errors: ProductValidationErrors, fieldName: string): ProductValidationErrors => {
  const newErrors = { ...errors };
  delete newErrors[fieldName];
  return newErrors;
};

/**
 * Formatea el precio para mostrar (agregar separadores de miles y símbolo $)
 */
export const formatPrice = (price: string): string => {
  const numericPrice = parseFloat(price.replace(/[$.]/g, ''));
  if (isNaN(numericPrice)) return price;
  
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numericPrice);
};

/**
 * Limpia el formato del precio para obtener solo números
 */
export const cleanPriceFormat = (formattedPrice: string): string => {
  return formattedPrice.replace(/[$.]/g, '').replace(/\./g, '');
};