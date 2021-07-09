import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import * as CANNON from 'cannon-es'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'

//link to DOM Element
const canvas = document.querySelector('.webgl')

//create scene
const scene = new THREE.Scene()

//dat.gui
const gui = new dat.GUI({width:300})

//fog
const fog = new THREE.Fog(0x400880, 60, 100)
scene.fog = fog

//Physics World
const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true

const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,
        restitution: 0.325
    }
)
world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial

//Cannon.js plane
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body({
    mass: 0,
    shape: floorShape,
    material: defaultMaterial
})
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
world.addBody(floorBody)

// // Three.js plane
// const plane = new THREE.Mesh(
//     new THREE.PlaneBufferGeometry(8, 8),
//     new THREE.MeshStandardMaterial()
// )
// scene.add(plane)
// plane.rotation.x = -Math.PI * 0.5
// plane.receiveShadow = true

//instantiate raycaster
const raycaster = new THREE.Raycaster()
let currentIntersect = null


//font loader
const fontLoader = new THREE.FontLoader()
fontLoader.load(
    'https://cdn.skypack.dev/three/examples/fonts/helvetiker_bold.typeface.json',
    (font) => {
        console.log('loaded')
        const textGeometry = new THREE.TextGeometry(
            'TIC TAC TOE', {
                font: font,
                size: 8,
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
        text.position.set(-2, 0, -30)
        text.rotation.x = -(Math.PI * 0.5)
    }
)

// //Test Box
// const box = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )
// scene.add(box)

//create plane
const planeGeometry = new THREE.PlaneBufferGeometry(1000, 1000)
const planeMaterial = new THREE.MeshStandardMaterial()
planeMaterial.color = new THREE.Color(0x400880)
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)
plane.rotation.x = -Math.PI * 0.5
plane.receiveShadow = true

//create tic tac toe grid
const grid = new THREE.Group()
const boxGridGeometry = new THREE.BoxBufferGeometry(0.6, 3, 30)
const boxGridMaterial = new THREE.MeshStandardMaterial()
boxGridMaterial.color = new THREE.Color(0xffcc00)
const grid1 = new THREE.Mesh(boxGridGeometry, boxGridMaterial)
const grid2 = new THREE.Mesh(boxGridGeometry, boxGridMaterial)
const grid3 = new THREE.Mesh(boxGridGeometry, boxGridMaterial)
const grid4 = new THREE.Mesh(boxGridGeometry, boxGridMaterial)
scene.add(grid)
grid.add(grid1, grid2, grid3, grid4)
grid1.position.set(0, 1.5, 0)
grid2.position.set(-9, 1.5, 0)
grid3.rotation.y = Math.PI * 0.5
grid3.position.set(-4.5, 1.5, 4.5)
grid4.rotation.y = Math.PI * 0.5
grid4.position.set(-4.5, 1.5, -4.5)
grid1.castShadow = true
grid2.castShadow = true
grid3.castShadow = true
grid4.castShadow = true

//cannon.js grid
const grid1Shape = new CANNON.Box(0.3, 1.5, 15)
const grid1Body = new CANNON.Body({
    mass: 10,
    position: new CANNON.Vec3(0, 1.5, 0),
    shape: grid1Shape,
    material: defaultMaterial
})
world.addBody(grid1Body)


//test Boxes
const boxGeometry = new THREE.BoxGeometry(8, 2, 8)
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
boxTopLeft.position.set(-14, 2, -10)
boxTopMid.position.set(-4.5, 2, -10)
boxTopRight.position.set(5, 2, -10)
boxMidLeft.position.set(-14, 2, 0)
boxMidMid.position.set(-4.5, 2, 0)
boxMidRight.position.set(5, 2, 0)
boxBottomLeft.position.set(-14, 2, 10)
boxBottomMid.position.set(-4.5, 2, 10)
boxBottomRight.position.set(5, 2, 10)
scene.add(boxTopLeft, boxTopMid, boxTopRight, boxMidLeft, boxMidMid, boxMidRight, boxBottomLeft, boxBottomMid, boxBottomRight)
gui.add(boxMaterial, 'visible')
//create camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100)
camera.position.z = 30
camera.position.y = 20
scene.add(camera)

//add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name('Ambient Light Intensity')

//add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
scene.add(directionalLight)
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001).name('Directional Light Intensity')

//add point light
const pointLight1 = new THREE.PointLight(0xffffff, 0.5, 25, 1)
scene.add(pointLight1)
pointLight1.position.set(0, 5, 5)
gui.add(pointLight1, 'intensity').min(0).max(1).step(0.001).name('Pointlight Front Center')
pointLight1.castShadow = true

const pointLight2 = new THREE.PointLight(0xffffff, 0.5, 25, 1)
scene.add(pointLight2)
pointLight2.position.set(5, 5, 0)
gui.add(pointLight2, 'intensity').min(0).max(1).step(0.001).name('Pointlight Mid Right')
pointLight2.castShadow = true

const pointLight3 = new THREE.PointLight(0xffffff, 0.5, 25, 1)
scene.add(pointLight3)
pointLight3.position.set(-10, 5, 0)
gui.add(pointLight3, 'intensity').min(0).max(1).step(0.001).name('Pointlight Mid Left')
pointLight3.castShadow = true

const pointLight4 = new THREE.PointLight(0xffffff, 0.5, 25, 1)
scene.add(pointLight4)
pointLight4.position.set(0, 5, -5)
gui.add(pointLight4, 'intensity').min(0).max(1).step(0.001).name('Pointlight Back Center')
pointLight4.castShadow = true

const pointLight5 = new THREE.PointLight(0xffffff, 0.5, 25, 1)
scene.add(pointLight5)
pointLight5.position.set(0, 5, 5)
gui.add(pointLight5, 'intensity').min(0).max(1).step(0.001).name('Pointlight Back')
pointLight5.castShadow = true

//controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//renderer
const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0x400880)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const objLoader = new OBJLoader()

//mouse
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / window.innerWidth * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    //console.log(mouse)
})

let oMeshes = new Array()
let oBodies = new Array()

//add event listener for mouse
window.addEventListener('click', () => {
    if(currentIntersect){
        //console.log('click')
         switch(currentIntersect.object)
        {
            case boxTopLeft:
                console.log('click on object TL')
                
                objLoader.load(
                    '/obj/o.obj',
                    (object) => {
                        console.log('o loaded')
                        const oMesh = object.children[0]
                        oMesh.material = new THREE.MeshStandardMaterial()
                        oMesh.castShadow = true

                        const createO = () => {
                            for(let i = 0; i < 50; i++){
                            const oClone = oMesh.clone()
                            oClone.position.x = (Math.random() - 0.5)-14
                            oClone.position.z = (Math.random() - 0.5)-10
                            oClone.position.y = 20 + i

                            scene.add(oClone)
                            oMeshes.push(oClone)

                            const oBody = new CANNON.Body({mass: 1})
                            oBody.addShape(new CANNON.Sphere(.05), new CANNON.Vec3(0.5, 0, 0))
                            oBody.addShape(new CANNON.Sphere(.05), new CANNON.Vec3(0, 0, 0.5))
                            oBody.addShape(new CANNON.Sphere(.05), new CANNON.Vec3(-0.5, 0, 0))
                            oBody.addShape(new CANNON.Sphere(.05), new CANNON.Vec3(0, 0, -0.5))
                            oBody.addShape(new CANNON.Sphere(.05), new CANNON.Vec3(0, 0, -0.38))
                            oBody.addShape(new CANNON.Sphere(.05), new CANNON.Vec3(0.4, 0.1, 0))
                            oBody.addShape(new CANNON.Sphere(.05), new CANNON.Vec3(0.4, -0.1, 0))
                            oBody.addShape(new CANNON.Sphere(.05), new CANNON.Vec3(0, -0.1, 0.4))
                            oBody.addShape(new CANNON.Sphere(.05), new CANNON.Vec3(0, -0.1, -0.4))
                            
                            oBody.position.x = oClone.position.x
                            oBody.position.y = oClone.position.y
                            oBody.position.z = oClone.position.z
                            world.addBody(oBody)
                            oBodies.push(oBody)
                            }
                        }
                        createO()   
                    }
                )
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

    oMeshes.forEach((m, i) => {
        m.position.set(
            oBodies[i].position.x,
            oBodies[i].position.y,
            oBodies[i].position.z
        )
        m.quaternion.set(
            oBodies[i].quaternion.x,
            oBodies[i].quaternion.y,
            oBodies[i].quaternion.z,
            oBodies[i].quaternion.w
        )
    })

    //raycaster
    raycaster.setFromCamera(mouse, camera)
    const objectsToTest = [boxTopLeft, boxTopMid, boxTopRight, boxMidLeft, boxMidMid, boxMidRight, boxBottomLeft, boxBottomMid, boxBottomRight]
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