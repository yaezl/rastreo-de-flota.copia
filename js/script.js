async function cargarConductor() {
    try {
        console.log('Intentando cargar conductores:', API_URL);
        
        const response = await fetch(`${API_URL}/api/conductor`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Respuesta del servidor:', response);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error en la respuesta:', errorText);
            throw new Error(`HTTP error! status: ${response.status}. ${errorText}`);
        }

        const conductores = await response.json();
        console.log('Conductores recibidos:', conductores);

        const tableBody = document.getElementById('conductorTableBody');
        
        // Limpiar tabla antes de cargar
        tableBody.innerHTML = '';

        if (conductores.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="4">No hay conductores registrados</td>`;
            tableBody.appendChild(row);
            return;
        }

        conductores.forEach(conductor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${conductor.dni}</td>
                <td>${conductor.nombreCompleto}</td>
                <td>${conductor.codigoPostal}</td>
                <td>${conductor.domicilio}</td>
                <td>${conductor.vencimientoLic}</td>
                <td>${conductor.categoriaLic}</td>
                <td>
                    <button onclick="iniciarEdicionConductor('${conductor.dni}', '${conductor.nombreCompleto}', '${conductor.codigoPostal}', '${conductor.domicilio}', '${conductor.vencimientoLic}', '${conductor.categoriaLic}')" class="btn btn-primary">Editar</button>
                    <button onclick="eliminarConductor('${conductor.dni}')" class="btn btn-primary">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error detallado al cargar conductores:', error);
        
        const tableBody = document.getElementById('conductorTableBody');
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="4">Error al cargar conductores: ${error.message}</td>`;
        tableBody.innerHTML = '';
        tableBody.appendChild(row);
    }
}

// Función para iniciar la edición de un conductor
function iniciarEdicionConductor(dni, nombreCompleto, codigoPostal, domicilio, vencimientoLic, categoriaLic) {
    // Llenar el formulario con los datos del conductor
    document.getElementById('dni').value = dni;
    document.getElementById('nombreCompleto').value = nombreCompleto;
    document.getElementById('codigoPostal').value = codigoPostal;
    document.getElementById("domicilio").value = domicilio;
    document.getElementById("vencimientoLic").value = vencimientoLic;
    document.getElementById("categoriaLic").value = categoriaLic;

    // Cambiar el texto del botón de guardar
    const submitButton = document.querySelector('#conductorForm .btn');
    submitButton.textContent = 'Actualizar';
    submitButton.classList.add('editing');
}

// Función para eliminar conductor
async function eliminarConductor(dni) {
    try {
        const response = await fetch(`${API_URL}/api/conductores/${dni}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.mensaje || 'Error al eliminar conductor');
        }

        alert('Conductor eliminado exitosamente');
        cargarConductor(); // Recargar tabla
    } catch (error) {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    }
}

// Event listener para el formulario de ingreso
document.getElementById('conductorForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const dni = document.getElementById('dni').value;
    const nombreCompleto = document.getElementById('nombreCompleto').value;
    const codigoPostal = document.getElementById('codigoPostal').value;
    const domicilio = document.getElementById('domicilio').value;
    const vencimientoLic = document.getElementById('vencimientoLic').value;
    const categoriaLic = document.getElementById('categoriaLic').value;

    // Validación básica
    if (!dni || !nombreCompleto || !codigoPostal || !domicilio || !vencimientoLic || !categoriaLic) {
        alert('Por favor, complete todos los campos');
        return;
    }

    // Verificar si estamos en modo edición
    const isEditing = this.querySelector('.btn').classList.contains('editing');

    try {
        let response;
        if (isEditing) {
            // Lógica para actualizar conductor
            response = await fetch(`${API_URL}/api/conductores/${dni}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ dni, nombreCompleto, codigoPostal, domicilio, vencimientoLic, categoriaLic })
            });
        } else {
            // Lógica para crear nuevo conductor
            response = await fetch(`${API_URL}/api/conductores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ dni, nombreCompleto, codigoPostal, domicilio, vencimientoLic, categoriaLic })
            });
        }

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.mensaje || 'Error al guardar el conductor');
        }

        alert(isEditing ? 'Conductor actualizado exitosamente!' : 'Conductor guardado exitosamente!');
        this.reset(); // Resetea el formulario
        
        // Restaurar botón de guardar
        const submitButton = this.querySelector('.btn');
        submitButton.textContent = 'Guardar';
        submitButton.classList.remove('editing');

        cargarConductor(); // Recargar tabla
    } catch (error) {
        alert('Error: ' + error.message);
        console.error('Error:', error);
    }
});

// Cargar conductores al inicio
document.addEventListener('DOMContentLoaded', cargarConductor);