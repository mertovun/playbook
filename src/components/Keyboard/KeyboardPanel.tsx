import { ENote, EOctave, EOrientation } from './interface';
import { Keyboard } from './Keyboard';
import { useKeyboardPanelLayout } from './useKeyboardPanelLayout';

export const KeyboardPanel = () => {
  const { orientation, setOrientation, mapRangeToNotes, mapRangeToOctaves } = useKeyboardPanelLayout([[ENote.A, EOctave._0], [ENote.C, EOctave._8]]);

  const toggleOrientation = () => {
    setOrientation(orientation === EOrientation.HORIZONTAL ? EOrientation.VERTICAL : EOrientation.HORIZONTAL);
  };

  return (
    <>
      <button onClick={toggleOrientation}>
        Toggle Orientation
      </button>
      <Keyboard 
        keyboardRange={[[ENote.A, EOctave._0], [ENote.C, EOctave._8]]} 
        orientation={orientation} 
        mapRangeToOctaves={mapRangeToOctaves}
        mapRangeToNotes={mapRangeToNotes}
      />
    </>
  );
};

export default KeyboardPanel;
