import React from 'react';
import { SVGIconProps } from './SVGIconProps';

export const NotApprovedSVGIcon: React.FC<SVGIconProps> = ({ color, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10"></circle>
    </svg>
  );
};
