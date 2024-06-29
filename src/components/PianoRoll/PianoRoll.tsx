import { EOrientation } from './interface';
import { Keyboard } from './Keyboard/Keyboard';
import './PianoRoll.css';
import { TimelineGrid } from './TimelineGrid/TimelineGrid';
import { useTimelineGridStore } from './TimelineGrid/useTimelineGridStore';
import { TimelineBackground } from './TimelineBackground/TimelineBackground';
import { measureBeatQuarter, formatMeasureBeatQuarter } from '../../utils/time';
import usePianoRollLayoutStore from './usePianoRollLayoutStore';
import { usePianoRollHandlers } from './usePianoRollHandlers';
import { usePianoRollUpdate } from './usePianoRollUpdate';

export const PianoRoll = () => {
  const { 
    orientation, 
    pianoRollWidth, 
    pianoRollLength, 
    timelineLength, 
    timelineX, 
    timelineY, 
    mapRangeToKeyboardNotes, 
    mapRangeToTimelineNotes, 
    mapRangeToKeyboardOctaves 
  } = usePianoRollLayoutStore();

  const { 
    isPlaying,
    stop,
    cursorStartTime,
    currentTime, 
    tempo, 
    timeSignature
  } = useTimelineGridStore();

  const { 
    timelineSvgRef, 
    toggleOrientation, 
    togglePlayPause, 
    handleTimelineClick 
  } = usePianoRollHandlers();

  const update = usePianoRollUpdate();

  const height = orientation === EOrientation.HORIZONTAL ? pianoRollLength : pianoRollWidth;
  const width = orientation === EOrientation.HORIZONTAL ? pianoRollWidth : pianoRollLength;
  const timelineHeight = orientation === EOrientation.HORIZONTAL ? timelineLength : pianoRollWidth;
  const timelineWidth = orientation === EOrientation.HORIZONTAL ? pianoRollWidth : timelineLength;

  const formattedMeasureBeatQuarter = formatMeasureBeatQuarter(...measureBeatQuarter(currentTime, tempo, timeSignature));

  return (
    <>
      <div>
        <button onClick={toggleOrientation}>Toggle Orientation</button>
        <button onClick={togglePlayPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button disabled={cursorStartTime === currentTime} onClick={stop}>
          {'Stop'}
        </button>
        {formattedMeasureBeatQuarter}
      </div>
      <div>
        <svg className={`pianoroll-svg ${orientation}`} width={width} height={height}>
          <Keyboard mapRangeToKeyboardOctaves={mapRangeToKeyboardOctaves} mapRangeToKeyboardNotes={mapRangeToKeyboardNotes} />
          <svg
            x={timelineX}
            y={timelineY}
            width={timelineWidth}
            height={timelineHeight}
            onClick={handleTimelineClick}
            ref={timelineSvgRef}
          >
            <TimelineBackground mapRangeToTimelineOctaves={mapRangeToKeyboardOctaves} mapRangeToTimelineNotes={mapRangeToTimelineNotes} />
            <TimelineGrid timelineWidth={timelineWidth} timelineHeight={timelineHeight} />
          </svg>
        </svg>
      </div>
    </>
  );
};

export default PianoRoll;
