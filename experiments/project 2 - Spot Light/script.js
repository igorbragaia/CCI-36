'use strict';

let
    time = 0,
    renderer = new THREE.WebGLRenderer({
        antialias: true
    }),
    scene = new THREE.Scene(),
    // camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000),
    camera = new THREE.OrthographicCamera(window.innerWidth / -256, window.innerWidth / 256, window.innerHeight / 256, window.innerHeight / -256, -200, 400),
    // sphere
    shape = new THREE.BoxBufferGeometry(0.5, 0.5, 0.5),
    material = new THREE.MeshLambertMaterial({
        color: 0x99ff00
    }),
    mesh = new THREE.Mesh(shape, material),
    // Visualize mesh faces with a wireframe overlay.
    //wire = new THREE.WireframeHelper(mesh, 0x000000),
    // Base level of light.
    amb = new THREE.AmbientLight(0x404040),
    // Pure red light.
    light = new THREE.PointLight({
        color: 0xffffff,
        decay: 2
    }),
    // Visualize point light location.
    helper = new THREE.PointLightHelper(light, 0.1),
    // plane
    geometryPlane = new THREE.BoxBufferGeometry(5, 0.1, 5),
    materialPlane = new THREE.MeshLambertMaterial({
        color: 0x666666,
        side: THREE.DoubleSide
    }),
    plane = new THREE.Mesh(geometryPlane, materialPlane);

//*********** SETUP ***********//
// enable rendering shadow
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// enable shpere shadow
mesh.castShadow = true; //default is false
mesh.receiveShadow = false; //default
// enable plane shadow
plane.castShadow = true; //default is false
plane.receiveShadow = true;
plane.position.y = -2;
// enable light shadow
light.castShadow = true;
light.position.y = 1;
light.intensity = 2;
// Create a basic ortographic camera
camera.position.x = 2;
camera.position.y = 1;
camera.position.z = 3;
camera.lookAt(scene.position);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// mouse scene controlling
let controls = new THREE.OrbitControls(camera);
controls.update();

scene.add(mesh);
//scene.add(wire);
scene.add(amb);
scene.add(light);
scene.add(helper);
scene.add(plane);

const render = function() {
    requestAnimationFrame(render);

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
    mesh.rotation.z += 0.01;



    light.position.set(Math.cos(0.01 * Math.PI * time), 2, Math.sin(0.01 * Math.PI * time));
    time++;

    renderer.render(scene, camera);
    controls.update();
};

// resize screen automatically
window.addEventListener(`resize`, () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});

// animate
requestAnimationFrame(render);
