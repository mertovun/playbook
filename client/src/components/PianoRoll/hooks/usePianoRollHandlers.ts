import { useCallback, useEffect, useRef } from 'react';
import { MAX_ZOOM_IN, MAX_ZOOM_OUT, useTimelineGridStore } from '../stores/useTimelineGridStore';
import { usePianoRollLayoutStore } from '../stores/usePianoRollLayoutStore';
import { EOrientation } from '../interface';
import { useControlBarStore } from '../stores/useControlBarStore';
import { parseMidiFile } from '../utils/midi';

export const usePianoRollHandlers = () => {
  const { 
    orientation, 
    setOrientation 
  } = usePianoRollLayoutStore();

  const { autoSlide, setAutoSlide } = useControlBarStore();

  const { 
    pixelsPerSecond,
    windowStartTime,
    setWindowStartTime,
    setPixelsPerSecond,
  } = useTimelineGridStore();


  const timelineSvgRef = useRef(null);

  const toggleOrientation = useCallback(() => {
    setOrientation(orientation === EOrientation.HORIZONTAL ? EOrientation.VERTICAL : EOrientation.HORIZONTAL);
  }, [orientation, setOrientation]);

  const toggleAutoSlide = useCallback(() => {
    setAutoSlide(!autoSlide);
  }, [autoSlide, setAutoSlide]);

  const handleDrop = useCallback(async (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'audio/midi') {
      const arrayBuffer = await file.arrayBuffer();
      parseMidiFile(arrayBuffer); // Call the MIDI parser function
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

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
      if (pixelsPerSecond<MAX_ZOOM_IN && pixelsPerSecond> MAX_ZOOM_OUT) setWindowStartTime(newWindowStartTime);
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
    toggleAutoSlide,
    handleDrop,
    handleDragOver,
  };
};
