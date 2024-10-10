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

const carrito = [];

function mostrarProductos(categoria) {
    const productosContainer = document.getElementById('productos-container');
    productosContainer.innerHTML = ''; // Limpiar productos existentes

    productos[categoria].forEach(producto => {
        const div = document.createElement('div');
        div.classList.add('producto');
        div.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio.toFixed(2)}</p>
            <input type="number" id="cantidad-${producto.id}" value="1" min="1" />
            <button onclick="agregarAlCarrito(${producto.id}, '${categoria}')">Agregar al Carrito</button>
        `;
        productosContainer.appendChild(div);
    });
}

function agregarAlCarrito(id, categoria) {
    const cantidad = document.getElementById(`cantidad-${id}`).value;
    const producto = productos[categoria].find(p => p.id === id);
    const total = producto.precio * cantidad;

    carrito.push({ ...producto, cantidad, total });
    actualizarCarrito();
}

function actualizarCarrito() {
    const carritoCount = document.getElementById('carrito-count');
    const carritoItems = document.getElementById('carrito-items');
    const totalSum = document.getElementById('total');

    carritoCount.textContent = carrito.length;
    carritoItems.innerHTML = '';
    let sumaTotal = 0;

    carrito.forEach((producto) => {
        const li = document.createElement('li');
        li.textContent = `${producto.nombre} - Cantidad: ${producto.cantidad} - Total: $${producto.total.toFixed(2)}`;
        carritoItems.appendChild(li);
        sumaTotal += producto.total;
    });

    totalSum.textContent = sumaTotal.toFixed(2);
}

// Mostrar la opción de productos al cargar
mostrarProductos('panificados');
