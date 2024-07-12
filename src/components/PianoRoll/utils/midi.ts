import { Midi } from '@tonejs/midi';
import { RecordedNotes, useMidiStore } from '../stores/useMidiStore';

export const dispatchNoteOnMessage = (midiNum: number, velocity: number) =>{
  const noteOnMessage = [0x90, midiNum, velocity]; // 0x90 is the Note On message
  window.dispatchEvent(new CustomEvent('midi', { detail: { data: noteOnMessage } }));
}

export const dispatchNoteOffMessage = (midiNum: number, velocity: number) =>{
  const noteOffMessage = [0x80, midiNum, velocity]; // 0x80 is the Note Off message
  window.dispatchEvent(new CustomEvent('midi', { detail: { data: noteOffMessage } }));
}

export const parseMidiFile = async (arrayBuffer: ArrayBuffer) => {
  const midi = new Midi(arrayBuffer);
  const { updateRecordedNotes, setTempo } = useMidiStore.getState();
  
  const newRecordedNotes: RecordedNotes = Array(128).fill(null).map(() => ({}));

  midi.tracks.forEach((track: any) =>
    track.notes.forEach((note: any) => {
      const midiNote = {
        note: note.midi,
        velocity: note.velocity * 127, 
        start: note.time,
        end: note.time + note.duration
      };
      newRecordedNotes[midiNote.note][midiNote.start] = midiNote;    
    }));

  setTempo(midi.header.tempos[0].bpm);
  updateRecordedNotes(newRecordedNotes);
};
