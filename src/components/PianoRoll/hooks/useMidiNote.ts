import { useCallback } from 'react';
import { useTimelineGridStore } from '../stores/useTimelineGridStore';
import { usePianoRollLayoutStore } from '../stores/usePianoRollLayoutStore';
import { MidiNote, useMidiStore } from '../stores/useMidiStore';

const calculateNotePosition = (note: MidiNote, windowStartTime: number, pixelsPerSecond: number) => {
  const startPx = (note.start - windowStartTime) * pixelsPerSecond;
  const durationPx = (note.end! - note.start) * pixelsPerSecond;
  return { startPx, durationPx, key: note.start, selected: note.selected || false };
};

export const useMidiNote = (midiNum: number) => {
  const { recordedNotes, activeNotes } = useMidiStore();
  const { currentTime, isRecording, windowStartTime, pixelsPerSecond } = useTimelineGridStore();
  const { orientation, timelineHeight, timelineWidth } = usePianoRollLayoutStore();

  const recordedNotesAtNum = recordedNotes[midiNum];
  const activeNote = activeNotes[midiNum];

  const notes = useCallback(() => {
    const notes = Object.values(recordedNotesAtNum).map(note => calculateNotePosition(note, windowStartTime, pixelsPerSecond));
    if (isRecording && activeNote) {
      notes.push(calculateNotePosition({ ...activeNote, end: currentTime }, windowStartTime, pixelsPerSecond));
    }

    return notes.filter(({ startPx, durationPx }) => {
      const noteEndPx = startPx + durationPx;
      return (startPx >= 0 && startPx < timelineWidth) || (noteEndPx >= 0 && noteEndPx < timelineWidth);
    })
  }, [midiNum, recordedNotesAtNum, activeNote, currentTime, windowStartTime, pixelsPerSecond, isRecording, orientation, timelineWidth, timelineHeight]);


  return notes;
};
