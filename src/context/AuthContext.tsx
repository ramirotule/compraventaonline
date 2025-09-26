import React, { createContext, useState } from 'react';
import type { ReactNode } from 'react';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  estaLogueado: boolean;
  login: (usuario: Usuario) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const login = (usuarioData: Usuario) => {
    setUsuario(usuarioData);
    localStorage.setItem('usuario', JSON.stringify(usuarioData));
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
  };

  const estaLogueado = usuario !== null;

  // Verificar si hay un usuario guardado en localStorage al cargar
  React.useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  const value: AuthContextType = {
    usuario,
    estaLogueado,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// useAuth hook has been moved to a separate file: useAuth.ts