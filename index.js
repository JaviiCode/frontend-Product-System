import { Producto } from './Producto.js';

const producto = new Producto();

// Función para crear la interfaz
function crearInterfaz() {
    // Limpiar el contenido previo
    document.body.innerHTML = ''; 

    // Crear contenedor principal
    const contenedor = document.createElement('div');
    contenedor.classList.add('contenedor');

    // Crear título
    const titulo = document.createElement('h1');
    titulo.textContent = 'Lista de Productos';
    contenedor.appendChild(titulo);

    // Crear formulario de agregar producto
    const formulario = document.createElement('div');
    formulario.classList.add('formulario'); // Clase para centrar el formulario
    formulario.innerHTML = `
        <form id="form-agregar-producto">
            <label>
                Título: <input type="text" id="titulo-producto" required>
            </label>
            <label>
                Categoría: <input type="text" id="categoria-producto" required>
            </label>
            <label>
                Precio: <input type="number" id="precio-producto" required>
            </label>
            <label>
                Tags (separados por comas): <input type="text" id="tags-producto">
            </label>
            <button type="submit" class="boton-primario">Crear Producto</button>
        </form>
    `;
    contenedor.appendChild(formulario);

    // Crear tabla de productos
    const tabla = document.createElement('table');
    tabla.id = 'tabla-productos';

    const thead = document.createElement('thead');
    const filaEncabezados = document.createElement('tr');

    const encabezados = ['ID', 'Título', 'Categoría', 'Precio', 'Tags', 'Acciones'];
    encabezados.forEach(texto => {
        const th = document.createElement('th');
        th.textContent = texto;
        filaEncabezados.appendChild(th);
    });

    thead.appendChild(filaEncabezados);

    const tbody = document.createElement('tbody');
    tbody.id = 'tbody-productos';

    tabla.appendChild(thead);
    tabla.appendChild(tbody);
    contenedor.appendChild(tabla);

    // Agregar todo al body
    document.body.appendChild(contenedor);

    // Agregar evento al formulario
    document.getElementById('form-agregar-producto').addEventListener('submit', (e) => {
        e.preventDefault();

        // Capturar datos del formulario
        const titulo = document.getElementById('titulo-producto').value;
        const categoria = document.getElementById('categoria-producto').value;
        const precio = parseFloat(document.getElementById('precio-producto').value);
        const tags = document.getElementById('tags-producto').value.split(',').map(tag => tag.trim());

        // Llamar al método `crearProducto` para enviar la petición POST
        producto.crearProducto({
            title: titulo,
            category: categoria,
            price: precio,
            tags: tags,
        });

        // Limpiar formulario
        e.target.reset();
    });
}

// Inicializar la página
function inicializarPagina() {
    crearInterfaz(); // Crear tabla y formulario
    producto.obtenerProductos(); // Cargar productos
}

inicializarPagina();
