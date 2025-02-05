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
function mostrarFormularioAgregarProducto() {
    const tablaContenedor = document.getElementById('tabla-contenedor');
    tablaContenedor.style.display = 'none';

    const accionesTabla = document.getElementById('acciones-tabla');
    accionesTabla.classList.add('hidden');  

    const formularioExistente = document.getElementById('formulario-producto');
    if (formularioExistente) {
        return;
    }

    const contenedorPrincipal = document.getElementById('contenedor-principal');
    const formularioHTML = `
        <div id="formulario-producto">
            <h1>Añadir Nuevo Producto</h1>
            <form id="form-agregar-producto">
                <label for="titulo-producto">Título: <input type="text" id="titulo-producto" required></label>
                <label for="categoria-producto">Categoría: <input type="text" id="categoria-producto" required></label>
                <label for="precio-producto">Precio: <input type="number" id="precio-producto" required></label>
                <label for="tags-producto">Tags (separados por comas): <input type="text" id="tags-producto"></label>
                <button type="submit" class="boton-primario">Crear Producto</button>
                <button type="button" id="btn-cancelar" class="boton-secundario">Cancelar</button>
            </form>
        </div>
    `;
    contenedorPrincipal.insertAdjacentHTML('beforeend', formularioHTML);

    const formAgregarProducto = document.getElementById('form-agregar-producto');
    formAgregarProducto.addEventListener('submit', async (e) => {
        e.preventDefault();

        const titulo = document.getElementById('titulo-producto').value;
        const categoria = document.getElementById('categoria-producto').value;
        const precio = parseFloat(document.getElementById('precio-producto').value);
        const tags = document.getElementById('tags-producto').value.split(',').map(tag => tag.trim());
        
        await producto.crearProducto({ title: titulo, category: categoria, price: precio, tags: tags });

        document.getElementById('formulario-producto').remove();
        tablaContenedor.style.display = 'block';
        accionesTabla.classList.remove('hidden');
        producto.obtenerProductos();
    });

    const btnCancelar = document.getElementById('btn-cancelar');
    btnCancelar.addEventListener('click', () => {
        document.getElementById('formulario-producto').remove();
        tablaContenedor.style.display = 'block';
        accionesTabla.classList.remove('hidden');
    });
}




// Inicializar la página
function inicializarPagina() {
    inicializarEventos();
    producto.obtenerProductos(); 
}

inicializarPagina();
