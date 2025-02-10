export class Carrito {
    constructor() {
        this.productos = [];
    }

    //obtengo las cookie y lo almaceno en un array
    async getCarrito(){
        const carritoCokie = this.getCarritoCookie();
        if(!carritoCokie){
            return [];
        }
        const carritoCokieDiv = carritoCokie.split(',');
        let carrito = [];

        for(let productoCookie of carritoCokieDiv){
            if(!productoCookie.trim().length){
                continue;
            }
            let productodiv = productoCookie.split('_');
            let idProducto = productodiv[0];
            let udProducto = productodiv[1];
            let producto = await this.buscarProducto(idProducto);
            producto.unidadesCarrito = udProducto;
            carrito.push(producto);
        }
        this.productos = carrito;
        return carrito;
    }
    
    //buscar producto en la api por id
    async buscarProducto(id){
        return fetch(`https://dummyjson.com/products/${id}`)
        .then(res=>res.json())
        .then(respuesta=>respuesta)
    }

    //obtener valor de la cookie
    getCarritoCookie(){
        const cookies = document.cookie;
        const cookiediv = cookies.split(';');

        for(let cookie of cookiediv){
            let Div = cookie.split('=');
            let nombre = Div[0];
            let valor = Div[1];
            if(nombre == 'carrito'){
                return valor;
            }
        }
        return '';

    }

    //añade el producto al carrito y si existe lo incremente
    async añadirProducto(id, cantidad = 1) { 
        let existeProducto = false;
    
        for (let producto of this.productos) {
            if (producto.id == id) {
                producto.unidadesCarrito += cantidad; // Suma la cantidad especificada
                existeProducto = true;
            }
        }
    
        if (!existeProducto) {
            let producto = await this.buscarProducto(id);
            producto.unidadesCarrito = cantidad; // Asigna la cantidad especificada
            this.productos.push(producto);
        }
    
        let carritoString = this.generarString();
        document.cookie = "carrito=" + carritoString;
    }



    //genera una sintr del carrito con sus productos
    generarString(){
        let string = "";
        for(let producto of this.productos){
            string += producto.id+"_"+producto.unidadesCarrito+","
        }return string+";";
    }

    //mostrar productos con html
    mostrarProductos() {
        const tbody = document.querySelector('#tbody-carrito');
        if (!tbody) {
            return false;
        }
        tbody.innerHTML = '';
    
        for (let producto of this.productos) {
            const fila = document.createElement('tr');
            fila.setAttribute('data-id', producto.id);
    
            fila.innerHTML = `
                <td>${producto.id}</td>
                <td>${producto.title}</td>
                <td>$${producto.price}</td>
                <td>${producto.unidadesCarrito}</td>
                <td>
                    <input type="number" id="cantidad-eliminar-${producto.id}" 
                           class="cantidad-eliminar" min="1" max="${producto.unidadesCarrito}" 
                           value="1" style="width: 60px;" />
                    <button class="eliminar" id="eliminar-btn_${producto.id}" data-id="${producto.id}">
                        Eliminar
                    </button>
                </td>
            `;
    
            tbody.appendChild(fila);
        }
        this.agregarEventosBotones();
    }

    //funcion de eventos.
    agregarEventosBotones() {
        const botonesEliminar = document.querySelectorAll('.eliminar');
    
        botonesEliminar.forEach((boton) => {
            boton.addEventListener('click', (e) => {
                const id = boton.getAttribute('data-id');
                const inputCantidad = document.querySelector(`#cantidad-eliminar-${id}`);
                const cantidadEliminar = parseInt(inputCantidad.value, 10) || 1;
    
                this.borrarProducto(id, cantidadEliminar);
            });
        });
    }
    

    //borra o reduce el producto
    borrarProducto(id, cantidadEliminar = 1) {
        let productosModificados = [];
    
        for (let producto of this.productos) {
            if (producto.id == id) {
                // Reducir la cantidad solo si es mayor o igual a la cantidad a eliminar
                if (producto.unidadesCarrito > cantidadEliminar) {
                    producto.unidadesCarrito -= cantidadEliminar;
                    productosModificados.push(producto);
                } else if (producto.unidadesCarrito <= cantidadEliminar) {
                    // Si las unidades a eliminar son iguales o mayores, elimina el producto
                    continue;
                }
            } else {
                productosModificados.push(producto);
            }
        }
    
        this.productos = productosModificados;
        this.mostrarProductos();
        document.cookie = "carrito=" + this.generarString();
    }
}
const carrito = new Carrito();
carrito.getCarrito().then(()=>carrito.mostrarProductos());

document.cookie = "carrito="