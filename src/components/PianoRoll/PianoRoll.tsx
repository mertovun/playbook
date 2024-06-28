import { useEffect } from 'react';
import { EOrientation, KeyboardRange } from './interface';
import { Keyboard } from './Keyboard/Keyboard';
import './PianoRoll.css';
import { TimelineGrid } from './TimelineGrid/TimelineGrid';
import { useTimelineStore } from './store';
import { TimelineBackground } from './TimelineBackground/TimelineBackground';
import { currentMeasureBeatQuarter, formatMeasureBeatQuarter } from '../../utils/time';
import usePianoRollLayoutStore from './usePianoRollLayoutStore';

export const PianoRoll = () => {
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
    mapRangeToKeyboardOctaves 
  } = usePianoRollLayoutStore();
  
  const { 
    isPlaying, 
    currentTime, 
    tempo, 
    timeSignature, 
    setCurrentTime 
  } = useTimelineStore();

  const toggleOrientation = () => {
    setOrientation(orientation === EOrientation.HORIZONTAL ? EOrientation.VERTICAL : EOrientation.HORIZONTAL);
  };

  const height = orientation === EOrientation.HORIZONTAL ? pianoRollLength : pianoRollWidth;
  const width = orientation === EOrientation.HORIZONTAL ? pianoRollWidth : pianoRollLength;
  const timelineHeight = orientation === EOrientation.HORIZONTAL ? timelineLength : pianoRollWidth;
  const timelineWidth = orientation === EOrientation.HORIZONTAL ? pianoRollWidth : timelineLength;

  const formattedMeasureBeatQuarter = formatMeasureBeatQuarter(...currentMeasureBeatQuarter(currentTime, tempo, timeSignature))

  useEffect(() => {
    let animationFrameId: number;
    if (isPlaying) {
      const startTime = performance.now();

      const update = () => {
        const elapsed = (performance.now() - startTime) / 1000;
        setCurrentTime(elapsed);
        animationFrameId = requestAnimationFrame(update);
      };

      animationFrameId = requestAnimationFrame(update);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPlaying, setCurrentTime]);

  return (
    <>
      <button onClick={toggleOrientation}>Toggle Orientation</button>
      <button onClick={() => useTimelineStore.setState({ isPlaying: !isPlaying })}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      {formattedMeasureBeatQuarter}
      <svg className={`pianoroll-svg ${orientation}`} width={width} height={height}>
        <Keyboard mapRangeToKeyboardOctaves={mapRangeToKeyboardOctaves} mapRangeToKeyboardNotes={mapRangeToKeyboardNotes} />
        <svg x={timelineX} y={timelineY} width={timelineWidth} height={timelineHeight}>
          <TimelineBackground mapRangeToTimelineOctaves={mapRangeToKeyboardOctaves} mapRangeToTimelineNotes={mapRangeToTimelineNotes} />
          <TimelineGrid timelineWidth={timelineWidth} timelineHeight={timelineHeight} />
        </svg>
      </svg>
    </>
  );
};

export default PianoRoll;
