import { buscarCaminoConLongitud, DFS , espaciosLibres} from './core/pathfinding.js';
import { generarTablero } from './core/tablero.js';
import { generarEnteroAleatorio } from './core/utils.js';
import { canvas, color, ctx, getBloqueSize, selectFilas } from './render/canvas.js';
import { dibujarCuadricula, dibujarCentrosDeCeldas } from './render/grid.js';
import { dibujarLinea } from './render/canvas.js';

function iniciarJuego() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const columnas = parseInt(selectFilas.value);
    const BLOQUE_TAM = getBloqueSize();

    console.log(`Iniciando juego con tamaño: ${columnas}x${columnas}, BLOQUE_TAM: ${BLOQUE_TAM}`);

    dibujarCuadricula(ctx, BLOQUE_TAM, columnas, columnas);
    let centros = dibujarCentrosDeCeldas(ctx, BLOQUE_TAM, columnas, columnas);

    let tablero = generarTablero(columnas);

    let aleatorio = generarEnteroAleatorio(0,columnas-1);

    let coordenadasInicio = [
        generarEnteroAleatorio(0, Math.floor(columnas/2)),
        generarEnteroAleatorio(0, columnas-1)
    ];
    let coordenadasFin = [
        generarEnteroAleatorio(Math.floor(columnas/2), columnas-1),
        generarEnteroAleatorio(0, Math.floor(columnas/2))
    ];

    console.log('Coordenadas inicio:', coordenadasInicio);
    console.log('Coordenadas fin:', coordenadasFin);

    let camino = buscarCaminoConLongitud(tablero, coordenadasInicio, coordenadasFin, {
        maxLongitud: tablero.length + tablero.length/2,
        maxIntentos: 20
    });
    let caminos = [camino];
    console.log('Camino encontrado:', camino);
    console.log('Longitud del camino:', camino.length);

    function dibujar(ctx, centros,tablero, camino) {
        
        for (let i = 0; i < camino.length - 1; i++) {
            const [fila, columna] = camino[i];
            const [filaSig, columnaSig] = camino[i + 1];
            
            const [centroInicioX, centroInicioY] = centros[fila][columna];
            const [centroFinX, centroFinY] = centros[filaSig][columnaSig];

            if(tablero[fila][columna] === 0 || tablero[fila][columna] === 2){
                dibujarLinea(ctx, centroInicioX, centroInicioY, centroFinX, centroFinY);
                tablero[fila][columna] = 1; // dibujado
                if(i === camino.length - 2){
                    tablero[filaSig][columnaSig] = 2; // punta de la flecha
                }
            } else {
                console.log(`Saltando (celda ya ocupada)`);
            }
        }
    }

    dibujar(ctx, centros,tablero, camino);
}

// Iniciar juego al cargar
console.log('Valor inicial del select:', selectFilas.value);
iniciarJuego();

// Reiniciar juego cuando cambie el tamaño
selectFilas.addEventListener('change', () => {
    console.log(`Tamaño cambiado a: ${selectFilas.value}x${selectFilas.value}`);
    iniciarJuego();
});

color.addEventListener('change', () => {
    console.log(`Color cambiado a: ${color.value}`);
    iniciarJuego();
});