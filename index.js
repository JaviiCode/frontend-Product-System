import { Producto } from './Producto.js';

const producto = new Producto();

// Función para inicializar los eventos
function inicializarEventos() {
    // Evento para el formulario de agregar producto
    const formAgregarProducto = document.getElementById('form-agregar-producto');
    formAgregarProducto.addEventListener('submit', (e) => {
        e.preventDefault();

        // Capturar datos del formulario
        const titulo = document.getElementById('titulo-producto').value;
        const categoria = document.getElementById('categoria-producto').value;
        const precio = parseFloat(document.getElementById('precio-producto').value);
        const tags = document.getElementById('tags-producto').value.split(',').map(tag => tag.trim());

        // Crear el producto
        producto.crearProducto({
            title: titulo,
            category: categoria,
            price: precio,
            tags: tags,
        });

        // Limpiar formulario
        formAgregarProducto.reset();
    });

    // Evento para el filtro por categoría
    const inputFiltroCategoria = document.getElementById('filtro-categoria');
    inputFiltroCategoria.addEventListener('input', (e) => {
        const categoria = e.target.value.trim().toLowerCase();
        producto.filtrarProductosPorCategoria(categoria); // Método para filtrar
    });
}

// Inicializar la página
function inicializarPagina() {
    inicializarEventos(); // Configurar los eventos
    producto.obtenerProductos(); // Cargar los productos
}

inicializarPagina();
