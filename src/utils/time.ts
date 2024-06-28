
export function currentMeasureBeatQuarter(currentTime:number, tempo:number, timeSignature:[number, number]){
  const [beatsPerMeasure, beatUnit] = timeSignature;
  const quarterPerBeat = 16 / beatUnit;

  const secondsPerQuarter = 60 / tempo / 4;
  let currentQuarter = currentTime *  secondsPerQuarter;
  let currentBeat = Math.floor(currentQuarter / quarterPerBeat);
  currentQuarter -= currentBeat * quarterPerBeat;
  let currentMeasure = Math.floor(currentBeat/ beatsPerMeasure);
  currentBeat -= currentMeasure * beatsPerMeasure;
  return [currentMeasure, currentBeat, currentQuarter]
}
