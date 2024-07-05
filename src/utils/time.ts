
export function timeToMeasureBeatTick(timeInSeconds:number, tempo:number, timeSignature:[number, number]): [number, number, number]{
  const [beatsPerMeasure, beatUnit] = timeSignature;
  const tickPerBeat = 16 / beatUnit;

  const secondsPerTick = 60 / tempo / 4;
  let quarter = timeInSeconds /  secondsPerTick;
  let beat = Math.floor(quarter / tickPerBeat);
  quarter -= beat * tickPerBeat;
  const measure = Math.floor(beat/ beatsPerMeasure);
  beat -= measure * beatsPerMeasure;
  return [measure, beat, quarter]
}

export function measureBeatTickToTime(measure: number, beat: number, tick: number, tempo: number, timeSignature: [number, number]): number {
  const [beatsPerMeasure, beatUnit] = timeSignature;
  const tickPerBeat = 16 / beatUnit;

  const secondsPerTick = 60 / tempo / 4;

  const totalTicks = (measure * beatsPerMeasure * tickPerBeat) + (beat * tickPerBeat) + tick;

  const timeInSeconds = totalTicks * secondsPerTick;

  return timeInSeconds;
}


export function formatMeasureBeatTick(measure:number, beat:number, tick:number) {
  const formattedMeasure = measure.toString().padStart(1, '0');
  const formattedBeat = beat.toString().padStart(1, '0');
  const formattedQuarter = tick.toFixed(3).padStart(5, '0');
  return ` ${formattedMeasure} : ${formattedBeat} : ${formattedQuarter}`;
}