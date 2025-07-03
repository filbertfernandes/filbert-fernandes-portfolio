import { OrbitControls } from "@react-three/drei";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useMediaQuery } from "react-responsive";

import Room from "./components/Room.jsx";
import { orbitControlsTarget, cameraInitialPosition, orbitControlsTargetScreenFocused, cameraPositionScreenFocused, cameraPositionCertificateFocused, orbitControlsTargetCertificateFocused } from "./data/initial";

export default function Experience({ isNight, isCameraFocused, setIsCameraFocused }) {
  const { camera } = useThree();

  const isMobile = useMediaQuery({ maxWidth: 768 });

  const controlsRef = useRef();

  const handleChairClick = () => {
    if(isCameraFocused) return;

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
          x: isMobile ? cameraPositionScreenFocused.mobile[0] : cameraPositionScreenFocused.desktop[0],
          y: isMobile ? cameraPositionScreenFocused.mobile[1] : cameraPositionScreenFocused.desktop[1],
          z: isMobile ? cameraPositionScreenFocused.mobile[2] : cameraPositionScreenFocused.desktop[2],
          duration: 1,
        },
        "-=1"
    )
    .call(() => {
      setIsCameraFocused(true);
    });
  };

  const handleCertificateClick = () => {
    if(isCameraFocused) return;

    const tl = gsap.timeline({ ease: "power3.inOut" });
    
    tl.to(controlsRef.current.target, 
      {
        x: isMobile ? orbitControlsTargetCertificateFocused.mobile[0] : orbitControlsTargetCertificateFocused.desktop[0],
        y: isMobile ? orbitControlsTargetCertificateFocused.mobile[1] : orbitControlsTargetCertificateFocused.desktop[1],
        z: isMobile ? orbitControlsTargetCertificateFocused.mobile[2] : orbitControlsTargetCertificateFocused.desktop[2],
        duration: 1,
      }
    )
    .to(camera.position, 
        {
          x: isMobile ? cameraPositionCertificateFocused.mobile[0] : cameraPositionCertificateFocused.desktop[0],
          y: isMobile ? cameraPositionCertificateFocused.mobile[1] : cameraPositionCertificateFocused.desktop[1],
          z: isMobile ? cameraPositionCertificateFocused.mobile[2] : cameraPositionCertificateFocused.desktop[2],
          duration: 1,
        },
        "-=1"
    )
    .call(() => {
      setIsCameraFocused(true);
    });
  };

  useEffect(() => {
    const goBack = () => {
      setIsCameraFocused(false);

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
          "-=1.4"
      )
    };

    if(!isCameraFocused) goBack();

    const handleKeyDown = (event) => {
      if(event.code === "Escape") {
        goBack();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCameraFocused]);

  return (
    <>
        <OrbitControls
          ref={controlsRef}
          target={isMobile ? orbitControlsTarget.mobile : orbitControlsTarget.desktop} 
          enableDamping
          enablePan={false}
          enableRotate={!isCameraFocused}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
          minAzimuthAngle={0}
          maxAzimuthAngle={Math.PI / 2}
          maxDistance={50}
          minDistance={1}  
        />
        <Room isNight={isNight} handleChairClick={handleChairClick} handleCertificateClick={handleCertificateClick} isCameraFocused={isCameraFocused} />
    </>
    
  )
}
