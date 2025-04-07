// Archivo: frontend/js/api.js

// URL base de la API
const API_URL = 'https://sistema-de-rastreo-de-flotas.onrender.com/api'; // Ajusta esto según la URL de tu servidor

// Funciones para conductores
async function obtenerConductores() {
    try {
        const response = await fetch(`${API_URL}/conductores`);
        if (!response.ok) {
            throw new Error('Error al obtener conductores');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

async function buscarConductores(termino) {
    try {
        const response = await fetch(`${API_URL}/conductores/buscar?q=${encodeURIComponent(termino)}`);
        if (!response.ok) {
            throw new Error('Error en la búsqueda');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

// Funciones para pasajeros
async function obtenerPasajeros() {
    try {
        const response = await fetch(`${API_URL}/pasajeros`);
        if (!response.ok) {
            throw new Error('Error al obtener pasajeros');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

async function buscarPasajeros(termino) {
    try {
        const response = await fetch(`${API_URL}/pasajeros/buscar?q=${encodeURIComponent(termino)}`);
        if (!response.ok) {
            throw new Error('Error en la búsqueda');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

// Funciones para vehículos
async function obtenerVehiculos() {
    try {
        const response = await fetch(`${API_URL}/vehiculos`);
        if (!response.ok) {
            throw new Error('Error al obtener vehículos');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

async function buscarVehiculos(termino) {
    try {
        const response = await fetch(`${API_URL}/vehiculos/buscar?q=${encodeURIComponent(termino)}`);
        if (!response.ok) {
            throw new Error('Error en la búsqueda');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

// Exportar funciones
window.api = {
    obtenerConductores,
    buscarConductores,
    obtenerPasajeros,
    buscarPasajeros,
    obtenerVehiculos,
    buscarVehiculos
};