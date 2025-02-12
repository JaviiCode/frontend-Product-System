import { Producto } from './Producto.js';

const producto = new Producto();

// Función para inicializar eventos
function inicializarEventos() {
    const btnAgregarProducto = document.getElementById('btn-agregar-producto');
    const filtroCategoria = document.getElementById('filtro-categoria');
    const btnIrCarrito = document.getElementById('btn-ir-carrito');

    if (btnAgregarProducto) {
        btnAgregarProducto.classList.remove('oculto');
        btnAgregarProducto.style.display = 'inline-block';
        btnAgregarProducto.addEventListener('click', mostrarFormularioAgregarProducto);
    }

    if (filtroCategoria) {
        filtroCategoria.classList.remove('oculto');
        filtroCategoria.style.display = 'block';
        filtroCategoria.addEventListener('input', (e) => {
            producto.filtrarPorCategoria(e.target.value);
        });
    }

    if (btnIrCarrito) {
        btnIrCarrito.classList.remove('oculto');
        btnIrCarrito.style.display = 'inline-block';
    }
}

// Función para mostrar el formulario de agregar producto
async function mostrarFormularioAgregarProducto() {
    const tablaContenedor = document.getElementById('tabla-contenedor');
    const accionesTabla = document.getElementById('acciones-tabla');
    const btnAgregarProducto = document.getElementById('btn-agregar-producto');
    const filtroCategoria = document.getElementById('filtro-categoria');
    const btnIrCarrito = document.getElementById('btn-ir-carrito');

    // Ocultar elementos pero sin perder sus estilos
    tablaContenedor.style.display = 'none';
    if (accionesTabla) accionesTabla.style.display = 'none';
    if (btnAgregarProducto) btnAgregarProducto.style.display = 'none';
    if (filtroCategoria) filtroCategoria.style.display = 'none';
    if (btnIrCarrito) btnIrCarrito.style.display = 'none';

    // Evitar que se cree más de un formulario
    if (document.getElementById('formulario-producto')) return;

    const contenedorPrincipal = document.getElementById('contenedor-principal');

    // Obtener categorías antes de generar el formulario
    const categorias = await producto.obtenerCategorias();
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
        const categoria = document.getElementById('categoria-producto').value;
        const precio = parseFloat(document.getElementById('precio-producto').value);
        const tags = document.getElementById('tags-producto').value.split(',').map(tag => tag.trim());

        await producto.crearProducto({ title: titulo, category: categoria, price: precio, tags });

        cerrarFormulario();
    });

    document.getElementById('btn-cancelar').addEventListener('click', cerrarFormulario);
}

// Función para cerrar el formulario y restaurar la pantalla principal
function cerrarFormulario() {
    const tablaContenedor = document.getElementById('tabla-contenedor');
    const accionesTabla = document.getElementById('acciones-tabla');
    const btnAgregarProducto = document.getElementById('btn-agregar-producto');
    const filtroCategoria = document.getElementById('filtro-categoria');
    const btnIrCarrito = document.getElementById('btn-ir-carrito');

    document.getElementById('formulario-producto')?.remove();

    tablaContenedor.style.display = 'block';
    if (accionesTabla) accionesTabla.style.display = 'block';
    
    // Restaurar los estilos de los botones correctamente
    if (btnAgregarProducto) btnAgregarProducto.style.display = 'inline-block';
    if (filtroCategoria) filtroCategoria.style.display = 'block';
    if (btnIrCarrito) btnIrCarrito.style.display = 'inline-block';

    producto.obtenerProductos();
    inicializarEventos();
}

// Inicializar la página
function inicializarPagina() {
    inicializarEventos();
    producto.obtenerProductos();
}

inicializarPagina();
