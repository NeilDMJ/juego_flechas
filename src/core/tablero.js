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
    const [i, j] = nodo;
    const adyacentes = [];
    const filas = tablero.length;
    const columnas = tablero[0].length;
    
    // Direcciones sin mezclar primero (optimización)
    const direcciones = [
        [-1, 0], // arriba
        [0, 1],  // derecha
        [1, 0],  // abajo
        [0, -1]  // izquierda
    ];
    
    // Agregar adyacentes válidos
    for (let k = 0; k < 4; k++) {
        const nuevoI = i + direcciones[k][0];
        const nuevoJ = j + direcciones[k][1];

        if (nuevoI >= 0 && nuevoI < filas && nuevoJ >= 0 && nuevoJ < columnas) {
            if (tablero[nuevoI][nuevoJ] === 0) {
                adyacentes.push([nuevoI, nuevoJ]);
            }
        }
    }
    
    // Mezclar solo si hay múltiples opciones
    if (adyacentes.length > 1) {
        for (let i = adyacentes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [adyacentes[i], adyacentes[j]] = [adyacentes[j], adyacentes[i]];
        }
    }
    
    return adyacentes;
}
