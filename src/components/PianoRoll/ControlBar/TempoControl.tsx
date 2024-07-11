import React from 'react';
import { TbMetronome } from "react-icons/tb";
import { useTimelineGridStore } from '../../../stores/useTimelineGridStore';
import { useMidiStore } from '../../../stores/useMidiStore';
import { useControlBarStore } from '../../../stores/useControlBarStore';


const TempoControl: React.FC = () => {
  const { isRecording } = useTimelineGridStore();
  const { tempo, setTempo, timeSignature, setTimeSignature } = useMidiStore();

  const { metronome, setMetronome } = useControlBarStore();

  const toggleMetronome = () => {
    setMetronome(!metronome);
  }

  const handleTempoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTempoValue = Number(e.target.value);
    setTempo(newTempoValue);
  };

  const handleTimeSignatureChange = (index: number, value: string) => {
    const newValue = Number(value);
    if (newValue > 0) { // Ensure positive value
      const newTimeSignature = [...timeSignature];
      newTimeSignature[index] = newValue;
      setTimeSignature(newTimeSignature as [number, number]);
    }
  };

  const [beatsPerMeasure, beatUnit] = timeSignature;

  return (
    <div className="control-group">
      <button onClick={toggleMetronome} className={metronome ? 'selected':''}>
        <TbMetronome title='Metronome' />
      </button>
      <label>
        <input
          className="tempo"
          type="number"
          min={10}
          max={300}
          value={tempo}
          disabled={isRecording}
          onChange={handleTempoChange}
        />
      </label>
      <label>
        <input
          type="number"
          min={1}
          max={16}
          value={beatsPerMeasure}
          disabled={isRecording}
          onChange={(e) => {
            handleTimeSignatureChange(0, e.target.value);
          }}
        />
        /
        <select
          value={beatUnit}
          disabled={isRecording}
          onChange={(e) => {
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
  );
};

export default TempoControl;
