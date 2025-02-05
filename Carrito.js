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
    async añadirProducto(id){
        let existeProducto = false;
        for(let producto of this.productos){
            if(producto.id == id){
                producto.unidadesCarrito++;
                existeProducto = true;
            }
        }
        if(existeProducto == false){
            let producto = await this.buscarProducto(id);
            producto.unidadesCarrito = 1;
            this.productos.push(producto);
        }
        let carritoString = this.generarString();
        document.cookie = "carrito="+carritoString;
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
        if(!tbody){
            return false
        }
        tbody.innerHTML = '';

        for(let producto of this.productos){
            const fila = document.createElement('tr');
            fila.setAttribute('data-id', producto.id);

            fila.innerHTML = `
                <td>${producto.id}</td>
                <td>${producto.title}</td>
                <td>$${producto.price}</td>
                <td>${producto.unidadesCarrito}</td>
                <td>
                    <button class="eliminar" id="eliminar-btn_${producto.id}"data-id="${producto.id}">Eliminar</button>
                </td>
            `;

            tbody.appendChild(fila);
        }
        this.agregarEventosBotones();
    }

    //funcion de eventos.
    agregarEventosBotones() {
        document.querySelectorAll('.eliminar').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                let productoid= e.target.id.split("_")[1];
                this.borrarProducto(productoid);
            });
        });
    }

    //borra o reduce el producto
    borrarProducto(id){
        let productosModificados = [];
        for(let producto of this.productos){
            if(producto.id == id){
                if(producto.unidadesCarrito > 1){
                    producto.unidadesCarrito--
                    productosModificados.push(producto);
                }
            }else{
                productosModificados.push(producto);
            }
        }this.productos = productosModificados;
        this.mostrarProductos();
        document.cookie="carrito="+this.generarString()
    }
}
const carrito = new Carrito();
carrito.getCarrito().then(()=>carrito.mostrarProductos());

document.cookie = "carrito="