import React from 'react';
import { TimelineNote } from './TimelineNote';
import { ENote, EOctave } from '../interface';
import usePianoRollLayoutStore from '../../../stores/usePianoRollLayoutStore';
import { MidiNote } from './MidiNote';

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
        <MidiNote key={i} {...noteProps} level={level} />
      ))}
      {blackNotesArray.map((noteProps:any, i:number) => (
        <MidiNote key={i + whiteNotesArray.length} {...noteProps} level={level} />
      ))}
    </g>
  );
});
