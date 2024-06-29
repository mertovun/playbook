import {create} from 'zustand';

interface TimelineStore {
  isPlaying: boolean;
  cursorStartTime: number;
  currentTime: number;
  tempo: number;
  timeSignature: [number, number];
  windowStartTime: number;
  pixelsPerSecond: number;
  setPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setCursorStartTime: (time: number) => void;
  setTempo: (tempo: number) => void;
  setTimeSignature: (timeSignature: [number, number]) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
}

export const useTimelineStore = create<TimelineStore>((set, get) => ({
  isPlaying: false,
  cursorStartTime: 0,
  currentTime: 0,
  tempo: 120,
  timeSignature: [4, 4],
  pixelsPerSecond: 100,
  windowStartTime: 0,
  setPlaying: (playing: boolean) => set({ isPlaying: playing }),
  setCurrentTime: (time: number) => set({ currentTime: time }),
  setCursorStartTime: (time: number) => {
    const { isPlaying } = get();
    if (isPlaying) set({ cursorStartTime: time, currentTime: time });
    else set({ cursorStartTime: time, currentTime: time });
  },
  setTempo: (tempo: number) => set({ tempo }),
  setTimeSignature: (timeSignature: [number, number]) => set({ timeSignature }),
  play: () => set({ isPlaying:true}),
  pause: () => set({ isPlaying:false}),
  stop: () => {
    const { cursorStartTime } = get();
    set({ isPlaying: false, currentTime: cursorStartTime })
  }
}));
