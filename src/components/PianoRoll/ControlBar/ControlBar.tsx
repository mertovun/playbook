import { useState } from 'react';
import { useTimelineGridStore } from '../TimelineGrid/useTimelineGridStore';
import { usePianoRollHandlers } from '../usePianoRollHandlers';
import { measureBeatQuarter, formatMeasureBeatQuarter } from '../../../utils/time';
import { useMidiStore } from '../useMidi';
import { TimeSignature } from '../interface';
import './ControlBar.css'; // Import the CSS for styling

export const ControlBar = () => {
  const { isPlaying, stop, record, cursorStartTime, currentTime } = useTimelineGridStore();
  const { toggleOrientation, togglePlayPause } = usePianoRollHandlers();
  const { tempo, setTempo, timeSignature, setTimeSignature } = useMidiStore();

  const formattedMeasureBeatQuarter = formatMeasureBeatQuarter(...measureBeatQuarter(currentTime, tempo, timeSignature));

  const [beatsPerMeasure, beatUnit] = timeSignature;
  const [newTempo, setNewTempo] = useState(tempo);
  const [newBeatsPerMeasure, setNewBeatsPerMeasure] = useState(beatsPerMeasure);
  const [newBeatUnit, setNewBeatUnit] = useState(beatUnit);

  const handleTempoChange = (e) => {
    const newTempoValue = Number(e.target.value);
    setNewTempo(newTempoValue);
    setTempo(newTempoValue);
  };

  const handleTimeSignatureChange = (index:number, value:string) => {
    const newTimeSignature = [...timeSignature];
    newTimeSignature[index] = Number(value);
    setTimeSignature(newTimeSignature as TimeSignature);
  };

  return (
    <div className="control-bar">
      <div className="control-group">
        <button onClick={toggleOrientation}>Toggle Orientation</button>
      </div>
      <div className="control-group">
        <button onClick={togglePlayPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button disabled={cursorStartTime === currentTime} onClick={stop}>
          {'Stop'}
        </button>
        <button disabled={isPlaying} onClick={record}>
          {'Record'}
        </button>
        {formattedMeasureBeatQuarter}
      </div>
      <div className="control-group">
        <label>
          Tempo:
          <input
            type="number"
            value={newTempo}
            onChange={handleTempoChange}
          />
        </label>
        <label>
          Time Signature:
          <input
            type="number"
            value={newBeatsPerMeasure}
            onChange={(e) => {
              setNewBeatsPerMeasure(Number(e.target.value));
              handleTimeSignatureChange(0, e.target.value);
            }}
          />
          /
          <select
            value={newBeatUnit}
            onChange={(e) => {
              setNewBeatUnit(Number(e.target.value));
              handleTimeSignatureChange(1, e.target.value);
            }}
          >
            {[1, 2, 4, 8, 16].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};

export default ControlBar;
