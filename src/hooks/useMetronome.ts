import { useEffect, useRef } from 'react';
import { DrumMachine } from 'smplr';
import { useMidiStore } from '../stores/useMidiStore';
import { useTimelineGridStore } from '../stores/useTimelineGridStore';
import { useControlBarStore } from '../stores/useControlBarStore';
import { timeToMeasureBeatTick } from '../utils/time';

export const useMetronome = () => {
  const contextRef = useRef<AudioContext | null>(null);
  const dmRef = useRef<DrumMachine | null>(null);

  const { metronome } = useControlBarStore();
  const { tempo, timeSignature } = useMidiStore();
  const { currentTime, isPlaying } = useTimelineGridStore();

  const currentTimeRef = useRef<number>(currentTime);

  useEffect(() => {
    if (!contextRef.current) {
      contextRef.current = new AudioContext();
    }

    if (!dmRef.current) {
      dmRef.current = new DrumMachine(contextRef.current);
    }

    if (isPlaying  && metronome) {
      const [_prevMeasure, prevBeat, _prevTick] = timeToMeasureBeatTick(currentTimeRef.current, tempo, timeSignature);
      const [_measure, beat, _tick] = timeToMeasureBeatTick(currentTime, tempo, timeSignature);

      if (prevBeat !== beat) {
        dmRef.current.start({ note: "clave" });
      }
    }
    currentTimeRef.current = currentTime;
  }, [currentTime, isPlaying, metronome, tempo, timeSignature]);

  return null;
};
