import React, { useCallback } from 'react';
import { useTimelineGridStore } from '../../../stores/useTimelineGridStore';
import { usePianoRollHandlers } from '../../../hooks/usePianoRollHandlers';
import { timeToMeasureBeatTick, formatMeasureBeatTick } from '../../../utils/time';
import { useMidiStore } from '../../../stores/useMidiStore';
import { useControlBarStore } from '../../../stores/useControlBarStore';
import OrientationControl from './OrientationControl';
import TempoControl from './TempoControl';
import AutoSlideControl from './AutoSlideControl';
import PlaybackControl from './PlaybackControl';
import VolumeControl from './VolumeControl';
import './ControlBar.css';
import usePianoRollLayoutStore from '../../../stores/usePianoRollLayoutStore';

export const ControlBar: React.FC = () => {
  const { isPlaying, isRecording, stop, record, cursorStartTime, currentTime } = useTimelineGridStore();
  const { toggleOrientation, toggleAutoSlide, togglePlayPause } = usePianoRollHandlers();
  const { orientation } = usePianoRollLayoutStore();
  const { tempo, setTempo, timeSignature, setTimeSignature, recordedNotes, updateRecordedNotes } = useMidiStore();

  const formattedMeasureBeatQuarter = formatMeasureBeatTick(...timeToMeasureBeatTick(currentTime, tempo, timeSignature));

  const { volume, isMuted, setVolume, setIsMuted, metronome, setMetronome } = useControlBarStore();

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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
  };

  const handleRecord = useCallback(() => {
    updateRecordedNotes(recordedNotes);
    record();
  }, [record, recordedNotes, updateRecordedNotes]);

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
  }, [isMuted, setIsMuted]);

  return (
    <div className="control-bar">
      <OrientationControl toggleOrientation={toggleOrientation} orientation={orientation} />
      <TempoControl
        metronome={metronome}
        toggleMetronome={toggleMetronome}
        tempo={tempo}
        isRecording={isRecording}
        handleTempoChange={handleTempoChange}
        timeSignature={timeSignature}
        handleTimeSignatureChange={handleTimeSignatureChange}
      />
      <AutoSlideControl
        toggleAutoSlide={toggleAutoSlide}
        formattedMeasureBeatQuarter={formattedMeasureBeatQuarter}
      />
      <PlaybackControl
        isPlaying={isPlaying}
        togglePlayPause={togglePlayPause}
        stop={stop}
        cursorStartTime={cursorStartTime}
        currentTime={currentTime}
        handleRecord={handleRecord}
      />
      <VolumeControl
        isMuted={isMuted}
        volume={volume}
        toggleMute={toggleMute}
        handleVolumeChange={handleVolumeChange}
      />
    </div>
  );
};

export default ControlBar;
