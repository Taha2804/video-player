"use client";

import React, { useState, useEffect, useRef } from "react";
import Hls from "hls.js";

import Controls from "../Controls";
import VisualHelpers from "../VisualHelper";
import { visualHelperEventType } from "../../../interface/VisualHelper";

import styles from "../video.module.css";
import helperStyles from "../VisualHelper/styles.module.css";

const VideoPlayer = () => {
  const videoURI = process.env.NEXT_PUBLIC_STREAM_API_ENDPOINT as string;

  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(70);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(false);

  // VisualHelpers states
  const [visualHelperEvent, setVisualHelperEvent] =
    useState<visualHelperEventType>("play");
  const [helperClass, setHelperClass] = useState("");

  // refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const contRef = useRef<HTMLDivElement | null>(null);
  const showControlsRef = useRef<NodeJS.Timeout>();
  const showVisualHelpersRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const video = videoRef.current;
    if (video && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoURI);
      hls.attachMedia(video);
      hlsRef.current = hls;
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });

      return () => {
        hls.destroy();
      };
    } else if (video && video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoURI;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });
    }
  }, [videoURI]);

  /**
   * This will show the visual helper for some time.
   *
   * Only volume controls and play/pause are represented with this
   * visual helpers.
   * @param helperEvent The corresponding event to show in Visual Helper
   */
  const showVisualHelper: (helperEvent: visualHelperEventType) => void = (
    helperEvent: visualHelperEventType
  ) => {
    console.log("calling", helperEvent);
    setVisualHelperEvent(helperEvent);
    setHelperClass(helperStyles.show);
    clearTimeout(showVisualHelpersRef.current);
    showVisualHelpersRef.current = setTimeout(() => {
      setHelperClass(helperStyles.hide);
    }, 10);
  };

  /**
   * To show controls for n seconds
   * @param n seconds
   * @param callback Callback to run after showing controls for n seconds
   */
  const showControlsFor = (n: number, callback?: () => void): void => {
    setShowControls(true);
    clearTimeout(showControlsRef.current);
    showControlsRef.current = setTimeout(() => {
      setShowControls(false);
      if (callback) callback();
    }, n * 1000);
  };

  return (
    <div
      className={`${styles.videoContainer} ${
        isFullScreen ? styles.fullScreenVideo : ""
      } ${!isPaused && !showControls ? styles.hidden : ""}`} // for making the cursor disapper
      ref={contRef}>
      <video className={styles.video} controls autoPlay src="/videos/video.mp4" muted>
        {/* <source src="/videos/video.mp4" type="video/mp4" /> */}
        {/* <source src="http://localhost:8000/bird.m3u8" type="application/x-mpegURL"></source> */}
      </video>
      {/* <VisualHelpers
        event={visualHelperEvent}
        helperClass={helperClass}
        volumeLabel={volume}
      />
      <Controls
        videoRef={videoRef}
        hlsRef={hlsRef}
        contRef={contRef}
        isPaused={isPaused}
        volume={volume}
        isFullScreen={isFullScreen}
        show={isPaused || showControls}
        setIsPaused={setIsPaused}
        setVolume={setVolume}
        setIsFullScreen={setIsFullScreen}
        showControlsFor={showControlsFor}
        showVisualHelper={showVisualHelper}
      /> */}
    </div>
  );
};

export default VideoPlayer;
