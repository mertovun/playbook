import React, { useEffect } from 'react';
import { PiPianoKeysFill } from "react-icons/pi";
import { EOrientation } from '../interface';
import { usePianoRollHandlers } from '../../../hooks/usePianoRollHandlers';
import { usePianoRollLayoutStore } from '../../../stores/usePianoRollLayoutStore';

const OrientationControl: React.FC= () => {
  const { toggleOrientation } = usePianoRollHandlers();
  const { orientation } = usePianoRollLayoutStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault(); // Prevent the default tab behavior if needed
        toggleOrientation();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleOrientation]);

  return (
    <div className="control-group">
      <button
        onClick={toggleOrientation}
        className={`orientation ${orientation === EOrientation.VERTICAL ? 'vertical' : 'horizontal'}`}
      >
        <PiPianoKeysFill title='Orientation [Tab]' />
      </button>
    </div>
  );
};

export default OrientationControl;
