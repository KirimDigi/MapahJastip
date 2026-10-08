import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/MapahJastip.id.png';

interface LogoProps {
  className?: string;
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = 'h-9 sm:h-10 w-auto' }) => {
  return (
    <Link to="/" className="inline-flex items-center shrink-0 group focus:outline-none">
      <img
        src={logoImg}
        alt="MapahJastip.id - Japan Personal Concierge"
        className={`${className} object-contain rounded-md`}
      />
    </Link>
  );
};

