import React from 'react';
import { IconSVGProps } from './icon-svg.interface';

export const NotApprovedSVGIcon: React.FC<IconSVGProps> = ({ color, className }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10">
      </circle>
    </svg>
  );
};
