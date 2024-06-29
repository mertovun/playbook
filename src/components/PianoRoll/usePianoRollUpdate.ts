import { useEffect } from 'react';
import { useTimelineGridStore } from './TimelineGrid/useTimelineGridStore';
import usePianoRollLayoutStore from './usePianoRollLayoutStore';
import { EOrientation } from './interface';

export const usePianoRollUpdate = () => {
  const { 
    orientation, 
  } = usePianoRollLayoutStore();

  const { 
    isPlaying, 
    windowStartTime,
    currentTime,
    setCurrentTime,
    setWindowStartTime,
  } = useTimelineGridStore();


  useEffect(() => {
    let animationFrameId: number;
    if (isPlaying) {
      const startClock = performance.now();

      const update = () => {
        const elapsed = (performance.now() - startClock) / 1000;
        const newCurrentTime = currentTime + elapsed;
        setCurrentTime(newCurrentTime);
        if (orientation === EOrientation.HORIZONTAL) setWindowStartTime(windowStartTime+elapsed);
        
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
};
