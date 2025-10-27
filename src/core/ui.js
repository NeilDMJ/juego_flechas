const puntosDisplay = document.getElementById('puntos');
const flechasDisplay = document.getElementById('flechas-restantes');

export function actualizarPuntos(puntos) {
    puntosDisplay.textContent = puntos;
}

export function actualizarFlechasRestantes(cantidad) {
    flechasDisplay.textContent = cantidad;
}

export function resetearDisplays() {
    actualizarPuntos(0);
    actualizarFlechasRestantes(0);
}
