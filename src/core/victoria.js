import { guardarPuntuacion, mostrarMejoresPuntuaciones, borrarHistorial, esNuevoRecord } from './puntuacion.js';

export function verificarVictoria(caminos, animacionActiva, puntos, flechasIniciales, flechasEliminadas, columnas, iniciarJuego) {
    if (caminos.length === 0 && !animacionActiva) {
        const sonidoVictoria = new Audio('recursos/collect-points-190037.mp3');
        sonidoVictoria.play();
        
        const eficiencia = Math.floor((flechasIniciales / flechasEliminadas) * 100);
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
