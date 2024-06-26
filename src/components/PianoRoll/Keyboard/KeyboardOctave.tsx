import React from 'react';
import { KeyboardNote } from './KeyboardNote';
import { ENote, EOctave } from '../interface';

export interface KeyboardOctaveProps {
  range: [ENote, ENote];
  level: EOctave;
  xOffset: number;
  mapRangeToKeyboardNotes: any;
}

export const KeyboardOctave: React.FC<KeyboardOctaveProps> = React.memo(({ range, level, xOffset, mapRangeToKeyboardNotes }) => {
  const { whiteNotesArray, blackNotesArray } = mapRangeToKeyboardNotes(range, level, xOffset);
  return (
    <g>
      {whiteNotesArray.map((noteProps:any, i:number) => (
        <KeyboardNote key={i} {...noteProps} />
      ))}
      {blackNotesArray.map((noteProps:any, i:number) => (
        <KeyboardNote key={i + whiteNotesArray.length} {...noteProps} />
      ))}
    </g>
  );
});
