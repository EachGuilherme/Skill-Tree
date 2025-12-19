import { useState, useCallback } from 'react';
import { CONFIG } from '../types';

export function usePanZoom() {
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [panStartX, setPanStartX] = useState(0);
  const [panStartY, setPanStartY] = useState(0);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const novoZoom = e.deltaY > 0 ? zoom - CONFIG.ZOOM_SPEED : zoom + CONFIG.ZOOM_SPEED;
    if (novoZoom >= CONFIG.ZOOM_MIN && novoZoom <= CONFIG.ZOOM_MAX) {
      setZoom(novoZoom);
    }
  }, [zoom]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsPanning(true);
    setPanStartX(e.clientX - panX);
    setPanStartY(e.clientY - panY);
  }, [panX, panY]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isPanning) return;
    setPanX(e.clientX - panStartX);
    setPanY(e.clientY - panStartY);
  }, [isPanning, panStartX, panStartY]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const resetView = useCallback(() => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  }, []);

  return {
    zoom,
    panX,
    panY,
    isPanning,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    resetView
  };
}