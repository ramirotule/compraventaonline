import emailjs from '@emailjs/browser';

// Configuración de EmailJS
const EMAILJS_CONFIG = {
  serviceId: 'service_2plyvqf', // Tu Service ID configurado
  templateId: 'template_rcsrawv', // Tu Template ID configurado
  publicKey: 'gUqpeXgf8HkMCrRX9', // Tu Public Key configurado
};

// Interfaz para datos de verificación
interface VerificationData {
  email?: string;
  telefono?: string;
  nombre: string;
  apellido: string;
}

// Generar código de verificación aleatorio
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Almacenar código temporalmente (en producción usar backend)
const verificationCodes = new Map<string, { code: string; timestamp: number; attempts: number }>();

// Enviar email de verificación
export const sendEmailVerification = async (data: VerificationData): Promise<{ success: boolean; message: string }> => {
  try {
    if (!data.email) {
      throw new Error('Email es requerido');
    }

    const code = generateVerificationCode();
    
    // Guardar código (5 minutos de validez)
    verificationCodes.set(data.email, {
      code,
      timestamp: Date.now(),
      attempts: 0
    });

    // Configurar EmailJS si no está inicializado
    emailjs.init(EMAILJS_CONFIG.publicKey);

    // Enviar email
    const result = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      {
        to_email: data.email,
        to_name: `${data.nombre} ${data.apellido}`,
        verification_code: code,
        user_name: data.nombre,
        company_name: 'CompraVenta Online',
      }
    );

    console.log('Email enviado exitosamente:', result);
    
    return {
      success: true,
      message: `Código de verificación enviado a ${data.email}`
    };

  } catch (error) {
    console.error('Error enviando email:', error);
    
    // En modo desarrollo, mostrar el código en consola
    // if (process.env.NODE_ENV === 'development' && data.email) {
    //   const storedData = verificationCodes.get(data.email);
    //   if (storedData) {
    //     console.log(`🔐 CÓDIGO DE DESARROLLO para ${data.email}: ${storedData.code}`);
    //   }
    // }
    
    return {
      success: false,
      message: 'Error al enviar el email de verificación. En desarrollo, revisa la consola.'
    };
  }
};

// Simular envío de SMS (mejorado)
export const sendSMSVerification = async (data: VerificationData): Promise<{ success: boolean; message: string }> => {
  try {
    if (!data.telefono) {
      throw new Error('Teléfono es requerido');
    }

    const code = generateVerificationCode();
    
    // Guardar código (5 minutos de validez)
    verificationCodes.set(data.telefono, {
      code,
      timestamp: Date.now(),
      attempts: 0
    });

    // Simular delay de envío SMS
    await new Promise(resolve => setTimeout(resolve, 1500));

    // En modo desarrollo, mostrar código en consola
    console.log(`📱 SMS SIMULADO enviado a ${data.telefono}:`);
    console.log(`🔐 Código: ${code}`);
    console.log(`👤 Para: ${data.nombre} ${data.apellido}`);

    return {
      success: true,
      message: `Código SMS enviado a ${data.telefono} (simulado)`
    };

  } catch (error) {
    console.error('Error simulando SMS:', error);
    return {
      success: false,
      message: 'Error al enviar SMS (simulado)'
    };
  }
};

// Verificar código ingresado
export const verifyCode = (identifier: string, inputCode: string): { success: boolean; message: string } => {
  const stored = verificationCodes.get(identifier);
  
  if (!stored) {
    return {
      success: false,
      message: 'No se encontró código de verificación. Solicita uno nuevo.'
    };
  }

  // Verificar expiración (5 minutos)
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  
  if (now - stored.timestamp > fiveMinutes) {
    verificationCodes.delete(identifier);
    return {
      success: false,
      message: 'El código ha expirado. Solicita uno nuevo.'
    };
  }

  // Verificar intentos máximos (3 intentos)
  if (stored.attempts >= 3) {
    verificationCodes.delete(identifier);
    return {
      success: false,
      message: 'Demasiados intentos fallidos. Solicita un nuevo código.'
    };
  }

  // Verificar código
  if (stored.code !== inputCode) {
    stored.attempts++;
    verificationCodes.set(identifier, stored);
    return {
      success: false,
      message: `Código incorrecto. Te quedan ${3 - stored.attempts} intentos.`
    };
  }

  // Código correcto - limpiar
  verificationCodes.delete(identifier);
  
  return {
    success: true,
    message: '¡Verificación exitosa!'
  };
};

// Reenviar código
export const resendCode = async (identifier: string, method: 'email' | 'sms', userData: VerificationData): Promise<{ success: boolean; message: string }> => {
  // Limpiar código anterior
  verificationCodes.delete(identifier);
  
  // Enviar nuevo código
  if (method === 'email') {
    return await sendEmailVerification(userData);
  } else {
    return await sendSMSVerification(userData);
  }
};

// Limpiar códigos expirados (llamar periódicamente)
export const cleanupExpiredCodes = () => {
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  
  for (const [key, data] of verificationCodes.entries()) {
    if (now - data.timestamp > fiveMinutes) {
      verificationCodes.delete(key);
    }
  }
};