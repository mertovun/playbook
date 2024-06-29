import {create} from 'zustand';

interface TimelineGridStore {
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
  setWindowStartTime: (time: number) => void;
  setPixelsPerSecond: (pixelsPerSecond: number) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
}

const MAX_ZOOM_IN = 400;
const MAX_ZOOM_OUT = 16;

export const useTimelineGridStore = create<TimelineGridStore>((set, get) => ({
  isPlaying: false,
  cursorStartTime: 0,
  currentTime: 0,
  tempo: 120,
  timeSignature: [4, 4],
  pixelsPerSecond: 100,
  windowStartTime: 0,
  setPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentTime: (time) => set({ currentTime: Math.max(time,0) }),
  setCursorStartTime: (time) => {
    time = Math.max(time,0);
    const { isPlaying } = get();
    if (isPlaying) set({ cursorStartTime: time, currentTime: time });
    else set({ cursorStartTime: time, currentTime: time });
  },
  setTempo: (tempo) => set({ tempo }),
  setTimeSignature: (timeSignature) => set({ timeSignature }),
  setWindowStartTime: (time) => set({ windowStartTime: Math.max(time,0) }),
  setPixelsPerSecond: (pixelsPerSecond) => {
    pixelsPerSecond = Math.max(MAX_ZOOM_OUT,pixelsPerSecond);
    pixelsPerSecond = Math.min(MAX_ZOOM_IN, pixelsPerSecond);
    set({ pixelsPerSecond })
  },
  play: () => set({ isPlaying:true}),
  pause: () => set({ isPlaying:false}),
  stop: () => {
    const { cursorStartTime } = get();
    set({ isPlaying: false, currentTime: cursorStartTime })
  }
}));
