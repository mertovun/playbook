import React from 'react';
import { Note } from './Note';
import { ENote, EOctave, EOrientation } from './interface';
import { LayoutConfig, useKeyboardPanelLayout } from './useKeyboardPanelLayout';

export interface OctaveProps {
  range: [ENote, ENote];
  level: EOctave;
  xOffset: number;
  orientation: EOrientation;
  layoutConfig: LayoutConfig;
}

export const Octave: React.FC<OctaveProps> = React.memo(({ range, level, xOffset, orientation, layoutConfig }) => {
  const { mapRangeToNotes } = useKeyboardPanelLayout([[ENote.C, EOctave._0], [ENote.B, EOctave._8]]); // Provide a dummy range
  const { whiteNotesArray, blackNotesArray } = mapRangeToNotes(range, level, xOffset, orientation, layoutConfig);
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
