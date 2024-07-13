import { useEffect } from 'react';
import { useTimelineGridStore } from '../stores/useTimelineGridStore';
import { useControlBarStore } from '../stores/useControlBarStore';
import { usePianoRollLayoutStore } from '../stores/usePianoRollLayoutStore';
import { EOrientation } from '../interface';

export const usePianoRollUpdate = () => {
  const { orientation } = usePianoRollLayoutStore();
  const { autoSlide, setAutoSlide } = useControlBarStore();

  const { 
    isPlaying, 
    windowStartTime,
    currentTime,
    pixelsPerSecond,
    incrementCurrentTime,
    incrementWindowStartTime,
    setWindowStartTime
  } = useTimelineGridStore();

  useEffect(() =>{
      if (autoSlide) {
        if (windowStartTime > currentTime) setWindowStartTime(currentTime);
      } else {
        const thresholdPx = orientation === EOrientation.HORIZONTAL ? 600 : 1100;
        const threshold = thresholdPx / pixelsPerSecond;
        if (windowStartTime > currentTime || windowStartTime + threshold < currentTime) {
          setWindowStartTime(currentTime);
          // setAutoSlide(true);
        }
      }
  }, [windowStartTime,currentTime,setWindowStartTime, autoSlide])

  useEffect(() => {
    let animationFrameId: number;
    let prevNow = performance.now();

    const update = () => {
      const now = performance.now();
      const elapsed = (now - prevNow) / 1000;
      incrementCurrentTime(elapsed);

      if (autoSlide) {
        incrementWindowStartTime(elapsed);
      } 
      
      prevNow = now;
      animationFrameId = requestAnimationFrame(update);
    };

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(update);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPlaying, autoSlide, orientation, pixelsPerSecond, setAutoSlide, incrementCurrentTime, incrementWindowStartTime, setWindowStartTime]);

};
