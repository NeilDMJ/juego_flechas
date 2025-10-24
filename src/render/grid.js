/**
 * Dibujo de cuadrículas y marcadores de celdas
 */

export function dibujarCuadricula(ctx, tamañoBloque, filas, columnas) {
    ctx.strokeStyle = 'lightgray';
    for (let i = 0; i <= filas; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * tamañoBloque);
        ctx.lineTo(columnas * tamañoBloque, i * tamañoBloque);
        ctx.stroke();
    }
    for (let j = 0; j <= columnas; j++) {
        ctx.beginPath();
        ctx.moveTo(j * tamañoBloque, 0);
        ctx.lineTo(j * tamañoBloque, filas * tamañoBloque);
        ctx.stroke();
    }
}

export function dibujarCentrosDeCeldas(ctx, tamañoBloque, filas, columnas) {
    const centros = [];
    ctx.fillStyle = "white";
    for (let i = 0; i < filas; i++) {
        centros[i] = [];
        for (let j = 0; j < columnas; j++) {
            const centroX = j * tamañoBloque + tamañoBloque / 2;
            const centroY = i * tamañoBloque + tamañoBloque / 2;
            centros[i][j] = [centroX, centroY];
            ctx.beginPath();
            ctx.arc(centroX, centroY, 2, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
    return centros;
}
