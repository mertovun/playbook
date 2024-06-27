import { ENote, EOctave, EOrientation, KeyboardRange } from './interface';
import { Keyboard } from './Keyboard/Keyboard';
import { usePianoRollLayout } from './usePianoRollLayout';
import './PianoRoll.css';
import { Timeline } from './Timeline/Timeline';

export const PianoRoll = () => {
  const keyboardRange: KeyboardRange = [[ENote.A, EOctave._0], [ENote.C, EOctave._8]];

  const { 
    orientation, 
    pianoRollWidth,
    pianoRollLength,
    timelineLength,
    timelineX,
    timelineY,
    setOrientation, 
    mapRangeToKeyboardNotes, 
    mapRangeToTimelineNotes,
    mapRangeToKeyboardOctaves } = usePianoRollLayout(keyboardRange);

  const toggleOrientation = () => {
    setOrientation(orientation === EOrientation.HORIZONTAL ? EOrientation.VERTICAL : EOrientation.HORIZONTAL);
  };

  const height = `${orientation === EOrientation.HORIZONTAL ? pianoRollLength : pianoRollWidth}`
  const width = `${orientation === EOrientation.HORIZONTAL ? pianoRollWidth : pianoRollLength}`

  const timelineHeight = `${orientation === EOrientation.HORIZONTAL ? timelineLength : pianoRollWidth}`
  const timelineWidth = `${orientation === EOrientation.HORIZONTAL ? pianoRollWidth : timelineLength}`

  // const { isPlaying, currentTime, setCurrentTime } = useStore();
  // const pianoRollRef = useRef<SVGSVGElement>(null);

  return (
    <>
      <button onClick={toggleOrientation}>
        Toggle Orientation
      </button>
      <svg className={`pianoroll-svg ${orientation}`} width={width} height={height}>
        <svg>
        <Keyboard 
          mapRangeToKeyboardOctaves={mapRangeToKeyboardOctaves}
          mapRangeToKeyboardNotes={mapRangeToKeyboardNotes}
        />
        </svg>
        <svg x={timelineX} y={timelineY} width={timelineWidth} height={timelineHeight}>
        <Timeline  
          mapRangeToTimelineOctaves={mapRangeToKeyboardOctaves}
          mapRangeToTimelineNotes={mapRangeToTimelineNotes}
        />
        </svg>
      </svg>
      
    </>
  );
};

export default PianoRoll;
