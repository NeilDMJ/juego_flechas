import { obtenerAdyacentes, generarTablero} from './tablero.js';
import { calcularDireccion } from '../render/arrows.js';
import { generarEnteroAleatorio } from './utils.js';

function getKey(nodo) {
    return `${nodo[0]},${nodo[1]}`;
}

export function DFS(tablero, nodoInicio, nodoFinal, maxProfundidad = null) {
    if (!maxProfundidad) {
        maxProfundidad = tablero.length * tablero.length;
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
    const { maxLongitud = tablero.length * 2, maxIntentos = 20 } = options;
    
    let intentos = 0;
    let mejorCamino = [];
    
    while (intentos < maxIntentos) {
        // Resetear tablero
        for (let i = 0; i < tablero.length; i++) {
            for (let j = 0; j < tablero[i].length; j++) {
                tablero[i][j] = 0;
            }
        }
        
        // Pasar maxLongitud como límite de profundidad a DFS
        let camino = DFS(tablero, nodoInicio, nodoFinal, maxLongitud);
        intentos++;
        
        // Si no hay camino, continuar
        if (camino.length === 0) {
            continue;
        }
        
        // Guardar el mejor camino encontrado (por si no hay válidos)
        if (mejorCamino.length === 0 || camino.length < mejorCamino.length) {
            mejorCamino = camino;
        }
        
        // Si el camino es válido, retornarlo inmediatamente
        if (caminoValido(camino, tablero)) {
            return camino;
        }
    }
    
    // Si no se encontró camino válido, retornar el mejor encontrado
    // Esto garantiza al menos una solución
    console.warn('No se encontró camino válido, retornando mejor camino:', mejorCamino.length);
    return mejorCamino;
}

export function generarCaminos(tablero, options = {}) {
    const { numCaminos = 5, minLongitud = 2, maxLongitud = 15, maxProfundidad = null } = options;
    const n = tablero.length;
    const caminos = [];
    const celdasOcupadas = new Set();
    
    for (let intento = 0; intento < numCaminos * 20; intento++) {
        if (caminos.length >= numCaminos) break;
        
        let filaInicio = Math.floor(Math.random() * n);
        let colInicio = Math.floor(Math.random() * n);
        
        const keyInicio = `${filaInicio},${colInicio}`;
        if (celdasOcupadas.has(keyInicio)) {
            continue;
        }
        
        let filaFin = Math.floor(Math.random() * n);
        let colFin = Math.floor(Math.random() * n);
        const keyFin = `${filaFin},${colFin}`;
        
        if (celdasOcupadas.has(keyFin)) {
            continue;
        }
        
        if (filaInicio === filaFin && colInicio === colFin) {
            continue;
        }
        
        tablero[filaInicio][colInicio] = 0;
        tablero[filaFin][colFin] = 0;
        
        const camino = DFS(tablero, [filaInicio, colInicio], [filaFin, colFin], maxProfundidad);
        
        tablero[filaInicio][colInicio] = 1;
        tablero[filaFin][colFin] = 1;
        
        if (camino && camino.length >= minLongitud && camino.length <= maxLongitud) {
            if (caminoValido(camino, tablero, caminos)) {
                caminos.push(camino);
                
                for (const [fila, col] of camino) {
                    celdasOcupadas.add(`${fila},${col}`);
                }
            }
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

function caminoValido(camino, tablero, otrosCaminos) {
    const posicionesCamino = new Set();
    for (const [fila, col] of camino) {
        const key = `${fila},${col}`;
        if (posicionesCamino.has(key)) {
            return false;
        }
        posicionesCamino.add(key);
    }
    
    for (const otroCamino of otrosCaminos) {
        for (const [fila, col] of otroCamino) {
            const key = `${fila},${col}`;
            if (posicionesCamino.has(key)) {
                return false;
            }
        }
    }
    
    const direccion = calcularDireccion(camino);
    const punta = camino[camino.length - 1];
    
    const cuerpoSinPunta = camino.slice(0, -1);
    const n = tablero.length;
    
    for (let distancia = 1; distancia < n; distancia++) {
        let celdaTrayectoria;
        if (direccion === 1) celdaTrayectoria = [punta[0] - distancia, punta[1]];
        else if (direccion === 2) celdaTrayectoria = [punta[0], punta[1] + distancia];
        else if (direccion === 3) celdaTrayectoria = [punta[0] + distancia, punta[1]];
        else if (direccion === 4) celdaTrayectoria = [punta[0], punta[1] - distancia];
        else break;
        
        if (celdaTrayectoria[0] < 0 || celdaTrayectoria[0] >= n || 
            celdaTrayectoria[1] < 0 || celdaTrayectoria[1] >= n) {
            break;
        }
        
        for (const [filaC, colC] of cuerpoSinPunta) {
            if (celdaTrayectoria[0] === filaC && celdaTrayectoria[1] === colC) {
                return false;
            }
        }
    }
    
    const distanciaMinima = 3;
    
    for (const otroCamino of otrosCaminos) {
        const otraDireccion = calcularDireccion(otroCamino);
        const otraPunta = otroCamino[otroCamino.length - 1];
        
        for (let distancia = 1; distancia <= distanciaMinima; distancia++) {
            let celdaEnDireccion;
            if (direccion === 1) celdaEnDireccion = [punta[0] - distancia, punta[1]];
            else if (direccion === 2) celdaEnDireccion = [punta[0], punta[1] + distancia];
            else if (direccion === 3) celdaEnDireccion = [punta[0] + distancia, punta[1]];
            else if (direccion === 4) celdaEnDireccion = [punta[0], punta[1] - distancia];
            else continue;
            
            let otraCeldaEnDireccion;
            if (otraDireccion === 1) otraCeldaEnDireccion = [otraPunta[0] - distancia, otraPunta[1]];
            else if (otraDireccion === 2) otraCeldaEnDireccion = [otraPunta[0], otraPunta[1] + distancia];
            else if (otraDireccion === 3) otraCeldaEnDireccion = [otraPunta[0] + distancia, otraPunta[1]];
            else if (otraDireccion === 4) otraCeldaEnDireccion = [otraPunta[0], otraPunta[1] - distancia];
            else continue;
            
            if (celdaEnDireccion[0] === otraPunta[0] && celdaEnDireccion[1] === otraPunta[1] &&
                otraCeldaEnDireccion[0] === punta[0] && otraCeldaEnDireccion[1] === punta[1]) {
                return false;
            }
        }
    }
    
    return true;
}

function hayFlechaContraria(posicionPunta, direccion, todosCaminos) {
    // Calcular la posición inmediatamente frente a la punta
    let posicionFrente;
    let direccionContraria;
    
    if (direccion === 1) {
        // Arriba -> verificar celda arriba, debe apuntar abajo (3)
        posicionFrente = [posicionPunta[0] - 1, posicionPunta[1]];
        direccionContraria = 3;
    } else if (direccion === 2) {
        // Derecha -> verificar celda derecha, debe apuntar izquierda (4)
        posicionFrente = [posicionPunta[0], posicionPunta[1] + 1];
        direccionContraria = 4;
    } else if (direccion === 3) {
        // Abajo -> verificar celda abajo, debe apuntar arriba (1)
        posicionFrente = [posicionPunta[0] + 1, posicionPunta[1]];
        direccionContraria = 1;
    } else if (direccion === 4) {
        // Izquierda -> verificar celda izquierda, debe apuntar derecha (2)
        posicionFrente = [posicionPunta[0], posicionPunta[1] - 1];
        direccionContraria = 2;
    } else {
        return false;
    }
    
    // Verificar si algún camino existente tiene su punta en esa posición y apunta en dirección contraria
    for (const otroCamino of todosCaminos) {
        if (otroCamino.length === 0) continue;
        
        const otraPunta = otroCamino[otroCamino.length - 1];
        
        // Si la punta del otro camino está en la posición frente a nosotros
        if (otraPunta[0] === posicionFrente[0] && otraPunta[1] === posicionFrente[1]) {
            const otraDireccion = calcularDireccion(otroCamino);
            
            // Si apunta en dirección contraria, hay conflicto
            if (otraDireccion === direccionContraria) {
                return true;
            }
        }
    }
    
    return false;
}
