// imageService.ts - Servicio para gestión de imágenes con Supabase Storage

import { supabase } from '../../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface ImageUploadResult {
  url: string;
  path: string;
  error?: string;
}

/**
 * Subir una imagen al storage de Supabase
 */
export const uploadImage = async (
  file: File, 
  folder: string = 'products'
): Promise<ImageUploadResult> => {
  try {
    // Obtener usuario actual
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { url: '', path: '', error: 'Usuario no autenticado' };
    }

    // Validar archivo
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { url: '', path: '', error: 'La imagen es demasiado grande. Máximo 5MB' };
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { url: '', path: '', error: 'Formato de imagen no válido. Use JPG, PNG o WEBP' };
    }

    // Generar nombre único para el archivo
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = `${user.id}/${folder}/${fileName}`;

    // Subir archivo
    const { data, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return { url: '', path: '', error: uploadError.message };
    }

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return {
      url: publicUrl,
      path: filePath,
    };

  } catch (error) {
    console.error('Error uploading image:', error);
    return { url: '', path: '', error: 'Error al subir la imagen' };
  }
};

/**
 * Subir múltiples imágenes
 */
export const uploadMultipleImages = async (
  files: File[],
  folder: string = 'products'
): Promise<ImageUploadResult[]> => {
  const uploadPromises = files.map(file => uploadImage(file, folder));
  return Promise.all(uploadPromises);
};

/**
 * Eliminar imagen del storage
 */
export const deleteImage = async (imagePath: string): Promise<{ error?: string }> => {
  try {
    const { error } = await supabase.storage
      .from('product-images')
      .remove([imagePath]);

    if (error) {
      console.error('Error deleting image:', error);
      return { error: error.message };
    }

    return {};
  } catch (error) {
    console.error('Error deleting image:', error);
    return { error: 'Error al eliminar la imagen' };
  }
};

/**
 * Obtener URL pública de una imagen
 */
export const getImageUrl = (imagePath: string): string => {
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(imagePath);

  return publicUrl;
};

/**
 * Comprimir imagen antes de subirla (opcional)
 */
export const compressImage = (file: File, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calcular nuevas dimensiones manteniendo aspect ratio
      const maxWidth = 1200;
      const maxHeight = 1200;
      
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Dibujar imagen redimensionada
      ctx?.drawImage(img, 0, 0, width, height);

      // Convertir a blob con calidad especificada
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        file.type,
        quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Validar imagen antes de subir
 */
export const validateImage = (file: File): { isValid: boolean; error?: string } => {
  // Validar tamaño
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { isValid: false, error: 'La imagen es demasiado grande. Máximo 5MB' };
  }

  // Validar tipo
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Formato no válido. Use JPG, PNG o WEBP' };
  }

  return { isValid: true };
};

/**
 * Generar thumbnail de imagen
 */
export const generateThumbnail = (file: File, size: number = 300): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = size;
      canvas.height = size;

      // Calcular recorte para thumbnail cuadrado
      const { width, height } = img;
      const minDimension = Math.min(width, height);
      const x = (width - minDimension) / 2;
      const y = (height - minDimension) / 2;

      // Dibujar imagen recortada y redimensionada
      ctx?.drawImage(
        img, 
        x, y, minDimension, minDimension, // source
        0, 0, size, size // destination
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const thumbnailFile = new File([blob], `thumb_${file.name}`, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(thumbnailFile);
          } else {
            resolve(file);
          }
        },
        file.type,
        0.8
      );
    };

    img.src = URL.createObjectURL(file);
  });
};