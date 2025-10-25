# Juego de Flechas Interactivo

Aplicación web interactiva donde flechas se generan aleatoriamente en un tablero y pueden ser movidas mediante clicks. El proyecto implementa algoritmos de búsqueda de caminos y detección de colisiones.

## Descripción del Proyecto

Este proyecto genera un tablero configurable donde se dibujan múltiples flechas de forma aleatoria. Las flechas ocupan varias celdas del tablero y tienen una dirección específica. Al hacer click en cualquier parte de una flecha, esta avanza automáticamente en su dirección hasta salir del tablero o colisionar con otra flecha.

El sistema utiliza búsqueda en profundidad (DFS) para generar caminos válidos que no se cruzan entre sí. Además, implementa un sistema de validación que previene que dos flechas queden apuntando una hacia la otra, incluso cuando hay espacio entre ellas.

## Funcionalidades

- Generación dinámica de flechas con longitudes variables entre 2 y 15 celdas
- Búsqueda de caminos mediante algoritmo DFS con límite de profundidad
- Sistema de detección de clicks que identifica sobre qué flecha se hizo click
- Animación suave del movimiento de flechas celda por celda
- Detección de colisiones en tiempo real para detener flechas cuando chocan
- Validación de caminos que evita flechas encontradas a corta distancia
- Tablero configurable con tres tamaños: pequeño (10x10), mediano (15x15) y grande (20x20)
- Selección de color para las flechas: rojo, verde, azul o negro
- Canvas responsive que se adapta al tamaño de la ventana

### Módulos Principales

**core/pathfinding.js**  
Contiene la implementación del algoritmo DFS y la función de generación de caminos. Incluye validación para prevenir colisiones y flechas encontradas.

**core/interaccion.js**  
Maneja la detección de clicks en el canvas y el movimiento paso a paso de las flechas. Calcula si una flecha puede avanzar verificando colisiones con otras flechas y límites del tablero.

**core/tablero.js**  
Genera la matriz del tablero y proporciona funciones para obtener celdas adyacentes con orden aleatorio.

**render/canvas.js**  
Gestiona el contexto del canvas y las funciones de dibujo. Maneja el caso especial de flechas de una sola celda.

**render/arrows.js**  
Dibuja las puntas de las flechas y calcula la dirección basándose en las últimas dos celdas del camino.

## Algoritmos Implementados

### Búsqueda en Profundidad (DFS)
Se utiliza para encontrar caminos entre dos puntos aleatorios del tablero. La implementación incluye:
- Límite de profundidad configurable (por defecto n²)
- Uso de conjuntos (Set) para verificación rápida de nodos visitados
- Exploración aleatoria de vecinos mediante shuffle inline

### Validación de Caminos
Verifica que un camino sea válido antes de agregarlo al tablero:
- No debe cruzarse consigo mismo
- No debe solaparse con otros caminos existentes
- Las flechas no deben apuntar una hacia otra en un rango de 3 celdas

### Detección de Colisiones
Utiliza Sets para búsqueda en O(1) de posiciones ocupadas. Verifica:
- Colisión con el propio cuerpo de la flecha
- Colisión con otras flechas en el tablero
- Salida del tablero por los bordes

## Uso

1. Abrir `index.html` en un navegador web moderno
2. Seleccionar el tamaño del tablero deseado (Pequeño, Mediano o Grande)
3. Elegir un color para las flechas
4. Hacer click sobre cualquier flecha para iniciar su movimiento
5. La flecha avanzará automáticamente hasta salir del tablero o chocar

## Tecnologías

- HTML5 Canvas para renderizado
- JavaScript 
- CSS3 para estilos y diseño responsive
- Algoritmos de búsqueda de grafos

## Características Técnicas

- Animación a 150ms por paso para movimiento suave
- Compensación de escala CSS en detección de clicks
- Generación de hasta 3 veces el tamaño del tablero en número de flechas
- Sistema de dirección preservada para flechas de una celda
- Inline Fisher-Yates shuffle para optimización de rendimiento
