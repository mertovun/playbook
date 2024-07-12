import React from 'react';

interface SelectionRectangleProps {
  selectionStart: { x: number; y: number } | null;
  selectionEnd: { x: number; y: number } | null;
}

export const SelectionRectangle: React.FC<SelectionRectangleProps> = ({ selectionStart, selectionEnd }) => {
  if (!selectionStart || !selectionEnd) {
    return null;
  }



  const x = Math.min(selectionStart.x, selectionEnd.x);
  const y = Math.min(selectionStart.y, selectionEnd.y);
  const width = Math.abs(selectionStart.x - selectionEnd.x);
  const height = Math.abs(selectionStart.y - selectionEnd.y);

  return (
    <rect
      className="selection-rectangle"
      x={x}
      y={y}
      width={width}
      height={height}
      fill='lightblue'
      opacity={0.2}
      style={{ pointerEvents: 'none' }}
    ></rect>
  );
};
