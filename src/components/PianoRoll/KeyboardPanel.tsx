import { ENote, EOctave, EOrientation } from './interface';
import { Keyboard } from './Keyboard/Keyboard';
import { useKeyboardPanelLayout } from './useKeyboardPanelLayout';
import './KeyboardPanel.css';

export const KeyboardPanel = () => {

  const { orientation, setOrientation, mapRangeToKeyboardNotes, mapRangeToKeyboardOctaves } = useKeyboardPanelLayout([[ENote.A, EOctave._0], [ENote.C, EOctave._8]]);

  const toggleOrientation = () => {
    setOrientation(orientation === EOrientation.HORIZONTAL ? EOrientation.VERTICAL : EOrientation.HORIZONTAL);
  };

  return (
    <>
      <button onClick={toggleOrientation}>
        Toggle Orientation
      </button>
      <svg className={`keyboard-svg ${orientation}`} width="100%" height="800">
        <Keyboard 
          keyboardRange={[[ENote.A, EOctave._0], [ENote.C, EOctave._8]]} 
          orientation={orientation} 
          mapRangeToKeyboardOctaves={mapRangeToKeyboardOctaves}
          mapRangeToKeyboardNotes={mapRangeToKeyboardNotes}
        />
      </svg>
      
    </>
  );
};

export default KeyboardPanel;
