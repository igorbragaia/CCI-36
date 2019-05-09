let scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000),
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x220000);
document.body.appendChild(renderer.domElement);

const width=window.innerWidth;

let mat_clear = new THREE.MeshLambertMaterial( { color: 0xFF7F7F} ),
    mat_dark = new THREE.MeshLambertMaterial( { color: 0xCE2029} ),
    mat_highlight = new THREE.MeshLambertMaterial( {color:0xff8000} );

const params = {
  height: 0.2,
  max_radius: 1,
  min_radius: 0.5,
  n: 15,
}

let slots = [],
    piecesState = {
      axis:[null,null,null],
      lastAxe: 0,
      bars:[[],[],[]],
      holdPiece: null
    };
let getLast = function(bar){
  let meshs = piecesState.bars[bar];
  response=null;
  for(let mesh of meshs)
    if(response == null || mesh.position.z > response.position.z)
  	 response = mesh;
  return response;
}

let subscribeCylinders = function(bar){
  const step = (params.max_radius-params.min_radius)/params.n;
  for(let i=1; i<=params.n; i++)
    subscribeCylinder(params.max_radius-i*step, bar);
}

let subscribeCylinder = function(radius, bar){
  let geometry = new THREE.CylinderGeometry( radius, radius, params.height, 100),
      material = mat_dark,
      cylinder = new THREE.Mesh( geometry, material );
  cylinder.position.x = 2*params.max_radius*(bar+1);
  cylinder.position.y = 3;
  cylinder.position.z = params.height*(piecesState.bars[bar].length+1);
  cylinder.rotation.x = Math.PI / 2;
  cylinder.is_clear = false;
  scene.add( cylinder );
  piecesState.bars[bar].push( cylinder );
}

let subscribeAxe = function(bar){
  const height = params.height*(params.n+2);
  const axis_radius = params.min_radius/3;
  let geometry = new THREE.CylinderGeometry( axis_radius, axis_radius, height, 100),
      material = mat_dark,
      cylinder = new THREE.Mesh( geometry, material );
  cylinder.position.x = 2*params.max_radius*(bar+1);
  cylinder.position.y = 3;
  cylinder.position.z = height/2;
  cylinder.rotation.x = Math.PI / 2;
  scene.add( cylinder );
  piecesState.axis[bar] = cylinder;
}

let subscribeAxis = function(){
  for(let i=0; i<piecesState.bars.length; i++)
    subscribeAxe(i);
}

subscribeCylinders(0);
subscribeAxis();

let light = new THREE.PointLight(0xffffff, 1.0);
light.position.set(4, 4, 10);


scene.add(light)
camera.position.x = 4;
camera.position.z = 5;
camera.position.y = -3;
camera.up = new THREE.Vector3(0, 0, 1);
camera.lookAt(new THREE.Vector3(4, 4, 0));

var t_blacks=Math.PI/2.0;
var t_whites=3.0*Math.PI/2.0;
var anim_time=0;

t=t_whites

boardcenter = new THREE.Vector3(4, 4, 0)

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(-1000,-1000);
var nmouse = new THREE.Vector2(-1000,-1000);

function updateCursor() {
	var width=window.innerWidth;
	var height=window.innerHeight;

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components
	nmouse.x = ( event.clientX / width ) * 2 - 1;
	nmouse.y = - ( event.clientY / height ) * 2 + 1;

	mouse.x= event.clientX -width/2
	mouse.y= -event.clientY + height/2

	raycaster.setFromCamera( nmouse, camera );
}


var state='preselect'
var grab=null;
var whites_turn=true;

var grab_x, grab_y;

function state_update(event) {
  if (event.type!='paint')
  {
    for(let bar of piecesState.bars)
      for(let piece of bar)
        piece.material= (piece.is_clear && piecesState.holdPiece == null)? mat_highlight: mat_dark;

    if(piecesState.holdPiece != null)
      piecesState.holdPiece.material = mat_highlight;

    updateCursor();
  }

  if (event.type=='mousemove' && state=='preselect')
  {
    if(!piecesState.lock){
      intersects = raycaster.intersectObjects(piecesState.bars.flat());
      for(let piece of piecesState.bars.flat())
        piece.is_clear=false;
      for(let piece of intersects)
        piece.object.is_clear=true;
    }
  }

  if (event.type=='mousedown' && state=='preselect')
  {
    for(let bar=0;bar<3;bar++){
      let last=[getLast(bar)].filter(x=>x!=null);
      intersects = raycaster.intersectObjects(last);
      for(let piece of intersects){
        piece.object.is_clear=true;
        state_update(new Event('paint'));
        piece.object.position.z = params.height*(params.n+5);
        piecesState.holdPiece = piece.object;
        piecesState.lastAxe = bar;
        piecesState.bars[bar] = piecesState.bars[bar].filter(x=>x!=piecesState.holdPiece);
        state='grab';
      }
    }
  }

  if (event.type=='mousemove' && state=='grab')
  {
    intersects = raycaster.intersectObjects([piecesState.holdPiece]);
    if(intersects.length)
      piecesState.holdPiece.position.x = intersects[0].point.x;
  }

  if (event.type=='mouseup' && state=='grab')
  {
    for(let bar=0;bar<3;bar++){
      intersects = raycaster.intersectObjects([piecesState.axis[bar]]);
      if(intersects.length && intersects[0].object.material == mat_highlight){
        let piece = piecesState.holdPiece;
        piece.position.z = params.height*(piecesState.bars[bar].length+1);
        piece.position.x = 2*params.max_radius*(bar+1);
        piecesState.holdPiece.is_clear=false;
        piecesState.bars[bar].push(piece);
        piecesState.holdPiece = null;
        piecesState.lastAxe = bar;
        state='preselect';
        for(let axe of piecesState.axis)
          axe.material = mat_dark;
        return;
      }
    }

    let bar = piecesState.lastAxe;
    let piece = piecesState.holdPiece;
    piece.position.z = params.height*(piecesState.bars[bar].length+1);
    piece.position.x = 2*params.max_radius*(bar+1);
    piecesState.holdPiece.is_clear=false;
    piecesState.bars[bar].push(piece);
    piecesState.holdPiece = null;
    state='preselect';
    for(let axe of piecesState.axis)
      axe.material = mat_dark;
    return;
  }

  if (event.type=='paint' && state=='turning')
  {
    anim_time=anim_time+0.05;
	if(whites_turn) t=t_blacks+anim_time;
	else t=t_whites+anim_time;
	if (anim_time>Math.PI) state='preselect';
  }

  if (event.type=='paint' && state=='grab')
  {
      for(let bar=0;bar<3;bar++){
        let last = getLast(bar);
        if(last == null || (piecesState.holdPiece != null && last.geometry.boundingSphere.radius > piecesState.holdPiece.geometry.boundingSphere.radius))
          piecesState.axis[bar].material = mat_highlight;
      }
  }
}

let check = function(){
  return piecesState.bars[0].length == 0 && piecesState.bars[1].length == 0 && piecesState.bars[2].length == params.n;
}
let estado=-1;
function animate() {

    requestAnimationFrame(animate);
    state_update(new Event('paint'));

    camera.position.x = 5 * Math.cos(t) + 4;
    camera.position.y = 5 * Math.sin(t) + 4;
    camera.position.z = 5 + Math.sin(t / 2.0) + 2 * Math.sin(t * 2.0);
    camera.up.set(0, 0, 1)
    camera.lookAt(boardcenter);

    renderer.render(scene, camera);

    if(estado == -1){
      estado = 0;
    } else if(estado == 0){
      if(check())
        estado = 1;
    } else if(estado == 1) {
      alert("really good!");
      estado = 10;
    }

}

window.addEventListener( 'mousemove', state_update, false );
window.addEventListener( 'mouseup', state_update, false );
window.addEventListener( 'mousedown', state_update, false );
animate();
