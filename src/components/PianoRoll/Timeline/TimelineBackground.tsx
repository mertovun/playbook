import usePianoRollLayoutStore from '../../../stores/usePianoRollLayoutStore';
import { TimelineOctave } from './TimelineOctave';


export const TimelineBackground = () => {
  const { mapRangeToOctaves } = usePianoRollLayoutStore();
  const octaves = mapRangeToOctaves();
  return (
    <>
      {octaves.map((octaveProps:any, i:number) => (
        <TimelineOctave key={i} {...octaveProps} />
      ))}
    </>
  );
};
