import { useCallback } from 'react';
import { useTimelineGridStore } from '../stores/useTimelineGridStore';
import usePianoRollLayoutStore from '../stores/usePianoRollLayoutStore';
import { useMidiStore } from '../stores/useMidiStore';
import { EOrientation } from '../components/PianoRoll/interface';
import { measureBeatTickToTime, timeToMeasureBeatTick } from '../utils/time';

export const useTimelineClick = () => {
  const { 
    orientation, 
  } = usePianoRollLayoutStore();

  const { 
    pixelsPerSecond,
    windowStartTime,
    setCursorStartTime,
    setCurrentTime,
    gridTick
  } = useTimelineGridStore();

  const { tempo, timeSignature } = useMidiStore();

  const handleTimelineClick = useCallback((e:any ) => {
    const rect = e.target.getBoundingClientRect();
    const position = orientation === EOrientation.HORIZONTAL ? rect.bottom - e.clientY : e.clientX - rect.left;
    const newStartTime = position / pixelsPerSecond + windowStartTime;
    let [measure, beat, tick] = timeToMeasureBeatTick(newStartTime, tempo, timeSignature, gridTick);
    tick = Math.floor(tick);
    const snapStartTime = measureBeatTickToTime(measure, beat, tick, tempo, timeSignature, gridTick);
    setCursorStartTime(snapStartTime);
    setCurrentTime(snapStartTime);
  }, [orientation, windowStartTime, tempo, setCursorStartTime, setCurrentTime, gridTick]);

  return {
    handleTimelineClick,
  };
};
