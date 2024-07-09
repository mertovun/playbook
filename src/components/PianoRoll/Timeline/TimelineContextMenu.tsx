import React from 'react';
import './TimelineContextMenu.scss';
import { ContextMenuOptions } from '../../../hooks/useContextMenuOptions';

interface ContextMenuProps {
  x: number;
  y: number;
  options: ContextMenuOptions[];
  onOptionClick: (option: ContextMenuOptions) => void;
}

export const TimelineContextMenu: React.FC<ContextMenuProps> = ({ x, y, options, onOptionClick }) => {
  return (
    <div 
      className="context-menu" 
      style={{ top: y, left: x, position: 'absolute' }}
    >
      {options.map((option, index) => (
        <div key={index} onClick={() => onOptionClick(option)} className="context-menu-option">
          {option}
        </div>
      ))}
    </div>
  );
};
