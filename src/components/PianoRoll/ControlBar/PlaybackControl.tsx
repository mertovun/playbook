import React, { useCallback, useEffect } from 'react';
import { TbPlayerPlayFilled, TbPlayerPauseFilled, TbPlayerStopFilled, TbPlayerRecordFilled } from "react-icons/tb";
import { useTimelineGridStore } from '../../../stores/useTimelineGridStore';
import { useMidiStore } from '../../../stores/useMidiStore';

const PlaybackControl: React.FC = () => {
  const { isPlaying, play, pause, stop, record, cursorStartTime, currentTime } = useTimelineGridStore();
  const { recordedNotes, updateRecordedNotes } = useMidiStore();

  const togglePlayPause =  useCallback(() => isPlaying ? pause() : play(), [isPlaying, pause, play]);

  const handleRecord = useCallback(() => {
    updateRecordedNotes(recordedNotes);
    record();
  }, [record, recordedNotes, updateRecordedNotes]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault(); // Prevent the default spacebar behavior (page scroll)
        isPlaying ? stop() : play();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying, stop, play]);

  return (
    <div className="control-group">
      <button onClick={togglePlayPause}>
        {isPlaying ? <TbPlayerPauseFilled title='Pause' /> : <TbPlayerPlayFilled title='Play'/>}
      </button>
      <button disabled={cursorStartTime === currentTime} onClick={stop}>
        <TbPlayerStopFilled title='Stop' />
      </button>
      <button disabled={isPlaying} onClick={handleRecord}>
        <TbPlayerRecordFilled title='Record' />
      </button>
    </div>
  );
};

export default PlaybackControl;
