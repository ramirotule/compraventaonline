import { useState } from 'react';
import { Filter } from 'bad-words';

interface ContentValidationResult {
  isValid: boolean;
  cleanedText?: string;
  detectedWords?: string[];
  message?: string;
}

export const useContentValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  
  // Configurar filtro con palabras en español
  const filter = new Filter();
  
  const spanishBadWordsRegex = [
  /\bidiot(a|o)?\b/i,
  /\best(ú|u)pido(s)?\b/i,
  /\bimb(é|e)cil(es)?\b/i,
  /\btont(o|a|os|as)?\b/i,
  /\btarad(o|a|os|as)?\b/i,
  /\bpelotud(o|a|os|as)?\b/i,
  /\bforr(o|a|os|as)?\b/i,
  /\bput(o|a|os|as)?\b/i,
  /\bconchud(o|a|os|as)?\b/i,
  /\bmog(ó|o)lic(o|a|os|as)?\b/i,
  /\bsoret(e|es)?\b/i,
  /\bgil(es)?\b/i,
  /\bchupapij(a|as)?\b/i,
  /\bpajer(o|a|os|as)?\b/i,
  /\bbolud(o|a|os|as)?\b/i,
  /\bmierd(a|as)?\b/i,
  /\bcag(ó|o)n(es)?\b/i,
  /\bmaric(ó|o)n(es)?\b/i,
  /\bput(a|as)?\b/i,
  /\bprostitut(a|as)?\b/i,
  /\bcornud(o|a|os|as)?\b/i,
  /\bort(o|os)?\b/i,
  /\bgarc(a|as)?\b/i,
  /\bladr(ó|o)n(es)?\b/i,
  /\bchorr(o|a|os|as)?\b/i,
  /\bnegro(s)? de mierd(a|as)?\b/i,
  /\bviller(o|a|os|as)?\b/i,
  /\bgord(o|a|os|as)?\b/i,
  /\bpendej(o|a|os|as)?\b/i,
  /\bcabez(a|as) de term(o|os)?\b/i
];

  // Función para detectar palabras prohibidas usando regex personalizado
  const contienePalabraProhibida = (texto: string): boolean => {
    return spanishBadWordsRegex.some((regex) => regex.test(texto));
  };

  // Agregar palabras ofensivas en español (personalizable)
const spanishBadWords = [ 
  'idiota', 'estúpido', 'imbécil', 'tonto', 'tarado', 'pelotudo',
  'forro', 'puto', 'conchudo', 'mogólico', 'sorete', 'gil',
  'chupapija', 'pajero', 'boludo', 'mierda', 'cagón','pija','concha',
  'maricón', 'puta', 'prostituta', 'cornudo', 'orto',
  'garca', 'ladrón', 'chorro', 'negro de mierda', 'villero',
  'gordo', 'mogolico', 'bobo', 'pendejo', 'cabeza de termo','topu', 'japi'
];
  
  filter.addWords(...spanishBadWords);

  /**
   * Valida texto para contenido ofensivo
   */
  const validateText = (text: string): ContentValidationResult => {
    if (!text || text.trim() === '') {
      return { isValid: true };
    }

    try {
      // Detectar palabras ofensivas con bad-words (método 1)
      const containsProfanityBadWords = filter.isProfane(text);
      
      // Detectar palabras prohibidas con regex personalizado (método 2)
      const containsCustomBadWords = contienePalabraProhibida(text);
      
      // Si cualquiera de los dos métodos detecta contenido ofensivo
      if (containsProfanityBadWords || containsCustomBadWords) {
        const cleanedText = filter.clean(text);
        
        // Identificar qué palabras fueron detectadas
        const detectedWords: string[] = [];
        
        // Detectar palabras específicas con regex
        spanishBadWordsRegex.forEach(regex => {
          const matches = text.match(regex);
          if (matches) {
            detectedWords.push(...matches);
          }
        });
        
        return {
          isValid: false,
          cleanedText,
          detectedWords: [...new Set(detectedWords)], // Remover duplicados
          message: `El texto contiene lenguaje inapropiado${detectedWords.length > 0 ? ` (detectadas: ${detectedWords.join(', ')})` : ''}. Por favor, revisa el contenido.`
        };
      }

      return { isValid: true };
    } catch (error) {
      console.error('Error validating text:', error);
      return { isValid: true }; // En caso de error, permitir el texto
    }
  };

  /**
   * Valida imágenes (básico - verifica tipo y tamaño)
   */
  const validateImage = async (file: File): Promise<ContentValidationResult> => {
    setIsValidating(true);
    
    try {
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setIsValidating(false);
        return {
          isValid: false,
          message: 'Tipo de archivo no permitido. Solo se permiten JPG, PNG y WebP.'
        };
      }

      // Validar tamaño (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setIsValidating(false);
        return {
          isValid: false,
          message: 'El archivo es demasiado grande. Máximo 5MB por imagen.'
        };
      }

      // Verificar si es realmente una imagen
      const isValidImage = await new Promise<boolean>((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        
        img.onload = () => {
          URL.revokeObjectURL(url);
          resolve(true);
        };
        
        img.onerror = () => {
          URL.revokeObjectURL(url);
          resolve(false);
        };
        
        img.src = url;
      });

      setIsValidating(false);

      if (!isValidImage) {
        return {
          isValid: false,
          message: 'El archivo no es una imagen válida.'
        };
      }

      return { isValid: true };
      
    } catch (error) {
      setIsValidating(false);
      console.error('Error validating image:', error);
      return {
        isValid: false,
        message: 'Error al validar la imagen. Por favor, intenta de nuevo.'
      };
    }
  };

  /**
   * Valida múltiples imágenes
   */
  const validateImages = async (files: File[]): Promise<ContentValidationResult[]> => {
    const validationPromises = files.map(file => validateImage(file));
    return Promise.all(validationPromises);
  };

  /**
   * Valida contenido completo del producto
   */
  const validateProductContent = async (productData: {
    titulo: string;
    descripcion: string;
    fotos: File[];
  }): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validar título
    const titleValidation = validateText(productData.titulo);
    if (!titleValidation.isValid) {
      errors.push(`Título: ${titleValidation.message}`);
    }

    // Validar descripción
    const descValidation = validateText(productData.descripcion);
    if (!descValidation.isValid) {
      errors.push(`Descripción: ${descValidation.message}`);
    }

    // Validar imágenes
    if (productData.fotos.length > 0) {
      const imageValidations = await validateImages(productData.fotos);
      imageValidations.forEach((validation, index) => {
        if (!validation.isValid) {
          errors.push(`Imagen ${index + 1}: ${validation.message}`);
        }
      });
    }

    // Verificar longitud de descripción
    if (productData.descripcion.length < 20) {
      warnings.push('La descripción es muy corta. Una descripción más detallada ayuda a los compradores.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  };

  return {
    validateText,
    validateImage,
    validateImages,
    validateProductContent,
    isValidating
  };
};