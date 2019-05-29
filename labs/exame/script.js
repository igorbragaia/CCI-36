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
    keyboard = new KeyboardState();

camera.position.set(20,20,20);
camera.lookAt(0,0,0);

renderer.setSize(window.innerWidth*0.9, window.innerHeight*0.9);
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
planemat = new THREE.MeshLambertMaterial({color: 0xffa500});
plane = new THREE.Mesh(planegeom, planemat);
plane.castShadow = true; //default is false
plane.receiveShadow = true;

plane.rotation.x = -Math.PI * (1/2)
plane.position.x = 2
plane.position.z = 0

// scene.add(plane)

spheregeom = new THREE.BoxGeometry(1, 1, 1)
spheremat = new THREE.MeshLambertMaterial({
    color: 0x800000
});
sphere = new THREE.Mesh(spheregeom, spheremat);
sphere.castShadow = true; //default is false
sphere.receiveShadow = true;

sphere.position.x = 0
sphere.position.y = 1/2
sphere.position.z = 20

var planeBase = new THREE.Object3D()
var sphereBase = new THREE.Object3D()
planeBase.add(plane)
planeBase.add(sphereBase)
sphereBase.add(sphere)

var borders = new THREE.Group();
var getBorder = (pos_x,pos_y,pos_z,x,y,z, rot_x) => {
  var border = new THREE.Mesh(new THREE.BoxGeometry(x,y,z), new THREE.MeshLambertMaterial({color: 0xffa500}));
  border.position.x = pos_x
  border.position.y = pos_y
  border.position.z = pos_z
  border.rotation.y = rot_x
  return border
}
borders.add(getBorder(2,0,-25,50,1,1,0))
borders.add(getBorder(2,0,25,50,1,1,0))
borders.add(getBorder(-23,0,0,1,1,50,0))
borders.add(getBorder(27,0,0,1,1,50,0))
borders.add(getBorder(2,0,-10,10,1,1,0))
borders.add(getBorder(2,0,10,10,1,1,0))
borders.add(getBorder(-10,0,0,1,1,10,0))
borders.add(getBorder(10,0,0,1,1,10,0))
borders.add(getBorder(2,0,-15,10,1,1,0))
borders.add(getBorder(2,0,15,10,1,1,0))
borders.add(getBorder(-15,0,0,1,1,10,0))
borders.add(getBorder(15,0,0,1,1,10,0))
borders.add(getBorder(17,0,-15,1,1,10,Math.PI/4))
borders.add(getBorder(-15,0,-17,1,1,10,-Math.PI/4))
borders.add(getBorder(-15,0,17,1,1,10,Math.PI/4))
borders.add(getBorder(19,0,17,1,1,10,-Math.PI/4))
planeBase.add(borders)

scene.add(planeBase)

sphere_velocity = 0
gravity = 0.0002


rotateLeft = true
let rotatePlane = () => {
  if(rotateLeft) {
    if(planeBase.rotation.x > -Math.PI * (1/4))
      planeBase.rotation.x -= Math.PI * 0.001
    else
      rotateLeft = !rotateLeft
  } else {
    if(planeBase.rotation.x < Math.PI * (1/4))
      planeBase.rotation.x += Math.PI * 0.001
    else
      rotateLeft = !rotateLeft
  }
}

let getGravity = () => {
  return gravity * Math.sin(planeBase.rotation.x)
}

v = 0
let applyPhysicsToSphere = () => {
  v += getGravity()
  sphere.position.z += v
}

var animate = function() {
    requestAnimationFrame(animate)

    rotatePlane()
    applyPhysicsToSphere()

    keyboard.update();

    if ( keyboard.down("left") )
      rotateLeft = true
    if( keyboard.down("right"))
      rotateLeft = false
    if( keyboard.pressed("up") )
      sphere.position.x += 0.1
    if( keyboard.pressed("down") )
      sphere.position.x -= 0.1

    controls.update()
    renderer.render(scene, camera);
};

animate();
