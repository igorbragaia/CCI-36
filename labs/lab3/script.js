let scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000),
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x220000);
document.body.appendChild(renderer.domElement);

let mat_clear = new THREE.MeshLambertMaterial( { color: 0xFF7F7F} ),
    mat_dark = new THREE.MeshLambertMaterial( { color: 0xCE2029} ),
    mat_highlight = new THREE.MeshBasicMaterial( {color:0xFFC0CB} );

const params = {
  height: 0.2,
  max_radius: 1,
  min_radius: 0.5,
  n: 10,
}

let slots = [],
    piecesState = {
      bars:[[],[],[]],
    };

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
  scene.add( cylinder );
  piecesState.bars[bar].push( cylinder );
}

let subscribeAxe = function(bar){
  const height = params.height*(params.n+2);
  const axis_radius = params.min_radius/3;
  let geometry = new THREE.CylinderGeometry( axis_radius, axis_radius, height, 100),
      material = mat_clear,
      cylinder = new THREE.Mesh( geometry, material );
  cylinder.position.x = 2*params.max_radius*(bar+1);
  cylinder.position.y = 3;
  cylinder.position.z = height/2;
  cylinder.rotation.x = Math.PI / 2;
  scene.add( cylinder );
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
    for (i=0; i<pieces.length; i++)
      if (pieces[i].is_white) pieces[i].material=mat_white; else pieces[i].material=mat_black;

    for (i=0; i<slots.length; i++)
      slots[i].material= slots[i].is_clear? mat_clear: mat_dark;

    updateCursor();
  }

  if (event.type=='mousemove' && state=='preselect')
  {
    intersects = raycaster.intersectObjects(slots)
	if (intersects.length) {
    	if (!intersects[0].object.piece) intersects[0].object.material=mat_highlight;
	}

	intersects = raycaster.intersectObjects(pieces)
	if (intersects.length) {
	  if (intersects[0].object.is_white==whites_turn) intersects[0].object.material=mat_highlight;
	}
  }

  if (event.type=='mousedown' && state=='preselect')
  {
	intersects = raycaster.intersectObjects(pieces)
	if (intersects.length) {
	  if (intersects[0].object.is_white==whites_turn)
		{
		  state='grab'
		  grab = intersects[0].object;
		  grab.position.z=1.0;
		  grab_x=grab.position.x;
		  grab_y=grab.position.y;
		  return; // sempre retornar se mudou de estado
		}
	}
  }

  if (event.type=='mousemove' && state=='grab')
  {
    intersects = raycaster.intersectObjects(slots)
	if (intersects.length) {
	    target_slot=intersects[0].object;
    	if (!target_slot.is_clear && !target_slot.piece) {
		  target_slot.material=mat_highlight;
		  grab_x=target_slot.position.x;
		  grab_y=target_slot.position.y;
		}
	}
  }

  if (event.type=='mouseup' && state=='grab')
  {
    console.log(event.type);
    intersects = raycaster.intersectObjects(slots)
	if (intersects.length) {
	    target_slot=intersects[0].object;
    	if (!target_slot.is_clear && !target_slot.piece) {
          origin_slot=grab.slot
          origin_slot.piece=null;
          target_slot.piece=grab;
		  grab.slot=target_slot;
		  grab.position.x=target_slot.position.x;
		  grab.position.y=target_slot.position.y;
		  grab.position.z=0.5;
		  state='turning'
		  anim_time=0;
		  whites_turn=!whites_turn;

		  grab=null;
		  return; // sempre retornar se mudou de estado
		}
	}
	state='preselect'
	origin_slot=grab.slot
	grab.position.x=origin_slot.position.x;
	grab.position.y=origin_slot.position.y;
	grab.position.z=0.5;
	grab=null
	return; // sempre retornar se mudou de estado

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
     var vel=0.1
     var x= grab.position.x;
	 var y= grab.position.y;
	 var dirx= grab_x-x;
	 var diry= grab_y-y;
	 var dist=Math.sqrt(dirx*dirx+diry*diry);
	 if (dist > vel)
	 {
	   grab.position.x=x+vel*dirx/dist;
	   grab.position.y=y+vel*diry/dist;
	 }
	 else
	 {
	   grab.position.x=grab_x;
	   grab.position.y=grab_y;
	 }
  }


}


function animate() {
    requestAnimationFrame(animate);
    state_update(new Event('paint'));

    camera.position.x = 5 * Math.cos(t) + 4;
    camera.position.y = 5 * Math.sin(t) + 4;
    camera.position.z = 5 + Math.sin(t / 2.0) + 2 * Math.sin(t * 2.0);
    camera.up.set(0, 0, 1)
    camera.lookAt(boardcenter);

    renderer.render(scene, camera);
}

window.addEventListener( 'mousemove', state_update, false );
window.addEventListener( 'mouseup', state_update, false );
window.addEventListener( 'mousedown', state_update, false );
animate();
