import { EOrientation } from './interface';
import { Keyboard } from './Keyboard/Keyboard';
import './PianoRoll.css';
import { TimelineGrid } from './TimelineGrid/TimelineGrid';
import { TimelineBackground } from './Timeline/TimelineBackground';
import usePianoRollLayoutStore from '../../stores/usePianoRollLayoutStore';
import { usePianoRollHandlers } from '../../hooks/usePianoRollHandlers';
import { usePianoRollUpdate } from '../../hooks/usePianoRollUpdate';
import { useMidi } from '../../hooks/useMidi';
import { ControlBar } from './ControlBar/ControlBar'; // import the new ControlBar component

export const PianoRoll = () => {
  const { 
    orientation, 
    pianoRollWidth, 
    pianoRollLength, 
    timelineX, 
    timelineY,
    timelineHeight,
    timelineWidth
  } = usePianoRollLayoutStore();

  const { 
    timelineSvgRef, 
    handleTimelineClick 
  } = usePianoRollHandlers();

  usePianoRollUpdate();
  useMidi();

  const height = orientation === EOrientation.HORIZONTAL ? pianoRollLength : pianoRollWidth;
  const width = orientation === EOrientation.HORIZONTAL ? pianoRollWidth : pianoRollLength;

  return (
    <>
      <ControlBar />
      <div>
        <svg className={`pianoroll-svg ${orientation}`} width={width} height={height}>
          <Keyboard />
          <svg
            x={timelineX}
            y={timelineY}
            width={timelineWidth}
            height={timelineHeight}
            onClick={handleTimelineClick}
            ref={timelineSvgRef}
          >
            <TimelineBackground />
            <TimelineGrid timelineWidth={timelineWidth} timelineHeight={timelineHeight} />
          </svg>
        </svg>
      </div>
    </>
  );
};

export default PianoRoll;
