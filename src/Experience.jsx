import { OrbitControls } from "@react-three/drei";
import Room from "./components/Room";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";

export default function Experience({ isNight }) {
  const { camera } = useThree();

  const [isFocused, setIsFocused] = useState(false);

  const isFocusedRef = useRef(isFocused);
  const controlsRef = useRef();

  const focusOnScreen = () => {
    if(isFocusedRef.current) return;

    const tl = gsap.timeline({ ease: "power3.inOut" });

    tl.to(controlsRef.current.target, 
      {
        x: -1.122124880324737,
        y: 4.9,
        z: -0.20813898690155438,
        duration: 1,
      }
    )
    .to(camera.position, 
        {
          x: 1.1635148041685475,
          y: 5.119653128329419,
          z: -0.15049656637635786,
          duration: 1,
        },
        "-=1"
    )
    .call(() => setIsFocused(true));
  };

  useEffect(() => {
    isFocusedRef.current = isFocused;
  }, [isFocused]);

  useEffect(() => {
    const handleClick = () => {
      if(!isFocusedRef.current) return;

      const tl = gsap.timeline({ ease: "power3.inOut" });

      tl.to(controlsRef.current.target, 
        {
          x: -0.8783316342959402,
          y: 3.5,
          z: -1.7424402227468443,
          duration: 1.4,
        }
      )
      .to(camera.position, 
          {
            x: 13.750061613249478,
            y: 10,
            z: 13.823624319788875,
            duration: 1.4,
          },
          "-=1.5"
      )
      .call(() => setIsFocused(false));
    };

    const handleKeyDown = (event) => {
      if(event.key === "Escape") {
        handleClick();
      }
    }

    window.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
        <OrbitControls
          ref={controlsRef}
          target={[-0.8783316342959402, 3.5, -1.7424402227468443]} 
          enableDamping
          enablePan={false}
          enableRotate={!isFocused}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
          minAzimuthAngle={0}
          maxAzimuthAngle={Math.PI / 2}
          maxDistance={20.9}
          minDistance={1}  
        />
        <Room isNight={isNight} handleChairClick={focusOnScreen} />
    </>
  )
}
