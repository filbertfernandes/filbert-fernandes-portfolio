import { OrbitControls } from "@react-three/drei";
import Room from "./components/Room";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useMediaQuery } from "react-responsive";

import { orbitControlsTarget, cameraInitialPosition, orbitControlsTargetScreenFocused, cameraScreenFocusedPosition } from "./data/initial";

export default function Experience({ isNight, isScreenFocused, setIsScreenFocused }) {
  const { camera } = useThree();

  const isMobile = useMediaQuery({ maxWidth: 768 });

  const controlsRef = useRef();

  const handleChairClick = () => {
    if(isScreenFocused) return;

    const tl = gsap.timeline({ ease: "power3.inOut" });
    
    tl.to(controlsRef.current.target, 
      {
        x: isMobile ? orbitControlsTargetScreenFocused.mobile[0] : orbitControlsTargetScreenFocused.desktop[0],
        y: isMobile ? orbitControlsTargetScreenFocused.mobile[1] : orbitControlsTargetScreenFocused.desktop[1],
        z: isMobile ? orbitControlsTargetScreenFocused.mobile[2] : orbitControlsTargetScreenFocused.desktop[2],
        duration: 1,
      }
    )
    .to(camera.position, 
        {
          x: isMobile ? cameraScreenFocusedPosition.mobile[0] : cameraScreenFocusedPosition.desktop[0],
          y: isMobile ? cameraScreenFocusedPosition.mobile[1] : cameraScreenFocusedPosition.desktop[1],
          z: isMobile ? cameraScreenFocusedPosition.mobile[2] : cameraScreenFocusedPosition.desktop[2],
          duration: 1,
        },
        "-=1"
    )
    .call(() => {
      setIsScreenFocused(true);
      setIsFocused(true);
    });
  };

  useEffect(() => {
    const goBack = () => {
      setIsScreenFocused(false);

      const tl = gsap.timeline({ ease: "power3.inOut" });

      tl.to(controlsRef.current.target, 
        {
          x: isMobile ? orbitControlsTarget.mobile[0] : orbitControlsTarget.desktop[0],
          y: isMobile ? orbitControlsTarget.mobile[1] : orbitControlsTarget.desktop[1],
          z: isMobile ? orbitControlsTarget.mobile[2] : orbitControlsTarget.desktop[2],
          duration: 1.4,
        }
      )
      .to(camera.position, 
          {
            x: isMobile ? cameraInitialPosition.mobile[0] : cameraInitialPosition.desktop[0],
            y: isMobile ? cameraInitialPosition.mobile[1] : cameraInitialPosition.desktop[1],
            z: isMobile ? cameraInitialPosition.mobile[2] : cameraInitialPosition.desktop[2],
            duration: 1.4,
          },
          "-=1.5"
      )
    };

    if(!isScreenFocused) goBack();

    const handleKeyDown = (event) => {
      if(event.code === "Escape") {
        goBack();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isScreenFocused]);

  return (
    <>
        <OrbitControls
          ref={controlsRef}
          target={isMobile ? orbitControlsTarget.mobile : orbitControlsTarget.desktop} 
          enableDamping
          enablePan={false}
          enableRotate={!isScreenFocused}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
          minAzimuthAngle={0}
          maxAzimuthAngle={Math.PI / 2}
          maxDistance={isMobile ? 39.5 : 20.9}
          minDistance={1}  
        />
        <Room isNight={isNight} handleChairClick={handleChairClick} />
    </>
    
  )
}
