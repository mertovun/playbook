import { ENote, EOctave, EOrientation, KeyboardRange } from './interface';
import { Keyboard } from './Keyboard/Keyboard';
import { useKeyboardPanelLayout } from './useKeyboardPanelLayout';
import './KeyboardPanel.css';
import { Timeline } from './Timeline/Timeline';

export const KeyboardPanel = () => {

  const keyboardRange: KeyboardRange = [[ENote.A, EOctave._0], [ENote.C, EOctave._8]];

  const { 
    orientation, 
    keyboardWidth,
    timelineLength,
    setOrientation, 
    mapRangeToKeyboardNotes, 
    mapRangeToTimelineNotes,
    mapRangeToKeyboardOctaves } = useKeyboardPanelLayout(keyboardRange);

  const toggleOrientation = () => {
    setOrientation(orientation === EOrientation.HORIZONTAL ? EOrientation.VERTICAL : EOrientation.HORIZONTAL);
  };

  const height = `${orientation === EOrientation.HORIZONTAL ? timelineLength : keyboardWidth}`
  const width = `${orientation === EOrientation.HORIZONTAL ? keyboardWidth : timelineLength}`

  return (
    <>
      <button onClick={toggleOrientation}>
        Toggle Orientation
      </button>
      <svg className={`keyboard-svg ${orientation}`} width={width} height={height}>
        <Keyboard 
          mapRangeToKeyboardOctaves={mapRangeToKeyboardOctaves}
          mapRangeToKeyboardNotes={mapRangeToKeyboardNotes}
        />
        <Timeline  
          mapRangeToTimelineOctaves={mapRangeToKeyboardOctaves}
          mapRangeToTimelineNotes={mapRangeToTimelineNotes}
        />
      </svg>
      
    </>
  );
};

export default KeyboardPanel;
