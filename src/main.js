import { buscarCaminoConLongitud, DFS , espaciosLibres, generarCaminos} from './core/pathfinding.js';
import { generarTablero } from './core/tablero.js';
import { generarEnteroAleatorio } from './core/utils.js';
import { canvas, color, ctx, getBloqueSize, selectFilas, dibujar } from './render/canvas.js';
import { dibujarCuadricula, dibujarCentrosDeCeldas } from './render/grid.js';
import { rellenarConflechas} from './render/canvas.js';
import { detectarFlechaClick, avanzarFlechaUnPaso } from './core/interaccion.js';

let tablero, centros, caminos, columnas;
let animacionActiva = false;

function iniciarJuego() {
    console.log('=== INICIANDO JUEGO ===');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    columnas = parseInt(selectFilas.value);
    const BLOQUE_TAM = getBloqueSize();

    console.log(`Iniciando juego con tamaño: ${columnas}x${columnas}, BLOQUE_TAM: ${BLOQUE_TAM}`);

    //dibujarCuadricula(ctx, BLOQUE_TAM, columnas, columnas);

    centros = dibujarCentrosDeCeldas(ctx, BLOQUE_TAM, columnas, columnas);
    console.log('Centros generados:', centros.length);

    tablero = generarTablero(columnas);
    console.log('Tablero generado:', tablero.length);

    const maxCaminos = Math.floor(columnas / 2) + 3;
    console.log('Intentando generar max:', maxCaminos, 'caminos');
    caminos = generarCaminos(tablero, { maxCaminos, maxLongitud: 10 });
    
    console.log(`Se generaron ${caminos.length} caminos:`, caminos);
    
    if (caminos.length === 0) {
        console.warn('no se generaron caminos');
    }
    
    caminos.forEach((camino, index) => {
        console.log(`Dibujando camino ${index}, longitud: ${camino.length}`);
        dibujar(ctx, centros, tablero, camino);
    });
    
    console.log('=== JUEGO INICIADO ===');
}

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const clickX = (event.clientX - rect.left) * scaleX;
    const clickY = (event.clientY - rect.top) * scaleY;
    
    const BLOQUE_TAM = getBloqueSize();
    
    console.log(`\n=== CLICK DETECTADO ===`);
    console.log(`Coordenadas canvas: (${clickX.toFixed(2)}, ${clickY.toFixed(2)})`);
    console.log(`Escala: (${scaleX.toFixed(2)}, ${scaleY.toFixed(2)})`);
    console.log(`Canvas size: ${canvas.width}x${canvas.height}`);
    console.log(`Display size: ${rect.width.toFixed(2)}x${rect.height.toFixed(2)}`);
    console.log(`Tamaño bloque: ${BLOQUE_TAM}`);
    console.log(`Caminos disponibles: ${caminos.length}`);
    
    caminos.forEach((c, idx) => {
        console.log(`Camino ${idx}:`, c);
    });
    
    const resultado = detectarFlechaClick(clickX, clickY, caminos, centros, BLOQUE_TAM);
    
    if (resultado && !animacionActiva) {
        const { camino, indice } = resultado;
        console.log(`Click en flecha ${indice}, longitud actual: ${camino.length}`);
        
        animacionActiva = true;
        
        const intervalo = setInterval(() => {
            const caminoActual = caminos[indice];
            
            if (!caminoActual) {
                clearInterval(intervalo);
                animacionActiva = false;
                return;
            }
            
            const nuevoCamino = avanzarFlechaUnPaso(caminoActual, tablero, caminos);
            
            if (nuevoCamino === null) {
                console.log(`Flecha ${indice} desapareció del tablero`);
                caminos.splice(indice, 1);
                clearInterval(intervalo);
                animacionActiva = false;
            } else if (nuevoCamino === caminoActual) {
                console.log('La flecha no puede avanzar más');
                clearInterval(intervalo);
                animacionActiva = false;
            } else {
                caminos[indice] = nuevoCamino;
            }
            
            const BLOQUE_TAM = getBloqueSize();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            centros = dibujarCentrosDeCeldas(ctx, BLOQUE_TAM, columnas, columnas);
            tablero = generarTablero(columnas);
            
            caminos.forEach(c => {
                dibujar(ctx, centros, tablero, c);
            });
        }, 150);
    } else if (animacionActiva) {
        console.log('Ya hay una animación en curso');
    } else {
        console.log('No se hizo click en ninguna flecha');
    }
});

console.log('Valor inicial del select:', selectFilas.value);
iniciarJuego();

selectFilas.addEventListener('change', () => {
    console.log(`Tamaño cambiado a: ${selectFilas.value}x${selectFilas.value}`);
    iniciarJuego();
});

color.addEventListener('change', () => {
    console.log(`Color cambiado a: ${color.value}`);
    iniciarJuego();
});