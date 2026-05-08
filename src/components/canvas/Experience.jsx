import { CameraControls } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

import Room from "./Room.jsx";

import {
  orbitControlsTarget,
  cameraInitialPosition,
  orbitControlsTargetScreenFocused,
  cameraPositionScreenFocused,
  cameraPositionCertificateFocused,
  orbitControlsTargetCertificateFocused,
} from "../../data/initial";

export default function Experience({
  isNight,
  isCameraFocused,
  setIsCameraFocused,
}) {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const controlsRef = useRef();

  const animateTo = (cameraPos, targetPos) => {
    if (!controlsRef.current) return;

    controlsRef.current.setLookAt(
      cameraPos[0],
      cameraPos[1],
      cameraPos[2],
      targetPos[0],
      targetPos[1],
      targetPos[2],
      true
    );
  };

  const handleChairClick = () => {
    if (isCameraFocused) return;

    const cameraPos = isMobile
      ? cameraPositionScreenFocused.mobile
      : cameraPositionScreenFocused.desktop;

    const targetPos = isMobile
      ? orbitControlsTargetScreenFocused.mobile
      : orbitControlsTargetScreenFocused.desktop;

    animateTo(cameraPos, targetPos);
    setIsCameraFocused(true);
  };

  const handleCertificateClick = () => {
    if (isCameraFocused) return;

    const cameraPos = isMobile
      ? cameraPositionCertificateFocused.mobile
      : cameraPositionCertificateFocused.desktop;

    const targetPos = isMobile
      ? orbitControlsTargetCertificateFocused.mobile
      : orbitControlsTargetCertificateFocused.desktop;

    animateTo(cameraPos, targetPos);
    setIsCameraFocused(true);
  };

  useEffect(() => {
    if (!isCameraFocused) {
      const cameraPos = isMobile
        ? cameraInitialPosition.mobile
        : cameraInitialPosition.desktop;

      const targetPos = isMobile
        ? orbitControlsTarget.mobile
        : orbitControlsTarget.desktop;

      animateTo(cameraPos, targetPos);
    }
  }, [isCameraFocused]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Escape") setIsCameraFocused(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <CameraControls
        ref={controlsRef}
        smoothTime={0.5}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        minAzimuthAngle={0}
        maxAzimuthAngle={Math.PI / 2}
        maxDistance={50}
        minDistance={1}
        polarRotateSpeed={isCameraFocused ? 0 : 1}
        azimuthRotateSpeed={isCameraFocused ? 0 : 1}
      />

      <Room
        isNight={isNight}
        handleChairClick={handleChairClick}
        handleCertificateClick={handleCertificateClick}
        isCameraFocused={isCameraFocused}
      />
    </>
  );
}
