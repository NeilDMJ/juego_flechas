/**
 * Funciones de utilidad reutilizables
 */

//generar un numero aleatorio con un minimo y un maximo
export function generarEnteroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Índice aleatorio entre 0 y i
    [array[i], array[j]] = [array[j], array[i]]; // Intercambio de elementos
  }
  return array;
}

