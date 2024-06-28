import { TimelineOctave } from './TimelineOctave';

interface TimelineBackgroundProps {
  mapRangeToTimelineOctaves: any;
  mapRangeToTimelineNotes: any;
}

export const TimelineBackground = ({ mapRangeToTimelineOctaves, mapRangeToTimelineNotes }: TimelineBackgroundProps) => {
  const octaves = mapRangeToTimelineOctaves();
  return (
    <>
      {octaves.map((octaveProps:any, i:number) => (
        <TimelineOctave key={i} {...octaveProps} mapRangeToTimelineNotes={mapRangeToTimelineNotes} />
      ))}
    </>
  );
};
