import { useCallback, useEffect, useRef } from 'react';
import { MAX_ZOOM_IN, MAX_ZOOM_OUT, useTimelineGridStore } from './TimelineGrid/useTimelineGridStore';
import usePianoRollLayoutStore from './usePianoRollLayoutStore';
import { EOrientation } from './interface';
import { useMidiStore } from './useMidiStore';

export const usePianoRollHandlers = () => {
  const { 
    orientation, 
    setOrientation 
  } = usePianoRollLayoutStore();

  const { 
    isPlaying, 
    play,
    pause,
    pixelsPerSecond,
    windowStartTime,
    setCursorStartTime,
    setCurrentTime,
    setWindowStartTime,
    setPixelsPerSecond,
  } = useTimelineGridStore();

  const { tempo } = useMidiStore();

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
  }, [orientation, windowStartTime, tempo, setCursorStartTime, setCurrentTime]);

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
      if (pixelsPerSecond<MAX_ZOOM_IN && pixelsPerSecond> MAX_ZOOM_OUT)setWindowStartTime(newWindowStartTime);
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

  return {
    timelineSvgRef,
    toggleOrientation,
    togglePlayPause,
    handleTimelineClick
  };
};
