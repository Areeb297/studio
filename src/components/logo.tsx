import React from 'react';

const Logo = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="rounded-lg"
  >
    <rect width="48" height="48" rx="8" fill="hsl(var(--primary))" />
    <text
      x="50%"
      y="55%"
      dominantBaseline="middle"
      textAnchor="middle"
      fontSize="28"
      fontWeight="bold"
      fill="hsl(var(--primary-foreground))"
      className="font-headline"
    >
      R
    </text>
  </svg>
);

export default Logo;
