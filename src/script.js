import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import fragment from '../shaders/fragment.glsl';
import vertex from '../shaders/vertex.glsl';

export default class Sketch {
    constructor(options) {
        this.container = options.container;

        this.sizes = {
            width: this.container.offsetWidth,
            height: this.container.offsetHeight
        };
        this.mouse = new THREE.Vector2(0, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setClearColor(0xeeeeee, 1);
        this.renderer.physicallyCorrectLights = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();

        var frustrumSize = 1;
        var aspect = this.sizes.width / this.sizes.height;
        this.camera = new THREE.OrthographicCamera(
            frustrumSize / -2, 
            frustrumSize / 2, 
            frustrumSize / 2, 
            frustrumSize / -2, 
            -1000, 
            1000
        );
        this.camera.position.set(0, 0, 2);

        // this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        window.addEventListener('resize', this.resize.bind(this));
        this.container.appendChild(this.renderer.domElement);

        this.addObjects();
        this.resize();
        this.mouseEvents();
        this.render();
    }

    resize() {
        this.sizes = {
            width: this.container.offsetWidth, 
            height: this.container.offsetHeight
        };

        this.imageAspect = 1;

        let a1, a2;
        if (this.sizes.height / this.sizes.width > this.imageAspect) {
            a1 = (this.sizes.width / this.sizes.height) * this.imageAspect;
            a2 = 1;
        } else {
            a1 = 1;
            a2 = (this.sizes.height / this.sizes.width) / this.imageAspect;
        }

        this.material.uniforms.resolution.value.x = this.sizes.width;
        this.material.uniforms.resolution.value.y = this.sizes.height;
        this.material.uniforms.resolution.value.z = a1;
        this.material.uniforms.resolution.value.w = a2;
        
        // this.camera.aspect = sizes.width / sizes.height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
    }

    addMesh() {
        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshNormalMaterial({});
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.scene.add(this.mesh);
        this.camera.lookAt(this.mesh.position);
    }

    addObjects() {
        this.material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: "#extension GL_OES_standard_derivatives: enable"
            },
            side: THREE.DoubleSide,
            uniforms: {
                time: { value: this.clock.elapsedTime },
                resolution: { value: new THREE.Vector4() },
                matcap: { value: new THREE.TextureLoader().load('/matcap.png') },
                mouse: { value: new THREE.Vector2(0, 0) }
            },
            vertexShader: vertex,
            fragmentShader: fragment
        });

        this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
        this.plane = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.plane);
    }

    mouseEvents() {
        this.mouse = new THREE.Vector2();
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.pageX / this.sizes.width - 0.5, 
            this.mouse.y = -e.pageY / this.sizes.height + 0.5
        });
    }

    render() {
        this.material.uniforms.time.value = this.clock.getElapsedTime();
        this.material.uniforms.mouse.value = this.mouse;

        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(this.render.bind(this));
    }
}

const container = document.querySelector('#container');

new Sketch({ container });