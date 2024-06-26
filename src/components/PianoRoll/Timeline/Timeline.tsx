import { TimelineOctave } from './TimelineOctave';
import { EOrientation } from '../interface';

interface TimelineProps {
  orientation: EOrientation;
  mapRangeToTimelineOctaves: any;
  mapRangeToTimelineNotes: any;
}

export const Timeline = ({ orientation, mapRangeToTimelineOctaves, mapRangeToTimelineNotes }: TimelineProps) => {
  const octaves = mapRangeToTimelineOctaves();
  return (
    <>
      {octaves.map((octaveProps:any, i:number) => (
        <TimelineOctave key={i} {...octaveProps} orientation={orientation} mapRangeToTimelineNotes={mapRangeToTimelineNotes} />
      ))}
    </>
  );
};
