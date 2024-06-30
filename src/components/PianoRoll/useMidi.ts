import { useEffect, useRef } from 'react';
import { SplendidGrandPiano } from 'smplr';
import { create } from 'zustand';
import { useTimelineGridStore } from './TimelineGrid/useTimelineGridStore';

type MidiNote = {
  note: number;
  velocity: number;
  start: number;
  end?: number;
}

interface MidiStore {
  tempo: number;
  setTempo: (tempo: number) => void;
  activeNotes: (MidiNote|undefined)[];
  recordedNotes: MidiNote[];
  clearRecordedNotes: () => void;
  addRecordedNote: (note:MidiNote) => void;
  noteOn: (note:number, velocity: number, startTime: number) => void;
  noteOff: (note:number, endTime: number) => MidiNote;
}

export const useMidiStore = create<MidiStore>((set,get) =>({
  tempo: 120,
  setTempo: (tempo) => set({tempo}),
  activeNotes: Array(128).fill(undefined),
  recordedNotes: [],
  clearRecordedNotes: () => set({ recordedNotes:[]}),
  addRecordedNote: (note:MidiNote) => {
    const { recordedNotes } = get();
    recordedNotes.push(note);
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

export const useMidi = () => {
  const contextRef = useRef<AudioContext | null>(null);
  const pianoRef = useRef<SplendidGrandPiano | null>(null);
  
  const { noteOn, noteOff, addRecordedNote, recordedNotes } = useMidiStore();
  const { currentTime, isRecording } = useTimelineGridStore();

  const currentTimeRef = useRef<number>(0);
  const isRecordingRef = useRef<boolean>(false);
  const recordedNotesRef = useRef<MidiNote[]>([]);

  useEffect(() => {
    currentTimeRef.current = currentTime;
    isRecordingRef.current = isRecording;
    recordedNotesRef.current = recordedNotes;
  }, [currentTime, isRecording, recordedNotes]);

  useEffect(() => {
    if (!contextRef.current) {
      contextRef.current = new AudioContext();
    }

    if (!pianoRef.current) {
      pianoRef.current = new SplendidGrandPiano(contextRef.current);
    }

    const handleMidiMessage = (message: any) => {
      const [command, note, velocity] = message.data;
      const currentTime = currentTimeRef.current;
      const isRecording = isRecordingRef.current;
      const recordedNotes = recordedNotesRef.current;
      if (command === 144 && velocity > 0) {
        // Note on
        pianoRef.current?.start({ note, velocity });
        noteOn(note, velocity, currentTime);
      } else if (command === 128 || (command === 144 && velocity === 0)) {
        // Note off
        pianoRef.current?.stop(note);
        const recordedNote = noteOff(note, currentTime);
        if (isRecording) addRecordedNote(recordedNote);
        
      }
      // console.log(recordedNotes)
    };

    const handleCustomMidiEvent = (event: any) => {
      handleMidiMessage(event.detail);
    };

    const requestMIDIAccess = async () => {
      try {
        const midiAccess = await navigator.requestMIDIAccess();
        const inputs = midiAccess.inputs.values();
        for (let input of inputs) {
          input.onmidimessage = handleMidiMessage;
        }

        return () => {
          for (let input of inputs) {
            input.onmidimessage = null;
          }
        };
      } catch (error) {
        console.error('Failed to get MIDI access', error);
        return () => {};
      }
    };

    let cleanupMidiAccess: () => void = () => {};

    requestMIDIAccess().then((cleanup) => {
      cleanupMidiAccess = cleanup;
    });

    window.addEventListener('midi', handleCustomMidiEvent);

    return () => {
      cleanupMidiAccess();
      window.removeEventListener('midi', handleCustomMidiEvent);
    };
  }, []);

  return null;
};

