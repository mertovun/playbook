import React from 'react';
import { NoteKey } from './NoteKey';
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
      {whiteNotesArray.map((noteProps:any, i:number) => (
        <NoteKey key={i} {...noteProps} />
      ))}
      {blackNotesArray.map((noteProps:any, i:number) => (
        <NoteKey key={i + whiteNotesArray.length} {...noteProps} />
      ))}
    </g>
  );
});
