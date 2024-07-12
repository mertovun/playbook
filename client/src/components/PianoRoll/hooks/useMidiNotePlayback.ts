import { useEffect, useRef } from 'react';
import { dispatchNoteOffMessage, dispatchNoteOnMessage } from '../utils/midi';
import { useMidiStore } from '../stores/useMidiStore';
import { useTimelineGridStore } from '../stores/useTimelineGridStore';

export const useMidiNotePlayback = (midiNum: number) => {
  const { recordedNotes, activeNotes } = useMidiStore();
  const { currentTime, isPlaying, isRecording } = useTimelineGridStore();

  const currentTimeRef = useRef(currentTime);
  const recordedNotesAtNum = recordedNotes[midiNum];

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

  return { recordedNotesAtNum, activeNote: activeNotes[midiNum] };
};
