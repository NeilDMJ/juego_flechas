/**
 * Funciones especializadas en dibujar flechas
 */
import { getBloqueSize, color } from './canvas.js';

export function dibujarPuntaFlecha(ctx, centros, camino) {
    const BLOQUE_TAM = getBloqueSize();
    
    //a partir de los ultimos nodos recorridos calcular la direccion de la flecha
    const ultimo = camino[camino.length - 1];
    const penultimo = camino[camino.length - 2];
    const [filaInicio, colInicio] = penultimo;
    const [filaFin, colFin] = ultimo;

    /**
     * [1,0]  abajo
     * [0,1]  derecha
     * [-1,0]  arriba
     * [0,-1]  izquierda
     */
    //calcular direccion en base a los dos puntos
    const [dirFila, dirCol] = [filaFin - filaInicio, colFin - colInicio];
    //centros 
    const centroX = centros[filaFin][colFin][0];
    const centroY = centros[filaFin][colFin][1];

    // Tamaño de la punta de flecha (proporcional al tamaño del bloque)
    const tamFlecha = BLOQUE_TAM * 0.3;

    ctx.beginPath();
    
    if (dirFila === 1 && dirCol === 0) {
        // Abajo 
        ctx.moveTo(centroX, centroY + tamFlecha / 2);
        ctx.lineTo(centroX - tamFlecha / 2, centroY - tamFlecha / 2);
        ctx.lineTo(centroX + tamFlecha / 2, centroY - tamFlecha / 2);
    } else if (dirFila === 0 && dirCol === 1) {
        // Derecha 
        ctx.moveTo(centroX + tamFlecha / 2, centroY);
        ctx.lineTo(centroX - tamFlecha / 2, centroY - tamFlecha / 2);
        ctx.lineTo(centroX - tamFlecha / 2, centroY + tamFlecha / 2);
    } else if (dirFila === -1 && dirCol === 0) {
        // Arriba 
        ctx.moveTo(centroX, centroY - tamFlecha / 2);
        ctx.lineTo(centroX - tamFlecha / 2, centroY + tamFlecha / 2);
        ctx.lineTo(centroX + tamFlecha / 2, centroY + tamFlecha / 2);
    } else if (dirFila === 0 && dirCol === -1) {
        // Izquierda 
        ctx.moveTo(centroX - tamFlecha / 2, centroY);
        ctx.lineTo(centroX + tamFlecha / 2, centroY - tamFlecha / 2);
        ctx.lineTo(centroX + tamFlecha / 2, centroY + tamFlecha / 2);
    }
    
    ctx.closePath();
    ctx.fillStyle = color.value;
    ctx.fill();
    
}

