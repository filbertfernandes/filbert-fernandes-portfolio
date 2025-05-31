import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import { useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const App = () => {
  const [isNight, setIsNight] = useState(false);

  return (
    <div className="relative w-screen h-screen">
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
            : "bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 shadow-[0_4px_12px_rgba(202,138,4,0.6)] hover:shadow-[0_6px_18px_rgba(202,138,4,0.8)] hover:brightness-110"
          }
          focus:outline-none active:outline-none active:ring-0
          hover:scale-105
        `}
      >
        {/* Slider circle */}
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
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 100,
          position: [13.750061613249478, 10, 13.823624319788875],
        }}
      >
        <Experience isNight={isNight} />
      </Canvas>
    </div>
  );
};

export default App;
