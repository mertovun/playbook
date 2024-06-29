import { useCallback, useEffect, useRef } from 'react';
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
    cursorStartTime,
    currentTime, 
    tempo, 
    timeSignature, 
    windowStartTime,
    pixelsPerSecond,
    setCursorStartTime,
    setCurrentTime,
    setWindowStartTime,
    setPixelsPerSecond,
  } = useTimelineStore();

  const timelineSvgRef = useRef(null);

  const toggleOrientation = useCallback(() => {
    setOrientation(orientation === EOrientation.HORIZONTAL ? EOrientation.VERTICAL : EOrientation.HORIZONTAL);
  }, [orientation, setOrientation]);

  const togglePlayPause =  useCallback(() => isPlaying ? pause() : play(), [isPlaying, pause, play]);

  const height = orientation === EOrientation.HORIZONTAL ? pianoRollLength : pianoRollWidth;
  const width = orientation === EOrientation.HORIZONTAL ? pianoRollWidth : pianoRollLength;
  const timelineHeight = orientation === EOrientation.HORIZONTAL ? timelineLength : pianoRollWidth;
  const timelineWidth = orientation === EOrientation.HORIZONTAL ? pianoRollWidth : timelineLength;

  const formattedMeasureBeatQuarter = formatMeasureBeatQuarter(...measureBeatQuarter(currentTime, tempo, timeSignature))

  const handleTimelineClick = useCallback((e:any ) => {
    const rect = e.target.getBoundingClientRect();
    const position = orientation === EOrientation.HORIZONTAL ? rect.bottom - e.clientY : e.clientX - rect.left;
    const newStartTime = position / pixelsPerSecond + windowStartTime;
    setCursorStartTime(newStartTime);
  }, [orientation, windowStartTime, timelineWidth, timelineLength, tempo, setCursorStartTime, setCurrentTime]);

  const handleTimelineScroll = useCallback((e: any) => {
    e.preventDefault();

    if (e.ctrlKey) {
      const delta = e.deltaY > 0 ? 1 : -1;
      const zoomFactor = 0.1;
      const newPixelsPerSecond = pixelsPerSecond * (1 - delta * zoomFactor);
      
      const rect = e.target.getBoundingClientRect();
      const mousePosition = orientation === EOrientation.HORIZONTAL ?  rect.bottom - e.clientY : e.clientX - rect.left;
      const timeAtMousePosition = (mousePosition / pixelsPerSecond) + windowStartTime;
      
      const newWindowStartTime = timeAtMousePosition - (mousePosition / newPixelsPerSecond);
  
      setPixelsPerSecond(newPixelsPerSecond);
      setWindowStartTime(newWindowStartTime);
    }
    else {
      const scrollAmount = e.deltaY / pixelsPerSecond * 0.3;
      const newWindowStartTime = windowStartTime - scrollAmount;
      setWindowStartTime(newWindowStartTime);
    }

  }, [orientation, pixelsPerSecond, windowStartTime, setPixelsPerSecond, setWindowStartTime]);

  useEffect(() => {
    const svgElement: any = timelineSvgRef.current;
    if (svgElement) {
      svgElement.addEventListener('wheel', handleTimelineScroll, { passive: false });
    }
    return () => {
      if (svgElement) {
        svgElement.removeEventListener('wheel', handleTimelineScroll);
      }
    };
  }, [handleTimelineScroll]);


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
      <button disabled={cursorStartTime===currentTime} onClick={stop}>
        {'Stop'}
      </button>
      {formattedMeasureBeatQuarter}
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
    </>
  );
};

export default PianoRoll;
