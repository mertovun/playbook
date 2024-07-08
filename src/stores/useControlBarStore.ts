import { create } from "zustand";

export enum EditMode {
  SELECT,
  PENCIL,
}

interface ControlBarStore {
  autoSlide: boolean;
  setAutoSlide: (autoSlide:boolean) => void;
  metronome: boolean;
  setMetronome: (metronome: boolean) => void;
  volume: number;
  isMuted: boolean;
  setVolume: (volume:number) => void;
  setIsMuted: (isMuted:boolean) => void;
  editMode: EditMode;
  setEditMode: (editMode: EditMode) => void;
  bookmarkSidebar: boolean;
  setBookmarkSidebar: (bookmarkSidebar: boolean) => void;
}

export const useControlBarStore = create<ControlBarStore>((set) =>({
  autoSlide: false,
  setAutoSlide: (autoSlide) => set({ autoSlide }),
  metronome: false,
  setMetronome: (metronome) => set({metronome}),
  volume:0.5,
  isMuted: false,
  setVolume: (volume) => set({volume}),
  setIsMuted: (isMuted) => set({isMuted}),
  editMode: EditMode.SELECT,
  setEditMode: (editMode) => set({editMode}),
  bookmarkSidebar: false,
  setBookmarkSidebar: (bookmarkSidebar) => set({bookmarkSidebar}),
}));
