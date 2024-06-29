import { useEffect, useRef } from 'react';
import { SplendidGrandPiano } from 'smplr';
import { create } from 'zustand';

type MidiNote = {
  velocity: number;
}

interface MidiStore {
  activeNotes: (MidiNote|undefined)[];
  noteOn: (note:number, velocity: number) => void;
  noteOff: (note:number) => void;
}

export const useMidiStore = create<MidiStore>((set,get) =>({
  activeNotes: Array(128).fill(undefined),
  noteOn: (note, velocity) => {
    const {activeNotes} = get();
    activeNotes[note] = { velocity };
    set({ activeNotes });
  },
  noteOff: (note) => {
    const {activeNotes} = get();
    activeNotes[note] = undefined;
    set({ activeNotes });
  }
}))

export const useMidi = () => {
  const contextRef = useRef<AudioContext | null>(null);
  const pianoRef = useRef<SplendidGrandPiano | null>(null);
  const { noteOn, noteOff } = useMidiStore();

  useEffect(() => {
    if (!contextRef.current) {
      contextRef.current = new AudioContext();
    }

    if (!pianoRef.current) {
      pianoRef.current = new SplendidGrandPiano(contextRef.current);
    }

    const handleMidiMessage = (message: any) => {
      const [command, note, velocity] = message.data;
      if (command === 144 && velocity > 0) {
        // Note on
        pianoRef.current?.start({ note, velocity });
        noteOn(note, velocity);
      } else if (command === 128 || (command === 144 && velocity === 0)) {
        // Note off
        pianoRef.current?.stop(note);
        noteOff(note);
      }
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

