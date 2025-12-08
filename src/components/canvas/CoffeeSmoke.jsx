import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader, RepeatWrapping, DoubleSide } from "three";
import { useRef } from "react";
import coffeeSmokeVertexShader from "./shaders/coffeeSmoke/vertex.glsl";
import coffeeSmokeFragmentShader from "./shaders/coffeeSmoke/fragment.glsl";

export default function CoffeeSmoke() {
  const meshRef = useRef();
  const perlinTexture = useLoader(
    TextureLoader,
    "./textures/perlin/perlin.png"
  );
  perlinTexture.wrapS = perlinTexture.wrapT = RepeatWrapping;

  const materialRef = useRef();
  const uniformsRef = useRef({
    uTime: { value: 0 },
    uPerlinTexture: { value: perlinTexture },
  });

  useFrame(({ clock }) => {
    if (materialRef.current) {
      uniformsRef.current.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} position={[-2.06, 3.42, 1.33]}>
      <planeGeometry
        args={[1, 1, 16, 64]}
        onUpdate={(geometry) => {
          geometry.translate(0, 0.5, 0);
          geometry.scale(0.49, 0.9, 0.49);
        }}
      />
      <shaderMaterial
        ref={materialRef}
        vertexShader={coffeeSmokeVertexShader}
        fragmentShader={coffeeSmokeFragmentShader}
        uniforms={uniformsRef.current}
        side={DoubleSide}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

useLoader.preload(TextureLoader, "./textures/perlin/perlin.png");
