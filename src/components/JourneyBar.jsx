import "../styles/journeybar.css";

import { FaHome, FaCampground } from "react-icons/fa";
import { FaCaravan } from "react-icons/fa6";
import { useGroup } from "../auth/GroupProvider";
import { getCampingStyle } from "../campingStyles";
function JourneyBar({ progress }) {
  const { campingStyle } = useGroup();
  const style = getCampingStyle(campingStyle);
  const journeyIcon = campingStyle === "Caravan" ? <FaCaravan /> : style.icons.departure;
  return (
    <div className="journey-wrapper">
      <FaHome className="journey-home" />

      <div className="journey-road">
        <div
  className="journey-caravan"
 style={{
  left: `${progress}%`,
}}
>
  <span role="img" aria-label={style.label}>{journeyIcon}</span>
</div>
      </div>

      <FaCampground className="journey-camp" />
    </div>
  );
}

export default JourneyBar;
