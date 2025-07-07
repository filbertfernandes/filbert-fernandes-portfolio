import { CanvasWrapper } from '@isaac_ua/drei-html-fix'
import { Suspense, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { useMediaQuery } from "react-responsive";
import { Loader } from "@react-three/drei";

import Experience from "./Experience.jsx";
import { cameraInitialPosition } from "./data/initial.js";

const App = () => {
  const [isNight, setIsNight] = useState(false);
  const [isCameraFocused, setIsCameraFocused] = useState(false);

  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className="relative w-screen h-screen">
      {/* Go back button */}
      <button
        onClick={() => setIsCameraFocused(false)}
        className={`z-10 absolute top-6 left-6 px-4 h-10 cursor-pointer text-white
          flex items-center gap-2 rounded-full transition-all duration-500 ease-in-out
          ${isNight 
            ? "bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 shadow-[0_4px_12px_rgba(100,100,100,0.4)] hover:shadow-[0_6px_18px_rgba(80,80,80,0.6)]" 
            : "bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 shadow-[0_4px_12px_rgba(202,138,4,0.6)] hover:shadow-[0_6px_18px_rgba(202,138,4,0.8)]"
          }
          hover:scale-105 hover:brightness-110
          focus:outline-none active:outline-none active:ring-0
          ${isCameraFocused ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
      >
        <IoArrowBack className="w-5 h-5 text-white" />
        <span className="font-bold">Go back</span>
      </button>

      {/* Toggle switch */}
      <button
        onClick={(event) => {
          event.stopPropagation()
          setIsNight((prev) => !prev)
        }}
        aria-label="Toggle day/night theme"
        className={`z-10 absolute top-6 right-6 w-20 h-10 px-2 cursor-pointer rounded-full transition-all duration-500 ease-in-out
          ${isNight
            ? "bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 shadow-[0_4px_12px_rgba(100,100,100,0.4)] hover:shadow-[0_6px_18px_rgba(80,80,80,0.6)] hover:brightness-110"
            : "bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 shadow-[0_4px_12px_rgba(202,138,4,0.6)] hover:shadow-[0_6px_18px_rgba(202,138,4,0.8)] hover:brightness-110"
          }
          focus:outline-none active:outline-none active:ring-0
          hover:scale-105
        `}
      >
        <span
          className={`w-8 h-8 rounded-full bg-white flex items-center justify-center
            shadow-inner shadow-gray-300 transform transition-transform duration-400 ease-in-out
            ${isNight ? "translate-x-8" : "translate-x-0"}
          `}
        >
          {isNight ? (
            <FaMoon className="text-yellow-300 w-5 h-5 drop-shadow-md transition duration-300" />
          ) : (
            <FaSun className="text-yellow-500 w-5 h-5 drop-shadow-md transition duration-300" />
          )}
        </span>
      </button>

      {/* Canvas */}
      <CanvasWrapper
        canvasProps={
          {
            camera: {
              fov: 45,
              near: 0.1,
              far: 150,
              position: isMobile ? cameraInitialPosition.mobile : cameraInitialPosition.desktop,
            }
          }
        }
      >
        <Suspense fallback={null}>
          <Experience isNight={isNight} isCameraFocused={isCameraFocused} setIsCameraFocused={setIsCameraFocused} isMobile={isMobile} />
        </Suspense>
      </CanvasWrapper>
      <Loader 
        containerStyles={{
          backgroundColor: 'oklch(0.44 0.02 229.29)',
          margin: '0 auto',
        }}
        innerStyles={{
          backgroundColor: 'oklch(0.49 0.02 219.83)',
          width: '20rem',
          height: '1rem',
          borderRadius: '0.5rem'
        }}
        barStyles={{
          backgroundColor: '#ffffff',
          width: '20rem',
          height: '1rem',
          borderRadius: '0.5rem'
        }}
        dataStyles={{
          color: '#ffffff',
          fontSize: '1rem',
          fontWeight: 'bold',
          fontFamily: 'system-ui',
          textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          marginTop: '1rem',
        }}
        dataInterpolation={(p) => `Loading ${Math.round(p)}%`}
      />
    </div>
  );
};

export default App;
