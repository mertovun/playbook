import React from 'react';
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { TbVolume, TbVolume3 } from "react-icons/tb";

interface VolumeControlProps {
  isMuted: boolean;
  volume: number;
  toggleMute: () => void;
  handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({
  isMuted,
  volume,
  toggleMute,
  handleVolumeChange,
}) => {
  return (
    <div className="control-group volume">
      <button onClick={toggleMute}>
        {isMuted ? <TbVolume3 /> : <TbVolume />}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        className="volume"
        value={isMuted ? 0 : volume}
        onChange={handleVolumeChange}
        disabled={isMuted}
      />
    </div>
  );
};

export default VolumeControl;
