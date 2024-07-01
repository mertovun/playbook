import React from 'react';
import { TimelineNote } from './TimelineNote';
import { ENote, EOctave } from '../interface';
import usePianoRollLayoutStore from '../usePianoRollLayoutStore';
import { TimelineMidiNote } from './TimelineMidiNote';

export interface TimelineOctaveProps {
  range: [ENote, ENote];
  level: EOctave;
  xOffset: number;
}

export const TimelineOctave: React.FC<TimelineOctaveProps> = React.memo(({ range, level, xOffset }) => {
  const { mapRangeToTimelineNotes } = usePianoRollLayoutStore()
  const { whiteNotesArray, blackNotesArray } = mapRangeToTimelineNotes(range, xOffset);
  return (
    <g>
      {whiteNotesArray.map((noteProps:any, i:number) => (
        <TimelineNote key={i} {...noteProps} level={level} />
      ))}
      {blackNotesArray.map((noteProps:any, i:number) => (
        <TimelineNote key={i + whiteNotesArray.length} {...noteProps} level={level} />
      ))}
      {whiteNotesArray.map((noteProps:any, i:number) => (
        <TimelineMidiNote key={i} {...noteProps} level={level} />
      ))}
      {blackNotesArray.map((noteProps:any, i:number) => (
        <TimelineMidiNote key={i + whiteNotesArray.length} {...noteProps} level={level} />
      ))}
    </g>
  );
});
