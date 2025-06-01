import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { useRef } from 'react'
import coffeeSmokeVertexShader from '../shaders/coffeeSmoke/vertex.glsl'
import coffeeSmokeFragmentShader from '../shaders/coffeeSmoke/fragment.glsl'

export default function CoffeeSmoke() {
  const meshRef = useRef()
  const perlinTexture = useLoader(THREE.TextureLoader, './textures/perlin/perlin.png')
  perlinTexture.wrapS = perlinTexture.wrapT = THREE.RepeatWrapping

  const materialRef = useRef()
  const uniformsRef = useRef({
    uTime: { value: 0 },
    uPerlinTexture: { value: perlinTexture }
  })

  useFrame(({ clock }) => {
    if (materialRef.current) {
      uniformsRef.current.uTime.value = clock.getElapsedTime()
    }
  })

  return (
    <mesh 
      ref={meshRef} 
      position={[-2.06, 3.42, 1.33]}
    >
      <planeGeometry 
        args={[1, 1, 16, 64]} 
        onUpdate={(geometry) => {
          geometry.translate(0, 0.5, 0)
          geometry.scale(0.49, 0.9, 0.49)
        }}
      />
      <shaderMaterial
        ref={materialRef}
        vertexShader={coffeeSmokeVertexShader}
        fragmentShader={coffeeSmokeFragmentShader}
        uniforms={uniformsRef.current}
        side={THREE.DoubleSide}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}