import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useEffect, useMemo, useState } from "react";
import gsap from "gsap";

import vertexShader from "../shaders/theme/vertex.glsl";
import fragmentShader from "../shaders/theme/fragment.glsl";
import { useFrame } from "@react-three/fiber";

const textureMap = {
  First: {
    day: "/textures/room/first_texture_set_day.webp",
    night: "/textures/room/first_texture_set_night.webp",
    nightLight: "/textures/room/first_texture_set_night_light.webp",
  },
  Second: {
    day: "/textures/room/second_texture_set_day.webp",
    night: "/textures/room/second_texture_set_night.webp",
    nightLight: "/textures/room/second_texture_set_night_light.webp",
  },
};

const useRoomTextures = () => {
  const day = {};
  const night = {};
  const nightLight = {};

  Object.entries(textureMap).forEach(([key, paths]) => {
    day[key] = useTexture(paths.day);
    day[key].flipY = false;
    day[key].colorSpace = THREE.SRGBColorSpace
    day[key].minFilter = THREE.LinearFilter
    day[key].magFilter = THREE.LinearFilter

    night[key] = useTexture(paths.night);
    night[key].flipY = false;
    night[key].colorSpace = THREE.SRGBColorSpace
    night[key].minFilter = THREE.LinearFilter
    night[key].magFilter = THREE.LinearFilter

    nightLight[key] = useTexture(paths.nightLight);
    nightLight[key].flipY = false;
    nightLight[key].colorSpace = THREE.SRGBColorSpace
    nightLight[key].minFilter = THREE.LinearFilter
    nightLight[key].magFilter = THREE.LinearFilter
  });

  return { day, night, nightLight };
};

export default function Room ({ isNight }) {
  const groupRef = useRef();
  const { scene } = useGLTF("/models/filbert_room_folio.glb");
  const { day, night, nightLight } = useRoomTextures();

  const chairTopRef = useRef(null);
  const fansRef = useRef([]);

  const [roomMaterials, setRoomMaterials] = useState({});

  const environmentMap = new THREE.CubeTextureLoader()
    .setPath("textures/skybox/")
    .load(["px.webp", "nx.webp", "py.webp", "ny.webp", "pz.webp", "nz.webp"]);

  useEffect(() => {
    const createMaterialForTextureSet = (textureSet) => {
      const material = new THREE.ShaderMaterial({
          uniforms: {
            uDayTexture1: { value: day.First },
            uNightTexture1: { value: night.First },
            uNightLightTexture1: { value: nightLight.First },
            uDayTexture2: { value: day.Second },
            uNightTexture2: { value: night.Second },
            uNightLightTexture2: { value: nightLight.Second },
            uMixRatioTheme: { value: 0 },
            uMixRatioLight: { value: 0 },
            uTextureSet: { value: textureSet },
          },
          vertexShader: vertexShader,
          fragmentShader: fragmentShader,
        });
      
        Object.entries(material.uniforms).forEach(([key, uniform]) => {
          if (uniform.value instanceof THREE.Texture) {
            uniform.value.minFilter = THREE.LinearFilter;
            uniform.value.magFilter = THREE.LinearFilter;
          }
        });
      
        return material;
    };
    
    setRoomMaterials({
        First: createMaterialForTextureSet(1),
        Second: createMaterialForTextureSet(2),
    });
  }, [])
  

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        if (child.name.includes("Glass")) {
          child.material = new THREE.MeshPhysicalMaterial({
            transmission: 1,
            opacity: 1,
            color: 0xfbfbfb,
            metalness: 0,
            roughness: 0,
            ior: 3,
            thickness: 0.01,
            specularIntensity: 1,
            envMap: environmentMap,
            envMapIntensity: 1,
            depthWrite: false,
            specularColor: 0xfbfbfb,
          });
        } else {
          Object.keys(roomMaterials).forEach((key) => {
            if (child.name.includes(key)) {
                child.material = roomMaterials[key];

                if (child.name.includes("Chair_Top")) {
                  chairTopRef.current = child;
                  if (!child.userData.initialRotation) {
                    child.userData.initialRotation = new THREE.Euler().copy(child.rotation);
                  }
                }
                
                if (child.name.includes("Fan")) {
                  fansRef.current.push(child);
                }
            }
          });
        }
      }
    });
  }, [scene, roomMaterials]);

  useEffect(() => {
    Object.values(roomMaterials).forEach((material) => {
      const tl = gsap.timeline();
      if (isNight) {
        tl.to(material.uniforms.uMixRatioTheme, {
          value: 1,
          duration: 1,
          ease: "power2.inOut",
        }).to(material.uniforms.uMixRatioLight, {
          value: 1,
          duration: 0.5,
          ease: "power2.inOut",
        });
      } else {
        tl.to(material.uniforms.uMixRatioLight, {
          value: 0,
          duration: 0.5,
          ease: "power2.inOut",
        }).to(material.uniforms.uMixRatioTheme, {
          value: 0,
          duration: 1,
          ease: "power2.inOut",
        });
      }
    });
  }, [isNight]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const baseAmplitude = Math.PI / 4;

    fansRef.current.forEach((fan) => {
      fan.rotation.y -= 0.02;
    });

    if (chairTopRef.current) {
      const rotationOffset = baseAmplitude * 
                              Math.sin(time * 0.45) * 
                              (1 - Math.abs(Math.sin(time * 0.45)) * 0.3);

      chairTopRef.current.rotation.y = chairTopRef.current.userData.initialRotation.y - rotationOffset;
    }
  })

  return <primitive ref={groupRef} object={scene} />;
};