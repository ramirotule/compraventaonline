import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, user, loading } = useAuth();

  // Estado del formulario
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  // Estados de UI
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirigir si ya está logueado
  useEffect(() => {
    if (user && !loading) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location]);

  // Validación del formulario
  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    // Validar password
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar errores del campo al escribir
    if (errors[name as keyof LoginErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }

    // Limpiar error general
    if (errors.general) {
      setErrors(prev => ({
        ...prev,
        general: undefined
      }));
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const { error } = await signIn(formData.email, formData.password);

      if (error) {
        console.error('Login error:', error);

        // Manejar errores específicos de Supabase
        let errorMessage = 'Error al iniciar sesión. Intenta de nuevo.';
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email o contraseña incorrectos';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Debes confirmar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Demasiados intentos de login. Intenta de nuevo en unos minutos.';
        } else if (error.message.includes('Network')) {
          errorMessage = 'Error de conexión. Verifica tu internet e intenta de nuevo.';
        }

        setErrors({ general: errorMessage });
      } else {
        // El login fue exitoso, el useEffect manejará la redirección
        console.log('Login successful');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setErrors({ 
        general: 'Error inesperado. Por favor, intenta de nuevo.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mostrar loading si está validando la sesión
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto"></div>
            <p className="mt-4 text-gray-600">Verificando sesión...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Iniciar Sesión
          </h2>
          <p className="text-gray-600">
            Accede a tu cuenta para comprar y vender
          </p>
        </div>

        {/* Mensaje de error general */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="text-red-600 text-xl mr-3">⚠️</div>
              <div>
                <p className="text-red-800 font-medium">Error de inicio de sesión</p>
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-colors ${
                errors.email 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300'
              } ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              placeholder="tu@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 font-bold">{errors.email}</p>
            )}
          </div>
          
          {/* Campo Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-colors ${
                  errors.password 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300'
                } ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 font-bold">{errors.password}</p>
            )}
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-400 text-white py-3 px-4 rounded-md hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Iniciando sesión...
              </div>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        {/* Links adicionales */}
        <div className="mt-8 space-y-4 text-center">
          <div>
            <Link 
              to="/forgot-password" 
              className="text-amber-400 hover:text-amber-500 text-sm font-medium"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <p className="text-gray-600 mb-3">
              ¿No tienes cuenta?
            </p>
            <Link 
              to="/registrate" 
              className="inline-block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors font-semibold"
            >
              Crear cuenta nueva
            </Link>
          </div>

          <div className="pt-4">
            <Link 
              to="/" 
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;