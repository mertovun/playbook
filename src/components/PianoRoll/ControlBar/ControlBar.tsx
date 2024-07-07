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
import './ControlBar.scss';
import EditModeControl from './EditModeControl';

export const ControlBar: React.FC = () => {
  const { isPlaying, stop, record, cursorStartTime, currentTime } = useTimelineGridStore();
  const { toggleAutoSlide, togglePlayPause } = usePianoRollHandlers();
  const { tempo, timeSignature,  recordedNotes, updateRecordedNotes } = useMidiStore();

  const formattedMeasureBeatQuarter = formatMeasureBeatTick(...timeToMeasureBeatTick(currentTime, tempo, timeSignature));

  const { autoSlide, volume, isMuted, setVolume, setIsMuted } = useControlBarStore();

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
      <OrientationControl />
      <TempoControl />
      <AutoSlideControl
        autoSlide={autoSlide}
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
      <EditModeControl/>
    </div>
  );
};

export default ControlBar;
