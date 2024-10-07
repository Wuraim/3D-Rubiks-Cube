import { isCameraUpsideDown } from "./cameraHandler";

export function displayCameraCoord(camera, rubiks, face){
    document.querySelector('#xCam').textContent = 'x : ' + camera.position.x.toFixed(2);
    document.querySelector('#yCam').textContent = 'y : ' + camera.position.y.toFixed(2);
    document.querySelector('#zCam').textContent = 'z : ' + camera.position.z.toFixed(2);
  
    document.querySelector('#rotationX').textContent = 'Rotation.x : ' + rubiks.rotation.x.toFixed(2);
    document.querySelector('#rotationY').textContent = 'Rotation.y : ' + rubiks.rotation.y.toFixed(2);
    document.querySelector('#rotationZ').textContent = 'Rotation.z : ' + rubiks.rotation.z.toFixed(2);

    document.querySelector('#face').textContent = 'face:' + face;
  }