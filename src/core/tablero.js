/**
 * Lógica del tablero y su estado
 * 0 : vacio
 * 1 : cuerpo de la flecha
 * 2 : punta de la flecha
 */

import {shuffleArray} from './utils.js';

export function generarTablero(filas) {
    let columnas = filas; //tablero cuadrado
    let tablero = new Array(filas);
    for (let i = 0; i < filas; i++) {
        tablero[i] = new Array(columnas);
        for (let j = 0; j < columnas; j++) {
            tablero[i][j] = 0;
        }
    }
    return tablero;
}

export function obtenerAdyacentes(nodo, tablero) {
    const [i,j] = nodo;
    const adyacentes = [];
    const filas = tablero.length;
    const columnas = tablero[0].length;
    const direcciones = [
        [-1,0], //arriba
        [0,1], //derecha
        [1,0], //abajo
        [0,-1] //izquierda
    ];

    // direcciones.forEach(direccion => {
    //     const nuevoI  = i + direccion[0];
    //     const nuevoJ = j + direccion[1];

    //     if (nuevoI >= 0 && nuevoI < filas && nuevoJ >= 0 && nuevoJ < columnas) {
    //         if (tablero[nuevoI][nuevoJ] === 0) {
    //             adyacentes.push([nuevoI, nuevoJ]);
    //         }
    //     }
    // });
    const direccionMezclada = shuffleArray(direcciones);

    for (let k = 0; k < direccionMezclada.length; k++) {

        const nuevoI  = i + direccionMezclada[k][0];
        const nuevoJ = j + direccionMezclada[k][1];

        if (nuevoI >= 0 && nuevoI < filas && nuevoJ >= 0 && nuevoJ < columnas) {
            if (tablero[nuevoI][nuevoJ] === 0) {
                adyacentes.push([nuevoI, nuevoJ]);
            }
        } 
    }
    return adyacentes;
}
