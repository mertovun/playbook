import { useCallback } from 'react';
import { useTimelineGridStore } from '../../../stores/useTimelineGridStore';
import { usePianoRollHandlers } from '../../../hooks/usePianoRollHandlers';
import { timeToMeasureBeatTick, formatMeasureBeatTick } from '../../../utils/time';
import { useMidiStore } from '../../../stores/useMidiStore';
import { TimeSignature } from '../interface';
import './ControlBar.css';
import { useControlBarStore } from '../../../stores/useControlBarStore';

export const ControlBar = () => {
  const { isPlaying, isRecording, stop, record, cursorStartTime, currentTime } = useTimelineGridStore();
  const { toggleOrientation, toggleAutoSlide, togglePlayPause } = usePianoRollHandlers();
  const { tempo, setTempo, timeSignature, setTimeSignature, recordedNotes, updateRecordedNotes } = useMidiStore();

  const formattedMeasureBeatQuarter = formatMeasureBeatTick(...timeToMeasureBeatTick(currentTime, tempo, timeSignature));

  const [beatsPerMeasure, beatUnit] = timeSignature;

  const { volume, isMuted, setVolume, setIsMuted, metronome, setMetronome } = useControlBarStore();

  const handleTempoChange = (e:any) => {
    const newTempoValue = Number(e.target.value);
    setTempo(newTempoValue);
  };

  const handleTimeSignatureChange = (index: number, value: string) => {
    const newValue = Number(value);
    if (newValue > 0) { // Ensure positive value
      const newTimeSignature = [...timeSignature];
      newTimeSignature[index] = newValue;
      setTimeSignature(newTimeSignature as TimeSignature);
    }
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
        <button onClick={toggleOrientation}>O</button>
        <button onClick={()=>{setMetronome(!metronome)}}>Metronom</button>
        <button onClick={toggleAutoSlide}>Auto</button>
        {formattedMeasureBeatQuarter}
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
      </div>
      <div className="control-group">
        <label>
          BPM:
          <input
            type="number"
            min={10}
            max={300}
            value={tempo}
            disabled={isRecording}
            onChange={handleTempoChange}
          />
        </label>
        <label>
          Time:
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
