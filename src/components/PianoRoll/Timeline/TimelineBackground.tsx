import { usePianoRollLayoutStore } from '../../../stores/usePianoRollLayoutStore';
import { TimelineOctave } from './TimelineOctave';

interface TimelineBackgroundProps {
  width: number;
  height: number;
}

export const TimelineBackground: React.FC<TimelineBackgroundProps> = ({width,  height}) => {
  const { mapRangeToOctaves } = usePianoRollLayoutStore();
  const octaves = mapRangeToOctaves();
  return (
    <>
      <rect width={width} height={height}></rect>
      {octaves.map((octaveProps:any, i:number) => (
        <TimelineOctave key={i} {...octaveProps} />
      ))}
    </>
  );
};
