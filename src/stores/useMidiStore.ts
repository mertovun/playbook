import { create } from 'zustand';
import { TimeSignature } from '../components/PianoRoll/interface';
import { useTimelineGridStore } from './useTimelineGridStore';

export type MidiNote = {
  note: number;
  velocity: number;
  start: number;
  end?: number;
  selected?: boolean;
}

export type RecordedNotes = { [key: number]: MidiNote }[];

interface MidiStore {
  tempo: number;
  setTempo: (newTempo: number) => void;
  timeSignature: TimeSignature;
  setTimeSignature: (timeSignature: TimeSignature) => void;
  activeNotes: (MidiNote | undefined)[];
  recordedNotes: RecordedNotes;
  clearRecordedNotes: () => void;
  recordNote: (note: MidiNote) => void;
  noteOn: (note: number, velocity: number, startTime: number) => void;
  noteOff: (note: number, endTime: number) => MidiNote;
  pastRecordedStates: { tempo: number; recordedNotes: RecordedNotes }[];
  futureRecordedStates: { tempo: number; recordedNotes: RecordedNotes }[];
  undo: () => void;
  redo: () => void;
  updateRecordedNotes: (newRecordedNotes: RecordedNotes) => void;
  selectNote: (midiNum: number, key: number) => void;
  deselectAll: () => void;
  countSelected: () => void;
  deleteSelected: () => void;
  clipboardNotes: RecordedNotes;
  copySelectedToClipboard: () => void;
}

export const useMidiStore = create<MidiStore>((set, get) => ({
  tempo: 120,
  setTempo: (newTempo) => {
    const { currentTime, setCurrentTime, cursorStartTime, setCursorStartTime, updateRecordedNotes } = useTimelineGridStore.getState();
    const { tempo, recordedNotes } = get();
    const newRecordedNotes: RecordedNotes = Array(128).fill(null).map(() => ({}));
    const change = tempo / newTempo;
    for (let i = 0; i < 128; i++) {
      for (let note of Object.values(recordedNotes[i])) {
        const newStart = change * note.start;
        const newEnd = change * note.end!;
        newRecordedNotes[i][newStart] = {
          note: note.note,
          velocity: note.velocity,
          start: newStart,
          end: newEnd,
          selected: note.selected,
        };
      }
    }
    setCurrentTime(change * currentTime);
    setCursorStartTime(change * cursorStartTime);
    set({ tempo: newTempo });
    updateRecordedNotes(newRecordedNotes);
  },
  timeSignature: [4, 4],
  setTimeSignature: (timeSignature) => set({ timeSignature }),
  activeNotes: Array(128).fill(undefined),
  recordedNotes: Array(128).fill(null).map(() => ({})),
  pastRecordedNotes: [],
  futureRecordedNotes: [],
  clearRecordedNotes: () => set({ recordedNotes: Array(128).fill(null).map(() => ({})) }),
  recordNote: (note: MidiNote) => {
    const { recordedNotes } = get();
    recordedNotes[note.note][note.start] = note;
    set({ recordedNotes });
  },
  noteOn: (note, velocity, startTime) => {
    const { activeNotes } = get();
    activeNotes[note] = { note, velocity, start: startTime };
    set({ activeNotes });
  },
  noteOff: (note, endTime) => {
    const { activeNotes } = get();
    const recordedNote: MidiNote = { ...(activeNotes[note] as MidiNote), end: endTime, selected: false };
    activeNotes[note] = undefined;
    set({ activeNotes });
    return recordedNote;
  },
  undo: () => {
    const { pastRecordedNotes, recordedNotes, futureRecordedNotes } = get();
    if (pastRecordedNotes.length === 0) return;
    const previousRecordedNotes = pastRecordedNotes[pastRecordedNotes.length - 1];
    set({
      recordedNotes: previousRecordedNotes,
      pastRecordedNotes: pastRecordedNotes.slice(0, pastRecordedNotes.length - 1),
      futureRecordedNotes: [JSON.parse(JSON.stringify(recordedNotes)), ...futureRecordedNotes],
    });
  },
  redo: () => {
    const { pastRecordedNotes, recordedNotes, futureRecordedNotes } = get();
    if (futureRecordedNotes.length === 0) return;
    const nextRecordedNotes = futureRecordedNotes[0];
    set({
      recordedNotes: nextRecordedNotes,
      pastRecordedNotes: [...pastRecordedNotes, JSON.parse(JSON.stringify(recordedNotes))],
      futureRecordedNotes: futureRecordedNotes.slice(1),
    });
  },
  updateRecordedNotes: (newRecordedNotes) => {
    const { recordedNotes, tempo, pastRecordedStates } = get();
    set({ 
      recordedNotes: newRecordedNotes, 
      pastRecordedStates: [...pastRecordedStates, { tempo, recordedNotes }], 
      futureRecordedStates: [] 
    });
  },
  selectNote: (midiNum, key) => {
    const { recordedNotes } = get();
    if (recordedNotes[midiNum] && recordedNotes[midiNum][key]) {
      recordedNotes[midiNum][key].selected = !recordedNotes[midiNum][key].selected;
      set({ recordedNotes });
    }
  },
  deselectAll: () => {
    const { recordedNotes } = get();
    for (let i = 0; i < 128; i++) {
      for (let note of Object.values(recordedNotes[i])) {
        note.selected = false;
      }
    }
    set({ recordedNotes });
  },
  countSelected: () => {
    const { recordedNotes } = get();
    let count = 0;
    for (let i = 0; i < 128; i++) {
      for (let note of Object.values(recordedNotes[i])) {
        if (note.selected) {
          count++;
        }
      }
    }
    return count;
  },
  deleteSelected: () => {
    const { recordedNotes } = get();
    const newRecordedNotes: RecordedNotes = Array(128).fill(null).map(() => ({}));
    for (let i = 0; i < 128; i++) {
      for (let [key, note] of Object.entries(recordedNotes[i])) {
        if (!note.selected) {
          // @ts-ignore
          newRecordedNotes[i][key] = note;
        }
      }
    }
    set({ recordedNotes: newRecordedNotes });
  },
  clipboardNotes: [],
  copySelectedToClipboard: () => {
    const { recordedNotes } = get();
    let clipboardNotes: RecordedNotes = Array(128).fill(null).map(() => ({}));
    let minStart = Infinity;
    for (let i = 0; i < 128; i++) {
      for (let note of Object.values(recordedNotes[i])) {
        if (note.selected) {
          minStart = Math.min(minStart, note.start);
        }
      }
    }
    for (let i = 0; i < 128; i++) {
      for (let note of Object.values(recordedNotes[i])) {
        if (note.selected) {
          clipboardNotes[i][note.start - minStart] = {
            ...note,
            start: note.start - minStart,
            end: note.end! - minStart,
          };
        }
      }
    }
    set({ clipboardNotes });
  },
}));
