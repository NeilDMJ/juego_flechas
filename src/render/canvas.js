import { dibujarPuntaFlecha } from './arrows.js';
import { generarEnteroAleatorio } from '../core/utils.js';
import { espaciosLibres , generarCaminos} from '../core/pathfinding.js';

const selectFilas = document.getElementById("tamaño");
const color = document.getElementById("color");
const canvas = document.getElementById("lienzo");
const ctx = canvas.getContext("2d");

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
    if (camino.length === 1) {
        const [fila, columna] = camino[0];
        tablero[fila][columna] = 2;
        
        const direccion = camino.direccionPrevia || 1;
        
        let puntoAnterior;
        if (direccion === 1) {
            puntoAnterior = [fila + 1, columna];
        } else if (direccion === 2) {
            puntoAnterior = [fila, columna - 1];
        } else if (direccion === 3) {
            puntoAnterior = [fila - 1, columna];
        } else if (direccion === 4) {
            puntoAnterior = [fila, columna + 1];
        }
        
        const caminoParaDibujar = [puntoAnterior, camino[0]];
        dibujarPuntaFlecha(ctx, centros, caminoParaDibujar);
        return;
    }

    for (let i = 0; i < camino.length - 1; i++) {
        const [fila, columna] = camino[i];
        const [filaSig, columnaSig] = camino[i + 1];

        const [centroInicioX, centroInicioY] = centros[fila][columna];
        const [centroFinX, centroFinY] = centros[filaSig][columnaSig];

        if (tablero[fila][columna] === 0 || tablero[fila][columna] === 2) {
            dibujarLinea(ctx, centroInicioX, centroInicioY, centroFinX, centroFinY);
            tablero[fila][columna] = 1;
            if (i === camino.length - 2) {
                tablero[filaSig][columnaSig] = 2;
                dibujarPuntaFlecha(ctx, centros, camino);
            }
        } else {
            console.log(`Saltando (celda ya ocupada)`);
        }
    }
}

export function rellenarConflechas(ctx, centros, tablero) {
    const maxCaminos = Math.floor(tablero.length / 2) + 3;
    const caminos = generarCaminos(tablero, maxCaminos);
    
    caminos.forEach(camino => {
        dibujar(ctx, centros, tablero, camino);
    });
}