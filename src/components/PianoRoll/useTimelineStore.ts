import {create} from 'zustand';

interface TimelineStore {
  isPlaying: boolean;
  startTime: number;
  currentTime: number;
  tempo: number;
  timeSignature: [number, number];
  setPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setStartTime: (time: number) => void;
  setTempo: (tempo: number) => void;
  setTimeSignature: (timeSignature: [number, number]) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
}

export const useTimelineStore = create<TimelineStore>((set, get) => ({
  isPlaying: false,
  startTime: 0,
  currentTime: 0,
  tempo: 120,
  timeSignature: [4, 4],
  setPlaying: (playing: boolean) => set({ isPlaying: playing }),
  setCurrentTime: (time: number) => set({ currentTime: time }),
  setStartTime: (time: number) => {
    const { isPlaying } = get();
    if (isPlaying) set({ startTime: time, currentTime: time });
    else set({ startTime: time, currentTime: time });
  },
  setTempo: (tempo: number) => set({ tempo }),
  setTimeSignature: (timeSignature: [number, number]) => set({ timeSignature }),
  play: () => set({ isPlaying:true}),
  pause: () => set({ isPlaying:false}),
  stop: () => {
    const { startTime } = get();
    set({ isPlaying: false, currentTime: startTime })
  }
}));
