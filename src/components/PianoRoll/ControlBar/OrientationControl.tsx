import React from 'react';
import { PiPianoKeysFill } from "react-icons/pi";
import { EOrientation } from '../interface';

interface OrientationControlProps {
  toggleOrientation: () => void;
  orientation: EOrientation
}

const OrientationControl: React.FC<OrientationControlProps> = ({ toggleOrientation, orientation }) => {
  return (
    <div className="control-group">
      <button onClick={toggleOrientation}>
        <PiPianoKeysFill />
      </button>
    </div>
  );
};

export default OrientationControl;
