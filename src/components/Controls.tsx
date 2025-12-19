import React from 'react';
import '../styles/components.css';

interface ControlsProps {
  onLayoutChange: (layout: string) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  onLayoutChange
}) => {
  return (
    <div className="controls">
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
