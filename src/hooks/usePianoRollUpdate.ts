import { useEffect } from 'react';
import { useTimelineGridStore } from '../stores/useTimelineGridStore';
import { useControlBarStore } from '../stores/useControlBarStore';
import usePianoRollLayoutStore from '../stores/usePianoRollLayoutStore';
import { EOrientation } from '../components/PianoRoll/interface';

export const usePianoRollUpdate = () => {
  const { orientation } = usePianoRollLayoutStore();
  const { autoSlide } = useControlBarStore();

  const { 
    isPlaying, 
    windowStartTime,
    currentTime,
    pixelsPerSecond,
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

        // slide logic
        if (autoSlide) {
          if (windowStartTime > currentTime) setWindowStartTime(currentTime-1);
          else setWindowStartTime(windowStartTime+elapsed);
        }
        else {
          const thresholdPx = orientation === EOrientation.HORIZONTAL ? 600 : 1000;
          const threshold = thresholdPx / pixelsPerSecond;
          if (windowStartTime > currentTime) setWindowStartTime(currentTime-1);
          if (windowStartTime + threshold < currentTime) setWindowStartTime(currentTime-1);
        }
        
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
