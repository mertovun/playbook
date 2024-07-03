import { create } from 'zustand';
import { TimeSignature } from './interface';

type MidiNote = {
  note: number;
  velocity: number;
  start: number;
  end?: number;
}

type RecordedNotes = {[key: number]:MidiNote}[];

interface MidiStore {
  tempo: number;
  setTempo: (newTempo: number) => void;
  timeSignature: TimeSignature;
  setTimeSignature: (timeSignature: TimeSignature) => void;
  activeNotes: (MidiNote|undefined)[];
  recordedNotes: RecordedNotes;
  clearRecordedNotes: () => void;
  addRecordedNote: (note:MidiNote) => void;
  noteOn: (note:number, velocity: number, startTime: number) => void;
  noteOff: (note:number, endTime: number) => MidiNote;
}

export const useMidiStore = create<MidiStore>((set,get) =>({
  tempo: 120,
  setTempo: (newTempo) => {
    const { tempo, recordedNotes } = get();
    const newRecordedNotes: RecordedNotes = Array(128).fill(null).map(()=>({}));
    const change = tempo / newTempo;
    for (let i = 0; i<128; i++) {
      for (let note of Object.values(recordedNotes[i])) {
        const newStart = change * note.start;
        const newEnd = change * note.end!;
        newRecordedNotes[i][newStart] = {
          note: note.note,
          velocity: note.velocity,
          start: newStart,
          end: newEnd
        }
      }
    }
    set({ tempo: newTempo, recordedNotes: newRecordedNotes })
  },
  timeSignature: [4, 4],
  setTimeSignature: (timeSignature) => set({ timeSignature }),
  activeNotes: Array(128).fill(undefined),
  recordedNotes: Array(128).fill(null).map(()=>({})),
  clearRecordedNotes: () => set({ recordedNotes:Array(128).fill(null).map(()=>({}))}),
  addRecordedNote: (note:MidiNote) => {
    const { recordedNotes } = get();
    recordedNotes[note.note][note.start] = note;
    set({recordedNotes});
  },
  noteOn: (note, velocity,startTime) => {
    const {activeNotes} = get();
    activeNotes[note] = { note, velocity, start: startTime };
    set({ activeNotes });
  },
  noteOff: (note, endTime) => {
    const {activeNotes } = get();
    const recordedNote:  MidiNote = {...(activeNotes[note] as MidiNote), end: endTime };
    activeNotes[note] = undefined;
    set({ activeNotes });
    return recordedNote;
  }
}))
