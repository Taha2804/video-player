"use client";

import React, { useState, useEffect } from "react";
import Hls, { Events, FragLoadedData } from "hls.js";

import PlayPauseBtn from "../PlayPauseBtn";
import VolumeControls from "../Volume";
import Timeline from "../Timeline";
import FullScreenBtn from "../FullScreenBtn";

import { visualHelperEventType } from "@/interface/VisualHelper";

import LStyles from "./styles.module.css"; // local styles

interface controlProps {
  videoRef: React.MutableRefObject<HTMLVideoElement | null>;
  hlsRef: React.MutableRefObject<Hls | null>;
  contRef: React.MutableRefObject<HTMLDivElement | null>;
  isPaused: boolean;
  volume: number;
  show: boolean;
  isFullScreen: boolean;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  setIsFullScreen: React.Dispatch<React.SetStateAction<boolean>>;
  showControlsFor: (time: number) => void;
  showVisualHelper: (helperEvent: visualHelperEventType) => void;
}

const Controls = ({
  videoRef,
  hlsRef,
  contRef,
  isPaused,
  volume,
  isFullScreen,
  show,
  setIsPaused,
  setVolume,
  showControlsFor,
  showVisualHelper,
}: controlProps): JSX.Element => {
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [currVideoTime, setCurrVideoTime] = useState<number>(0);
  const [loadedDuration, setLoadedDuration] = useState<number>(0);
  const [isMute, setIsMute] = useState<boolean>(false);

  /**
   * This toggles play/pause for the video
   */
  const togglePlayPause: () => void = () => {
    console.log("play/pause triggered");
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        showVisualHelper("play");
        console.log("playing");
        setIsPaused(false);
        video.play();
      } else {
        showVisualHelper("pause");
        console.log("paused");
        setIsPaused(true);
        video.pause();
      }
    }
  };

  /**
   * To mute and un-mute the video
   */
  const toggleMuteUnmute: () => void = () => {
    const video = videoRef.current;
    if (video) {
      if (video.muted) {
        video.muted = false;
        setIsMute(false);
        video.volume = volume / 100;
        showVisualHelper("volume");
      } else {
        video.muted = true;
        setIsMute(true);
        showVisualHelper("mute");
      }
    }
  };

  /**
   * This update the volume to the new number
   * @param vol volume to set
   */
  const updateVolume: (vol: number) => void = (vol: number) => {
    const video = videoRef.current;
    if (video) {
      console.log("input: " + vol);
      setVolume(vol);
      if (vol > video.volume * 100) showVisualHelper("volume-high");
      else if (vol === 0) showVisualHelper("mute");
      else showVisualHelper("volume-low");
      video.volume = vol / 100;
    }
  };

  /**
   * This toggles the video expand/collapse.
   */
  const toggleExpandCollapseVideo: () => void = () => {
    const container = contRef.current;
    console.log("expand/collapse ran");
    if (container) {
      if (document.fullscreenElement) document.exitFullscreen();
      else container.requestFullscreen();
    }
  };

  /**
   * seek the video to percent (this is only used for seeking with the scrubber)
   * @param toPercent percent to which the video to be seeked
   */
  const seekVideoTo = (toPercent: number): void => {
    const video = videoRef.current;
    if (video) {
      const time = toPercent * videoDuration;
      video.currentTime = time;
      setCurrVideoTime(time);
      video.volume = 0.7;
    }
    // showControlsFor(2);
  };

  const formatTime = (time: number): string => {
    const floor = Math.floor;

    let hrs: number = 0;
    let min: number = floor(time / 60);
    let sec: number = floor(time % 60);

    // if video is longer than 59 mins
    if (min > 59) {
      hrs = floor(min / 60);
      min = min % 60;
    }

    return `${hrs > 0 ? hrs + ":" : ""}${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  const Time = ({
    time,
    id,
    className,
  }: {
    time: number;
    id?: string;
    className?: string;
  }): JSX.Element => (
    <div id={`${id}`} className={`${LStyles.time} ${className}`}>
      {formatTime(Math.round(time))}
    </div>
  );

  /**
   * set custom keybindings and mouse interaction events for better user-experience.
   */
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      setVideoDuration(video.duration);
      if (video.muted) setIsMute(true);

      const onFragLoad = (event: Events.FRAG_LOADED, data: FragLoadedData) => {
        setLoadedDuration(data.frag.start + data.frag.duration);
      };

      // mouse event listeners
      const clickListener = () => {
        togglePlayPause();
        showControlsFor(2);
      };
      const mouseLeaveListener = () => showControlsFor(2);
      const mouseMoveListener = mouseLeaveListener;
      // mouse events
      video.addEventListener("mouseleave", mouseLeaveListener);
      video.addEventListener("mousemove", mouseMoveListener);
      video.addEventListener("click", clickListener);

      const keypressListener: (e: KeyboardEvent) => void = (e) => {
        if (e.key === "f") {
          toggleExpandCollapseVideo();
        } else if ([" ", "k"].includes(e.key)) {
          togglePlayPause();
        } else if (e.key === "l") {
          video.currentTime += 10;
        } else if (e.key === "j") {
          video.currentTime -= 11;
        } else if (e.key === "m") {
          toggleMuteUnmute();
        } else if (e.key === "Escape") {
          // FIXED: This is showing some big time error, please fix ASAP
          e.preventDefault();
          if (isFullScreen) toggleExpandCollapseVideo();
        } else if (e.key >= "0" && e.key <= "9") {
          // FIXED: With `ctrl or `alt do not do this
          if (e.altKey || e.ctrlKey || e.metaKey) return;
          video.currentTime = (parseInt(e.key) * videoDuration) / 10;
        }
        // after each of this operation or the keystroke, show the controls for 2 seconds
        showControlsFor(2);
        setCurrVideoTime(video.currentTime);
      };
      document.addEventListener("keypress", keypressListener);

      // The keypress listeners are different from the keydown listeners.
      const keydownListener: (e: KeyboardEvent) => void = (
        e: KeyboardEvent
      ) => {
        if (e.key === "ArrowUp") {
          if (volume < 95) updateVolume(volume + 5);
          else updateVolume(100);
        } else if (e.key === "ArrowDown") {
          if (volume > 5) updateVolume(volume - 5);
          else updateVolume(0);
        } else if (e.key === "ArrowRight") {
          video.currentTime += 5;
        } else if (e.key === "ArrowLeft") {
          video.currentTime -= 5;
        }
        setCurrVideoTime(video.currentTime);
      };
      document.addEventListener("keydown", keydownListener);

      const hls = hlsRef.current;
      if (hls) {
        hls.on(Hls.Events.FRAG_LOADED, onFragLoad);
      }

      return () => {
        document.removeEventListener("keypress", keypressListener);
        document.removeEventListener("keydown", keydownListener);
        video.removeEventListener("click", clickListener);
        video.removeEventListener("mouseleave", mouseLeaveListener);
        video.removeEventListener("mousemove", mouseMoveListener);

        if (hls) {
          hls.off(Hls.Events.FRAG_LOADED, onFragLoad);
        }
      };
    }
  }, [videoRef, setIsPaused, toggleExpandCollapseVideo]);

  useEffect(() => {
    if (isPaused) return;

    /**
     * This changes the video time for display for every 100ms (0.1s)
     */
    const updateCurrentTime = () => {
      const currentTime = videoRef.current?.currentTime;
      if (videoDuration != null && currentTime != null) {
        setCurrVideoTime(currentTime);
        if (currentTime === videoDuration) {
          // on end of the video
          setIsPaused(true);
        }
      }
    };

    const intervalId = setInterval(updateCurrentTime, 100);

    return () => {
      clearInterval(intervalId);
    };
  }, [currVideoTime, videoDuration, isPaused, videoRef, setIsPaused]);

  return (
    <div
      className={`${LStyles.videoControlsContainer} ${show ? "" : LStyles.hidden}`}>
      {/* // <div className={`${LStyles.videoControlsContainer} ${}`}> */}
      <div className={LStyles.controls}>
        <PlayPauseBtn paused={isPaused} onPlayPause={togglePlayPause} />
        <VolumeControls
          isMute={isMute}
          volumePercent={volume}
          onMuteUnmute={toggleMuteUnmute}
          updateVolume={updateVolume}
        />
        <Time id={LStyles.startTime} time={currVideoTime} />
        <Timeline
          progressPercent={(currVideoTime / videoDuration) * 100}
          loadedPercent={(loadedDuration / videoDuration) * 100}
          seekVideo={seekVideoTo}
        />
        <Time id={LStyles.endTime} time={videoDuration - currVideoTime} />
        <FullScreenBtn
          isFullScreen={isFullScreen}
          onExpandCollapse={toggleExpandCollapseVideo}
        />
      </div>
    </div>
  );
};

export default Controls;
