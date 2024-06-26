import React from 'react';
import './TimelineNote.css';
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

export const TimelineNote: React.FC<NoteProps> = React.memo(({ x, y, width, height, color }) => (
  <g>
    <rect x={x} y={y} width={width} height={height} fill={color}  />
  </g>
));

