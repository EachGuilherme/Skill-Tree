import { useState, useCallback, useEffect, useRef } from 'react';
import { CONFIG } from '../types';

export function usePanZoom() {
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [panStartX, setPanStartX] = useState(0);
  const [panStartY, setPanStartY] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  // ✅ Zoom com scroll
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    setZoom(prevZoom => {
      const novoZoom = e.deltaY > 0 ? prevZoom - CONFIG.ZOOM_SPEED : prevZoom + CONFIG.ZOOM_SPEED;
      return Math.max(CONFIG.ZOOM_MIN, Math.min(CONFIG.ZOOM_MAX, novoZoom));
    });
  }, []);

  // ✅ Iniciar pan com mouse
  const handleMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    setIsPanning(true);
    setPanStartX(e.clientX - panX);
    setPanStartY(e.clientY - panY);
  }, [panX, panY]);

  // ✅ Mover durante pan
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isPanning) return;
    setPanX(e.clientX - panStartX);
    setPanY(e.clientY - panStartY);
  }, [isPanning, panStartX, panStartY]);

  // ✅ Finalizar pan
  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // ✅ Vincular listeners ao document
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;

    svg.addEventListener('wheel', handleWheel as EventListener, { passive: false });
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      svg.removeEventListener('wheel', handleWheel as EventListener);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleWheel, handleMouseMove, handleMouseUp]);

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
    svgRef,
    handleMouseDown,
    resetView
  };
}
