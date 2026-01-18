import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

let scene: THREE.Scene;
let garageModel: THREE.Object3D | null = null;

const loader = new GLTFLoader();

// Load garage model once
export function loadGarageModel() {
  loader.load('/models/test_hanger.glb', (gltf) => {
    garageModel = gltf.scene;
    scene.add(garageModel);
  });
}

let currentCarModel: THREE.Object3D | null = null;

export function loadCarModel(carPath: string) {
  if (currentCarModel) {
    scene.remove(currentCarModel); // Remove the existing car model from the scene
  }

  loader.load(carPath, (gltf) => {
    currentCarModel = gltf.scene;
    scene.add(currentCarModel);
  });
}

// Example: Load a car when the user selects it
export function onCarSelected(carId: string) {
  const carFilePath = `path/to/cars/${carId}.glb`;
  loadCarModel(carFilePath);
}