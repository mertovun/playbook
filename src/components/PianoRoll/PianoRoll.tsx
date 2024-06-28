import React, { useEffect, useRef } from 'react';
import { ENote, EOctave, EOrientation, KeyboardRange } from './interface';
import { Keyboard } from './Keyboard/Keyboard';
import { usePianoRollLayout } from './usePianoRollLayout';
import './PianoRoll.css';
import { TimelineGrid } from './TimelineGrid/TimelineGrid';
import { useTimelineStore } from './store';
import { TimelineBackground } from './TimelineBackground/TimelineBackground';

export const PianoRoll = () => {
  const keyboardRange: KeyboardRange = [[ENote.A, EOctave._0], [ENote.C, EOctave._8]];
  const { orientation, pianoRollWidth, pianoRollLength, timelineLength, timelineX, timelineY, setOrientation, mapRangeToKeyboardNotes, mapRangeToTimelineNotes, mapRangeToKeyboardOctaves } = usePianoRollLayout(keyboardRange);
  const { isPlaying, currentTime, setCurrentTime } = useTimelineStore();

  const toggleOrientation = () => {
    setOrientation(orientation === EOrientation.HORIZONTAL ? EOrientation.VERTICAL : EOrientation.HORIZONTAL);
  };

  const height = orientation === EOrientation.HORIZONTAL ? pianoRollLength : pianoRollWidth;
  const width = orientation === EOrientation.HORIZONTAL ? pianoRollWidth : pianoRollLength;
  const timelineHeight = orientation === EOrientation.HORIZONTAL ? timelineLength : pianoRollWidth;
  const timelineWidth = orientation === EOrientation.HORIZONTAL ? pianoRollWidth : timelineLength;

  useEffect(() => {
    let animationFrameId: number;
    if (isPlaying) {
      const startTime = performance.now();

      const update = () => {
        const elapsed = (performance.now() - startTime) / 1000;
        setCurrentTime(elapsed);
        animationFrameId = requestAnimationFrame(update);
      };

      animationFrameId = requestAnimationFrame(update);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPlaying, setCurrentTime]);

  return (
    <>
      <button onClick={toggleOrientation}>Toggle Orientation</button>
      <button onClick={() => useTimelineStore.setState({ isPlaying: !isPlaying })}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <svg className={`pianoroll-svg ${orientation}`} width={width} height={height}>
        <Keyboard mapRangeToKeyboardOctaves={mapRangeToKeyboardOctaves} mapRangeToKeyboardNotes={mapRangeToKeyboardNotes} />
        <svg x={timelineX} y={timelineY} width={timelineWidth} height={timelineHeight}>
          <TimelineBackground mapRangeToTimelineOctaves={mapRangeToKeyboardOctaves} mapRangeToTimelineNotes={mapRangeToTimelineNotes} />
          <TimelineGrid timelineWidth={timelineWidth} timelineHeight={timelineHeight} />
        </svg>
      </svg>
    </>
  );
};

export default PianoRoll;
