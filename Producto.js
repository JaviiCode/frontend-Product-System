import { Carrito } from './Carrito.js';

export class Producto {
    constructor() {
        this.productos = [];
        this.carrito = new Carrito;
    }

    //Funcion de peticion get a la api, me traigo los productos y los meto en un array.
    async obtenerProductos() {
        try {
            const respuesta = await fetch('https://dummyjson.com/products');
            const respuestajson = await respuesta.json();
            this.productos = respuestajson.products;
            this.mostrarProductos();
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    }

    //Funcion para recorrer el array e insertarlo en la tabla de manera dinamica metiendole un atributo data-id por cada uno de los productos para identificarlos mejor en el resto del codigo.
    mostrarProductos() {
        const tbody = document.querySelector('#tbody-productos');
        tbody.innerHTML = '';

        this.productos.forEach((producto) => {
            const fila = document.createElement('tr');
            fila.setAttribute('data-id', producto.id);

            fila.innerHTML = `
                <td>${producto.id}</td>
                <td>${producto.title}</td>
                <td>${producto.category}</td>
                <td>$${producto.price}</td>
                <td>${producto.tags ? producto.tags.join(', ') : 'N/A'}</td>
                <td>
                    <button class="editar" data-id="${producto.id}">Editar</button>
                    <button class="eliminar" data-id="${producto.id}">Eliminar</button>
                    <button class="carrito" data-id="${producto.id}">Carrito</button>
                </td>
            `;

            tbody.appendChild(fila);
        });


        this.agregarEventosBotones();
    }
     //funcion para añadir producto a la cookie.
    async agregarCarrito(e) {
        let productoID = e.target.getAttribute('data-id');
        await this.carrito.añadirProducto(productoID);
        console.log(await this.carrito.getCarrito());
    }

    //eventos de botones de toda la pagina para no tener que repetir
    agregarEventosBotones() {
        document.querySelectorAll('.editar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const fila = e.target.closest('tr');
                const id = fila.getAttribute('data-id');
                const producto = this.productos.find(p => p.id == id);
                this.activarEdicionEnFila(fila, producto);
            });
        });

        document.querySelectorAll('.eliminar').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.closest('tr').getAttribute('data-id');
                await this.eliminarProducto(id);
            });
        });

        document.querySelectorAll('.carrito').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                this.agregarCarrito(e);
                this.mostrarMensaje('Producto Agregado al Carrito', 'exito');
            });
        });
    }

    // metodo para cuando le de al boton de editar se edite en la propia fila
    async activarEdicionEnFila(fila, producto) {
        const contenidoOriginal = fila.innerHTML;

        fila.innerHTML = `
            <td>${producto.id}</td>
            <td><input type="text" id="edit-title" value="${producto.title}"></td>
            <td><input type="text" id="edit-category" value="${producto.category}"></td>
            <td><input type="number" id="edit-price" value="${producto.price}"></td>
            <td><input type="text" id="edit-tags" value="${producto.tags ? producto.tags.join(', ') : ''}"></td>
            <td>
                <button class="guardar">Guardar</button>
                <button class="cancelar">Cancelar</button>
            </td>
        `;

        // Evento para guardar los cambios
        fila.querySelector('.guardar').addEventListener('click', async () => {

            const respuesta = await fetch(`https://dummyjson.com/products/${producto.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: producto.title,
                    category: producto.category,
                    price: producto.price,
                    tags: producto.tags,
                }),
            });

            if (respuesta.ok) {
                const nuevoTitulo = fila.querySelector('#edit-title').value;
                const nuevaCategoria = fila.querySelector('#edit-category').value;
                const nuevoPrecio = parseFloat(fila.querySelector('#edit-price').value);
                const nuevosTags = fila.querySelector('#edit-tags').value.split(',').map(tag => tag.trim());

                // Actualizar el producto en el array sin llamar a la API
                producto.title = nuevoTitulo;
                producto.category = nuevaCategoria;
                producto.price = nuevoPrecio;
                producto.tags = nuevosTags;

                // Volver a renderizar la fila con los nuevos datos
                fila.innerHTML = `
                <td>${producto.id}</td>
                <td>${producto.title}</td>
                <td>${producto.category}</td>
                <td>$${producto.price}</td>
                <td>${producto.tags ? producto.tags.join(', ') : 'N/A'}</td>
                <td>
                    <button class="editar" data-id="${producto.id}">Editar</button>
                    <button class="eliminar" data-id="${producto.id}">Eliminar</button>
                    <button class="carrito" data-id="${producto.id}">Carrito</button>
                </td>
            `;
                this.mostrarMensaje('Producto Actualizado.', 'exito');
                // Volver a agregar eventos a los botones de la fila actualizada
                this.agregarEventosBotones();
            }else{
                this.mostrarMensaje('Producto NO Actualizado.', 'error');
            }

        });

        // Evento para cancelar la edición y restaurar la fila original
        fila.querySelector('.cancelar').addEventListener('click', () => {
            fila.innerHTML = contenidoOriginal;
            this.agregarEventosBotones();
        });
    }

    //funcion para crear producto en la api
    async crearProducto(nuevoProducto) {
        try {
            const respuesta = await fetch('https://dummyjson.com/products/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoProducto),
            });

            const datos = await respuesta.json();

            if (respuesta.ok) {
                this.productos.push(datos);
                this.mostrarMensaje('Producto Agregado.', 'exito');
                this.mostrarProductos();
            } else {
                this.mostrarMensaje('Producto NO Agregado.', 'error');
            }
        } catch (error) {
            console.error('Error al crear el producto:', error);
        }
    }

    //funcion para filtrar por producto categoria y tags.
    filtrarPorCategoria(valor) {
        const valorFiltro = valor.toLowerCase();

        const productosFiltrados = this.productos.filter(producto => {
            const titulo = producto.title.toLowerCase();
            const categoria = producto.category.toLowerCase();
            const tags = producto.tags ? producto.tags.join(', ').toLowerCase() : '';

            return titulo.includes(valorFiltro) || categoria.includes(valorFiltro) || tags.includes(valorFiltro);
        });

        // Actualizamos la tabla con los productos filtrados
        this.mostrarProductosFiltrados(productosFiltrados);
    }

    // funcion para mostrar productos filtrados
    mostrarProductosFiltrados(productos) {
        const tbody = document.querySelector('#tbody-productos');
        tbody.innerHTML = ''; // Limpiar la tabla antes de agregar los nuevos productos

        productos.forEach((producto) => {
            const fila = document.createElement('tr');
            fila.setAttribute('data-id', producto.id);

            fila.innerHTML = `
                <td>${producto.id}</td>
                <td>${producto.title}</td>
                <td>${producto.category}</td>
                <td>$${producto.price}</td>
                <td>${producto.tags ? producto.tags.join(', ') : 'N/A'}</td>
                <td>
                    <button class="editar" data-id="${producto.id}">Editar</button>
                    <button class="eliminar" data-id="${producto.id}">Eliminar</button>
                    <button class="carrito" id="agregarCarrito_${producto.id}" data-id="${producto.id}">Carrito</button>
                </td>
            `;

            tbody.appendChild(fila);
        });
        this.agregarEventosBotones();
    }

    //funcion para eliminar producto
    async eliminarProducto(id) {
        const respuesta = await fetch(`https://dummyjson.com/products/${id}`, {
            method: 'DELETE',
        });

        if (respuesta.ok) {
            this.productos = this.productos.filter(producto => producto.id !== parseInt(id));
            this.mostrarProductos();
            this.mostrarMensaje('Producto Eliminado.', 'exito');
        } else {
            this.mostrarMensaje('Producto NO Eliminado.', 'error');
        }

    }

//funcion de las alertas
    mostrarMensaje(mensaje, tipo) {
        const mensajeContainer = document.getElementById('mensaje-container');
        const mensajeTexto = document.getElementById('mensaje-texto');

        mensajeTexto.textContent = mensaje;

        if (tipo === 'error') {
            mensajeContainer.style.backgroundColor = '#f44336';
        } else {
            mensajeContainer.style.backgroundColor = '#5a6268';
        }

        mensajeContainer.style.display = 'block';

        setTimeout(() => {
            mensajeContainer.style.display = 'none';
        }, 3000);
    }
}