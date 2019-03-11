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
		helper = new THREE.PointLightHelper(light, 0.1);

camera.position.set(10,10,10);
camera.lookAt(0,0,0);

renderer.setSize(window.innerWidth*3/4, window.innerHeight*3/4);
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

function makeBook(bookWidth, bookHeight, bookThick, color) {
    let groupBook = new THREE.Group();

    makeHardcover = function(paperWidth, paperHeight, thick) {
        let
            hardcoverWidth = paperWidth * 1.01,
            hardcoverHeight = paperHeight * 1.01,
            hardcover_geom = new THREE.BoxBufferGeometry(hardcoverWidth, hardcoverHeight, 0.01),
            hardcover_mat = new THREE.MeshLambertMaterial({
                color: color
            }),
            hardcover = new THREE.Mesh(hardcover_geom, hardcover_mat),
            groupHardcover = new THREE.Group();

				hardcover.castShadow = true; //default is false
				hardcover.receiveShadow = true; //default
        let hardcoverBack = hardcover.clone();
        let hardcoverFront = hardcover.clone();
        hardcoverFront.position.z = thick;
        hardcoverBack.position.x = hardcoverHeight / 2;
        hardcoverFront.position.x = hardcoverHeight / 2;
        hardcoverBack.position.y = hardcoverWidth / 2;
        hardcoverFront.position.y = hardcoverWidth / 2;

        let
            thick_aux = thick,
            hardcover_geom_aux = new THREE.BoxBufferGeometry(0.01, paperHeight * 1.01, thick_aux),
            hardcover_mat_aux = new THREE.MeshLambertMaterial({
                color: color
            }),
            hardcover_aux = new THREE.Mesh(hardcover_geom_aux, hardcover_mat_aux);

				hardcover_aux.castShadow = true; //default is false
				hardcover_aux.receiveShadow = true; //default
        hardcover_aux.position.x = 0;
        hardcover_aux.position.y = hardcoverWidth / 2;
        hardcover_aux.position.z = thick_aux / 2;

        groupHardcover.add(hardcoverBack);
        groupHardcover.add(hardcoverFront);
        groupHardcover.add(hardcover_aux)

        return groupHardcover;
    }

    makePages = function(paperWidth, paperHeight, thick) {
        let
            qtyPages = thick / 0.001,
            page_geom = new THREE.BoxBufferGeometry(paperWidth, paperHeight, 0.001),
            page_mat = new THREE.MeshLambertMaterial({
                color: 0xF5F5F5
            }),
        		page = new THREE.Mesh(page_geom, page_mat),
            groupPages = new THREE.Group();

				page.castShadow = true; //default is false
				page.receiveShadow = true; //default

        for (let i = 0; i < qtyPages; i++) {
            let singlePage = page.clone();
            singlePage.position.z = 0.001 * (1 / 2 + i - 1);
            singlePage.position.x = paperWidth / 2;
            singlePage.position.y = paperHeight / 2;
            groupPages.add(singlePage);
        }

        return groupPages;
    }

    let pages = makePages(bookWidth, bookHeight, bookThick);
    let hardcover = makeHardcover(bookWidth * 1.001, bookHeight * 1.001, bookThick);

    groupBook.add(pages);
    groupBook.add(hardcover);

    return groupBook;
}

let makeBookRow = function(qty) {
    let groupBookRow = new THREE.Group();

    let allThick = 0;
    for (let i = 0; i < qty; i++) {
        let bookThick = 0.1 + Math.random() / 3;
        const color = parseInt(Math.random() * 16777215);
        let book = makeBook(1, 1, bookThick, color);
        book.rotation.y = -Math.PI * (i + Math.random()) * 0.01;
        book.position.z = allThick;
        allThick += bookThick + 0.1;

        groupBookRow.add(book);
    }

    return groupBookRow;
}

let makeShelf = function(rows) {
    let
        refY = 0.5,
        baseX = 1.3,
        baseY = 0.15,
        baseZ = 5,
        base_geom = new THREE.BoxBufferGeometry(baseX, baseY, baseZ),
        base_mat = new THREE.MeshLambertMaterial({
            color: 0x654321
        }),
        base = new THREE.Mesh(base_geom, base_mat);

		base.castShadow = true; //default is false
		base.receiveShadow = true; //default

    let
        supportX = 1.3,
        supportY = 0.2 + 1.5 * rows,
        supportZ = 0.1,
        support_geom = new THREE.BoxBufferGeometry(supportX, supportY, supportZ),
        support_mat = new THREE.MeshLambertMaterial({
            color: 0x654321
        }),
        support = new THREE.Mesh(support_geom, support_mat);

		support.castShadow = true; //default is false
		support.receiveShadow = true; //default

    supportLeft = support.clone();
    supportLeft.position.z = -supportZ / 2;
    supportLeft.position.y = supportY / 2;
    supportLeft.position.x = supportX / 2;

    supportRight = support.clone();
    supportRight.position.z = -supportZ / 2 + baseZ;
    supportRight.position.y = supportY / 2;
    supportRight.position.x = supportX / 2;

    let groupBase = new THREE.Group();
    groupBase.add(supportLeft);
    groupBase.add(supportRight);

    for (let i = 0; i < rows; i++) {
        let ith_base = base.clone();
        ith_base.position.y = refY;
        ith_base.position.z = baseZ / 2;
        ith_base.position.x = baseX / 2;

        let BookRow = makeBookRow(10 - parseInt(Math.random() * 3));
        BookRow.position.y = refY + baseY / 2;
        groupBase.add(ith_base);
        groupBase.add(BookRow);

        refY += 1.5;
    }

    return groupBase;
}

shelf = makeShelf(5);
scene.add(shelf);

planegeom = new THREE.PlaneGeometry(15, 15)
planemat = new THREE.MeshLambertMaterial({
    color: 0xCCCC55
});
plane = new THREE.Mesh(planegeom, planemat);
plane.castShadow = true; //default is false
plane.receiveShadow = true;

plane.rotation.x = -Math.PI / 2.0

plane.position.x = 2
plane.position.z = 2

scene.add(plane)

var time = 0;
var animate = function() {
    requestAnimationFrame(animate);
    controls.update()

		light.position.set( 5 * Math.cos(0.01 * Math.PI * time), 10, 2.5 + 5 * Math.sin(0.01 * Math.PI * time ));
		time++;

    renderer.render(scene, camera);
};

animate();
