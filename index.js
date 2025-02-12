import { Producto } from './Producto.js';


const producto = new Producto();


// Función para inicializar eventos
function inicializarEventos() {

    const btnAgregarProducto = document.getElementById('btn-agregar-producto');
    btnAgregarProducto.addEventListener('click', mostrarFormularioAgregarProducto);

    const filtroCategoria = document.getElementById('filtro-categoria');
    filtroCategoria.addEventListener('input', (e) => {
        producto.filtrarPorCategoria(e.target.value);
    });
}

// Función para mostrar el formulario de agregar producto
async function mostrarFormularioAgregarProducto() {
    const tablaContenedor = document.getElementById('tabla-contenedor');
    tablaContenedor.style.display = 'none';

    const accionesTabla = document.getElementById('acciones-tabla');
    if (accionesTabla) {
        accionesTabla.remove();
    }

    const formularioExistente = document.getElementById('formulario-producto');
    if (formularioExistente) {
        return;
    }

    const contenedorPrincipal = document.getElementById('contenedor-principal');

    // Obtener categorías antes de generar el formulario
    const categorias = await producto.obtenerCategorias();

    // Generar opciones del select
    const opcionesCategorias = categorias
        .map(cat => `<option value="${cat.name || cat}">${cat.name || cat}</option>`)
        .join('');

    const formularioHTML = `
        <div id="formulario-producto">
            <h1>Añadir Nuevo Producto</h1>
            <form id="form-agregar-producto">
                <label for="titulo-producto">Título: <input type="text" id="titulo-producto" required></label>
                
                <label for="categoria-producto">Categoría:
                    <select id="categoria-producto" required>
                        <option value="" disabled selected>Selecciona una categoría</option>
                        ${opcionesCategorias}
                    </select>
                </label>
                
                <label for="precio-producto">Precio: <input type="number" id="precio-producto" required></label>
                <label for="tags-producto">Tags (separados por comas): <input type="text" id="tags-producto"></label>
                
                <button type="submit" class="boton-primario">Crear Producto</button>
                <button type="button" id="btn-cancelar" class="boton-secundario">Cancelar</button>
            </form>
        </div>
    `;

    contenedorPrincipal.insertAdjacentHTML('beforeend', formularioHTML);

    document.getElementById('form-agregar-producto').addEventListener('submit', async (e) => {
        e.preventDefault();

        const titulo = document.getElementById('titulo-producto').value;
        const categoria = document.getElementById('categoria-producto').value; // Ahora toma el valor del select
        const precio = parseFloat(document.getElementById('precio-producto').value);
        const tags = document.getElementById('tags-producto').value.split(',').map(tag => tag.trim());

        await producto.crearProducto({ title: titulo, category: categoria, price: precio, tags: tags });

        document.getElementById('formulario-producto').remove();
        tablaContenedor.style.display = 'block';

        producto.obtenerProductos();
        inicializarEventos();
    });

    document.getElementById('btn-cancelar').addEventListener('click', () => {
        document.getElementById('formulario-producto').remove();
        tablaContenedor.style.display = 'block';
        inicializarEventos();
       
    });
}





// Inicializar la página
function inicializarPagina() {
    inicializarEventos();
    producto.obtenerProductos();
}

inicializarPagina();
