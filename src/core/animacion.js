import { avanzarFlechaUnPaso } from './interaccion.js';
import { dibujarCentrosDeCeldas } from '../render/grid.js';
import { generarTablero } from './tablero.js';
import { dibujar, getBloqueSize } from '../render/canvas.js';
import { actualizarFlechasRestantes } from './ui.js';

export function animarFlecha(indice, caminos, tablero, ctx, columnas, onComplete) {
    const intervalo = setInterval(() => {
        const caminoActual = caminos[indice];
        
        if (!caminoActual) {
            clearInterval(intervalo);
            onComplete(null);
            return;
        }
        
        const nuevoCamino = avanzarFlechaUnPaso(caminoActual, tablero, caminos);
        
        if (nuevoCamino === null) {
            console.log(`Flecha ${indice} desapareció del tablero`);
            
            const puntosGanados = caminoActual.length * 10;
            caminos.splice(indice, 1);
            actualizarFlechasRestantes(caminos.length);
            
            clearInterval(intervalo);
            onComplete(puntosGanados);
        } else if (nuevoCamino === caminoActual) {
            console.log('La flecha no puede avanzar más');
            clearInterval(intervalo);
            onComplete(0);
        } else {
            caminos[indice] = nuevoCamino;
        }
        
        const BLOQUE_TAM = getBloqueSize();
        ctx.clearRect(0, 0, 800, 800);
        const centros = dibujarCentrosDeCeldas(ctx, BLOQUE_TAM, columnas, columnas);
        const nuevoTablero = generarTablero(columnas);
        
        caminos.forEach(c => {
            dibujar(ctx, centros, nuevoTablero, c);
        });
    }, 30);
}
