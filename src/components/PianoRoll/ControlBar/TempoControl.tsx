import React from 'react';
import { TbMetronome } from "react-icons/tb";

interface TempoControlProps {
  metronome: boolean
  toggleMetronome: () => void;
  tempo: number;
  isRecording: boolean;
  handleTempoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  timeSignature: number[];
  handleTimeSignatureChange: (index: number, value: string) => void;
}

const TempoControl: React.FC<TempoControlProps> = ({
  metronome,
  toggleMetronome,
  tempo,
  isRecording,
  handleTempoChange,
  timeSignature,
  handleTimeSignatureChange,
}) => {
  const [beatsPerMeasure, beatUnit] = timeSignature;

  return (
    <div className="control-group">
      <button onClick={toggleMetronome} className={metronome ? 'selected':''}>
        <TbMetronome />
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
