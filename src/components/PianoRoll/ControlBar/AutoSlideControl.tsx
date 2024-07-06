import React from 'react';
import { TbArrowBigRightLines } from "react-icons/tb";

interface AutoSlideControlProps {
  autoSlide: boolean
  toggleAutoSlide: () => void;
  formattedMeasureBeatQuarter: string;
}

const AutoSlideControl: React.FC<AutoSlideControlProps> = ({
  autoSlide,
  toggleAutoSlide,
  formattedMeasureBeatQuarter,
}) => {
  return (
    <div className="control-group">
      <button onClick={toggleAutoSlide} className={autoSlide ? 'selected':''}>
        <TbArrowBigRightLines />
      </button>
      {formattedMeasureBeatQuarter}
    </div>
  );
};

export default AutoSlideControl;
