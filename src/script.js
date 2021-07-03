import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import gsap from 'gsap'

//link to DOM Element
const canvas = document.querySelector('.webgl')

//create scene
const scene = new THREE.Scene()

//dat.gui
const gui = new dat.GUI({width:300})

//fog
const fog = new THREE.Fog(0x400880, 60, 100)
scene.fog = fog

//instantiate raycaster
const raycaster = new THREE.Raycaster()
let currentIntersect = null


//font loader
const fontLoader = new THREE.FontLoader()
fontLoader.load(
    'https://cdn.skypack.dev/three/examples/fonts/droid/droid_sans_regular.typeface.json',
    (font) => {
        console.log('loaded')
        const textGeometry = new THREE.TextGeometry(
            'Tic Tac Toe', {
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
        text.position.set(0, 0, -30)
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


//test Boxes
const boxGeometry = new THREE.BoxGeometry(8, 8, 8)
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
boxTopLeft.position.set(-14, 4, -10)
boxTopMid.position.set(-4.5, 4, -10)
boxTopRight.position.set(5, 4, -10)
boxMidLeft.position.set(-14, 4, 0)
boxMidMid.position.set(-4.5, 4, 0)
boxMidRight.position.set(5, 4, 0)
boxBottomLeft.position.set(-14, 4, 10)
boxBottomMid.position.set(-4.5, 4, 10)
boxBottomRight.position.set(5, 4, 10)
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

//updater function
const updater = () => {
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