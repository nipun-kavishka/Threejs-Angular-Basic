import * as THREE from 'three';
import { Injectable, ElementRef, OnDestroy, NgZone } from '@angular/core';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

@Injectable({ providedIn: 'root' })
export class EngineService implements OnDestroy {

  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private light: THREE.AmbientLight;
  //model to load 3d object
  private model: THREE.Group;
  //store load status
  private modelStatus: boolean = false;

  private frameId: number = null;

  public constructor(private ngZone: NgZone) { }

  public ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: false,    // transparent background
      antialias: true // smooth edges
    });

    const width = window.innerWidth / 1.05;
    const height = window.innerHeight / 1.05;

    //set width anf height of the renderer
    this.renderer.setSize(width, height);

    this.setupScene();
    this.loadGLB("DOMCEK");
  }

  public setupScene() {
    // create the scene
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      70, window.innerWidth / window.innerHeight, 0.1, 10000
    );
    //set and adjust camera position
    this.camera.position.z = 6;
    this.camera.position.y = 2;
    this.scene.add(this.camera);

    // soft white light
    this.light = new THREE.AmbientLight(0xffffff);
    this.light.position.z = 10;
    this.scene.add(this.light);
  }

  loadGLB(fileName: string) {
    //re create the scene
    this.setupScene();

    //load gltf loader to render model
    var loader = new GLTFLoader();
    loader.load('../../assets/models/' + fileName + '.glb', gltf => {
      this.model = gltf.scene;
      this.scene.add(this.model);
      this.modelStatus = true;
    }, undefined, function (error) {
      console.error(error);
    });
  }

  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });
      }

      window.addEventListener('resize', () => {
        this.resize();
      });
    });
  }

  public render(): void {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });
    if (this.modelStatus)
      this.model.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
  }

  public resize(): void {
    const width = window.innerWidth / 1.05;
    const height = window.innerHeight / 1.05;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }
}
