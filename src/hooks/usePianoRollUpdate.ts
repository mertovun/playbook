import { useState, useEffect } from 'react';
import { useTimelineGridStore } from '../stores/useTimelineGridStore';
import { useControlBarStore } from '../stores/useControlBarStore';
import usePianoRollLayoutStore from '../stores/usePianoRollLayoutStore';
import { EOrientation } from '../components/PianoRoll/interface';

const useDebouncedEffect = (effect: () => void, delay: number, deps: any[]) => {
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const id = setTimeout(effect, delay);
    setTimeoutId(id);
    return () => clearTimeout(id);
  }, [...deps, delay]);
};

export const usePianoRollUpdate = () => {
  const { orientation } = usePianoRollLayoutStore();
  const { autoSlide, setAutoSlide } = useControlBarStore();

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
    let startClock = performance.now();

    const update = () => {
      const elapsed = (performance.now() - startClock) / 1000;
      const newCurrentTime = currentTime + elapsed;
      setCurrentTime(newCurrentTime);

      // slide logic
      if (autoSlide) {
        if (windowStartTime > currentTime) setWindowStartTime(currentTime - 1);
        else setWindowStartTime(windowStartTime + elapsed);
      } else {
        const thresholdPx = orientation === EOrientation.HORIZONTAL ? 600 : 1100;
        const threshold = thresholdPx / pixelsPerSecond;
        if (windowStartTime > currentTime || windowStartTime + threshold < currentTime) {
          setWindowStartTime(currentTime);
          setAutoSlide(true);
        }
      }
      
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
  }, [isPlaying, autoSlide, orientation, windowStartTime, pixelsPerSecond, setAutoSlide, currentTime, setCurrentTime, setWindowStartTime]);

  useDebouncedEffect(() => {
    if (isPlaying) {
      setCurrentTime(currentTime);
    }
  }, 40, [currentTime, isPlaying, setCurrentTime]);
};
