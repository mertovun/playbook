import React, { useCallback, useEffect, useRef, useMemo } from 'react';
import './TimelineNote.css';
import { ENote, EOrientation } from '../interface';
import { noteToMidiNum } from '../../../utils/note';
import { useMidiStore } from '../../../stores/useMidiStore';
import { useTimelineGridStore } from '../../../stores/useTimelineGridStore';
import usePianoRollLayoutStore from '../../../stores/usePianoRollLayoutStore';
import { dispatchNoteOffMessage, dispatchNoteOnMessage } from '../../../utils/midi';

export interface TimelineMidiNoteProps {
  note: ENote;
  level: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

const calculateNotePosition = (note: any, windowStartTime: number, pixelsPerSecond: number) => {
  const startPx = (note.start - windowStartTime) * pixelsPerSecond;
  const durationPx = (note.end! - note.start) * pixelsPerSecond;
  return { startPx, durationPx, key: note.start };
};

export const TimelineMidiNote: React.FC<TimelineMidiNoteProps> = React.memo(({ note, level, x, y, width, height }) => {
  const midiNum = noteToMidiNum([note, level]);

  const { recordedNotes, activeNotes } = useMidiStore();
  const { currentTime, isPlaying, isRecording, windowStartTime, pixelsPerSecond } = useTimelineGridStore();
  const { orientation, timelineHeight, timelineWidth } = usePianoRollLayoutStore();

  const noteDefaultColor = '#eb9';
  const noteDefaultStrokeColor = '#643';

  const currentTimeRef = useRef(currentTime);

  const recordedNotesAtNum = recordedNotes[midiNum];
  const activeNote = activeNotes[midiNum];

  useEffect(() => {
    const notes = Object.values(recordedNotesAtNum);
    if (isPlaying && !isRecording && notes.length) {
      for (let note of notes) {
        if (currentTimeRef.current <= note.start && currentTime >= note.start) {
          dispatchNoteOnMessage(midiNum, note.velocity);
        }
        if (currentTimeRef.current <= note.end! && currentTime >= note.end!) {
          dispatchNoteOffMessage(midiNum, note.velocity);
        }
      }
    }
    currentTimeRef.current = currentTime;
  }, [currentTime, midiNum, recordedNotesAtNum, isPlaying, isRecording]);

  const renderNotes = useCallback(() => {
    const notes = Object.values(recordedNotesAtNum).map(note => calculateNotePosition(note, windowStartTime, pixelsPerSecond));
    if (isRecording && activeNote) {
      notes.push(calculateNotePosition({ ...activeNote, end: currentTime }, windowStartTime, pixelsPerSecond));
    }

    return notes.filter(({ startPx, durationPx }) => {
      const noteEndPx = startPx + durationPx;
      return (startPx >= 0 && startPx < timelineWidth) || (noteEndPx >= 0 && noteEndPx < timelineWidth);
    }).map(({ startPx, durationPx, key }) => {
      const noteX = orientation === EOrientation.HORIZONTAL ? 0 : startPx;
      const noteY = orientation === EOrientation.HORIZONTAL ? timelineHeight - startPx - durationPx : 0;
      const noteWidth = orientation === EOrientation.HORIZONTAL ? width : durationPx;
      const noteHeight = orientation === EOrientation.HORIZONTAL ? durationPx : height;
      return (
        <rect
          key={key}
          x={noteX}
          y={noteY}
          width={noteWidth}
          height={noteHeight}
          fill={noteDefaultColor}
          stroke={noteDefaultStrokeColor}
          strokeWidth={1.2}
          rx={5}
          ry={5}
          style={{ pointerEvents: 'none' }}
        />
      );
    });
  }, [midiNum, recordedNotesAtNum, activeNote, currentTime, windowStartTime, pixelsPerSecond, isRecording, orientation, timelineWidth, timelineHeight, width, height]);

  return (
    <svg x={x} y={y}>
      {renderNotes()}
    </svg>
  );
});
