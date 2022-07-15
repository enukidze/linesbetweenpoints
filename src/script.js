import './style.css'
import * as THREE from 'three'
import { gsap } from 'gsap'
import {
    MeshLine,
    MeshLineMaterial
} from 'three.meshline';
// import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import {
    SVGLoader
} from "three/examples/jsm/loaders/SVGLoader";
// f
import {
    Line2,
    LineGeometry,
    LineMaterial
} from 'three-fatline'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import {
    BufferGeometry,
    Camera,
    Group,
    LineSegments,
    Material,
    Mesh,
    MeshBasicMaterial,
    Points,
    Vector3
} from 'three'







/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//loaders
const textureLoader  = new THREE.TextureLoader();


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
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)
const camera = new THREE.PerspectiveCamera(30, sizes.width / sizes.height, 0.1, 15)
camera.position.x = 5
camera.position.y = 4.5
camera.position.z = 11



//** Particles */



const particlesMaterial = new THREE.PointsMaterial({
    size: 0.01,
    sizeAttenuation: true
})

const particlesGeometry = new THREE.BufferGeometry()
// const count = 1000



const xMax = 10,
    yMax = 10,
    zMax = 10;

const count = xMax * yMax * zMax;
const positions = new Float32Array(count * 3)
const pointsArr = [];



for (let x = 0; x < xMax; x++) {
    for (let y = 0; y < yMax; y++) {
        for (let z = 0; z < zMax; z++) {
            pointsArr.push({
                x,
                y,
                z
            })
        }
    }
};





for (let i = 0; i < count * 3; i += 3) {
    const index = Math.floor(i / 3);
    positions[i] = pointsArr[index].x;
    positions[i + 1] = pointsArr[index].y;
    positions[i + 2] = pointsArr[index].z;
}

//** Lines */


const lineMat = new LineMaterial({
    color: 'white',
    linewidth: 1,
    resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
    transparent: true,
    opacity: 0.1

})


for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        for (let h = 0; h < 10; h++) {
            const geometry = new LineGeometry()
            geometry.setPositions([i + 1, h, j, i, h, j])

            if (i > 8) {
                break;
            }

            const line = new Line2(geometry, lineMat)
            line.computeLineDistances()
            cameraGroup.add(line)
        }
    }
}



for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        for (let h = 0; h < 9; h++) {
            const geometry = new LineGeometry()
            geometry.setPositions([i, h + 1, j, i, h, j])

            const line = new Line2(geometry, lineMat)
            line.computeLineDistances()
            cameraGroup.add(line)
        }
    }
}



for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 9; j += 2) {
        for (let h = 0; h < 10; h++) {
            const geometry = new LineGeometry()
            geometry.setPositions([i, h, j + 1, i, h, j])

            const line = new Line2(geometry, lineMat)
            line.computeLineDistances()
            cameraGroup.add(line)
        }
    }
}


console.log(cameraGroup);




//add particles to the scene
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
cameraGroup.add(particles)

scene.add(cameraGroup)

//** Logo */

const blue = textureLoader.load('logo/blue.png')
const logoGeometry = new THREE.PlaneBufferGeometry(2,0.7,2.5)
const logoMaterial = new THREE.MeshBasicMaterial({
    map: blue,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 1
})

const logo = new Mesh(logoGeometry,logoMaterial)
logo.position.set(5,5,7)
console.log(logo.position);
// cameraGroup.add(logo)


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//**Camera Animation */
let mouseX = 0
let mouseY = 0

const target = new THREE.Vector2()
const mouse = new THREE.Vector2()
const windowHalf = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);


document.addEventListener('mousemove', onMouseMove, false);

function onMouseMove(event) {

    mouse.x = (event.clientX - windowHalf.x);
    mouse.y = (event.clientY - windowHalf.x);

}


/**
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0



const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime


    // Render
    renderer.render(scene, camera)
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)


    target.x = (1 - mouse.x) * 0.00009;
    target.y = (1 - mouse.y) * 0.00009;




    cameraGroup.rotation.x += 0.05 * (target.y - cameraGroup.rotation.x);
    cameraGroup.rotation.y += 0.05 * (target.x - cameraGroup.rotation.y);

    //  camera.position.x += 0.1 * ( target.y - camera.rotation.x );
    //   camera.position.y += 0.05 *  ( target.x - camera.rotation.y );

    
    camera.lookAt(5,4.5,7)

}

tick()