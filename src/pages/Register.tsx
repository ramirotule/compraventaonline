import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DatePicker, { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/datepicker.css';
import { 
  sendEmailVerification, 
  sendSMSVerification, 
  verifyCode, 
  resendCode 
} from '../services/verificationService';

// Register Spanish locale
registerLocale('es', es);

interface FormData {
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

interface ValidationErrors {
  [key: string]: string;
}

type VerificationMethod = 'email' | 'sms' | null;

const Register = () => {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellido: '',
    dni: '',
    fechaNacimiento: null,
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    provincia: '',
    codigoPostal: '',
    password: '',
    confirmPassword: '',
    aceptaTerminos: false,
    aceptaPrivacidad: false
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerificationStep, setShowVerificationStep] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Lista de provincias argentinas
  const provincias = [
    'Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes',
    'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza',
    'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis',
    'Santa Cruz', 'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego',
    'Tucumán', 'CABA'
  ];

  // Validaciones
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Nombre y apellido
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    else if (formData.nombre.trim().length < 2) newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es obligatorio';
    else if (formData.apellido.trim().length < 2) newErrors.apellido = 'El apellido debe tener al menos 2 caracteres';

    // DNI
    if (!formData.dni.trim()) newErrors.dni = 'El DNI es obligatorio';
    else if (!/^\d{7,8}$/.test(formData.dni.replace(/\./g, ''))) {
      newErrors.dni = 'El DNI debe tener entre 7 y 8 dígitos';
    }

    // Fecha de nacimiento
    if (!formData.fechaNacimiento) {
      newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
    } else {
      const fechaNac = formData.fechaNacimiento;
      const hoy = new Date();
      const edad = hoy.getFullYear() - fechaNac.getFullYear();
      const mesActual = hoy.getMonth();
      const diaActual = hoy.getDate();
      const mesNacimiento = fechaNac.getMonth();
      const diaNacimiento = fechaNac.getDate();
      
      // Ajustar edad si aún no ha pasado el cumpleaños este año
      let edadFinal = edad;
      if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
        edadFinal--;
      }
      
      if (edadFinal < 18) {
        newErrors.fechaNacimiento = 'Debes ser mayor de 18 años para registrarte';
      }
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    // Teléfono
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio';
    } else if (!/^(\+54)?[\s-]?(\d{2,4})[\s-]?\d{6,8}$/.test(formData.telefono.replace(/[\s-]/g, ''))) {
      newErrors.telefono = 'El formato del teléfono no es válido (ej: +54 11 1234-5678)';
    }

    // Dirección
    if (!formData.direccion.trim()) newErrors.direccion = 'La dirección es obligatoria';
    if (!formData.ciudad.trim()) newErrors.ciudad = 'La ciudad es obligatoria';
    if (!formData.provincia) newErrors.provincia = 'La provincia es obligatoria';
    if (!formData.codigoPostal.trim()) {
      newErrors.codigoPostal = 'El código postal es obligatorio';
    } else if (!/^\d{4}$/.test(formData.codigoPostal)) {
      newErrors.codigoPostal = 'El código postal debe tener 4 dígitos';
    }

    // Contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Términos y condiciones
    if (!formData.aceptaTerminos) {
      newErrors.aceptaTerminos = 'Debes aceptar los términos y condiciones';
    }
    if (!formData.aceptaPrivacidad) {
      newErrors.aceptaPrivacidad = 'Debes aceptar la política de privacidad';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    setFormData(prev => ({ ...prev, fechaNacimiento: date }));
    
    // Limpiar error del campo cuando el usuario seleccione una fecha
    if (errors.fechaNacimiento) {
      setErrors(prev => ({ ...prev, fechaNacimiento: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simular registro en backend
      console.log('Registrando usuario:', formData);
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Si el registro es exitoso, mostrar opciones de verificación
      setShowVerificationStep(true);
      setIsSubmitting(false);
      
    } catch (error) {
      console.error('Error en el registro:', error);
      alert('Error al crear la cuenta. Por favor, intenta de nuevo.');
      setIsSubmitting(false);
    }
  };

  const handleVerificationMethodSelect = async (method: VerificationMethod) => {
    setVerificationMethod(method);
    
    try {
      let result;
      
      if (method === 'email') {
        result = await sendEmailVerification({
          email: formData.email,
          nombre: formData.nombre,
          apellido: formData.apellido
        });
      } else {
        result = await sendSMSVerification({
          telefono: formData.telefono,
          nombre: formData.nombre,
          apellido: formData.apellido
        });
      }

      if (result.success) {
        alert(result.message);
      } else {
        alert(result.message);
      }
      
    } catch (error) {
      console.error('Error enviando código:', error);
      alert('Error al enviar el código de verificación. Intenta de nuevo.');
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      setCodeError('Ingresa el código de verificación');
      return;
    }

    if (verificationCode.length !== 6) {
      setCodeError('El código debe tener 6 dígitos');
      return;
    }

    setIsVerifying(true);
    setCodeError('');

    try {
      const identifier = verificationMethod === 'email' ? formData.email : formData.telefono;
      const result = verifyCode(identifier, verificationCode);
      
      if (result.success) {
        alert('¡Registro completado exitosamente! Bienvenido a la plataforma.');
        // Aquí redirigiríamos al login o dashboard
      } else {
        setCodeError(result.message);
      }
      
    } catch (error) {
      console.error('Error verificando código:', error);
      setCodeError('Error al verificar el código. Intenta de nuevo.');
    } finally {
      setIsVerifying(false);
    }
  };

  const resendCodeHandler = async () => {
    if (!verificationMethod) return;
    
    try {
      const identifier = verificationMethod === 'email' ? formData.email : formData.telefono;
      const userData = {
        email: formData.email,
        telefono: formData.telefono,
        nombre: formData.nombre,
        apellido: formData.apellido
      };
      
      const result = await resendCode(identifier, verificationMethod, userData);
      
      if (result.success) {
        alert(result.message);
      } else {
        alert(result.message);
      }
      
    } catch (error) {
      console.error('Error reenviando código:', error);
      alert('Error al reenviar el código.');
    }
  };

  // Si estamos en el paso de verificación
  if (showVerificationStep) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              ¡Cuenta Creada!
            </h1>
            <p className="text-gray-600">
              Ahora necesitamos verificar tu identidad
            </p>
          </div>

          {!verificationMethod ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 text-center">
                ¿Dónde quieres recibir el código de verificación?
              </h2>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleVerificationMethodSelect('email')}
                  className="w-full p-4 border border-gray-300 rounded-lg hover:border-amber-400 hover:bg-amber-50 transition-colors text-left"
                >
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">📧</div>
                    <div>
                      <div className="font-semibold">Email</div>
                      <div className="text-sm text-gray-600">{formData.email}</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleVerificationMethodSelect('sms')}
                  className="w-full p-4 border border-gray-300 rounded-lg hover:border-amber-400 hover:bg-amber-50 transition-colors text-left"
                >
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">📱</div>
                    <div>
                      <div className="font-semibold">SMS</div>
                      <div className="text-sm text-gray-600">{formData.telefono}</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="text-center">
                <div className="text-4xl mb-3">
                  {verificationMethod === 'email' ? '📧' : '📱'}
                </div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Código Enviado
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Hemos enviado un código de 6 dígitos{' '}
                  {verificationMethod === 'email' 
                    ? `al email ${formData.email}` 
                    : `por SMS al ${formData.telefono}`
                  }
                </p>
              </div>

              <div>
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Código de Verificación
                </label>
                <input
                  type="text"
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(e) => {
                    setVerificationCode(e.target.value.replace(/\D/g, '').substring(0, 6));
                    if (codeError) setCodeError('');
                  }}
                  className="w-full px-3 py-3 text-center text-2xl font-mono border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent tracking-widest"
                  placeholder="123456"
                  maxLength={6}
                />
                {codeError && (
                  <p className="mt-1 text-sm text-red-600">{codeError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isVerifying || verificationCode.length !== 6}
                className="w-full bg-amber-400 text-white py-3 px-6 rounded-md hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? 'Verificando...' : 'Verificar Código'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={resendCodeHandler}
                  className="text-amber-400 hover:text-amber-500 text-sm font-semibold"
                >
                  Reenviar código
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setVerificationMethod(null);
                    setVerificationCode('');
                    setCodeError('');
                  }}
                  className="text-gray-600 hover:text-gray-700 text-sm"
                >
                  ← Cambiar método de verificación
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Formulario principal de registro
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Crear Cuenta
          </h1>
          <p className="text-gray-600">
            Únete a nuestra comunidad de compra y venta
          </p>
        </div>

        {/* Información sobre verificación */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            🔐 Verificación de Identidad
          </h3>
          <p className="text-sm text-blue-800">
            Para garantizar la seguridad de nuestra comunidad, verificamos la identidad 
            de todos nuestros usuarios. Todos tus datos están protegidos y se usan 
            únicamente para propósitos de seguridad.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Datos Personales */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📝 Datos Personales
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  placeholder="Tu nombre"
                />
                {errors.nombre && (
                  <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                )}
              </div>

              <div>
                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido *
                </label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  placeholder="Tu apellido"
                />
                {errors.apellido && (
                  <p className="mt-1 text-sm text-red-600">{errors.apellido}</p>
                )}
              </div>

              <div>
                <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-1">
                  DNI *
                </label>
                <input
                  type="text"
                  id="dni"
                  name="dni"
                  value={formData.dni}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  placeholder="12.345.678"
                />
                {errors.dni && (
                  <p className="mt-1 text-sm text-red-600">{errors.dni}</p>
                )}
              </div>

              <div>
                <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Nacimiento *
                </label>
                <DatePicker
                  selected={formData.fechaNacimiento}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Selecciona tu fecha de nacimiento"
                  maxDate={new Date()}
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                  yearDropdownItemNumber={100}
                  scrollableYearDropdown
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  calendarClassName="shadow-lg border border-gray-200"
                  locale="es"
                />
                {errors.fechaNacimiento && (
                  <p className="mt-1 text-sm text-red-600">{errors.fechaNacimiento}</p>
                )}
              </div>
            </div>
          </div>

          {/* Datos de Contacto */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📞 Datos de Contacto
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  placeholder="tu@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  placeholder="+54 11 1234-5678"
                />
                {errors.telefono && (
                  <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
                )}
              </div>
            </div>
          </div>

          {/* Dirección */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📍 Dirección
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección *
                </label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  placeholder="Av. Corrientes 1234"
                />
                {errors.direccion && (
                  <p className="mt-1 text-sm text-red-600">{errors.direccion}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-1">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    id="ciudad"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    placeholder="Buenos Aires"
                  />
                  {errors.ciudad && (
                    <p className="mt-1 text-sm text-red-600">{errors.ciudad}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="provincia" className="block text-sm font-medium text-gray-700 mb-1">
                    Provincia *
                  </label>
                  <select
                    id="provincia"
                    name="provincia"
                    value={formData.provincia}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  >
                    <option value="">Seleccionar</option>
                    {provincias.map(provincia => (
                      <option key={provincia} value={provincia}>{provincia}</option>
                    ))}
                  </select>
                  {errors.provincia && (
                    <p className="mt-1 text-sm text-red-600">{errors.provincia}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="codigoPostal" className="block text-sm font-medium text-gray-700 mb-1">
                    Código Postal *
                  </label>
                  <input
                    type="text"
                    id="codigoPostal"
                    name="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    placeholder="1234"
                  />
                  {errors.codigoPostal && (
                    <p className="mt-1 text-sm text-red-600">{errors.codigoPostal}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Credenciales */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              🔒 Credenciales
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  placeholder="Mínimo 8 caracteres"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Contraseña *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  placeholder="Repite la contraseña"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
          </div>

          {/* Términos y Condiciones */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📋 Términos y Condiciones
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="aceptaTerminos"
                  name="aceptaTerminos"
                  checked={formData.aceptaTerminos}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 text-amber-400 focus:ring-amber-400 border-gray-300 rounded"
                />
                <label htmlFor="aceptaTerminos" className="ml-2 text-sm text-gray-700">
                  Acepto los{' '}
                  <Link to="/terminos" className="text-amber-400 hover:text-amber-500 underline">
                    términos y condiciones
                  </Link>{' '}
                  del servicio *
                </label>
              </div>
              {errors.aceptaTerminos && (
                <p className="text-sm text-red-600 ml-6">{errors.aceptaTerminos}</p>
              )}

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="aceptaPrivacidad"
                  name="aceptaPrivacidad"
                  checked={formData.aceptaPrivacidad}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 text-amber-400 focus:ring-amber-400 border-gray-300 rounded"
                />
                <label htmlFor="aceptaPrivacidad" className="ml-2 text-sm text-gray-700">
                  Acepto la{' '}
                  <Link to="/privacidad" className="text-amber-400 hover:text-amber-500 underline">
                    política de privacidad
                  </Link>{' '}
                  y el tratamiento de mis datos *
                </label>
              </div>
              {errors.aceptaPrivacidad && (
                <p className="text-sm text-red-600 ml-6">{errors.aceptaPrivacidad}</p>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-amber-400 text-white py-3 px-6 rounded-md hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
            
            <Link
              to="/login"
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-300 transition-colors text-center font-semibold"
            >
              Ya tengo cuenta
            </Link>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            ¿Necesitas ayuda?{' '}
            <Link to="/contacto" className="text-amber-400 hover:text-amber-500 underline">
              Contáctanos
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
