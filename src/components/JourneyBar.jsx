import { FaHome, FaCampground } from "react-icons/fa";
import { FaCaravan } from "react-icons/fa6";
function JourneyBar({ progress }) {
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
  <FaCaravan />
</div>
      </div>

      <FaCampground className="journey-camp" />
    </div>
  );
}

export default JourneyBar;