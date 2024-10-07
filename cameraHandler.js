import * as THREE from 'three';

export function limitAngle(angle){
    let result = angle;
    if(angle > Math.PI) {
        result = angle - 2 * Math.PI;
    } else if (angle < - Math.PI) {
        result = 2 * Math.PI + angle;
    }
    return result;
}

export function isCameraUpsideDown(cameraAngleSigma){
    return Math.abs(cameraAngleSigma) > Math.PI / 2;
}