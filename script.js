let productos = {};  // Contendrá los productos cargados del archivo JSON
const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

document.addEventListener('DOMContentLoaded', () => {
    // Cargar los productos al inicio
    cargarProductos();
    actualizarCarrito();
});

// Cargar productos desde el archivo JSON
function cargarProductos() {
    fetch('./productos.json')  // Ruta al archivo JSON
        .then(response => response.json())
        .then(data => {
            productos = data;  // Asignamos los productos al objeto global
            // Mostrar productos al cargar la página
            mostrarProductos('panificados');  // Mostrar los productos de una categoría por defecto
            mostrarCategorias();  // Mostrar las categorías en la interfaz
        })
        .catch(error => console.error('Error al cargar productos:', error));
}

// Mostrar productos de una categoría
function mostrarProductos(categoria) {
    const productosContainer = document.getElementById('productos-container');
    productosContainer.innerHTML = '';

    if (productos[categoria]) {
        productos[categoria].forEach(producto => {
            const div = crearProductoHTML(producto, categoria);
            productosContainer.appendChild(div);
        });
    } else {
        productosContainer.innerHTML = '<p>No hay productos disponibles en esta categoría.</p>';
    }
}

// Mostrar las categorías disponibles
function mostrarCategorias() {
    const categorias = Object.keys(productos);
    const categoriasContainer = document.getElementById('categorias-container');
    categoriasContainer.innerHTML = '';

    categorias.forEach(categoria => {
        const div = document.createElement('div');
        div.classList.add('categoria');
        div.innerHTML = `<h3 onclick="mostrarProductos('${categoria}')">${categoria.charAt(0).toUpperCase() + categoria.slice(1)}</h3>`;
        categoriasContainer.appendChild(div);
    });
}

// Generar el HTML de un producto
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

// Agregar un producto al carrito
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

// Guardar el carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Actualizar el carrito en el DOM
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

// Eliminar un producto del carrito
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    actualizarCarrito();
}

// Función para mostrar el modal de compra
function comprarProductos() {
    if (carrito.length === 0) {
        alert("El carrito está vacío. Agrega productos antes de comprar.");
        return;
    }

    const sumaTotal = carrito.reduce((total, producto) => total + producto.total, 0).toFixed(2);
    const mensajeCompra = document.getElementById('mensaje-compra');
    mensajeCompra.textContent = `El total de su compra es $${sumaTotal}. ¿Desea completar la compra?`;

    const modal = document.getElementById('modal-compra');
    modal.style.display = 'flex';
}

// Función para finalizar la compra
function finalizarCompra() {
    carrito.length = 0;
    guardarCarrito();
    actualizarCarrito();

    alert("Gracias por su compra. ¡Esperamos verlo pronto!");

    cerrarModalCompra();
}

// Función para cerrar el modal
function cerrarModalCompra() {
    const modal = document.getElementById('modal-compra');
    modal.style.display = 'none';
}
