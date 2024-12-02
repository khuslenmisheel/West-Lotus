//Import three js 3d model renderers and orbital controls/camera to render
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as THREE from 'three';

//Our 3d object
let mesh;

//In charge of putting buttons into drop down menu
const menu = document.querySelector('#mobile-menu')
const menuLinks = document.querySelector('.navbar__menu')

//Toggling navigation bar functionality when it's in mobile/smaller screen
menu.addEventListener('click', function() {
    menu.classList.toggle('is-active')
    menuLinks.classList.toggle('active')
})


//Setting up the renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

//Setting renderer to match window width and height
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

//Enable shadows inside of the scene
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//Establish container element for renderer
const container = document.getElementById('shirt__container');
container.appendChild(renderer.domElement);

//New scene that actually does the 3D rendering
const scene = new THREE.Scene();

//Initializing camera and it's original spawn point
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 0, 0);

//Controls for interactive camera movement
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false; //No panning
controls.enableZoom = false; //No zooming
controls.minDistance = 5;
controls.maxDistance = 20;
controls.minPolarAngle = Math.PI / 2;
controls.maxPolarAngle = Math.PI / 2;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

//Adding a spotlight so that we can actually see our 3d object
const spotLight = new THREE.SpotLight(0xffffff, 5000, 100, 0.22, 0.5);
spotLight.position.set(0, 25, 0);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
scene.add(spotLight);

//Load in our 3d model
const loader = new GLTFLoader().setPath('models/');
loader.load('scene.gltf', (gltf) => {
  console.log('loading model');
  mesh = gltf.scene;

  //Enabling the shadows for all the mesh
  mesh.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  mesh.position.set(0, -5.5, -1);
  mesh.scale.set(5, 5, 5);
  scene.add(mesh);
  
}, (xhr) => {
  console.log(`Loading`);
}, (error) => {
  console.error(error);
});


//Depending on which color you pick on the main section
//This changes the color or each individual mesh, essentially changing the color of model

window.changeModelColor = function(color) {
  if (mesh) {
    mesh.traverse((child) => {
      if (child.isMesh) {
        child.material.color.set(color);
      }
    });
  }
};

//Adjust the renderer and camera settings when the window is resized
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//Animation loop to render the scene and update controls
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

//Calling animation loop
animate();