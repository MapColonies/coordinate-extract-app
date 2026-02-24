import React from 'react';
import { SVGIconProps } from './SVGIconProps';

export const CoordinateSVGIcon: React.FC<SVGIconProps> = ({ color, className }) => {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.4" />
      <path d="M3 12h18" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.7" />
      <path d="M6 8c2.5 1.6 9.5 1.6 12 0" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      <path d="M6 16c2.5-1.6 9.5-1.6 12 0" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      <path d="M12 3c-1.5 3-1.5 15 0 18" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      <path
        d="M16 8
           a2 2 0 1 0 -4 0
           c0 1.8 2 4 2 4
           s2-2.2 2-4z"
        stroke={color}
        strokeWidth="1.3"
        fill="none"
      />

      <circle cx="14" cy="8" r="0.7" fill={color} />
    </svg>
  );
};
