import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import * as CANNON from 'cannon-es'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'
import cannonDebugger from 'cannon-es-debugger'
import { ObjectLoader } from 'three'

//link to DOM Element
const canvas = document.querySelector('.webgl')

//create scene
const scene = new THREE.Scene()

//dat.gui
const gui = new dat.GUI({width:300})

// //fog
// const fog = new THREE.Fog(0x400880, 60, 80)
// scene.fog = fog

//Physics World
const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true

cannonDebugger(scene, world.bodies, {
    color: 0xffffff,
    autoUpdate: true
})

const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,
        restitution: 0.8
    }
)
world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial

//instantiate raycaster
const raycaster = new THREE.Raycaster()
let currentIntersect = null

//font loader
const fontLoader = new THREE.FontLoader()
fontLoader.load(
    'fonts/Artista 2.0/Arista 2.0_Regular.typeface.json',
    (font) => {
        console.log('loaded')
        const textGeometry = new THREE.TextGeometry(
            'TIC TAC TOE', {
                font: font,
                size: 7,
                height: 2,
                curveSegments: 24,
                bevelEnabled: true,
                bevelThickness: 0.05,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 12
            }
        )
        textGeometry.computeBoundingBox()
        textGeometry.center()
        const textMaterial = new THREE.MeshStandardMaterial()
        const text = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(text)
        textMaterial.color = new THREE.Color(0xffcc00)
        text.position.set(0, 0, -25)
        text.rotation.z = Math.PI * 0.1
    }
)

//Cannon.js plane
const planeShape = new CANNON.Plane()
const planeBody = new CANNON.Body({
    mass: 0,
    shape: planeShape,
    material: defaultMaterial
})
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
world.addBody(planeBody)

//Three.js plane
const planeGeometry = new THREE.PlaneBufferGeometry(50, 50)
const planeMaterial = new THREE.MeshStandardMaterial()
const planeFloor = new THREE.Mesh(planeGeometry, planeMaterial)
const planeRoof = new THREE.Mesh(planeGeometry, planeMaterial)
const planeRightWall = new THREE.Mesh(planeGeometry, planeMaterial)
const planeLeftWall = new THREE.Mesh(planeGeometry, planeMaterial)
const planeBackWall = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(planeFloor, planeRoof, planeRightWall, planeLeftWall, planeBackWall)

planeFloor.rotation.x = -Math.PI * 0.5
planeFloor.position.set(0, -25, 0)
planeFloor.receiveShadow = true

planeRoof.rotation.x = Math.PI * 0.5
planeRoof.position.set(0, 25, 0)

planeRightWall.rotation.y = -Math.PI * 0.5
planeRightWall.position.set(25, 0, 0)

planeLeftWall.rotation.y = Math.PI * 0.5
planeLeftWall.position.set(-25, 0, 0)

planeBackWall.rotation.z = -Math.PI * 0.5
planeBackWall.position.set(0, 0, -25)

const planeFrontWallBox = new THREE.Mesh(
    new THREE.BoxGeometry(50, 50, 1),
    new THREE.MeshStandardMaterial()
)
scene.add(planeFrontWallBox)
planeFrontWallBox.position.set(0, 0, 25)


//test Boxes
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshStandardMaterial({
    wireframe: true,
    color: 0xff0000
})
const boxTopLeft = new THREE.Mesh(boxGeometry, boxMaterial)
const boxTopMid = new THREE.Mesh(boxGeometry, boxMaterial)
const boxTopRight = new THREE.Mesh(boxGeometry, boxMaterial)
const boxMidLeft = new THREE.Mesh(boxGeometry, boxMaterial)
const boxMidMid = new THREE.Mesh(boxGeometry, boxMaterial)
const boxMidRight = new THREE.Mesh(boxGeometry, boxMaterial)
const boxBottomLeft = new THREE.Mesh(boxGeometry, boxMaterial)
const boxBottomMid = new THREE.Mesh(boxGeometry, boxMaterial)
const boxBottomRight = new THREE.Mesh(boxGeometry, boxMaterial)
scene.add(boxTopLeft, boxTopMid, boxTopRight, boxMidLeft, boxMidMid, boxMidRight, boxBottomLeft, boxBottomMid, boxBottomRight)
gui.add(boxMaterial, 'visible')
//create camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 200)
camera.position.set(0, 0, 10)
scene.add(camera)

//add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name('Ambient Light Intensity')

const pointLightBack = new THREE.PointLight(0xffffff, 0.2, 100, 0.1)
const pointLightLeft = new THREE.PointLight(0xffffff, 0.2, 100, 0.1)
const pointLightRight = new THREE.PointLight(0xffffff, 0.2, 100, 0.1)
pointLightBack.position.set(0, 20, 0)
pointLightLeft.position.set(-20, 10, 0)
pointLightRight.position.set(20, 10, 0)
scene.add(pointLightBack, pointLightLeft, pointLightRight)
const pointLightHelperBack = new THREE.PointLightHelper(pointLightBack, 1, 0x00ff00)
const pointLightHelperLeft = new THREE.PointLightHelper(pointLightLeft, 1, 0x00ff00)
const pointLightHelperRight = new THREE.PointLightHelper(pointLightRight, 1, 0x00ff00)
scene.add(pointLightHelperBack, pointLightHelperLeft, pointLightHelperRight)

//controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//renderer
const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

//mouse
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / window.innerWidth * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    //console.log(mouse)
})

//add event listener for mouse
window.addEventListener('click', () => {
    if(currentIntersect){
        //console.log('click')
         switch(currentIntersect.object)
        {
            case boxTopLeft:
                console.log('click on object TL')
                break

            case boxTopMid:
                console.log('click on object TM')
                break

            case boxTopRight:
                console.log('click on object TR')
                break

            case boxMidLeft:
                console.log('click on object ML')
                break

            case boxMidMid:
                console.log('click on object MM')
                break

            case boxMidRight:
                console.log('click on object MR')
                break
            
            case boxBottomLeft:
                console.log('click on object BL')
                break

            case boxBottomMid:
                console.log('click on object BM')
                break

            case boxBottomRight:
                console.log('click on object BR')
                break
            
        }
    }
})

//event listener for resize of window
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
})

//Clock
const clock = new THREE.Clock()
let oldElapsedTime = 0

//updater function
const updater = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    world.step(1/60, deltaTime, 3)

    //raycaster
    raycaster.setFromCamera(mouse, camera)
    let objectsToTest = [boxTopLeft, boxTopMid, boxTopRight, boxMidLeft, boxMidMid, boxMidRight, boxBottomLeft, boxBottomMid, boxBottomRight]
    const intersects = raycaster.intersectObjects(objectsToTest)
    if(intersects.length)
    {
        if(!currentIntersect)
        {
            //console.log('mouse enter')
        }

        currentIntersect = intersects[0]
    }
    else
    {
        if(currentIntersect)
        {
            //console.log('mouse leave')
            
        }
        
        currentIntersect = null
    }
    

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(updater)
}

updater()
