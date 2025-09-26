import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-auto',
    md: 'h-8 w-auto', 
    lg: 'h-12 w-auto',
    xl: 'h-35 w-auto'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl', 
    xl: 'text-3xl'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <img 
        src="/assets/logo.svg" 
        alt="CompraVenta Online" 
        className={sizeClasses[size]}
      />

    </div>
  );
};

export default Logo;