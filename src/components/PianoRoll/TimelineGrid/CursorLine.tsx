import React from 'react';

interface CursorLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export const CursorLine: React.FC<CursorLineProps> = ({ x1, y1, x2, y2 }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="red" strokeWidth="1" />
);
