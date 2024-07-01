import React from 'react';

interface GridLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  label: string | number;
  labelX?: number;
  labelY?: number;
}

export const GridLine: React.FC<GridLineProps> = ({ x1, y1, x2, y2, color, label, labelX, labelY }) => (
  <React.Fragment>
    <line 
      x1={x1} 
      y1={y1} 
      x2={x2} 
      y2={y2} 
      stroke={color} 
      strokeWidth="0.5" 
      style={{ pointerEvents: 'none' }} 
      strokeOpacity="0.5" 
    />
    {label && (
      <text
        x={labelX}
        y={labelY}
        alignmentBaseline="middle"
        textAnchor="middle"
        fontSize="10"
        fill={color}
        opacity="0.5" 
        style={{ pointerEvents: 'none' }}
      >
        {label}
      </text>
    )}
  </React.Fragment>
);