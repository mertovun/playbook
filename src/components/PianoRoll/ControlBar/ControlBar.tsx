import React from 'react';
import OrientationControl from './OrientationControl';
import TempoControl from './TempoControl';
import AutoSlideControl from './AutoSlideControl';
import PlaybackControl from './PlaybackControl';
import VolumeControl from './VolumeControl';
import './ControlBar.scss';
import EditModeControl from './EditModeControl';

export const ControlBar: React.FC = () => {
  return (
    <div className="control-bar">
      <OrientationControl />
      <TempoControl />
      <AutoSlideControl />
      <PlaybackControl />
      <VolumeControl />
      <EditModeControl/>
    </div>
  );
};

export default ControlBar;
