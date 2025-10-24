/**
 * Funciones básicas de dibujo en canvas
 */

const selectFilas = document.getElementById("tamaño");
const color = document.getElementById("color");
const canvas = document.getElementById("lienzo");
const ctx = canvas.getContext("2d");

// Función para calcular el tamaño del bloque dinámicamente
export function getBloqueSize() {
    return canvas.width / parseInt(selectFilas.value);
}

export { canvas, ctx, color, selectFilas };

export function dibujarLinea(ctx,inicioX, inicioY, finX,finY) {
    ctx.beginPath();
    ctx.moveTo(inicioX , inicioY );
    ctx.lineWidth = 3;
    ctx.strokeStyle = color.value;
    ctx.lineTo(finX , finY );
    ctx.stroke();
}
