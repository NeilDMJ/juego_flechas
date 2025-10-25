/**
 * Algoritmos de búsqueda de caminos
 */
import { obtenerAdyacentes, generarTablero} from './tablero.js';
import { calcularDireccion } from '../render/arrows.js';
import { generarEnteroAleatorio } from './utils.js';

function getKey(nodo) {
    return `${nodo[0]},${nodo[1]}`;
}

//Busqueda en profundidad con límite
export function DFS(tablero, nodoInicio, nodoFinal, maxProfundidad = null) {
    if (!maxProfundidad) {
        maxProfundidad = tablero.length * tablero.length; // n²
    }
    
    let visitado = new Set();
    let pila = [];
    let padres = new Map(); 

    const keyInicio = getKey(nodoInicio);
    const keyFinal = getKey(nodoFinal);

    pila.push({nodo: nodoInicio, profundidad: 0});
    visitado.add(keyInicio);
    padres.set(keyInicio, null);

    let encontrado = false;

    while (pila.length > 0) {
        let {nodo: nodoActual, profundidad} = pila.pop();
        let keyActual = getKey(nodoActual);

        if (keyActual === keyFinal) {
            encontrado = true;
            break;
        }
        
        // Límite de profundidad
        if (profundidad >= maxProfundidad) {
            continue;
        }

        let adyacentes = obtenerAdyacentes(nodoActual, tablero);

        for (const vecino of adyacentes) {
            let vecinoKey = getKey(vecino);

            if (!visitado.has(vecinoKey)) {
                visitado.add(vecinoKey);
                padres.set(vecinoKey, nodoActual);
                pila.push({nodo: vecino, profundidad: profundidad + 1});
            }
        }
    }

    const camino = [];

    if (encontrado) {
        let actual = nodoFinal;
        while (actual !== null) {
            camino.push(actual);
            let actualKey = getKey(actual);
            actual = padres.get(actualKey);
        }
        return camino.reverse();
    }
    return [];
}

export function buscarCaminoConLongitud(tablero, nodoInicio, nodoFinal, options = {}) {
    const { maxLongitud = tablero.length * 2, maxIntentos = 10 } = options;
    
    let intentos = 0;
    
    while (intentos < maxIntentos) {
        // Resetear tablero
        for (let i = 0; i < tablero.length; i++) {
            for (let j = 0; j < tablero[i].length; j++) {
                tablero[i][j] = 0;
            }
        }
        
        let camino = DFS(tablero, nodoInicio, nodoFinal);
        intentos++;
        
        // Verificar si el camino cumple con los requisitos
        if (camino.length === 0) {
            continue;
        }
        
        if (camino.length > maxLongitud) {
            continue;
        }
        
        if (!caminoValido(camino, tablero)) {
            continue;
        }
        
        return camino;
    }

    return [];
}

export function generarCaminos(tablero, maxCaminos = 10) {
    const caminos = [];
    let intentos = 0;
    const maxIntentosTotal = maxCaminos * 5;
    const maxLongitudCamino = Math.min(tablero.length * 3, 30); // Limitar longitud
    
    while (caminos.length < maxCaminos && intentos < maxIntentosTotal) {
        intentos++;
        
        // Encontrar nodos disponibles (optimizado)
        const nodosDisponibles = [];
        for (let i = 0; i < tablero.length; i++) {
            for (let j = 0; j < tablero[i].length; j++) {
                if (tablero[i][j] === 0) {
                    nodosDisponibles.push([i, j]);
                }
            }
        }
        
        // Si no hay suficientes nodos libres, terminar
        if (nodosDisponibles.length < 2) {
            break;
        }
        
        // Seleccionar inicio y fin aleatorios
        const indiceInicio = generarEnteroAleatorio(0, nodosDisponibles.length - 1);
        const nodoInicio = nodosDisponibles[indiceInicio];
        
        // Remover el nodo inicio
        nodosDisponibles.splice(indiceInicio, 1);
        
        const indiceFin = generarEnteroAleatorio(0, nodosDisponibles.length - 1);
        const nodoFinal = nodosDisponibles[indiceFin];
        
        // Buscar camino con límite de profundidad
        const camino = DFS(tablero, nodoInicio, nodoFinal, maxLongitudCamino);
        
        // Validar longitud mínima y validez
        if (camino.length >= 3 && camino.length <= maxLongitudCamino && caminoValido(camino, tablero)) {
            caminos.push(camino);
            
            // Marcar el tablero DESPUÉS de validar para que DFS funcione
            for (let i = 0; i < camino.length; i++) {
                const [fila, col] = camino[i];
                tablero[fila][col] = 1; // Marcar como ocupado para próximos caminos
            }
        }
    }
    
    // Resetear el tablero para que dibujar() pueda usarlo
    for (let i = 0; i < tablero.length; i++) {
        for (let j = 0; j < tablero[i].length; j++) {
            tablero[i][j] = 0;
        }
    }
    
    return caminos;
}

export function espaciosLibres(tablero) {
    let vectorLibres = [tablero.length * tablero[0].length];
    let k = 0;
    for (let i = 0; i < tablero.length; i++) {
        for (let j = 0; j < tablero[i].length; j++) {
            if (tablero[i][j] === 0) {
                vectorLibres[k] = [k];
                k++;
            }
        }
    }
    return vectorLibres;
}




function caminoValido(camino, tablero){
    if (camino.length <= 6) return true; // camino muy corto
    
    const direccion = calcularDireccion(camino);
    let actual = camino[camino.length - 1]; // ultimo
    
    const posicionesCamino = new Set();
    for (const [fila, col] of camino) {
        posicionesCamino.add(`${fila},${col}`);
    }
    
    // Límite de pasos para evitar loop infinito
    const maxPasos = tablero.length * 2;
    let pasos = 0;
    
    // avanzar en la direccion de la punta
    while (pasos < maxPasos) {
        pasos++;
        
        let siguiente;
        if (direccion === 1) {
            // Arriba
            siguiente = [actual[0] - 1, actual[1]];
        } else if (direccion === 2) {
            // Derecha
            siguiente = [actual[0], actual[1] + 1];
        } else if (direccion === 3) {
            // Abajo
            siguiente = [actual[0] + 1, actual[1]];
        } else if (direccion === 4) {
            // Izquierda
            siguiente = [actual[0], actual[1] - 1];
        } else {
            return true; // cualquier otra asumimos válido
        }
        
        // verificar si sale del tablero
        if (siguiente[0] < 0 || siguiente[0] >= tablero.length || 
            siguiente[1] < 0 || siguiente[1] >= tablero[0].length) {
            return true; // salio sin chocar
        }
        
        const siguienteKey = `${siguiente[0]},${siguiente[1]}`;
        if (posicionesCamino.has(siguienteKey)) {
            return false; // Choca con su propio cuerpo
        }
        
        // Si hay obstáculo (otra flecha), válido
        if (tablero[siguiente[0]][siguiente[1]] !== 0) {
            return true;
        }
        
        // Celda vacía, seguir avanzando
        actual = siguiente;
    }
    
    // Si llegamos aquí, asumimos válido (no chocó en maxPasos)
    return true;
}
