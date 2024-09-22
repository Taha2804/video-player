import React from "react";

import Play from "/public/images/play.svg";
import Pause from "/public/images/pause.svg";

import styles from "@/components/video/video.module.css";

type playPauseProps = {
  paused: boolean;
  onPlayPause: () => void;
};
const PlayPauseBtn = ({ paused, onPlayPause }: playPauseProps): JSX.Element => {
  return (
    <button
      className={styles.controlBtn}
      id={styles.playPauseBtn}
      onClick={() => onPlayPause()}>
      {paused ? <Play /> : <Pause />}
    </button>
  );
};

export default PlayPauseBtn;
