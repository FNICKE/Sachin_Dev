import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20',
    secondary: 'bg-secondary text-white hover:bg-secondary-dark shadow-lg shadow-secondary/20',
    outline: 'border-2 border-primary text-primary hover:bg-primary/10',
    ghost: 'hover:bg-primary/10 text-primary',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20'
  };

  return (
    <button 
      className={`btn-premium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card = ({ children, className = '', hoverEffect = true }) => {
  return (
    <div className={`glass-panel rounded-3xl p-8 transition-all duration-500 ${hoverEffect ? 'hover:scale-[1.02] hover:shadow-2xl' : ''} ${className}`}>
      {children}
    </div>
  );
};

export const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-primary/10 text-primary border border-primary/20',
    secondary: 'bg-secondary/10 text-secondary border border-secondary/20',
    success: 'bg-green-500/10 text-green-500 border border-green-500/20'
  };

  return (
    <span className={`px-4 py-1.5 rounded-full text-sm font-medium tracking-wide ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
