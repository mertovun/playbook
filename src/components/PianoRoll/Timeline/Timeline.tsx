import { TimelineOctave } from './TimelineOctave';

interface TimelineProps {
  mapRangeToTimelineOctaves: any;
  mapRangeToTimelineNotes: any;
}

export const Timeline = ({ mapRangeToTimelineOctaves, mapRangeToTimelineNotes }: TimelineProps) => {
  const octaves = mapRangeToTimelineOctaves();
  return (
    <>
      {octaves.map((octaveProps:any, i:number) => (
        <TimelineOctave key={i} {...octaveProps} mapRangeToTimelineNotes={mapRangeToTimelineNotes} />
      ))}
    </>
  );
};
