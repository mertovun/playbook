import { create } from 'zustand';
import { TimeSignature } from './interface';

type MidiNote = {
  note: number;
  velocity: number;
  start: number;
  end?: number;
}

type RecordedNotes = { [key: number]: MidiNote }[];

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
  pastRecordedNotes: RecordedNotes[];
  futureRecordedNotes: RecordedNotes[];
  undo: () => void;
  redo: () => void;
  changeRecordedNotes: (newRecordedNotes: RecordedNotes) => void;
}

export const useMidiStore = create<MidiStore>((set, get) => ({
  tempo: 120,
  setTempo: (newTempo) => {
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
          end: newEnd
        };
      }
    }
    set({ tempo: newTempo, recordedNotes: newRecordedNotes });
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
    const recordedNote: MidiNote = { ...(activeNotes[note] as MidiNote), end: endTime };
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
  changeRecordedNotes: (newRecordedNotes) => {
    const { recordedNotes, pastRecordedNotes } = get();
    set({ 
      recordedNotes: newRecordedNotes, 
      pastRecordedNotes: [...pastRecordedNotes, JSON.parse(JSON.stringify(recordedNotes))], 
      futureRecordedNotes: [] 
    });
  },
}));
