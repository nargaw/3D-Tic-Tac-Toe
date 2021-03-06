import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import * as CANNON from 'cannon-es'
import cannonDebugger from 'cannon-es-debugger'

//link to DOM Element
const canvas = document.querySelector('.webgl')

//game Logic
const players = ['X', 'O']
let currentTurn = players[Math.floor(Math.random() * players.length)]
const array = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
]
let winner = ''

const checkWinner = () => {
    let one = array[0][0]
    let two = array[0][1]
    let three = array[0][2]
    let four = array[1][0]
    let five = array[1][1]
    let six = array[1][2]
    let seven = array[2][0]
    let eight = array[2][1]
    let nine = array[2][2]

    if (one !== "" || two !== "" || three !== "" || four !== "" || five !== "" || six !== "" || seven !== "" || eight !== "" || nine !== "" && winner!== 'O' && winner!=='X'){
        console.log("tictactoe")
        if (one === two && two === three && one === three){
            console.log('winner is ' + one)
            winner = one
        } else if (one === four && four === seven && one === seven){
            console.log('winner is ' + one)
            winner = one
        } else if (one === five && five === nine && one === nine){
            console.log('winner is ' + one)
            winner = one
        } else if (five === four && four === six && six === five){
            console.log('winner is ' + four)
            winner = four
        } else if (seven === eight && seven === nine && eight === nine){
            console.log('winner is ' + seven)
            winner = seven
        } else if (two === five && five === eight && two === eight){
            console.log('winner is ' + two)
            winner = two
        } else if (three === six && three === nine && six === nine){
            console.log('winner is ' + three)
            winner = three
        } else if (three === five && five === seven && three === seven){
            console.log('winner is ' + three)
            winner = three
        } 
    }
}
 
//create scene
const scene = new THREE.Scene()

//dat.gui
const gui = new dat.GUI({width:300})
const debugObject = {}

//Physics World
const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true

// cannonDebugger(scene, world.bodies, {
//     color: 0xff0000,
//     autoUpdate: true
// })

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
    'https://raw.githubusercontent.com/nargaw/3D-Tic-Tac-Toe/master/static/fonts/Artista%202.0/Arista%202.0_Regular.typeface.json',
    (font) => {
        const textMaterial = new THREE.MeshStandardMaterial()
        textMaterial.color = new THREE.Color(0xffe45e)
        const text3DGeometry = new THREE.TextGeometry(
            '3D', {
                font: font,
                size: 8,
                height: 2,
                curveSegments: 4,
                bevelEnabled: true,
                bevelThickness: 0.05,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4
            }
        )
        
        const textTicGeometry = new THREE.TextGeometry(
            'TIC', {
                font: font,
                size: 8,
                height: 2,
                curveSegments: 4,
                bevelEnabled: true,
                bevelThickness: 0.05,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4
            }
        )
        const textTacGeometry = new THREE.TextGeometry(
            'TAC', {
                font: font,
                size: 8,
                height: 2,
                curveSegments: 4,
                bevelEnabled: true,
                bevelThickness: 0.05,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4
            }
        )
        const textToeGeometry = new THREE.TextGeometry(
            'TOE', {
                font: font,
                size: 8,
                height: 2,
                curveSegments: 4,
                bevelEnabled: true,
                bevelThickness: 0.05,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4
            }
        )

        text3DGeometry.computeBoundingBox()
        text3DGeometry.center()
        const text3D = new THREE.Mesh(text3DGeometry, textMaterial)
        scene.add(text3D)
        
        text3D.position.set(0, 16, -25)
        text3D.castShadow = true

        textTicGeometry.computeBoundingBox()
        textTicGeometry.center()
        const textTic = new THREE.Mesh(textTicGeometry, textMaterial)
        scene.add(textTic)
        
        textTic.position.set(0, 6, -25)
        textTic.castShadow = true

        textTacGeometry.computeBoundingBox()
        textTacGeometry.center()
        const textTac = new THREE.Mesh(textTacGeometry, textMaterial)
        scene.add(textTac)
        
        textTac.position.set(0, -4, -25)
        textTac.castShadow = true

        textToeGeometry.computeBoundingBox()
        textToeGeometry.center()
        const textToe = new THREE.Mesh(textToeGeometry, textMaterial)
        scene.add(textToe)
        
        textToe.position.set(0, -14, -25)
        textToe.castShadow = true
    }
)

fontLoader.load(
    'https://raw.githubusercontent.com/nargaw/3D-Tic-Tac-Toe/master/static/fonts/Artista%202.0/Arista%202.0_Regular.typeface.json',
    (font) => {
        const textRightWallMaterial = new THREE.MeshStandardMaterial()
        textRightWallMaterial.color = new THREE.Color(0xffe45e)
        const textRightOneGeometry = new THREE.TextGeometry(
            'This project was made', {
                font: font,
                size: 3,
                height: 2,
                curveSegments: 4,
                bevelEnabled: true,
                bevelThickness: 0.05,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4

            }
        )

        const textRightTwoGeometry = new THREE.TextGeometry(
            'using Three.Js', {
                font: font,
                size: 3,
                height: 2,
                curveSegments: 4,
                bevelEnabled: true,
                bevelThickness: 0.05,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4

            }
        )

        textRightOneGeometry.computeBoundingBox()
        textRightOneGeometry.center()
        const textRightOne = new THREE.Mesh(textRightOneGeometry, textRightWallMaterial)
        scene.add(textRightOne)
        
        textRightOne.position.set(25, 10, 0)
        textRightOne.rotation.y = -Math.PI * 0.5
        textRightOne.castShadow = true

        textRightTwoGeometry.computeBoundingBox()
        textRightTwoGeometry.center()
        const textRightTwo = new THREE.Mesh(textRightTwoGeometry, textRightWallMaterial)
        scene.add(textRightTwo)
        
        textRightTwo.position.set(25, 3, 0)
        textRightTwo.rotation.y = -Math.PI * 0.5
        textRightTwo.castShadow = true
    }
)

fontLoader.load(
    'https://raw.githubusercontent.com/nargaw/3D-Tic-Tac-Toe/master/static/fonts/Artista%202.0/Arista%202.0_Regular.typeface.json',
    (font) => {
        const textBackWallMaterial = new THREE.MeshStandardMaterial()
        textBackWallMaterial.color = new THREE.Color(0x00ffff)
        const textBackWallGeometry = new THREE.TextGeometry(
            '@nate_dev_', {
                font: font,
                size: 3,
                height: 2,
                curveSegments: 4,
                bevelEnabled: true,
                bevelThickness: 0.05,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4

            }
        )
        textBackWallGeometry.computeBoundingBox()
        textBackWallGeometry.center()
        const textBackWall = new THREE.Mesh(textBackWallGeometry, textBackWallMaterial)
        scene.add(textBackWall)
        
        textBackWall.position.set(0, 5, 25)
        textBackWall.rotation.y = -Math.PI
        textBackWall.castShadow = true
    }
)


const displayWinner = () => {
    if (winner === 'O' || winner === 'X'){
       fontLoader.load('https://raw.githubusercontent.com/nargaw/3D-Tic-Tac-Toe/master/static/fonts/Artista%202.0/Arista%202.0_Regular.typeface.json',
        (font) => {
            const textMaterial = new THREE.MeshStandardMaterial()
            textMaterial.color = new THREE.Color(0xffe45e)
            const textGeometry = new THREE.TextGeometry(
                'The Winner is: ', {
                    font: font,
                    size: 5,
                    height: 1,
                    curveSegments: 4,
                    bevelEnabled: true,
                    bevelThickness: 0.05,
                    bevelSize: 0.02,
                    bevelOffset: 0,
                    bevelSegments: 4
                }
            )
            const textWinnerGeometry = new THREE.TextGeometry(
                winner, {
                    font: font,
                    size: 20,
                    height: 1,
                    curveSegments: 4,
                    bevelEnabled: true,
                    bevelThickness: 0.05,
                    bevelSize: 0.02,
                    bevelOffset: 0,
                    bevelSegments: 4
                }
            )

            textGeometry.computeBoundingBox()
            textGeometry.center()
            const text = new THREE.Mesh(textGeometry, textMaterial)

            textWinnerGeometry.computeBoundingBox()
            textWinnerGeometry.center()
            const textWinner = new THREE.Mesh(textWinnerGeometry, textMaterial)

            scene.add(text, textWinner)

            text.position.set(-25, 15, 0)
            text.rotation.y = Math.PI * 0.5
            text.castShadow = true

            textWinner.position.set(-25, 0, 0)
            textWinner.rotation.y = Math.PI * 0.5
            textWinner.castShadow = true
        })
    }
}

//Three.js plane
const planeGeometry = new THREE.PlaneBufferGeometry(50, 50)
const planeMaterial = new THREE.MeshStandardMaterial({color: 0xff6392})
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
    new THREE.MeshStandardMaterial({color: 0xff6392})
)
scene.add(planeFrontWallBox)
planeFrontWallBox.position.set(0, 0, 25)

//Cannon.js plane
const planeShape = new CANNON.Plane()
const planeBody = new CANNON.Body({
    mass: 0,
    shape: planeShape,
    material: defaultMaterial
})
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
planeBody.position.set(new CANNON.Vec3(0, 0, 0))
world.addBody(planeBody)

/**
 * Platform
 */


//cannon floor
const floorBody = new CANNON.Body({
    mass: 0,
    material: defaultMaterial
})
world.addBody(floorBody)
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
floorBody.addShape(new CANNON.Box(new CANNON.Vec3(25, 25, 0.1)), new CANNON.Vec3(0, 0, -25))

//cannon backwall
const backwallBody = new CANNON.Body({
    mass: 0,
    material: defaultMaterial
})
world.addBody(backwallBody)
backwallBody.addShape(new CANNON.Box(new CANNON.Vec3(25, 25, 0.1)), new CANNON.Vec3(0, 0, -25))

//cannon frontwall
const frontwallBody = new CANNON.Body({
    mass: 0,
    material: defaultMaterial
})
world.addBody(frontwallBody)
frontwallBody.addShape(new CANNON.Box(new CANNON.Vec3(25, 25, 0.1)), new CANNON.Vec3(0, 0, 25))

//cannon leftwall
const leftwallBody = new CANNON.Body({
    mass: 0,
    material: defaultMaterial
})
world.addBody(leftwallBody)
leftwallBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, -1, 0), Math.PI * 0.5)
leftwallBody.addShape(new CANNON.Box(new CANNON.Vec3(25, 25, 0.1)), new CANNON.Vec3(0, 0, 25))

//cannon rightwall
const rightwallBody = new CANNON.Body({
    mass: 0,
    material: defaultMaterial
})
world.addBody(rightwallBody)
rightwallBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, -1, 0), Math.PI * 0.5)
rightwallBody.addShape(new CANNON.Box(new CANNON.Vec3(25, 25, 0.1)), new CANNON.Vec3(0, 0, -25))


//Cannon platform
const platformShape = new CANNON.Box(new CANNON.Vec3(6, 6, 0.25))
const platformBody = new CANNON.Body({
    mass: 0,
    shape: platformShape,
    material: defaultMaterial
})
world.addBody(platformBody)
platformBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)

//Three.js platform
const platformGeometry = new THREE.BoxGeometry(12, 12, 0.5)
const platformMaterial = new THREE.MeshStandardMaterial({color:0x5aa9e6})
const platform = new THREE.Mesh(platformGeometry, platformMaterial)
scene.add(platform)
platform.castShadow = true
platform.receiveShadow = true
platform.rotation.x = -Math.PI * 0.5

//Three.js tic tac toe grid
const gridGeometry = new THREE.BoxGeometry(0.25, 2, 10)
const gridMaterial = new THREE.MeshStandardMaterial({color:0x5aa9e6})
const verticalLeft = new THREE.Mesh(gridGeometry, gridMaterial)
const verticalRight = new THREE.Mesh(gridGeometry, gridMaterial)
const horizontalBack = new THREE.Mesh(gridGeometry, gridMaterial)
const horizontalFront = new THREE.Mesh(gridGeometry, gridMaterial)

scene.add(verticalLeft, verticalRight, horizontalBack, horizontalFront)
verticalLeft.position.set(-1.5, 1, 0)
verticalLeft.castShadow = true
verticalRight.position.set(1.5, 1, 0)
verticalRight.castShadow = true
horizontalBack.rotation.y = -Math.PI * 0.5
horizontalBack.position.set(0, 1, -1.5)
horizontalBack.castShadow = true
horizontalFront.rotation.y = -Math.PI * 0.5
horizontalFront.position.set(0, 1, 1.5)
horizontalFront.castShadow = true

//Cannon.js tic tac toe grid
const gridBody = new CANNON.Body({
    mass: 0,
    material: defaultMaterial
})
gridBody.addShape(new CANNON.Box(new CANNON.Vec3(0.125, 1, 5)), new CANNON.Vec3(-1.5, 1, 0))
gridBody.addShape(new CANNON.Box(new CANNON.Vec3(0.125, 1, 5)), new CANNON.Vec3(1.5, 1, 0))
gridBody.addShape(new CANNON.Box(new CANNON.Vec3(5, 1, 0.125)), new CANNON.Vec3(0, 1, -1.5))
gridBody.addShape(new CANNON.Box(new CANNON.Vec3(5, 1, 0.125)), new CANNON.Vec3(0, 1, 1.5))
gridBody.addShape(new CANNON.Box(new CANNON.Vec3(5, 2, 0.125)), new CANNON.Vec3(0, 1, -6))
gridBody.addShape(new CANNON.Box(new CANNON.Vec3(5, 2, 0.125)), new CANNON.Vec3(0, 1, 6))
gridBody.addShape(new CANNON.Box(new CANNON.Vec3(0.125, 2, 5)), new CANNON.Vec3(-6, 1, 0))
gridBody.addShape(new CANNON.Box(new CANNON.Vec3(0.125, 2, 5)), new CANNON.Vec3(6, 1, 0))
world.addBody(gridBody)

//objects to update
const oUpdate = []
const xUpdate = []

//create O
const torusGeometry = new THREE.TorusGeometry(1, 0.5, 64, 64)
const torusMaterial = new THREE.MeshStandardMaterial({color:0x7fc8f8})
const verticalRectangleShape = new CANNON.Box(new CANNON.Vec3(0.5, 1.5, 0.5))
const horizontalRectangleShape = new CANNON.Box(new CANNON.Vec3(1.5, 0.5, 0.5))
const createO = () => {
    for (let i = 0; i<= 10; i++){
        //Three.js Torus
        const torus = new THREE.Mesh(torusGeometry, torusMaterial)
        scene.add(torus)
        torus.castShadow = true
        torus.position.x = (Math.random() -0.5) * 4
        torus.position.z = (Math.random() -0.5) * 4
        torus.position.y = -5
        
        //Cannon.js Torus
        const torusBody = new CANNON.Body({
            mass: 1,
            material: defaultMaterial
        })
        torusBody.addShape(verticalRectangleShape)
        torusBody.addShape(horizontalRectangleShape)
        torusBody.addShape(new CANNON.Sphere(0.6), new CANNON.Vec3(0.75, 0.75, 0))
        torusBody.addShape(new CANNON.Sphere(0.6), new CANNON.Vec3(-0.75, 0.75, 0))
        torusBody.addShape(new CANNON.Sphere(0.6), new CANNON.Vec3(0.75, -0.75, 0))
        torusBody.addShape(new CANNON.Sphere(0.6), new CANNON.Vec3(-0.75, -0.75, 0))

        torusBody.position.x = torus.position.x
        torusBody.position.y = torus.position.y
        torusBody.position.z = torus.position.z
        world.addBody(torusBody)

        oUpdate.push({
            mesh: torus,
            body: torusBody
        })
    }
    
}


//add to GUI
debugObject.createO = () => {
    createO()
}
//gui.add(debugObject, 'createO').name('Create O')

//create X
const xGeometry = new THREE.BoxGeometry(4, 1, 1)
const xMaterial = new THREE.MeshStandardMaterial({color: 0x00ffff})
const xShape = new CANNON.Box(new CANNON.Vec3(1.8, 1.8, 0.5))
const createX = () => {
    //Three.js X 
    for (let i=0; i<= 10; i++){
        const xGroup = new THREE.Group()
        const xLeft = new THREE.Mesh(xGeometry, xMaterial)
        const xRight = new THREE.Mesh(xGeometry, xMaterial)
        xGroup.position.x = (Math.random() -0.5) * 4
        xGroup.position.z = (Math.random() -0.5) * 4
        xGroup.position.y = -5
        
        xLeft.castShadow = true
        xRight.castShadow = true
        xLeft.rotation.z = -Math.PI * 0.25
        xRight.rotation.z = Math.PI * 0.25
        xGroup.add(xLeft)
        xGroup.add(xRight)
        scene.add(xGroup)
        //Cannon.js X Body
        
        const xBody = new CANNON.Body({
            mass: 1,
            material: defaultMaterial
        })
        xBody.position.x = xGroup.position.x
        xBody.position.y = xGroup.position.y
        xBody.position.z = xGroup.position.z
        xBody.addShape(xShape)
        world.addBody(xBody)
        
        xUpdate.push({
            mesh: xGroup,
            body: xBody
        })
    }   
}

//add to GUI
const reset = () => {
  window.location = window.location.href
}
debugObject.reset = () => {
    reset()
}
gui.add(debugObject, 'reset').name('Reset')
//add to GUI
debugObject.createX = () => {
    createX()
}
//gui.add(debugObject, 'createX').name('Create X')

createX()
createO()

//Raycaster Boxes
const boxGeometry = new THREE.BoxGeometry(3, 2, 3)
const boxMaterial = new THREE.MeshStandardMaterial({
    visible: false
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
//gui.add(boxMaterial, 'visible')

boxTopLeft.position.set(-3.25, 1, -3.25)
boxTopMid.position.set(0, 1, -3.25)
boxTopRight.position.set(3.25, 1, -3.25)
boxMidLeft.position.set(-3.25, 1, 0)
boxMidMid.position.set(0, 1, 0)
boxMidRight.position.set(3.25, 1, 0)
boxBottomLeft.position.set(-3.25, 1, 3.25)
boxBottomMid.position.set(0, 1, 3.25)
boxBottomRight.position.set(3.25, 1, 3.25)

//create camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 200)
camera.position.set(0, 10, 20)
scene.add(camera)

//add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
scene.add(ambientLight)
//gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name('Ambient Light Intensity')

const pointLightBack = new THREE.PointLight(0xffffff, 0.4, 100, 0.1)
const pointLightLeft = new THREE.PointLight(0xffffff, 0.2, 100, 0.1)
const pointLightRight = new THREE.PointLight(0xffffff, 0.2, 100, 0.1)
pointLightBack.position.set(0, 20, 0)
pointLightLeft.position.set(-20, 10, 0)
pointLightRight.position.set(20, 10, 0)
scene.add(pointLightBack, pointLightLeft, pointLightRight)
pointLightBack.castShadow = true
pointLightLeft.castShadow = true
pointLightRight.castShadow = true
pointLightBack.shadow.mapSize.width = 512
pointLightBack.shadow.mapSize.height = 512
pointLightLeft.shadow.mapSize.width = 512
pointLightLeft.shadow.mapSize.height = 512
pointLightRight.shadow.mapSize.width = 512
pointLightRight.shadow.mapSize.height = 512
const pointLightHelperBack = new THREE.PointLightHelper(pointLightBack, 1, 0x00ff00)
const pointLightHelperLeft = new THREE.PointLightHelper(pointLightLeft, 1, 0x00ff00)
const pointLightHelperRight = new THREE.PointLightHelper(pointLightRight, 1, 0x00ff00)
//scene.add(pointLightHelperBack, pointLightHelperLeft, pointLightHelperRight)

//controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false

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

const torusSmallGeometry = new THREE.TorusGeometry(0.5, 0.25, 64, 64)
const verticalSmallRectangleShape = new CANNON.Box(new CANNON.Vec3(0.25, 0.75, 0.25))
const horizontalSmallRectangleShape = new CANNON.Box(new CANNON.Vec3(0.75, 0.25, 0.25))
const xSmallGeometry = new THREE.BoxGeometry(2, 0.5, 0.5)
const xSmallMaterial = new THREE.MeshStandardMaterial({color: 0x00ffff})
const xSmallShape = new CANNON.Box(new CANNON.Vec3(0.9, 0.9, 0.25))
let x, y, z
const genSmallO = (x, y, z) => {
    const torus = new THREE.Mesh(torusSmallGeometry, torusMaterial)
    scene.add(torus)
    torus.castShadow = true
    torus.position.x = x
    torus.position.z = z
    torus.position.y = y
    
    
    //Cannon.js Torus
    const torusBody = new CANNON.Body({
        mass: 1,
        material: defaultMaterial
    })
    torusBody.addShape(verticalSmallRectangleShape)
    torusBody.addShape(horizontalSmallRectangleShape)
    torusBody.addShape(new CANNON.Sphere(0.3), new CANNON.Vec3(0.325, 0.325, 0))
    torusBody.addShape(new CANNON.Sphere(0.3), new CANNON.Vec3(-0.325, 0.325, 0))
    torusBody.addShape(new CANNON.Sphere(0.3), new CANNON.Vec3(0.325, -0.325, 0))
    torusBody.addShape(new CANNON.Sphere(0.3), new CANNON.Vec3(-0.325, -0.325, 0))

    torusBody.position.x = torus.position.x
    torusBody.position.y = torus.position.y
    torusBody.position.z = torus.position.z
    
    world.addBody(torusBody)

    oUpdate.push({
        mesh: torus,
        body: torusBody
    })
}

const genSmallX = (x, y, z) => {
    const xGroup = new THREE.Group()
    const xLeft = new THREE.Mesh(xSmallGeometry, xSmallMaterial)
    const xRight = new THREE.Mesh(xSmallGeometry, xSmallMaterial)
    xGroup.position.x = x
    xGroup.position.z = z
    xGroup.position.y = y
    
    xLeft.castShadow = true
    xRight.castShadow = true
    xLeft.rotation.z = -Math.PI * 0.25
    xRight.rotation.z = Math.PI * 0.25
    xGroup.add(xLeft)
    xGroup.add(xRight)
    scene.add(xGroup)
    //Cannon.js X Body
    
    const xBody = new CANNON.Body({
        mass: 1,
        material: defaultMaterial
    })
    xBody.position.x = xGroup.position.x
    xBody.position.y = xGroup.position.y
    xBody.position.z = xGroup.position.z
    
    xBody.addShape(xSmallShape)
    world.addBody(xBody)
    
    xUpdate.push({
        mesh: xGroup,
        body: xBody
    })
}

//add event listener for mouse
window.addEventListener('click', () => {
    if(currentIntersect && winner !== 'X' && winner !== 'O'){
         switch(currentIntersect.object)
        {
            case boxTopLeft:
                if (array[0][0] !== 'X' && array[0][0] !== 'O'){
                    if (currentTurn === 'O'){
                        genSmallO(-3.25, 6, -3)
                        array[0].splice(0, 1, 'O')
                        currentTurn = 'X'
                    } else {
                        genSmallX(-3.25, 6, -3)
                        array[0].splice(0, 1, 'X')
                        currentTurn = 'O'
                    }
                    //console.log('click on object TL')
                    //console.log(currentTurn)
                }
                checkWinner()
                displayWinner()
                break

            case boxTopMid:
                if (array[0][1] !== 'X' && array[0][1] !== 'O'){
                    if (currentTurn === 'O'){
                        genSmallO(0, 6, -3)
                        array[0].splice(1, 1, 'O')
                        currentTurn = 'X'
                    } else {
                        genSmallX(0, 6, -3)
                        array[0].splice(1, 1, 'X')
                        currentTurn = 'O'   
                    }
                    //console.log('click on object TM')
                    //console.log(currentTurn)
                }
                checkWinner()
                displayWinner()
                break

            case boxTopRight:
                if (array[0][2] !== 'X' && array[0][2] !== 'O'){
                    if (currentTurn === 'O'){
                        genSmallO(3.25, 6, -3)
                        array[0].splice(2, 1, 'O')
                        currentTurn = 'X' 
                    } else {
                        genSmallX(3.25, 6, -3)
                        array[0].splice(2, 1, 'X')
                        currentTurn = 'O'
                    }
                    //console.log('click on object TR')
                    //console.log(currentTurn)
                }
                checkWinner()
                displayWinner()
                break

            case boxMidLeft:
                if (array[1][0] !== 'X' && array[1][0] !== 'O'){
                    if (currentTurn === 'O'){
                        genSmallO(-3.25, 6, 0)
                        array[1].splice(0, 1, 'O')
                        currentTurn = 'X'
                    } else {
                        genSmallX(-3.25, 6, 0)
                        array[1].splice(0, 1, 'X')
                        currentTurn = 'O' 
                    }
                    //console.log('click on object ML')
                    //console.log(currentTurn)
                }
                checkWinner()
                displayWinner()   
                break

            case boxMidMid:
                if (array[1][1] !== 'X' && array[1][1] !== 'O'){
                    if (currentTurn === 'O'){
                        genSmallO(0, 6, 0)
                        array[1].splice(1, 1, 'O')
                        currentTurn = 'X'
                    } else {
                        genSmallX(0, 6, 0)
                        array[1].splice(1, 1, 'X')
                        currentTurn = 'O'
                    }
                    //console.log('click on object MM')
                    //console.log(currentTurn)
                }
                checkWinner()
                displayWinner()
                break

            case boxMidRight:
                if (array[1][2] !== 'X' && array[1][2] !== 'O'){
                    if (currentTurn === 'O'){
                        genSmallO(3.25, 6, 0)
                        array[1].splice(2, 1, 'O')
                        currentTurn = 'X'
                    } else {
                        genSmallX(3.25, 6, 0)
                        array[1].splice(2, 1, 'X')
                        currentTurn = 'O'
                    }
                    //console.log('click on object MR')
                    //console.log(currentTurn)
                }
                checkWinner()
                displayWinner()
                break
            
            case boxBottomLeft:
                if (array[2][0] !== 'X' && array[2][0] !== 'O'){
                    if (currentTurn === 'O'){
                        genSmallO(-3.25, 6, 3)
                        array[2].splice(0, 1, 'O')
                        currentTurn = 'X'  
                    } else {
                        genSmallX(-3.25, 6, 3)
                        array[2].splice(0, 1, 'X')
                        currentTurn = 'O'
                    }
                    //console.log('click on object BL')
                    //console.log(currentTurn)
                }
                checkWinner()
                displayWinner()
                break

            case boxBottomMid:
                if (array[2][1] !== 'X' && array[2][1] !== 'O'){
                    if (currentTurn === 'O'){
                        genSmallO(0, 6, 3)
                        array[2].splice(1, 1, 'O')
                        currentTurn = 'X'
                    } else {
                        genSmallX(0, 6, 3)
                        array[2].splice(1, 1, 'X')
                        currentTurn = 'O'   
                    }
                    //console.log('click on object BM')
                    //console.log(currentTurn)
                }
                checkWinner()
                displayWinner()
                break

            case boxBottomRight:
                if (array[2][2] !== 'X' && array[2][2] !== 'O'){
                    if (currentTurn === 'O'){
                        genSmallO(3.25, 6, 3)
                        array[2].splice(2, 1, 'O')
                        currentTurn = 'X'    
                    } else {
                        genSmallX(3.25, 6, 3)
                        array[2].splice(2, 1, 'X')
                        currentTurn = 'O' 
                    }
                    //console.log('click on object BR')
                    //console.log(currentTurn)
                }
                checkWinner()
                displayWinner()
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

    for(const object of oUpdate){
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
    }

    for(const object of xUpdate){
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
    }
    //checkWinner()
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
