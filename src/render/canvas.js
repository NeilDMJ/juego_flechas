/**
 * Funciones básicas de dibujo en canvas
 */

import { dibujarPuntaFlecha } from './arrows.js';

const selectFilas = document.getElementById("tamaño");
const color = document.getElementById("color");
const canvas = document.getElementById("lienzo");
const ctx = canvas.getContext("2d");

// Función para calcular el tamaño del bloque dinámicamente
export function getBloqueSize() {
    return canvas.width / parseInt(selectFilas.value);
}

export { canvas, ctx, color, selectFilas };

export function dibujarLinea(ctx, inicioX, inicioY, finX, finY) {
    ctx.beginPath();
    ctx.moveTo(inicioX, inicioY);
    ctx.lineWidth = 5;
    ctx.strokeStyle = color.value;
    ctx.lineTo(finX, finY);
    ctx.stroke();
}

export function dibujar(ctx, centros, tablero, camino) {

    for (let i = 0; i < camino.length - 1; i++) {
        const [fila, columna] = camino[i];
        const [filaSig, columnaSig] = camino[i + 1];

        const [centroInicioX, centroInicioY] = centros[fila][columna];
        const [centroFinX, centroFinY] = centros[filaSig][columnaSig];

        if (tablero[fila][columna] === 0 || tablero[fila][columna] === 2) {
            dibujarLinea(ctx, centroInicioX, centroInicioY, centroFinX, centroFinY);
            tablero[fila][columna] = 1; // dibujado
            if (i === camino.length - 2) {
                tablero[filaSig][columnaSig] = 2; // punta de la flecha
                // Dibujar punta de flecha
                dibujarPuntaFlecha(ctx, centros, camino);
            }
        } else {
            console.log(`Saltando (celda ya ocupada)`);
        }
    }
}