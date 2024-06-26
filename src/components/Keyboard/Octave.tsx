import React from 'react';
import { Note } from './Note';
import { ENote, EOctave } from './interface';

export interface OctaveProps {
  range: [ENote, ENote];
  level: EOctave;
  xOffset: number;
  mapRangeToNotes: any;
}

export const Octave: React.FC<OctaveProps> = React.memo(({ range, level, xOffset, mapRangeToNotes }) => {
  const { whiteNotesArray, blackNotesArray } = mapRangeToNotes(range, level, xOffset);
  return (
    <g>
      {whiteNotesArray.map((noteProps, i) => (
        <Note key={i} {...noteProps} />
      ))}
      {blackNotesArray.map((noteProps, i) => (
        <Note key={i + whiteNotesArray.length} {...noteProps} />
      ))}
    </g>
  );
});
