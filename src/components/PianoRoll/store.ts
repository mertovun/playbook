import {create} from 'zustand';

interface TimelineStore {
  isPlaying: boolean;
  currentTime: number;
  tempo: number;
  timeSignature: [number, number];
  setPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setTempo: (tempo: number) => void;
  setTimeSignature: (timeSignature: [number, number]) => void;
}

export const useTimelineStore = create<TimelineStore>((set) => ({
  isPlaying: false,
  currentTime: 0,
  tempo: 120,
  timeSignature: [4, 4],
  setPlaying: (playing: boolean) => set({ isPlaying: playing }),
  setCurrentTime: (time: number) => set({ currentTime: time }),
  setTempo: (tempo: number) => set({ tempo }),
  setTimeSignature: (timeSignature: [number, number]) => set({ timeSignature }),
}));
