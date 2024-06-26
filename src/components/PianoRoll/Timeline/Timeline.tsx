import { TimelineOctave } from './TimelineOctave';
import { EOrientation, KeyboardRange, NoteWithOctave } from '../interface';

interface TimelineProps {
  keyboardRange: KeyboardRange;
  orientation: EOrientation;
  mapRangeToTimelineOctaves: any;
  mapRangeToTimelineNotes: any;
}

export const Timeline = ({ keyboardRange, orientation, mapRangeToTimelineOctaves, mapRangeToTimelineNotes }: TimelineProps) => {
  const octaves = mapRangeToTimelineOctaves(keyboardRange);
  return (
    <>
      {octaves.map((octaveProps:any, i:number) => (
        <TimelineOctave key={i} {...octaveProps} orientation={orientation} mapRangeToTimelineNotes={mapRangeToTimelineNotes} />
      ))}
    </>
  );
};
