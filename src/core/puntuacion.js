export function guardarPuntuacion(puntosTotales, columnas) {
    const mejoresPuntuaciones = obtenerMejoresPuntuaciones();
    
    const nuevaPuntuacion = {
        puntos: puntosTotales,
        fecha: new Date().toLocaleString('es-ES'),
        tamano: columnas
    };
    
    mejoresPuntuaciones.push(nuevaPuntuacion);
    mejoresPuntuaciones.sort((a, b) => b.puntos - a.puntos);
    mejoresPuntuaciones.splice(5);
    
    localStorage.setItem('mejoresPuntuaciones', JSON.stringify(mejoresPuntuaciones));
}

export function obtenerMejoresPuntuaciones() {
    const puntuaciones = localStorage.getItem('mejoresPuntuaciones');
    return puntuaciones ? JSON.parse(puntuaciones) : [];
}

export function mostrarMejoresPuntuaciones() {
    const mejores = obtenerMejoresPuntuaciones();
    
    if (mejores.length === 0) {
        return '<p style="color: #999;">Aún no hay puntuaciones registradas</p>';
    }
    
    let html = '<div style="text-align: left; max-width: 400px; margin: 0 auto;">';
    html += '<h4 style="text-align: center; margin-bottom: 10px;">Top 5 Mejores Puntuaciones</h4>';
    html += '<ol style="padding-left: 20px;">';
    
    mejores.forEach((record) => {
        html += `<li style="margin: 8px 0;">
            <strong>${record.puntos}</strong> puntos - 
            Tablero ${record.tamano}x${record.tamano} - 
            <small>${record.fecha}</small>
        </li>`;
    });
    
    html += '</ol></div>';
    return html;
}

export function borrarHistorial() {
    localStorage.removeItem('mejoresPuntuaciones');
}

export function esNuevoRecord(puntos) {
    const mejores = obtenerMejoresPuntuaciones();
    return mejores.length === 0 || mejores[0]?.puntos < puntos;
}
