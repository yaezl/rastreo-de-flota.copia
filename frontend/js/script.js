const API_URL = 'https://sistema-de-rastreo-de-flotas.onrender.com'; // tu endpoint real
/*
// Función para verificar si el usuario está autenticado
function verificarAutenticacion() {
  token = localStorage.getItem('token');
  if (!token && !window.location.pathname.includes('logueo.html')) {
    window.location.href = 'logueo.html';
  }
}*/

// Función para inicializar la aplicación cuando se cargue
async function inicializar() {
  try {
    verificarAutenticacion();
    
    // Cargar datos iniciales según la página actual
    const paginaActual = window.location.pathname;
    if (paginaActual.includes('personal.html')) {
      await cargarConductores();
      await cargarPasajeros();
    } else if (paginaActual.includes('vehiculos.html')) {
      await cargarVehiculos();
    } else if (paginaActual.includes('cargarConductor.html') || 
               paginaActual.includes('cargarPasajero.html')) {
      await cargarPatentesVehiculos();
      verificarEdicion();
    } else if (paginaActual.includes('cargarVehiculo.html')) {
      verificarEdicion();
    }
  } catch (error) {
    console.error("Error al inicializar la aplicación:", error);
  }
}

// Función para hacer solicitudes a la API
async function fetchAPI(endpoint, method = 'GET', body = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const options = {
    method,
    headers,
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(`${API_URL}/api/${endpoint}`, options);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error en la solicitud');
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error en fetchAPI (${endpoint}):`, error);
    throw error;
  }
}

/*// Función para manejar el inicio de sesión
async function iniciarSesion(event) {
  event.preventDefault();
  
  const email = document.getElementById('floatingInput').value;
  const password = document.getElementById('floatingPassword').value;
  
  try {
    const data = await fetchAPI('auth/login', 'POST', { email, password });
    
    // Guardar token de sesión
    localStorage.setItem('token', data.session?.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    // Redirigir al dashboard
    window.location.href = 'index.html';
  } catch (error) {
    alert('Error de inicio de sesión: ' + error.message);
    console.error('Error de inicio de sesión:', error);
  }
}

// Función para cerrar sesión
function cerrarSesion() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'logueo.html';
}*/

// GESTIÓN DE CONDUCTORES
async function cargarConductores() {
  try {
    const data = await fetchAPI('conductores');
    
    const tbody = document.getElementById('conductorTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    data.forEach(conductor => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${conductor.dni}</td>
        <td>${conductor.nombreCompleto}</td>
        <td>${conductor.codigoPostal}</td>
        <td>${conductor.domicilio}</td>
        <td>${formatearFecha(conductor.vencimientoLic)}</td>
        <td>${conductor.categoriaLic}</td>
        <td>${conductor.vehiculos?.patente || 'No asignado'}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarConductor('${conductor.dni}')">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarConductor('${conductor.dni}')">Eliminar</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Error al cargar conductores:", error);
  }
}

async function guardarConductor(event) {
  event.preventDefault();
  
  const formData = new FormData(document.getElementById('conductorForm'));
  const conductor = {
    dni: formData.get('dni'),
    nombreCompleto: formData.get('nombreCompleto'),
    codigoPostal: formData.get('codigoPostal'),
    domicilio: formData.get('domicilio'),
    vencimientoLic: formData.get('vencimientoLic'),
    categoriaLic: formData.get('categoriaLic'),
    vehiculo_id: formData.get('vehiculo')
  };
  
  try {
    const isNew = !window.location.search.includes('dni=');
    if (isNew) {
      await fetchAPI('conductores', 'POST', conductor);
    } else {
      await fetchAPI(`conductores/${conductor.dni}`, 'PUT', conductor);
    }
    
    alert('Conductor guardado correctamente');
    window.location.href = 'personal.html';
  } catch (error) {
    alert('Error al guardar conductor: ' + error.message);
    console.error('Error al guardar conductor:', error);
  }
}

async function editarConductor(dni) {
  window.location.href = `cargarConductor.html?dni=${dni}`;
}

async function cargarConductorParaEditar(dni) {
  try {
    const data = await fetchAPI(`conductores/${dni}`);
    
    document.getElementById('dni').value = data.dni;
    document.getElementById('dni').readOnly = true; // No permitir editar el DNI
    document.getElementById('nombreCompleto').value = data.nombreCompleto;
    document.getElementById('codigoPostal').value = data.codigoPostal;
    document.getElementById('domicilio').value = data.domicilio;
    document.getElementById('vencimientoLic').value = data.vencimientoLic?.split('T')[0] || '';
    document.getElementById('categoriaLic').value = data.categoriaLic;
    document.getElementById('vehiculo').value = data.vehiculo_id || '';
  } catch (error) {
    console.error("Error al cargar conductor para editar:", error);
  }
}

async function eliminarConductor(dni) {
  if (!confirm('¿Está seguro de eliminar este conductor?')) return;
  
  try {
    await fetchAPI(`conductores/${dni}`, 'DELETE');
    
    alert('Conductor eliminado correctamente');
    await cargarConductores();
  } catch (error) {
    alert('Error al eliminar conductor: ' + error.message);
    console.error('Error al eliminar conductor:', error);
  }
}

async function buscarConductor() {
  const busqueda = document.getElementById('busquedaConductor').value.trim();
  
  try {
    let data;
    if (busqueda) {
      data = await fetchAPI(`conductores/buscar?q=${busqueda}`);
    } else {
      data = await fetchAPI('conductores');
    }
    
    const tbody = document.getElementById('conductorTableBody');
    tbody.innerHTML = '';
    
    data.forEach(conductor => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${conductor.dni}</td>
        <td>${conductor.nombreCompleto}</td>
        <td>${conductor.codigoPostal}</td>
        <td>${conductor.domicilio}</td>
        <td>${formatearFecha(conductor.vencimientoLic)}</td>
        <td>${conductor.categoriaLic}</td>
        <td>${conductor.vehiculos?.patente || 'No asignado'}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarConductor('${conductor.dni}')">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarConductor('${conductor.dni}')">Eliminar</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Error al buscar conductores:", error);
  }
}

// GESTIÓN DE PASAJEROS
async function cargarPasajeros() {
  try {
    const data = await fetchAPI('pasajeros');
    
    const tbody = document.getElementById('pasajeroTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    data.forEach(pasajero => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${pasajero.dni}</td>
        <td>${pasajero.nombreCompleto}</td>
        <td>${pasajero.codigoPostal}</td>
        <td>${pasajero.domicilio}</td>
        <td>${pasajero.vehiculos?.patente || 'No asignado'}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarPasajero('${pasajero.dni}')">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarPasajero('${pasajero.dni}')">Eliminar</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Error al cargar pasajeros:", error);
  }
}

async function guardarPasajero(event) {
  event.preventDefault();
  
  const formData = new FormData(document.getElementById('pasajeroForm'));
  const pasajero = {
    dni: formData.get('dni'),
    nombreCompleto: formData.get('nombreCompleto'),
    codigoPostal: formData.get('codigoPostal'),
    domicilio: formData.get('domicilio'),
    vehiculo_id: formData.get('vehiculo')
  };
  
  try {
    const isNew = !window.location.search.includes('dni=');
    if (isNew) {
      await fetchAPI('pasajeros', 'POST', pasajero);
    } else {
      await fetchAPI(`pasajeros/${pasajero.dni}`, 'PUT', pasajero);
    }
    
    alert('Pasajero guardado correctamente');
    window.location.href = 'personal.html';
  } catch (error) {
    alert('Error al guardar pasajero: ' + error.message);
    console.error('Error al guardar pasajero:', error);
  }
}

async function editarPasajero(dni) {
  window.location.href = `cargarPasajero.html?dni=${dni}`;
}

async function cargarPasajeroParaEditar(dni) {
  try {
    const data = await fetchAPI(`pasajeros/${dni}`);
    
    document.getElementById('dni').value = data.dni;
    document.getElementById('dni').readOnly = true; // No permitir editar el DNI
    document.getElementById('nombreCompleto').value = data.nombreCompleto;
    document.getElementById('codigoPostal').value = data.codigoPostal;
    document.getElementById('domicilio').value = data.domicilio;
    document.getElementById('vehiculo').value = data.vehiculo_id || '';
  } catch (error) {
    console.error("Error al cargar pasajero para editar:", error);
  }
}

async function eliminarPasajero(dni) {
  if (!confirm('¿Está seguro de eliminar este pasajero?')) return;
  
  try {
    await fetchAPI(`pasajeros/${dni}`, 'DELETE');
    
    alert('Pasajero eliminado correctamente');
    await cargarPasajeros();
  } catch (error) {
    alert('Error al eliminar pasajero: ' + error.message);
    console.error('Error al eliminar pasajero:', error);
  }
}

async function buscarPasajero() {
  const busqueda = document.getElementById('busquedaPasajero').value.trim();
  
  try {
    let data;
    if (busqueda) {
      data = await fetchAPI(`pasajeros/buscar?q=${busqueda}`);
    } else {
      data = await fetchAPI('pasajeros');
    }
    
    const tbody = document.getElementById('pasajeroTableBody');
    tbody.innerHTML = '';
    
    data.forEach(pasajero => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${pasajero.dni}</td>
        <td>${pasajero.nombreCompleto}</td>
        <td>${pasajero.codigoPostal}</td>
        <td>${pasajero.domicilio}</td>
        <td>${pasajero.vehiculos?.patente || 'No asignado'}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarPasajero('${pasajero.dni}')">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarPasajero('${pasajero.dni}')">Eliminar</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Error al buscar pasajeros:", error);
  }
}

// GESTIÓN DE VEHÍCULOS
async function cargarVehiculos() {
  try {
    const data = await fetchAPI('vehiculos');
    
    const tbody = document.getElementById('vehiculoTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    data.forEach(vehiculo => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${vehiculo.patente}</td>
        <td>${vehiculo.marca}</td>
        <td>${vehiculo.modelo}</td>
        <td>${vehiculo.combustible}</td>
        <td>${vehiculo.kilometraje}</td>
        <td>${formatearFecha(vehiculo.rto)}</td>
        <td>${vehiculo.equipamiento}</td>
        <td>${vehiculo.conductores?.nombreCompleto || 'No asignado'}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarVehiculo('${vehiculo.patente}')">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarVehiculo('${vehiculo.patente}')">Eliminar</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Error al cargar vehículos:", error);
  }
}

async function guardarVehiculo(event) {
  event.preventDefault();
  
  const formData = new FormData(document.getElementById('vehiculoForm'));
  const vehiculo = {
    patente: formData.get('patente'),
    marca: formData.get('marca'),
    modelo: formData.get('modelo'),
    combustible: formData.get('combustible'),
    kilometraje: Number(formData.get('kilometraje')),
    rto: formData.get('rto'),
    equipamiento: formData.get('equipamiento')
  };
  
  try {
    const isNew = !window.location.search.includes('patente=');
    if (isNew) {
      await fetchAPI('vehiculos', 'POST', vehiculo);
    } else {
      await fetchAPI(`vehiculos/${vehiculo.patente}`, 'PUT', vehiculo);
    }
    
    alert('Vehículo guardado correctamente');
    window.location.href = 'vehiculos.html';
  } catch (error) {
    alert('Error al guardar vehículo: ' + error.message);
    console.error('Error al guardar vehículo:', error);
  }
}

async function editarVehiculo(patente) {
  window.location.href = `cargarVehiculo.html?patente=${patente}`;
}

async function cargarVehiculoParaEditar(patente) {
  try {
    const data = await fetchAPI(`vehiculos/${patente}`);
    
    document.getElementById('patente').value = data.patente;
    document.getElementById('patente').readOnly = true; // No permitir editar la patente
    document.getElementById('marca').value = data.marca;
    document.getElementById('modelo').value = data.modelo;
    document.getElementById('combustible').value = data.combustible;
    document.getElementById('kilometraje').value = data.kilometraje;
    document.getElementById('rto').value = data.rto?.split('T')[0] || '';
    document.getElementById('equipamiento').value = data.equipamiento;
  } catch (error) {
    console.error("Error al cargar vehículo para editar:", error);
  }
}

async function eliminarVehiculo(patente) {
  if (!confirm('¿Está seguro de eliminar este vehículo?')) return;
  
  try {
    await fetchAPI(`vehiculos/${patente}`, 'DELETE');
    
    alert('Vehículo eliminado correctamente');
    await cargarVehiculos();
  } catch (error) {
    alert('Error al eliminar vehículo: ' + error.message);
    console.error('Error al eliminar vehículo:', error);
  }
}

async function buscarVehiculo() {
  const busqueda = document.getElementById('busquedaVehiculo').value.trim();
  
  try {
    let data;
    if (busqueda) {
      data = await fetchAPI(`vehiculos/buscar?q=${busqueda}`);
    } else {
      data = await fetchAPI('vehiculos');
    }
    
    const tbody = document.getElementById('vehiculoTableBody');
    tbody.innerHTML = '';
    
    data.forEach(vehiculo => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${vehiculo.patente}</td>
        <td>${vehiculo.marca}</td>
        <td>${vehiculo.modelo}</td>
        <td>${vehiculo.combustible}</td>
        <td>${vehiculo.kilometraje}</td>
        <td>${formatearFecha(vehiculo.rto)}</td>
        <td>${vehiculo.equipamiento}</td>
        <td>${vehiculo.conductores?.nombreCompleto || 'No asignado'}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarVehiculo('${vehiculo.patente}')">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarVehiculo('${vehiculo.patente}')">Eliminar</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Error al buscar vehículos:", error);
  }
}

// FUNCIONES AUXILIARES
async function cargarPatentesVehiculos() {
  try {
    const data = await fetchAPI('vehiculos/patentes');
    
    const selectVehiculo = document.getElementById('vehiculo');
    if (!selectVehiculo) return;
    
    selectVehiculo.innerHTML = '<option value="">Seleccione un vehículo</option>';
    
    data.forEach(vehiculo => {
      const option = document.createElement('option');
      option.value = vehiculo.id;
      option.textContent = vehiculo.patente;
      selectVehiculo.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar patentes de vehículos:", error);
  }
}

function formatearFecha(fecha) {
  if (!fecha) return 'No especificada';
  
  const date = new Date(fecha);
  return date.toLocaleDateString('es-AR');
}

// Verificar si se está editando un registro existente
function verificarEdicion() {
  const urlParams = new URLSearchParams(window.location.search);
  const dni = urlParams.get('dni');
  const patente = urlParams.get('patente');
  
  if (dni) {
    if (window.location.pathname.includes('cargarConductor.html')) {
      cargarConductorParaEditar(dni);
    } else if (window.location.pathname.includes('cargarPasajero.html')) {
      cargarPasajeroParaEditar(dni);
    }
  } else if (patente && window.location.pathname.includes('cargarVehiculo.html')) {
    cargarVehiculoParaEditar(patente);
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
  await inicializar();
  
  // Formulario de inicio de sesión
  const loginForm = document.getElementById('Formulario');
  if (loginForm) {
    loginForm.addEventListener('submit', iniciarSesion);
  }
  
  // Botón de cerrar sesión
  const logoutButton = document.getElementById('salir');
  if (logoutButton) {
    logoutButton.addEventListener('click', cerrarSesion);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logout");
  
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
          alert("Error al cerrar sesión");
          return;
        }
  
        // 🧽 Limpiamos la verificación
        localStorage.removeItem("verificado");
  
        // Redirigimos a logueo
        window.location.href = "logueo.html";
      });
    }
  });
  
  
  // Formulario de conductor
  const conductorForm = document.getElementById('conductorForm');
  if (conductorForm) {
    conductorForm.addEventListener('submit', guardarConductor);
  }
  
  // Formulario de pasajero
  const pasajeroForm = document.getElementById('pasajeroForm');
  if (pasajeroForm) {
    pasajeroForm.addEventListener('submit', guardarPasajero);
  }
  
  // Formulario de vehículo 
  const vehiculoForm = document.getElementById('vehiculoForm');
  if (vehiculoForm) {
    vehiculoForm.addEventListener('submit', guardarVehiculo);
  }
  
  // Botones de búsqueda
  const busquedaConductorInput = document.getElementById('busquedaConductor');
  if (busquedaConductorInput) {
    document.getElementById('btnBuscarConductor').addEventListener('click', buscarConductor);
    busquedaConductorInput.addEventListener('keyup', function(event) {
      if (event.key === 'Enter') {
        buscarConductor();
      }
    });
  }
  
  const busquedaPasajeroInput = document.getElementById('busquedaPasajero');
  if (busquedaPasajeroInput) {
    document.getElementById('btnBuscarPasajero').addEventListener('click', buscarPasajero);
    busquedaPasajeroInput.addEventListener('keyup', function(event) {
      if (event.key === 'Enter') {
        buscarPasajero();
      }
    });
  }
  
  const busquedaVehiculoInput = document.getElementById('busquedaVehiculo');
  if (busquedaVehiculoInput) {
    document.getElementById('btnBuscarVehiculo').addEventListener('click', buscarVehiculo);
    busquedaVehiculoInput.addEventListener('keyup', function(event) {
      if (event.key === 'Enter') {
        buscarVehiculo();
      }
    });
  }
});