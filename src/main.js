import { buscarCaminoConLongitud, DFS , espaciosLibres, generarCaminos} from './core/pathfinding.js';
import { generarTablero } from './core/tablero.js';
import { generarEnteroAleatorio } from './core/utils.js';
import { canvas, color, ctx, getBloqueSize, selectFilas, dibujar } from './render/canvas.js';
import { dibujarCuadricula, dibujarCentrosDeCeldas } from './render/grid.js';
import { rellenarConflechas} from './render/canvas.js';
import { detectarFlechaClick, avanzarFlechaUnPaso } from './core/interaccion.js';
import { guardarPuntuacion, obtenerMejoresPuntuaciones, mostrarMejoresPuntuaciones, borrarHistorial, esNuevoRecord } from './core/puntuacion.js';

let tablero, centros, caminos, columnas;
let animacionActiva = false;
let reiniciarBtn = document.getElementById('reiniciar');
let puntos = 0;
let flechasEliminadas = 0;
let flechasIniciales = 0;
const puntosDisplay = document.getElementById('puntos');
const flechasDisplay = document.getElementById('flechas-restantes');
const sonidoFlecha = new Audio('recursos/whoosh-transitions-sfx-01-118227.mp3');

function actualizarPuntos(puntosGanados) {
    puntos += puntosGanados;
    puntosDisplay.textContent = puntos;
}

function actualizarFlechasRestantes() {
    flechasDisplay.textContent = caminos.length;
}

function verificarVictoria() {
    if (caminos.length === 0 && !animacionActiva) {
        const sonidoVictoria = new Audio('recursos/collect-points-190037.mp3');
        sonidoVictoria.play();
        
        const eficiencia = Math.floor((flechasIniciales / (flechasEliminadas)) * 100);
        const bonusEficiencia = eficiencia > 100 ? Math.floor((eficiencia - 100) * 10) : 10;
        const puntosFinales = puntos + bonusEficiencia;
        
        guardarPuntuacion(puntosFinales, columnas);
        
        const esRecord = esNuevoRecord(puntosFinales);
        
        Swal.fire({
            title: esRecord ? '¡Nuevo Record!' : 'Ganaste!',
            html: `
                <p>Has eliminado todas las flechas del tablero</p>
                <hr>
                <p><strong>Puntuación: ${puntos}</strong></p>
                <p>Bonus eficiencia: +${bonusEficiencia}</p>
                <p><strong>Total: ${puntosFinales} puntos</strong></p>
                <p style="font-size: 0.9em; color: #666;">Eficiencia: ${eficiencia}%</p>
                <hr>
                ${mostrarMejoresPuntuaciones()}
            `,
            icon: 'success',
            confirmButtonText: 'Jugar de nuevo',
            confirmButtonColor: '#4CAF50',
            showDenyButton: true,
            denyButtonText: 'Borrar historial',
            denyButtonColor: '#d33'
        }).then((result) => {
            if (result.isConfirmed) {
                iniciarJuego();
            } else if (result.isDenied) {
                borrarHistorial();
                Swal.fire('Historial borrado', '', 'info');
            }
        });
    }
}

function iniciarJuego() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    columnas = parseInt(selectFilas.value);
    const BLOQUE_TAM = getBloqueSize();
    
    puntos = 0;
    flechasEliminadas = 0;
    puntosDisplay.textContent = puntos;

    console.log(`Iniciando juego con tamaño: ${columnas}x${columnas}, BLOQUE_TAM: ${BLOQUE_TAM}`);

    //dibujarCuadricula(ctx, BLOQUE_TAM, columnas, columnas);

    centros = dibujarCentrosDeCeldas(ctx, BLOQUE_TAM, columnas, columnas);
    console.log('Centros generados:', centros.length);

    tablero = generarTablero(columnas);
    console.log('Tablero generado:', tablero.length);

    const maxCaminos = columnas * 3;
    console.log('Intentando generar max:', maxCaminos, 'caminos');
    caminos = generarCaminos(tablero, { 
        numCaminos: maxCaminos, 
        minLongitud: 3, 
        maxLongitud: 15 
    });
    
    console.log(`Se generaron ${caminos.length} caminos:`, caminos);
    
    if (caminos.length === 0) {
        console.warn('no se generaron caminos');
    }
    
    caminos.forEach((camino, index) => {
        console.log(`Dibujando camino ${index}, longitud: ${camino.length}`);
        dibujar(ctx, centros, tablero, camino);
    });
    
    flechasIniciales = caminos.length;
    actualizarFlechasRestantes();
    
    console.log('inicio');
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
        sonidoFlecha.play();
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
                
                const puntosGanados = caminoActual.length * 10;
                actualizarPuntos(puntosGanados);
                flechasEliminadas++;
                
                caminos.splice(indice, 1);
                actualizarFlechasRestantes();
                
                clearInterval(intervalo);
                animacionActiva = false;
                
                verificarVictoria();
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
        }, 30);
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

reiniciarBtn.addEventListener('click', () => {
    console.log('Boton reiniciar presionado');
    iniciarJuego();
});