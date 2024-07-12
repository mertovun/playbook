import React, { useCallback } from 'react';
import { TbVolume, TbVolume3 } from "react-icons/tb";
import { useControlBarStore } from '../stores/useControlBarStore';

const VolumeControl: React.FC = () => {
  const {  volume, isMuted, setVolume, setIsMuted } = useControlBarStore();

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
  };

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
  }, [isMuted, setIsMuted]);

  return (
    <div className="control-group volume">
      <button onClick={toggleMute}>
        {isMuted ? <TbVolume3 title='Unmute' /> : <TbVolume title='Mute' />}
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
