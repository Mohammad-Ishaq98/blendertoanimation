import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/orbitcontrols';
import { GLTFLoader } from 'three/examples/jsm/loaders/gltfloader';

const dogURL = new URL( '../assets/doggo2.7cea7903.glb', import.meta.url );
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xA3A3A3);
document.body.appendChild( renderer.domElement );
camera.position.set( 0, 5, 20 );
// orbits
const orbits = new OrbitControls( camera, renderer.domElement );


// grid
const gridHelper = new THREE.GridHelper( 30, 30, 0x333333 )
scene.add( gridHelper );

//mixer animation
let mixer;
const assetsLoader = new GLTFLoader();
assetsLoader.load( dogURL.href, function ( gltf ) {
	const model = gltf.scene;
	scene.add( model );
	mixer = new THREE.AnimationMixer( model );
	const clips = gltf.animations;

	//certain animation
	// const clip = THREE.AnimationClip.findByName( clips, 'HeadAction' );
	// const action = mixer.clipAction( clip );
	// action.play();

	clips.forEach( clip => {
		const action = mixer.clipAction( clip );
		action.play();
	});

}, undefined, function (error) {
	console.error(error);
  }
)

const clock = new THREE.Clock();
function animate() {
	if ( mixer )
	mixer.update( clock.getDelta() )
	orbits.update();
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

animate();

// window resize 
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});