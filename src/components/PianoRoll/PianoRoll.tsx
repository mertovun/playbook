import { useCallback, useEffect } from 'react';
import { EOrientation } from './interface';
import { Keyboard } from './Keyboard/Keyboard';
import './PianoRoll.css';
import { TimelineGrid } from './TimelineGrid/TimelineGrid';
import { useTimelineStore } from './useTimelineStore';
import { TimelineBackground } from './TimelineBackground/TimelineBackground';
import { measureBeatQuarter, formatMeasureBeatQuarter } from '../../utils/time';
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
    play,
    pause,
    stop,
    startTime,
    currentTime, 
    tempo, 
    timeSignature, 
    setCurrentTime 
  } = useTimelineStore();

  const toggleOrientation = useCallback(() => {
    setOrientation(orientation === EOrientation.HORIZONTAL ? EOrientation.VERTICAL : EOrientation.HORIZONTAL);
  }, [orientation, setOrientation]);

  const togglePlayPause =  useCallback(() => isPlaying ? pause() : play(), [isPlaying, pause, play]);

  const height = orientation === EOrientation.HORIZONTAL ? pianoRollLength : pianoRollWidth;
  const width = orientation === EOrientation.HORIZONTAL ? pianoRollWidth : pianoRollLength;
  const timelineHeight = orientation === EOrientation.HORIZONTAL ? timelineLength : pianoRollWidth;
  const timelineWidth = orientation === EOrientation.HORIZONTAL ? pianoRollWidth : timelineLength;

  const formattedMeasureBeatQuarter = formatMeasureBeatQuarter(...measureBeatQuarter(currentTime, tempo, timeSignature))

  useEffect(() => {
    let animationFrameId: number;
    if (isPlaying) {
      const startClock = performance.now();

      const update = () => {
        const elapsed = (performance.now() - startClock) / 1000;
        setCurrentTime(currentTime + elapsed);
        animationFrameId = requestAnimationFrame(update);
      };
      animationFrameId = requestAnimationFrame(update);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPlaying, setCurrentTime, currentTime]);

  return (
    <>
      <button onClick={toggleOrientation}>Toggle Orientation</button>
      <button onClick={togglePlayPause}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <button disabled={startTime===currentTime} onClick={stop}>
        {'Stop'}
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
