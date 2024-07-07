import React from 'react';
import { PiPianoKeysFill } from "react-icons/pi";
import { EOrientation } from '../interface';
import { usePianoRollHandlers } from '../../../hooks/usePianoRollHandlers';
import usePianoRollLayoutStore from '../../../stores/usePianoRollLayoutStore';

const OrientationControl: React.FC= () => {
  const { toggleOrientation } = usePianoRollHandlers();
  const { orientation } = usePianoRollLayoutStore();

  return (
    <div className="control-group">
      <button
        onClick={toggleOrientation}
        className={`orientation ${orientation === EOrientation.VERTICAL ? 'vertical' : 'horizontal'}`}
      >
        <PiPianoKeysFill />
      </button>
    </div>
  );
};

export default OrientationControl;
