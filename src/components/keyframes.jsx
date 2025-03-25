import {keyframes} from "styled-components";

const floatUp = keyframes`
  0% { opacity: 1; transform: translateY(0) scale(1); }
  100% { opacity: 0; transform: translateY(-50px) scale(1.5); }
`;
const crazyShake = keyframes`
  0% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(10deg) scale(1.1); }
  50% { transform: rotate(-10deg) scale(1.2); }
  75% { transform: rotate(10deg) scale(1.1); }
  100% { transform: rotate(0deg) scale(1); }
`;
const shake = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); }
  20% { transform: translate(-5px, 0) rotate(-5deg); }
  40% { transform: translate(5px, 0) rotate(5deg); }
  60% { transform: translate(-5px, 0) rotate(-5deg); }
  80% { transform: translate(5px, 0) rotate(5deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
`;
const flash = keyframes`
  0% { background: rgba(255, 0, 0, 0.8); }
  20% { background: rgba(255, 255, 0, 0.8); }
  40% { background: rgba(0, 255, 255, 0.8); }
  60% { background: rgba(0, 0, 255, 0.8); }
  80% { background: rgba(255, 0, 255, 0.8); }
  100% { background: rgba(255, 0, 0, 0.8); }
`;

export {floatUp, crazyShake, shake, flash};