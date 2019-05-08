var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x220000);
document.body.appendChild(renderer.domElement);

var slots = []
var pieces = []
const params = {
  height: 0.2,
  max_radius: 1,
  min_radius: 0.5,
  n: 10,
}
var state = {
  bars:[[],[],[]],
}

var subscribeCylinders = function(bar){
  const step=(params.max_radius-params.min_radius)/params.n;
  for(let i=1; i<=params.n; i++)
    subscribeCylinder(params.max_radius-i*step, bar);
}

var subscribeCylinder = function(radius, bar){
  var geometry = new THREE.CylinderGeometry( radius, radius, params.height, 100);
  var material = new THREE.MeshLambertMaterial( { color: 0xCE2029 } );
  var cylinder = new THREE.Mesh( geometry, material );
  cylinder.position.x=2*params.max_radius*(bar+1);
  cylinder.position.y=3;
  cylinder.position.z=params.height*(state.bars[bar].length+1);
  cylinder.rotation.x = Math.PI / 2;
  scene.add( cylinder );
  state.bars[bar].push( cylinder );
}

var subscribeAxe = function(bar){
  const height = params.height*(params.n+2);
  const axis_radius = params.min_radius/3;
  var geometry = new THREE.CylinderGeometry( axis_radius, axis_radius, height, 100);
  var material = new THREE.MeshLambertMaterial( { color: 0xFF7F7F } );
  var cylinder = new THREE.Mesh( geometry, material );
  cylinder.position.x = 2*params.max_radius*(bar+1);
  cylinder.position.y = 3;
  cylinder.position.z = height/2;
  cylinder.rotation.x = Math.PI / 2;
  scene.add( cylinder );
}

var subscribeAxis = function(){
  for(let i=0; i<state.bars.length; i++)
    subscribeAxe(i);
}

subscribeCylinders(0);
subscribeAxis();

var light = new THREE.PointLight(0xffffff, 1.0);
light.position.set(4, 4, 10);


scene.add(light)
camera.position.x = 4;
camera.position.z = 5;
camera.position.y = -3;
camera.up = new THREE.Vector3(0, 0, 1);
camera.lookAt(new THREE.Vector3(4, 4, 0));

var t_blacks = Math.PI / 2.0;
var t_whites = 3.0 * Math.PI / 2.0;
var anim_time = 0;

t = t_whites

boardcenter = new THREE.Vector3(4, 4, 0)

function animate() {
    requestAnimationFrame(animate);

    camera.position.x = 5 * Math.cos(t) + 4;
    camera.position.y = 5 * Math.sin(t) + 4;
    camera.position.z = 5 + Math.sin(t / 2.0) + 2 * Math.sin(t * 2.0);
    camera.up.set(0, 0, 1)
    camera.lookAt(boardcenter);

    renderer.render(scene, camera);
}

animate();
