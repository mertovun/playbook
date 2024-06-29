// usePianoRollHandlers.ts
import { useCallback, useEffect, useRef } from 'react';
import { useTimelineGridStore } from './TimelineGrid/useTimelineGridStore';
import usePianoRollLayoutStore from './usePianoRollLayoutStore';
import { EOrientation } from './interface';

export const usePianoRollHandlers = () => {
  const { 
    orientation, 
    timelineLength,
    setOrientation 
  } = usePianoRollLayoutStore();

  const { 
    isPlaying, 
    play,
    pause,
    pixelsPerSecond,
    windowStartTime,
    currentTime,
    tempo,
    setCursorStartTime,
    setCurrentTime,
    setWindowStartTime,
    setPixelsPerSecond,
  } = useTimelineGridStore();

  const timelineSvgRef = useRef(null);

  const toggleOrientation = useCallback(() => {
    setOrientation(orientation === EOrientation.HORIZONTAL ? EOrientation.VERTICAL : EOrientation.HORIZONTAL);
  }, [orientation, setOrientation]);

  const togglePlayPause =  useCallback(() => isPlaying ? pause() : play(), [isPlaying, pause, play]);

  const handleTimelineClick = useCallback((e:any ) => {
    const rect = e.target.getBoundingClientRect();
    const position = orientation === EOrientation.HORIZONTAL ? rect.bottom - e.clientY : e.clientX - rect.left;
    const newStartTime = position / pixelsPerSecond + windowStartTime;
    setCursorStartTime(newStartTime);
  }, [orientation, windowStartTime, timelineLength, tempo, setCursorStartTime, setCurrentTime]);

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
    } else {
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

  return {
    timelineSvgRef,
    toggleOrientation,
    togglePlayPause,
    handleTimelineClick
  };
};
