import React from 'react';
import '../styles/components.css';

interface ControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onResetView: () => void;
  onLayoutChange: (layout: string) => void;
  tpAtual: number;
}

export const Controls: React.FC<ControlsProps> = ({
  zoom,
  onZoomChange,
  onResetView,
  onLayoutChange,
  tpAtual
}) => {
  return (
    <div className="controls">
      <div className="control-group">
        <label>💰 TP: {tpAtual}</label>
      </div>

      <div className="control-group">
        <label>🔍 Zoom: {(zoom * 100).toFixed(0)}%</label>
        <button onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}>-</button>
        <button onClick={() => onZoomChange(Math.min(3, zoom + 0.1))}>+</button>
        <button onClick={onResetView}>↺ Reset</button>
      </div>

      <div className="control-group">
        <label>🎨 Layout:</label>
        <select onChange={(e) => onLayoutChange(e.target.value)}>
          <option value="radial">Radial</option>
          <option value="cruz">Cruz Escalonada</option>
          <option value="escalonada">Escalonada</option>
        </select>
      </div>
    </div>
  );
};