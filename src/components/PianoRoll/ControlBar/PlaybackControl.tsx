import React, { useCallback } from 'react';
import { TbPlayerPlayFilled, TbPlayerPauseFilled, TbPlayerStopFilled, TbPlayerRecordFilled } from "react-icons/tb";
import { usePianoRollHandlers } from '../../../hooks/usePianoRollHandlers';
import { useTimelineGridStore } from '../../../stores/useTimelineGridStore';
import { useMidiStore } from '../../../stores/useMidiStore';

const PlaybackControl: React.FC = () => {
  const { isPlaying, stop, record, cursorStartTime, currentTime } = useTimelineGridStore();
  const { togglePlayPause } = usePianoRollHandlers();
  const { recordedNotes, updateRecordedNotes } = useMidiStore();

  const handleRecord = useCallback(() => {
    updateRecordedNotes(recordedNotes);
    record();
  }, [record, recordedNotes, updateRecordedNotes]);

  return (
    <div className="control-group">
      <button onClick={togglePlayPause}>
        {isPlaying ? <TbPlayerPauseFilled /> : <TbPlayerPlayFilled />}
      </button>
      <button disabled={cursorStartTime === currentTime} onClick={stop}>
        <TbPlayerStopFilled />
      </button>
      <button disabled={isPlaying} onClick={handleRecord}>
        <TbPlayerRecordFilled />
      </button>
    </div>
  );
};

export default PlaybackControl;
