import { create } from 'zustand';

interface UIStoreState {
  zoom: number;
  panX: number;
  panY: number;
  isPanning: boolean;

  // Actions
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  setIsPanning: (isPanning: boolean) => void;
  resetView: () => void;
}

export const useUIStore = create<UIStoreState>((set) => ({
  zoom: 1,
  panX: 0,
  panY: 0,
  isPanning: false,

  setZoom: (zoom) => set({ zoom }),
  setPan: (x, y) => set({ panX: x, panY: y }),
  setIsPanning: (isPanning) => set({ isPanning }),
  resetView: () => set({ zoom: 1, panX: 0, panY: 0 })
}));