const productos = {
    panificados: [
        { id: 1, nombre: "Pan de Mesa", precio: 999, imagen: "./img/pandemesa.jpg" },
        { id: 2, nombre: "Pan de Hamburguesa", precio: 999, imagen: "./img/panhamburguesa.jpg" },
        { id: 3, nombre: "Pan de Pancho", precio: 999, imagen: "./img/panpancho.jpg" }
    ],
    pastas: [
        { id: 1, nombre: "Fideos", precio: 999, imagen: "./img/fideos.jpg" },
        { id: 2, nombre: "Ñoquis", precio: 999, imagen: "./img/nioquis.jpg" },
        { id: 3, nombre: "Ravioles", precio: 999, imagen: "./img/ravioles.jpg" }
    ],
    pascualinas: [
        { id: 1, nombre: "Pascualina Criolla", precio: 999, imagen: "./img/criolla.jpg" },
        { id: 2, nombre: "Pascualina hojaldre", precio: 999, imagen: "./img/hojaldre.jpg" },
    ],
};

// Cargar el carrito desde el Local Storage
const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para mostrar productos de una categoría
function mostrarProductos(categoria) {
    const productosContainer = document.getElementById('productos-container');
    productosContainer.innerHTML = '';

    productos[categoria].forEach(producto => {
        const div = crearProductoHTML(producto, categoria);
        productosContainer.appendChild(div);
    });
}

// Genera el HTML de un producto
function crearProductoHTML(producto, categoria) {
    const div = document.createElement('div');
    div.classList.add('producto');
    div.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p>Precio: $${producto.precio.toFixed(2)}</p>
        <input type="number" id="cantidad-${categoria}-${producto.id}" value="1" min="1" />
        <button onclick="agregarAlCarrito(${producto.id}, '${categoria}')">Agregar al Carrito</button>
    `;
    return div;
}

// Función para agregar producto al carrito
function agregarAlCarrito(id, categoria) {
    const cantidadInput = document.getElementById(`cantidad-${categoria}-${id}`);
    const cantidad = parseInt(cantidadInput.value, 10);

    if (isNaN(cantidad) || cantidad < 1) {
        alert('Por favor, ingresa una cantidad válida.');
        return;
    }

    const producto = productos[categoria].find(p => p.id === id);
    const total = producto.precio * cantidad;
    const productoCarrito = carrito.find(item => item.id === id && item.categoria === categoria);

    if (productoCarrito) {
        productoCarrito.cantidad += cantidad;
        productoCarrito.total = productoCarrito.precio * productoCarrito.cantidad;
    } else {
        carrito.push({ ...producto, cantidad, total, categoria });
    }

    guardarCarrito();
    actualizarCarrito();
}

// Guardar el carrito en el Local Storage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Actualiza el carrito en el DOM y el Local Storage
function actualizarCarrito() {
    const carritoCount = document.getElementById('carrito-count');
    const carritoItems = document.getElementById('carrito-items');
    const totalSum = document.getElementById('total');

    carritoCount.textContent = carrito.length;
    carritoItems.innerHTML = '';
    let sumaTotal = 0;

    carrito.forEach((producto, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${producto.nombre} - Cantidad: ${producto.cantidad} - Total: $${producto.total.toFixed(2)}
            <button onclick="eliminarDelCarrito(${index})">Eliminar</button>
        `;
        carritoItems.appendChild(li);
        sumaTotal += producto.total;
    });

    totalSum.textContent = sumaTotal.toFixed(2);
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    actualizarCarrito();
}

// Al cargar la página, actualizamos el carrito con los datos almacenados en el Local Storage
document.addEventListener('DOMContentLoaded', actualizarCarrito);

function comprarProductos() {
    if (carrito.length === 0) {
        alert("El carrito está vacío. Agrega productos antes de comprar.");
        return;
    }

    const sumaTotal = carrito.reduce((total, producto) => total + producto.total, 0).toFixed(2);
    const mensajeCompra = document.getElementById('mensaje-compra');
    mensajeCompra.textContent = `El total de su compra es $${sumaTotal}. ¿Desea completar la compra?`;

    // Mostrar el modal
    const modal = document.getElementById('modal-compra');
    modal.style.display = 'flex';
}

function finalizarCompra() {
    // Vaciar el carrito
    carrito.length = 0;
    guardarCarrito();
    actualizarCarrito();

    // Cerrar el modal
    cerrarModalCompra();

    // Mensaje de agradecimiento
    alert("Gracias por su compra. ¡Esperamos verlo pronto!");
}

function cerrarModalCompra() {
    const modal = document.getElementById('modal-compra');
    modal.style.display = 'none';
}
