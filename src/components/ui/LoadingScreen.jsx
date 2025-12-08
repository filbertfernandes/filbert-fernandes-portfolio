import { useProgress } from "@react-three/drei";

const LoadingScreen = () => {
  const { progress, active } = useProgress();

  return (
    <div
      className={`
        fixed inset-0 z-20 grid place-items-center
        transition-opacity duration-700
        ${active ? "opacity-100" : "animate-fadeout"}
        bg-[#8e9ca2]
      `}
    >
      <div className="w-full max-w-sm text-center px-8 space-y-6">
        <div className="text-[15px] tracking-[0.18em] uppercase text-white/90 font-light">
          Please wait
        </div>

        <div className="w-full h-3 bg-white/15 rounded-full overflow-hidden backdrop-blur-[1px]">
          <div
            className="h-full transition-all duration-500 ease-out rounded-full
              bg-gradient-to-r from-[#f3d36b] to-[#d3af3a]"
            style={{ width: progress + "%" }}
          />
        </div>

        <div className="text-xs text-white/80 tracking-wide">
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
