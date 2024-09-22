import FullScreen from "/public/images/full-screen.svg";
import CollapseScreen from "/public/images/collapse-screen.svg";

import globalStyles from "@/components/video/video.module.css";

interface fullScreenProps {
  isFullScreen: boolean;
  onExpandCollapse: () => void;
}
const FullScreenBtn = ({
  isFullScreen,
  onExpandCollapse,
}: fullScreenProps): JSX.Element => {
  return (
    <button
      className={globalStyles.controlBtn}
      id={globalStyles.fullScreen}
      onClick={() => onExpandCollapse()}>
      {isFullScreen ? <CollapseScreen /> : <FullScreen />}
    </button>
  );
};

export default FullScreenBtn;
