import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders & Textures
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

// Environment map
const environmentMap = new THREE.CubeTextureLoader()
  .setPath("textures/skybox/")
  .load(["px.webp", "nx.webp", "py.webp", "ny.webp", "pz.webp", "nz.webp"]);

const textureMap = {
    First: {
        day: '/textures/room/first_texture_set_day.webp',
        night: '/textures/room/first_texture_set_night.webp',
        nightLight: '/textures/room/first_texture_set_night_light.webp'
    },
    Second: {
        day: '/textures/room/second_texture_set_day.webp',
        night: '/textures/room/second_texture_set_night.webp',
        nightLight: '/textures/room/second_texture_set_night_light.webp'
    }
}

const loadedTextures = {
    day: {},
    night: {},
    nightLight: {}
}

Object.entries(textureMap).forEach(([key, value]) => {
    const dayTexture = textureLoader.load(value.day, (texture) => {
        texture.flipY = false
        texture.colorSpace = THREE.SRGBColorSpace
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
    })
    loadedTextures.day[key] = dayTexture

    const nightTexture = textureLoader.load(value.night, (texture) => {
        texture.flipY = false
        texture.colorSpace = THREE.SRGBColorSpace
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
    })
    loadedTextures.night[key] = nightTexture

    const nightLightTexture = textureLoader.load(value.nightLight, (texture) => {
        texture.flipY = false
        texture.colorSpace = THREE.SRGBColorSpace
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
    })
    loadedTextures.nightLight[key] = nightLightTexture
})

/**
 * Reuseable Materials
 */
const glassMaterial = new THREE.MeshPhysicalMaterial({
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


/**
 * Load Models
 */
let chairTop;
const yAxisFans = [];

gltfLoader.load('/models/filbert_room_folio.glb', (glb) => {
    glb.scene.traverse((child) => {
        if (child.isMesh) {
            if (child.name.includes("Glass")) {
                child.material = glassMaterial;
            } 

            else {
                Object.keys(textureMap).forEach((key) => {
                    if (child.name.includes(key)) {
                        const material = new THREE.MeshBasicMaterial({
                            map: loadedTextures.nightLight[key],
                        })
    
                        child.material = material

                        if (child.name.includes("Chair_Top")) {
                            chairTop = child;
                            child.userData.initialRotation = new THREE.Euler().copy(child.rotation);
                        }
                        
                        if (child.name.includes("Fan")) {
                            yAxisFans.push(child)
                        }
                    }
                })
            }
        }

        scene.add(glb.scene)
    })
})

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.set(13.750061613249478, 12.108307047343999, 13.823624319788875)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.target.set(-0.7441870552433264, 3.051084299332125, -1.9247339317163805)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const tick = (timestamp) =>
{
    // Update controls
    controls.update()

    // Animations
    yAxisFans.forEach((fan) => {
        fan.rotation.y -= 0.02;
    });

    if (chairTop) {
        const time = timestamp * 0.001;
        const baseAmplitude = Math.PI / 4;

        const rotationOffset = baseAmplitude * 
                                Math.sin(time * 0.45) * 
                                (1 - Math.abs(Math.sin(time * 0.45)) * 0.3);

        chairTop.rotation.y = chairTop.userData.initialRotation.y - rotationOffset;
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()