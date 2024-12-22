import React from 'react'

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="200"
    height="50"
    viewBox="0 0 200 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* 
    Hier würde der tatsächliche SVG-Code für das Logo stehen. 
    Dies ist nur ein Platzhalter für die Struktur.
    */}
    <circle cx="25" cy="25" r="20" fill="#B8B8B8" />
    <circle cx="25" cy="25" r="20" fill="#E0E0E0" clipPath="inset(0 50% 0 0)" />
    <rect x="20" y="20" width="10" height="10" fill="#FF6B35" />
    <text x="60" y="30" fill="#1A3A6E" fontSize="24" fontFamily="Arial, sans-serif">
      Used<tspan fill="#3E7CB1">Parts</tspan>Hub
    </text>
  </svg>
)

