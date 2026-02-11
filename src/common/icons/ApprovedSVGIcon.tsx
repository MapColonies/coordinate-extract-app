import React from 'react';
import { SVGIconProps } from './SVGIconProps';

export const ApprovedSVGIcon: React.FC<SVGIconProps> = ({ color, className }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
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
      <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
      <path d="m9 11 3 3L22 4"></path>
    </svg>
  );
};
