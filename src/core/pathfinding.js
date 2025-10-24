/**
 * Algoritmos de búsqueda de caminos
 */
import { obtenerAdyacentes, generarTablero} from './tablero.js';
import { calcularDireccion } from '../render/arrows.js';

function getKey(nodo) {
    return `${nodo[0]},${nodo[1]}`;
}

//Busqueda en profundidad
export function DFS(tablero, nodoInicio, nodoFinal) {
    let visitado = new Set();
    let pila = [];
    let padres = new Map(); 

    const keyInicio = getKey(nodoInicio);
    const keyFinal = getKey(nodoFinal);

    pila.push(nodoInicio);//iniciar la pila
    visitado.add(keyInicio);
    padres.set(keyInicio,null); //el inicio no tiene padre

    let encontrado = false;

    while (pila.length > 0 ) {
        let nodoActual = pila.pop();
        let keyActual = getKey(nodoActual);

        if (keyActual === keyFinal) {
            encontrado = true;
            break;
        }

        let adyacentes = obtenerAdyacentes(nodoActual, tablero);

        for (const vecino of adyacentes) {
            let vecinoKey = getKey(vecino);

            if (!visitado.has(vecinoKey)) {
                visitado.add(vecinoKey);
                padres.set(vecinoKey,nodoActual);
                pila.push(vecino);
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
        return camino.reverse(); //camino alreves para inicio -> fin
    }
    return [];
}

export function buscarCaminoConLongitud(tablero, nodoInicio, nodoFinal, options = {}) {
    const { maxLongitud = tablero.length * 2, maxIntentos = 5 } = options;
    
    let camino = DFS(tablero, nodoInicio, nodoFinal);
    let intentos = 1;
    
    while (camino.length > maxLongitud && intentos < maxIntentos) {
        //console.log(`Intento ${intentos}: Camino demasiado largo (${camino.length} > ${maxLongitud}).`);
        
        for (let i = 0; i < tablero.length; i++) { //resetear tablero
            for (let j = 0; j < tablero[i].length; j++) {
                tablero[i][j] = 0;
            }
        }
        
        camino = DFS(tablero, nodoInicio, nodoFinal);
        intentos++;
    }
    
    if (camino.length > maxLongitud) {
        buscarCaminoConLongitud(tablero, nodoInicio, nodoFinal, options);
    }

    if (!caminoValido(camino, tablero)) {
        console.log('Camino no valido, buscando de nuevo');
        buscarCaminoConLongitud(tablero, nodoInicio, nodoFinal, options);
    }
    
    return camino;
}

function generarCaminos(tablero) {
    const caminos = [];
    let vectorLibres = new Set();

    

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
    
    // avanzazr en la direccion de la punta
    while (true) {
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
            return true; // Dirección inválida, asumimos válido
        }
        
        // verificar si sale
        if (siguiente[0] < 0 || siguiente[0] >= tablero.length || 
            siguiente[1] < 0 || siguiente[1] >= tablero[0].length) {
            return true; // salio sin chocar
        }
        
        // Verificar si choca ESPECÍFICAMENTE con su propio cuerpo
        const siguienteKey = `${siguiente[0]},${siguiente[1]}`;
        if (posicionesCamino.has(siguienteKey)) {
            return false; // Choca con su propio cuerpo
        }
        
        //vacio avanza
        if (tablero[siguiente[0]][siguiente[1]] === 0) {
            actual = siguiente;
        }
    }
}
