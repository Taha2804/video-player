type visualHelperEventType =
  | "pause"
  | "play"
  | "mute"
  | "volume"
  | "volume-low"
  | "volume-high"
  | "forward"
  | "backward";

interface visualHelperType {
  event: visualHelperEventType;
  helperClass: string;
  volumeLabel: number;
}

export type { visualHelperEventType };
export default visualHelperType;
