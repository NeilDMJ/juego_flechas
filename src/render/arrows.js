/**
 * Funciones especializadas en dibujar flechas
 */
import { getBloqueSize, color } from './canvas.js';

export function dibujarPuntaFlecha(ctx, centros, camino) {
    const BLOQUE_TAM = getBloqueSize();

    const ultimo = camino[camino.length - 1];
    const [filaFin, colFin] = ultimo;
    const centroX = centros[filaFin][colFin][0];
    const centroY = centros[filaFin][colFin][1];

    const tamFlecha = BLOQUE_TAM * 0.3;

    ctx.beginPath();
    const direccion = calcularDireccion(camino);

    switch (direccion) {
        case 1:
            // Arriba 
            ctx.moveTo(centroX, centroY - tamFlecha / 2);
            ctx.lineTo(centroX - tamFlecha / 2, centroY + tamFlecha / 2);
            ctx.lineTo(centroX + tamFlecha / 2, centroY + tamFlecha / 2);

            break;
        case 2:
            // Derecha 
            ctx.moveTo(centroX + tamFlecha / 2, centroY);
            ctx.lineTo(centroX - tamFlecha / 2, centroY - tamFlecha / 2);
            ctx.lineTo(centroX - tamFlecha / 2, centroY + tamFlecha / 2);
            break;
        case 3:

            // Abajo 
            ctx.moveTo(centroX, centroY + tamFlecha / 2);
            ctx.lineTo(centroX - tamFlecha / 2, centroY - tamFlecha / 2);
            ctx.lineTo(centroX + tamFlecha / 2, centroY - tamFlecha / 2);
            break
        case 4:
            // Izquierda 
            ctx.moveTo(centroX - tamFlecha / 2, centroY);
            ctx.lineTo(centroX + tamFlecha / 2, centroY - tamFlecha / 2);
            ctx.lineTo(centroX + tamFlecha / 2, centroY + tamFlecha / 2);
            break;
        default:
            break;
    }

    ctx.closePath();
    ctx.fillStyle = color.value;
    ctx.fill();

}

export function calcularDireccion(camino) {
    const ultimo = camino[camino.length - 1];
    const penultimo = camino[camino.length - 2];
    const [filaInicio, colInicio] = penultimo;
    const [filaFin, colFin] = ultimo;
    /**
     * [-1,0]  arriba -1
     * [0,1]  derecha -2
     * [1,0]  abajo -3
     * [0,-1]  izquierda -4
     */
    //calcular direccion en base a los dos puntos
    const [dirFila, dirCol] = [filaFin - filaInicio, colFin - colInicio];

    if (dirFila === -1 && dirCol === 0) {
        return 1;
    } else if (dirFila === 0 && dirCol === 1) {
        return 2;
    } else if (dirFila === 1 && dirCol === 0) {
        return 3;
    } else if (dirFila === 0 && dirCol === -1) {
        return 4;
    }
}