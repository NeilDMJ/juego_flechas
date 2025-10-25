
import { calcularDireccion } from '../render/arrows.js';

export function detectarFlechaClick(clickX, clickY, caminos, centros, bloqueSize) {
    const columnaClick = Math.floor(clickX / bloqueSize);
    const filaClick = Math.floor(clickY / bloqueSize);
    
    console.log(`Celda clickeada: [${filaClick}, ${columnaClick}]`);
    console.log(`Total de caminos: ${caminos.length}`);
    
    for (let i = 0; i < caminos.length; i++) {
        const camino = caminos[i];
        
        for (let j = 0; j < camino.length; j++) {
            const [fila, col] = camino[j];
            
            if (fila === filaClick && col === columnaClick) {
                console.log(`Encontrada flecha ${i} en posicion ${j} del camino`);
                return { camino, indice: i };
            }
        }
    }
    
    console.log('No se encontro flecha en esa celda');
    return null;
}

export function avanzarFlechaUnPaso(camino, tablero, todosCaminos) {
    if (camino.length < 2) {
        if (camino.length === 1 && camino.direccionPrevia) {
            const [fila, col] = camino[0];
            const direccion = camino.direccionPrevia;
            
            let siguiente;
            if (direccion === 1) siguiente = [fila - 1, col];
            else if (direccion === 2) siguiente = [fila, col + 1];
            else if (direccion === 3) siguiente = [fila + 1, col];
            else if (direccion === 4) siguiente = [fila, col - 1];
            
            if (siguiente && (siguiente[0] < 0 || siguiente[0] >= tablero.length || 
                siguiente[1] < 0 || siguiente[1] >= tablero[0].length)) {
                return null;
            }
        }
        return camino;
    }
    
    const direccion = calcularDireccion(camino);
    const puntaActual = camino[camino.length - 1];
    
    const posicionesOcupadas = new Set();
    for (const otroCamino of todosCaminos) {
        if (otroCamino === camino) continue;
        
        for (const [fila, col] of otroCamino) {
            posicionesOcupadas.add(`${fila},${col}`);
        }
    }
    
    let siguiente;
    
    if (direccion === 1) {
        siguiente = [puntaActual[0] - 1, puntaActual[1]];
    } else if (direccion === 2) {
        siguiente = [puntaActual[0], puntaActual[1] + 1];
    } else if (direccion === 3) {
        siguiente = [puntaActual[0] + 1, puntaActual[1]];
    } else if (direccion === 4) {
        siguiente = [puntaActual[0], puntaActual[1] - 1];
    } else {
        return camino;
    }
    
    if (siguiente[0] < 0 || siguiente[0] >= tablero.length || 
        siguiente[1] < 0 || siguiente[1] >= tablero[0].length) {
        const nuevoCamino = camino.slice(1);
        if (nuevoCamino.length === 0) return null;
        nuevoCamino.direccionPrevia = direccion;
        return nuevoCamino;
    }
    
    const siguienteKey = `${siguiente[0]},${siguiente[1]}`;
    
    const cuerpoSinCola = camino.slice(1);
    const chocaConPropioCuerpo = cuerpoSinCola.some(
        ([f, c]) => f === siguiente[0] && c === siguiente[1]
    );
    
    if (chocaConPropioCuerpo) {
        return camino;
    }
    
    if (posicionesOcupadas.has(siguienteKey)) {
        return camino;
    }
    
    const nuevoCamino = [...camino];
    nuevoCamino.push(siguiente);
    nuevoCamino.shift();
    nuevoCamino.direccionPrevia = direccion;
    
    return nuevoCamino;
}

export function avanzarFlecha(camino, tablero, todosCaminos) {
    if (camino.length < 2) return camino;
    
    const direccion = calcularDireccion(camino);
    const punta = camino[camino.length - 1];
    const longitudOriginal = camino.length;
    
    const posicionesOcupadas = new Set();
    for (const otroCamino of todosCaminos) {
        if (otroCamino === camino) continue;
        
        for (const [fila, col] of otroCamino) {
            posicionesOcupadas.add(`${fila},${col}`);
        }
    }
    
    let nuevoCamino = [...camino];
    let pasosContinuos = 0;
    const maxPasos = tablero.length * tablero.length;
    
    while (pasosContinuos < maxPasos) {
        pasosContinuos++;
        const puntaActual = nuevoCamino[nuevoCamino.length - 1];
        let siguiente;
        
        if (direccion === 1) {
            siguiente = [puntaActual[0] - 1, puntaActual[1]];
        } else if (direccion === 2) {
            siguiente = [puntaActual[0], puntaActual[1] + 1];
        } else if (direccion === 3) {
            siguiente = [puntaActual[0] + 1, puntaActual[1]];
        } else if (direccion === 4) {
            siguiente = [puntaActual[0], puntaActual[1] - 1];
        } else {
            break;
        }
        
        if (siguiente[0] < 0 || siguiente[0] >= tablero.length || 
            siguiente[1] < 0 || siguiente[1] >= tablero[0].length) {
            nuevoCamino.shift();
            
            if (nuevoCamino.length === 0) {
                return null;
            }
            continue;
        }
        
        const siguienteKey = `${siguiente[0]},${siguiente[1]}`;
        
        const cuerpoSinCola = nuevoCamino.slice(1);
        const chocaConPropioCuerpo = cuerpoSinCola.some(
            ([f, c]) => f === siguiente[0] && c === siguiente[1]
        );
        
        if (chocaConPropioCuerpo) {
            break;
        }
        
        if (posicionesOcupadas.has(siguienteKey)) {
            break;
        }
        
        nuevoCamino.push(siguiente);
        nuevoCamino.shift();
        
        if (nuevoCamino.length > longitudOriginal) {
            nuevoCamino.shift();
        }
    }
    
    return nuevoCamino;
}
