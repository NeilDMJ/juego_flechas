import { buscarCaminoConLongitud, DFS , espaciosLibres} from './core/pathfinding.js';
import { generarTablero } from './core/tablero.js';
import { generarEnteroAleatorio } from './core/utils.js';
import { canvas, color, ctx, getBloqueSize, selectFilas } from './render/canvas.js';
import { dibujarCuadricula, dibujarCentrosDeCeldas } from './render/grid.js';
import { rellenarConflechas} from './render/canvas.js';

function iniciarJuego() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const columnas = parseInt(selectFilas.value);
    const BLOQUE_TAM = getBloqueSize();

    console.log(`Iniciando juego con tamaño: ${columnas}x${columnas}, BLOQUE_TAM: ${BLOQUE_TAM}`);

    //dibujarCuadricula(ctx, BLOQUE_TAM, columnas, columnas);

    let centros = dibujarCentrosDeCeldas(ctx, BLOQUE_TAM, columnas, columnas);

    let tablero = generarTablero(columnas);

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
        maxLongitud: tablero.length * 2,
        maxIntentos: 20
    });
    let caminos = [camino];
    console.log('Camino encontrado:', camino);
    console.log('Longitud del camino:', camino.length);

    rellenarConflechas(ctx, centros,tablero, camino);
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