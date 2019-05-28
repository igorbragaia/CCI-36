let
    scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000),
    renderer = new THREE.WebGLRenderer({
        antialias: true
    }),
    controls = new THREE.OrbitControls(camera),
    axesHelper = new THREE.AxesHelper(5),
		amb = new THREE.AmbientLight(0x404040),
		// Pure red light.
		light = new THREE.PointLight({
				color: 0xffffff,
				decay: 2
		}),
		// Visualize point light location.
		helper = new THREE.PointLightHelper(light, 0.1),
    raycaster = new THREE.Raycaster();

camera.position.set(10,10,10);
camera.lookAt(0,0,0);

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

camera.position.z = 5;

light.castShadow = true;
light.position.y = 10;
light.intensity = 2;

scene.add(axesHelper);
scene.add(amb);
scene.add(light);
scene.add(helper);

planegeom = new THREE.PlaneGeometry(50, 50)
planemat = new THREE.MeshLambertMaterial({
    color: 0xCCCC55
});
plane = new THREE.Mesh(planegeom, planemat);
plane.castShadow = true; //default is false
plane.receiveShadow = true;

plane.rotation.x = -Math.PI / 2.0

plane.position.x = 2
plane.position.z = 0

// scene.add(plane)

spheregeom = new THREE.SphereGeometry(1, 32, 32)
spheremat = new THREE.MeshLambertMaterial({
    color: 0xCCCC55
});
sphere = new THREE.Mesh(spheregeom, spheremat);
sphere.castShadow = true; //default is false
sphere.receiveShadow = true;

// sphere.rotation.y = -Math.PI / 2.0
sphere.position.x = 4
sphere.position.y = 1
sphere.position.z = 0


// let group = new THREE.Group();
// group.add(sphere)
// group.add(plane)

// scene.add(group)

var planeBase = new THREE.Object3D()
var sphereBase = new THREE.Object3D()
planeBase.add(plane)
planeBase.add(sphereBase)
sphereBase.add(sphere)

scene.add(planeBase)

sphere_velocity = 0
gravity = 0.001

var time = 0;
var step = 0.05
var animate = function() {
    requestAnimationFrame(animate)

    planeBase.rotation.x = time

    g = gravity * Math.sin(time)

    sphereBase.position.z += sphere_velocity
    sphere_velocity += g
    console.log(g)

    if(time > 1)
      step = -0.005
    if(time < -1)
      step = 0.005

    time += step // em radianos

    controls.update()
    renderer.render(scene, camera);
};

animate();
