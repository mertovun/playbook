import React from 'react';
import { TbPlayerPlayFilled, TbPlayerPauseFilled, TbPlayerStopFilled, TbPlayerRecordFilled } from "react-icons/tb";

interface PlaybackControlProps {
  isPlaying: boolean;
  togglePlayPause: () => void;
  stop: () => void;
  cursorStartTime: number;
  currentTime: number;
  handleRecord: () => void;
}

const PlaybackControl: React.FC<PlaybackControlProps> = ({
  isPlaying,
  togglePlayPause,
  stop,
  cursorStartTime,
  currentTime,
  handleRecord,
}) => {
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
