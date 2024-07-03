import { create } from "zustand";

interface ControlBarStore {
  volume: number;
  isMuted: boolean;
  setVolume: (volume:number) => void;
  setIsMuted: (isMuted:boolean) => void;
}

export const useControlBarStore = create<ControlBarStore>((set) =>({
  volume:0.5,
  isMuted: false,
  setVolume: (volume) => set({volume}),
  setIsMuted: (isMuted) => set({isMuted})
}));