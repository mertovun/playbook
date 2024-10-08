
export function timeToMeasureBeatTick(timeInSeconds:number, tempo:number, timeSignature:[number, number], gridTick:number): [number, number, number]{
  const [beatsPerMeasure, beatUnit] = timeSignature;
  const tickPerBeat = 4 * gridTick / beatUnit;

  const secondsPerTick = tickDuration(gridTick, tempo);
  let tick = timeInSeconds /  secondsPerTick;
  let beat = Math.floor(tick / tickPerBeat);
  tick -= beat * tickPerBeat;
  const measure = Math.floor(beat/ beatsPerMeasure);
  beat -= measure * beatsPerMeasure;
  return [measure, beat, tick]
}

export function measureBeatTickToTime(measure: number, beat: number, tick: number, tempo: number, timeSignature: [number, number], gridTick:number): number {
  const [beatsPerMeasure, beatUnit] = timeSignature;
  const tickPerBeat = 4 * gridTick / beatUnit;

  const secondsPerTick = tickDuration(gridTick, tempo);

  const totalTicks = (measure * beatsPerMeasure * tickPerBeat) + (beat * tickPerBeat) + tick;

  const timeInSeconds = totalTicks * secondsPerTick;

  return timeInSeconds;
}

export function formatMeasureBeatTick(measure:number, beat:number, tick:number) {
  const formattedMeasure = measure.toString().padStart(1, '0');
  const formattedBeat = beat.toString().padStart(1, '0');
  const formattedTick = tick.toFixed(3).padStart(5, '0');
  return ` ${formattedMeasure} : ${formattedBeat} : ${formattedTick}`;
}

export function tickDuration(gridTick:number, tempo: number) {
  return 60 / tempo / gridTick;
}