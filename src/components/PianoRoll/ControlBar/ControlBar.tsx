import { useState, useCallback } from 'react';
import { useTimelineGridStore } from '../TimelineGrid/useTimelineGridStore';
import { usePianoRollHandlers } from '../usePianoRollHandlers';
import { measureBeatQuarter, formatMeasureBeatQuarter } from '../../../utils/time';
import { useMidiStore } from '../useMidiStore';
import { TimeSignature } from '../interface';
import './ControlBar.css'; // Import the CSS for styling
import { useControlBarStore } from './useControlBarStore';

export const ControlBar = () => {
  const { isPlaying, isRecording, stop, record, cursorStartTime, currentTime } = useTimelineGridStore();
  const { toggleOrientation, togglePlayPause } = usePianoRollHandlers();
  const { tempo, setTempo, timeSignature, setTimeSignature, recordedNotes, updateRecordedNotes } = useMidiStore();

  const formattedMeasureBeatQuarter = formatMeasureBeatQuarter(...measureBeatQuarter(currentTime, tempo, timeSignature));

  const [beatsPerMeasure, beatUnit] = timeSignature;
  const [newTempo, setNewTempo] = useState(tempo);
  const [newBeatsPerMeasure, setNewBeatsPerMeasure] = useState(beatsPerMeasure);
  const [newBeatUnit, setNewBeatUnit] = useState(beatUnit);

  const { volume, isMuted, setVolume, setIsMuted } = useControlBarStore();

  const handleTempoChange = (e:any) => {
    const newTempoValue = Number(e.target.value);
    setNewTempo(newTempoValue);
    setTempo(newTempoValue);
  };

  const handleTimeSignatureChange = (index: number, value: string) => {
    const newTimeSignature = [...timeSignature];
    newTimeSignature[index] = Number(value);
    setTimeSignature(newTimeSignature as TimeSignature);
  };

  const handleVolumeChange = (e: any) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
  };

  const handleRecord = useCallback(() => {
    updateRecordedNotes(recordedNotes);
    record();
  }, [record, recordedNotes, updateRecordedNotes]);

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
  },[isMuted, setIsMuted]);

  return (
    <div className="control-bar">
      <div className="control-group">
        <button onClick={toggleOrientation}>Orientation</button>
      </div>
      <div className="control-group">
        <button onClick={togglePlayPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button disabled={cursorStartTime === currentTime} onClick={stop}>
          {'Stop'}
        </button>
        <button disabled={isPlaying} onClick={handleRecord}>
          {'Record'}
        </button>
        {formattedMeasureBeatQuarter}
      </div>
      <div className="control-group">
        <label>
          BPM:
          <input
            type="number"
            value={newTempo}
            disabled={isRecording}
            onChange={handleTempoChange}
          />
        </label>
        <label>
          Time:
          <input
            type="number"
            value={newBeatsPerMeasure}
            disabled={isRecording}
            onChange={(e) => {
              setNewBeatsPerMeasure(Number(e.target.value));
              handleTimeSignatureChange(0, e.target.value);
            }}
          />
          /
          <select
            value={newBeatUnit}
            disabled={isRecording}
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
      <div className="control-group">
        <label>
          Volume:
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            disabled={isMuted}
          />
        </label>
        <button onClick={toggleMute}>
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
      </div>
    </div>
  );
};

export default ControlBar;
