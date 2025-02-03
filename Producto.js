export class Producto {
    constructor() {
        this.productos = [];
    }

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

    mostrarProductos() {
        const tbody = document.querySelector('#tbody-productos');
        tbody.innerHTML = ''; 
    
        this.productos.forEach((producto) => {
            const fila = document.createElement('tr');
    
            fila.innerHTML = `
                <td>${producto.id}</td>
                <td>${producto.title}</td>
                <td>${producto.category}</td>
                <td>$${producto.price}</td>
                <td>${producto.tags ? producto.tags.join(', ') : 'N/A'}</td>
                <td>
                    <button class="editar" data-id="${producto.id}">Editar</button>
                    <button class="eliminar" data-id="${producto.id}">Eliminar</button>
                </td>
            `;
    
            tbody.appendChild(fila);
        });
    
        // Agregar eventos a los botones "Editar" y "Eliminar"
        document.querySelectorAll('.editar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const producto = this.productos.find(p => p.id == id);
                this.mostrarFormularioEdicion(producto);
            });
        });
    
        document.querySelectorAll('.eliminar').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                await this.eliminarProducto(id);
            });
        });
    }

    async crearProducto(nuevoProducto) {
        try {
            const respuesta = await fetch('https://dummyjson.com/products/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoProducto),
            });
    
            const datos = await respuesta.json();
    
            if (respuesta.ok) {
                alert(`Producto creado correctamente: ${datos.title}`);
                this.obtenerProductos(); // Recargar la tabla de productos
            } else {
                alert(`Error al crear el producto: ${respuesta.status}`);
            }
        } catch (error) {
            console.error('Error al crear el producto:', error);
        }
    }

    mostrarFormularioEdicion(producto) {
        const formulario = document.createElement('div');
        formulario.innerHTML = `
            <div class="modal">
                <h2>Editar Producto</h2>
                <label>Título: <input type="text" id="nuevoTitulo" value="${producto.title}"></label>
                <label>Precio: <input type="number" id="nuevoPrecio" value="${producto.price}"></label>
                <button id="guardarCambios">Guardar</button>
                <button id="cerrarModal">Cancelar</button>
            </div>
        `;
        document.body.appendChild(formulario);

        document.getElementById('guardarCambios').addEventListener('click', async () => {
            const nuevoTitulo = document.getElementById('nuevoTitulo').value;
            const nuevoPrecio = document.getElementById('nuevoPrecio').value;
            if (nuevoTitulo && nuevoPrecio) {
                await this.actualizarProducto(producto.id, { ...producto, title: nuevoTitulo, price: parseFloat(nuevoPrecio) });
                formulario.remove();
                this.obtenerProductos();
            }
        });

        document.getElementById('cerrarModal').addEventListener('click', () => {
            formulario.remove();
        });
    }

    async actualizarProducto(id, producto) {
        try {
            console.log("Intentando actualizar el producto con ID:", id);
            console.log("Datos enviados:", producto);
    
            const respuesta = await fetch(`https://dummyjson.com/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: producto.title,
                    price: producto.price
                }),
            });
    
            const datos = await respuesta.json();
    
            if (respuesta.ok) {
                alert(`Producto actualizado correctamente: ${datos.title} - $${datos.price}`);
            } else {
                alert(`Error al  actualizar: ${respuesta.status}`);
            }
    
            this.obtenerProductos(); //recargar la tabla
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
        }
    }
    
    async eliminarProducto(id) {
        try {
            const respuesta = await fetch(`https://dummyjson.com/products/${id}`, {
                method: 'DELETE',
            });
    
            if (respuesta.ok) {
                alert(`Producto con ID ${id} eliminado correctamente.`);
            } else {
                alert(`No se pudo eliminar el producto. Código: ${respuesta.status}`);
            }
    
            this.obtenerProductos(); //recargar la tabla
        } catch (error) {
            alert('Error al eliminar el producto:', error);
        }
    }
}
