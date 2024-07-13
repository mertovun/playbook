import {create} from 'zustand';

interface TimelineGridStore {
  isPlaying: boolean;
  isRecording: boolean;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  incrementCurrentTime: (elapsed: number) => void;
  play: () => void;
  record: () => void;
  pause: () => void;
  stop: () => void;
  
  cursorStartTime: number;
  windowStartTime: number;
  pixelsPerSecond: number;
  setCursorStartTime: (time: number) => void;
  setWindowStartTime: (time: number) => void;
  incrementWindowStartTime: (elapsed: number) => void;
  setPixelsPerSecond: (pixelsPerSecond: number) => void;
  gridTick: number;
  setGridTick: (gridTick:number) => void;
}

export const MAX_ZOOM_IN = 400;
export const MAX_ZOOM_OUT = 16;

export const useTimelineGridStore = create<TimelineGridStore>((set, get) => ({
  isPlaying: false,
  isRecording: false,
  currentTime: 0,
  setCurrentTime: (time) => set({ currentTime: Math.max(time,0) }),
  incrementCurrentTime: (elapsed) => {
    const { currentTime } = get();
    set( {currentTime: currentTime+elapsed })
  },
  play: () => set({ isPlaying:true}),
  pause: () => set({ isPlaying:false}),
  record: () => {
    const { cursorStartTime } = get();
    set({ isPlaying: true, currentTime: cursorStartTime, isRecording: true })
  },
  stop: () => {
    const { cursorStartTime } = get();
    set({ isPlaying: false, currentTime: cursorStartTime, isRecording: false })
  },

  cursorStartTime: 0,
  pixelsPerSecond: 100,
  windowStartTime: 0,
  setCursorStartTime: (time) => {
    time = Math.max(time,0);
     set({ cursorStartTime: time });
  },
  setWindowStartTime: (time) => set({ windowStartTime: Math.max(time,0) }),
  incrementWindowStartTime: (elapsed) => {
    const { windowStartTime } = get();
    set( {windowStartTime: windowStartTime+elapsed })
  },
  setPixelsPerSecond: (pixelsPerSecond) => {
    pixelsPerSecond = Math.max(MAX_ZOOM_OUT,pixelsPerSecond);
    pixelsPerSecond = Math.min(MAX_ZOOM_IN, pixelsPerSecond);
    set({ pixelsPerSecond })
  },
  gridTick: 2,
  setGridTick: (gridTick) => set({gridTick}),
}));
