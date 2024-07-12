import { useEffect, useRef } from 'react';
import { SplendidGrandPiano } from 'smplr';
import { useMidiStore } from '../stores/useMidiStore';
import { useTimelineGridStore } from '../stores/useTimelineGridStore';
import { useControlBarStore } from '../stores/useControlBarStore';

export const useMidi = () => {
  const contextRef = useRef<AudioContext | null>(null);
  const pianoRef = useRef<SplendidGrandPiano | null>(null);
  
  const { noteOn, noteOff, recordNote, undo, redo } = useMidiStore();
  const { currentTime, isRecording } = useTimelineGridStore();
  const { volume, isMuted } = useControlBarStore();

  const currentTimeRef = useRef<number>(0);
  const isRecordingRef = useRef<boolean>(false);

  useEffect(() => {
    currentTimeRef.current = currentTime;
    isRecordingRef.current = isRecording;
  }, [currentTime, isRecording]);

  useEffect(() => {
    if (pianoRef.current) {
      pianoRef.current.output.setVolume(isMuted ? 0 : Math.ceil(volume * 127));
    }
  });

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
      if (command === 144 && velocity > 0) {
        // Note on
        pianoRef.current?.start({ note, velocity });
        noteOn(note, velocity, currentTime);
      } else if (command === 128 || (command === 144 && velocity === 0)) {
        // Note off
        pianoRef.current?.stop(note);
        const recordedNote = noteOff(note, currentTime);
        if (isRecording) recordNote(recordedNote);
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
