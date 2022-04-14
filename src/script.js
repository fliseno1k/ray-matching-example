import * as THREE from 'three';


export default class Sketch {
    constructor() {
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
        this.camera.position.z = 1;
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        document.querySelector('#container').appendChild(this.renderer.domElement);
        window.addEventListener('resize', this.updateSizes.bind(this));

        this.addMesh();
        this.render();
    }

    updateSizes() {
        const sizes = {
            width: window.innerWidth, 
            height: window.innerHeight
        };

        this.camera.aspect = sizes.width / sizes.height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(sizes.width, sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    addMesh() {
        this.geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        this.material = new THREE.MeshNormalMaterial();
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.scene.add(this.mesh);
    }

    render() {
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;

        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(this.render.bind(this));
    }
}

new Sketch();