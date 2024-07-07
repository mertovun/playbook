import React from 'react';
import OrientationControl from './OrientationControl';
import TempoControl from './TempoControl';
import AutoSlideControl from './AutoSlideControl';
import PlaybackControl from './PlaybackControl';
import VolumeControl from './VolumeControl';
import './ControlBar.scss';
import EditModeControl from './EditModeControl';
import BookmarkBarControl from './BookmarkBarControl';

export const ControlBar: React.FC = () => {
  return (
    <div className="control-bar">
      <OrientationControl />
      <TempoControl />
      <AutoSlideControl />
      <PlaybackControl />
      <VolumeControl />
      <EditModeControl />
      <BookmarkBarControl />
    </div>
  );
};

export default ControlBar;
