import React from 'react';
import { TimelineNote } from './TimelineNote';
import { ENote, EOctave } from '../interface';

export interface TimelineOctaveProps {
  range: [ENote, ENote];
  level: EOctave;
  xOffset: number;
  mapRangeToTimelineNotes: any;
}

export const TimelineOctave: React.FC<TimelineOctaveProps> = React.memo(({ range, level, xOffset, mapRangeToTimelineNotes }) => {
  const { whiteNotesArray, blackNotesArray } = mapRangeToTimelineNotes(range, xOffset);
  return (
    <g>
      {whiteNotesArray.map((noteProps:any, i:number) => (
        <TimelineNote key={i} {...noteProps} />
      ))}
      {blackNotesArray.map((noteProps:any, i:number) => (
        <TimelineNote key={i + whiteNotesArray.length} {...noteProps} />
      ))}
    </g>
  );
});
