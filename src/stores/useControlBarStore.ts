import { create } from "zustand";

interface ControlBarStore {
  autoSlide: boolean;
  setAutoSlide: (autoSlide:boolean) => void;
  metronome: boolean;
  setMetronome: (metronome: boolean) => void;
  volume: number;
  isMuted: boolean;
  setVolume: (volume:number) => void;
  setIsMuted: (isMuted:boolean) => void;
}

export const useControlBarStore = create<ControlBarStore>((set) =>({
  autoSlide: false,
  setAutoSlide: (autoSlide) => set({ autoSlide }),
  metronome: true,
  setMetronome: (metronome) => set({metronome}),
  volume:0.5,
  isMuted: false,
  setVolume: (volume) => set({volume}),
  setIsMuted: (isMuted) => set({isMuted})
}));