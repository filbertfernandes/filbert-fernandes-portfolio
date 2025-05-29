import { OrbitControls } from "@react-three/drei";
import Room from "./components/Room";

export default function Experience({ isNight }) {
  return (
    <>
        <OrbitControls 
          target={[-0.8783316342959402, 3.5, -1.7424402227468443]} 
          enableDamping
          enablePan={false}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
          minAzimuthAngle={0}
          maxAzimuthAngle={Math.PI / 2}
          maxDistance={20.9} // Limit zoom out
          minDistance={1} // Limit zoom in  
        />
        <Room isNight={isNight} />
    </>
  )
}
