//***** SETUP *****//
// constants
objs = [];
step = 0.1;

const fireColorsPalette = [{"r":7,"g":7,"b":7},{"r":31,"g":7,"b":7},{"r":47,"g":15,"b":7},{"r":71,"g":15,"b":7},{"r":87,"g":23,"b":7},{"r":103,"g":31,"b":7},{"r":119,"g":31,"b":7},{"r":143,"g":39,"b":7},{"r":159,"g":47,"b":7},{"r":175,"g":63,"b":7},{"r":191,"g":71,"b":7},{"r":199,"g":71,"b":7},{"r":223,"g":79,"b":7},{"r":223,"g":87,"b":7},{"r":223,"g":87,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":103,"b":15},{"r":207,"g":111,"b":15},{"r":207,"g":119,"b":15},{"r":207,"g":127,"b":15},{"r":207,"g":135,"b":23},{"r":199,"g":135,"b":23},{"r":199,"g":143,"b":23},{"r":199,"g":151,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":167,"b":39},{"r":191,"g":167,"b":39},{"r":191,"g":175,"b":47},{"r":183,"g":175,"b":47},{"r":183,"g":183,"b":47},{"r":183,"g":183,"b":55},{"r":207,"g":207,"b":111},{"r":223,"g":223,"b":159},{"r":239,"g":239,"b":199},{"r":255,"g":255,"b":255}]

// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({antialias:true});
// Configure renderer clear color
renderer.setClearColor("#000000");
// Configure renderer size
renderer.setSize( window.innerWidth, window.innerHeight );

// Append Renderer to DOM
document.body.appendChild( renderer.domElement );

// Create an empty scene
var scene = new THREE.Scene();

// Create a basic ortographic camera
camera = new THREE.OrthographicCamera( window.innerWidth / - 256, window.innerWidth / 256,window.innerHeight / 256, window.innerHeight / - 256, -200, 500 );
camera.position.x = 2;
camera.position.y = 1;
camera.position.z = 3;
camera.lookAt(scene.position);

var controls = new THREE.OrbitControls( camera );
controls.update();

//***** HAVING FUN *****//

move = function(){
  const gaussianValue =  Math.sqrt(-2 * Math.log(Math.random()))*Math.cos((2*Math.PI) * Math.random());
  return 0.01 * gaussianValue;
};

getRGB = function(rgb)
{
  return "rgb(" + rgb["r"] + "," + rgb["g"] + "," + rgb["b"] + ")";
}

subscribeObj = function(x,y,z, intensity) {
  var color = getRGB(fireColorsPalette[intensity]);

  var geometry = new THREE.BoxGeometry( 0.05, 0.05, 0.05 );
  var material = new THREE.MeshBasicMaterial( { color: color, transparent: true, opacity: 0.8} );

  var obj = {
    geometry: geometry,
    material: material,
    mesh: new THREE.Mesh( geometry, material ),
    xReference: x,
    yReference: y,
    zReference: z,
    intensity: intensity,
    time: 0
  }

  obj.mesh.position.x = obj.xReference;
  obj.mesh.position.y = obj.yReference;
  obj.mesh.position.z = obj.zReference;

  scene.add(obj.mesh);
  return obj;
}

var objs = []
for(var x=0; x<15; x++)
{
  yArray = [];
  for(var y=0; y<36; y++)
  {
    var zArray = [];
    for(var z=0; z<15; z++)
    {
      var obj = subscribeObj(0.1*x, 0.05*y, 0.1*z, 36-y);
      zArray.push(obj);
    }
    yArray.push(zArray);
  }
  objs.push(yArray);
}

// Render Loop
var render = function () {
  requestAnimationFrame( render );

  for(var xIndex=0; xIndex<objs.length; xIndex++)
    for(var yIndex=0; yIndex<objs[xIndex].length; yIndex++)
      for(var zIndex=0; zIndex<objs[xIndex][yIndex].length; zIndex++)
      {
        var obj = objs[xIndex][yIndex][zIndex];

        mesh = obj.mesh;

        mesh.position.y = obj.yReference + ( 1 + Math.abs( move() ) + obj.yReference ) * ( mesh.position.y - obj.yReference +  Math.abs( move( ) ) ) % 0.5;

        mesh.position.x = obj.xReference + ( ( mesh.position.x - obj.xReference ) + Math.abs( move( ) ) ) % 0.3;
        mesh.position.z = obj.zReference + ( ( mesh.position.z - obj.zReference ) + Math.abs( move( ) ) ) % 0.3;

        mesh.rotation.x += 0.02;
        mesh.rotation.y += 0.02;
        mesh.scale.set(3/(1+5*mesh.position.y),
                       3/(1+5*mesh.position.y),
                       3/(1+5*mesh.position.y));
      }

  // Render the scene
  renderer.render(scene, camera);
  controls.update();
};

render();
