import React from 'react';
import './TimelineNote.css';
import { ENote } from '../interface';

export interface NoteProps {
  note: ENote;
  level:number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export const TimelineNote: React.FC<NoteProps> = ({ x, y, width, height, color }) => {
  
  return (
    <rect x={x} y={y} width={width} height={height} fill={color}  />
  )
};

