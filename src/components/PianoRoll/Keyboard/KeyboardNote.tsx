import React from 'react';
import './KeyboardNote.css';
import { ENote } from '../interface';

export interface NoteProps {
  note: ENote;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  color: string;
}

export const KeyboardNote: React.FC<NoteProps> = React.memo(({ note, x, y, width, height, label, color }) => (
  <g>
    <rect x={x} y={y} width={width} height={height} fill={color} stroke="black" />
    {label && (
      <text
        x={x + width / 2}
        y={y + height / 1.25}
        alignmentBaseline="middle"
        textAnchor="middle"
        fontSize="9"
        className="note-label"
      >
        {label}
      </text>
    )}
  </g>
));

