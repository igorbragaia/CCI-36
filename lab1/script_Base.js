var scene = new THREE.Scene(); var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); var renderer = new THREE.WebGLRenderer({antialias:true}); renderer.setSize( window.innerWidth, window.innerHeight ); document.body.appendChild( renderer.domElement );

camera.position.z = 5;

var controls = new THREE.OrbitControls( camera );

var axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );


function makeChair(col=0xFFCC22)
{

	var leg_geom= new THREE.BoxGeometry(0.3,2.0,0.3)
	var leg_mat= new THREE.MeshLambertMaterial({color:0xFF5522})
	var leg = new THREE.Mesh(leg_geom, leg_mat)

	positions=[ [0,0], [1.5, 0], [1.5, 1.5], [0, 1.5] ]

	var g= new THREE.Group()
	for (var i=0; i<positions.length; i++)
	{
	  x=positions[i][0]
	  z=positions[i][1]
	  m = leg.clone()
	  m.position.x=x
	  m.position.z=z
	  m.position.y=0
	  g.add(m)
	}

	var seat_geom = new THREE.BoxGeometry(1.8,0.2,1.8)
	var seat_mat= new THREE.MeshLambertMaterial({color:col})
	var seat=new THREE.Mesh(seat_geom,seat_mat)

	seat.position.set(0.75,1.0,0.75)

	var backrest_geom = new THREE.BoxGeometry(1.8,2.0,0.2)
	var backrest_mat= new THREE.MeshLambertMaterial({color:col})
	var backrest=new THREE.Mesh(backrest_geom,backrest_mat)

	backrest.position.set(0.75,2.0,0.0)



	var g2 = new THREE.Group()
	g2.add(g)
	g2.add(seat)
	g2.add(backrest)

	return g2
}

chairs = [ makeChair(), makeChair(0x0022FF), makeChair(0x00FF22)]
chairs[0].position.z=5
chairs[0].rotation.y=Math.PI

chairs[2].position.x=5
chairs[2].rotation.y=-Math.PI/3.0

g_chairs=new THREE.Group()

for( var i=0; i<3; i++) g_chairs.add(chairs[i]);

scene.add(g_chairs);

g_chairs.position.y=1

planegeom=new THREE.PlaneGeometry(8,8)
planemat= new THREE.MeshLambertMaterial({color:0xCCCC55})
plane= new THREE.Mesh(planegeom, planemat)

plane.rotation.x=-Math.PI/2.0

plane.position.x=2
plane.position.z=2


scene.add(plane)


var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

var light2 = new THREE.PointLight( 0xffffff, 1, 100 );
light2.position.set( 50, 20, 50 );
scene.add( light2 );





var t=0
			var animate = function () {
				requestAnimationFrame( animate );
				controls.update()
      			t=(t+1)%60

				light2.color.g=Math.abs(Math.sin(t*Math.PI/30.0))

				renderer.render( scene, camera );
			};


			animate()
