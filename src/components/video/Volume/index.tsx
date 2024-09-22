import { ChangeEvent } from "react";

import Mute from "/public/images/mute.svg";
import VolumeHigh from "/public/images/volume-high.svg";
import VolumeLow from "/public/images/volume-low.svg";

import GStyles from "../video.module.css";      // global styles
import LStyles from "./styles.module.css";      // local styles

interface volumeProps {
  isMute: boolean;
  volumePercent: number;
  onMuteUnmute: () => void;
  updateVolume: (vol: number) => void;
}

const VolumeControls = ({
  isMute,
  volumePercent,
  onMuteUnmute,
  updateVolume,
}: volumeProps): JSX.Element => {
  const Volume = ({
    isMute,
    vol,
  }: {
    isMute: boolean;
    vol: number;
  }): JSX.Element => {
    if (isMute || vol === 0) return <Mute />;
    else if (vol < 50) return <VolumeLow />;
    else return <VolumeHigh />;
  };

  return (
    <div className={LStyles.volCont}>
      <button
        className={GStyles.controlBtn}
        id={LStyles.volume}
        onClick={() => (onMuteUnmute ? onMuteUnmute() : null)}>
        <Volume isMute={isMute} vol={volumePercent} />
      </button>
      <div id={LStyles.volSlider}>
        <input
          type="range"
          name="vol"
          id={LStyles.volRange}
          value={volumePercent}
          min={0}
          max={100}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            updateVolume(parseInt(e.target.value))
          }
        />
      </div>
    </div>
  );
};

export default VolumeControls;
