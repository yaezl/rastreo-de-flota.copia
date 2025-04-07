// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());
app.use(cors());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// CRUD Conductores
// Crear conductor
app.post('/conductores', async (req, res) => {
    const { nombre, apellido, dni, domicilio, fecha_vencimiento_licencia, categoria_licencia, vehiculo_asignado } = req.body;
    const { data, error } = await supabase
        .from('conductores')
        .insert([{ nombre, apellido, dni, domicilio, fecha_vencimiento_licencia, categoria_licencia, vehiculo_asignado }]);
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});

// Leer conductores
app.get('/conductores', async (req, res) => {
    const { data, error } = await supabase.from('conductores').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Actualizar conductor
app.put('/conductores/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, dni, domicilio, fecha_vencimiento_licencia, categoria_licencia, vehiculo_asignado } = req.body;
    const { data, error } = await supabase
        .from('conductores')
        .update({ nombre, apellido, dni, domicilio, fecha_vencimiento_licencia, categoria_licencia, vehiculo_asignado })
        .eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Eliminar conductor
app.delete('/conductores/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('conductores')
        .delete()
        .eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.status(204).send();
});

// CRUD Pasajeros
// Crear pasajero
app.post('/pasajeros', async (req, res) => {
    const { nombre, apellido, dni, domicilio, vehiculo_asignado } = req.body;
    const { data, error } = await supabase
        .from('pasajeros')
        .insert([{ nombre, apellido, dni, domicilio, vehiculo_asignado }]);
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});

// Leer pasajeros
app.get('/pasajeros', async (req, res) => {
    const { data, error } = await supabase.from('pasajeros').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Actualizar pasajero
app.put('/pasajeros/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, dni, domicilio, vehiculo_asignado } = req.body;
    const { data, error } = await supabase
        .from('pasajeros')
        .update({ nombre, apellido, dni, domicilio, vehiculo_asignado })
        .eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Eliminar pasajero
app.delete('/pasajeros/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('pasajeros')
        .delete()
        .eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.status(204).send();
});

// CRUD Vehículos
// Crear vehículo
app.post('/vehiculos', async (req, res) => {
    const { marca, modelo, patente, rto, combustible, kilometraje, equipamiento, conductor_asignado } = req.body;
    const { data, error } = await supabase
        .from('vehiculos')
        .insert([{ marca, modelo, patente, rto, combustible, kilometraje, equipamiento, conductor_asignado }]);
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});

// Leer vehículos
app.get('/vehiculos', async (req, res) => {
    const { data, error } = await supabase.from('vehiculos').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Actualizar vehículo
app.put('/vehiculos/:id', async (req, res) => {
    const { id } = req.params;
    const { marca, modelo, patente, rto, combustible, kilometraje, equipamiento, conductor_asignado } = req.body;
    const { data, error } = await supabase
        .from('vehiculos')
        .update({ marca, modelo, patente, rto, combustible, kilometraje, equipamiento, conductor_asignado })
        .eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Eliminar vehículo
app.delete('/vehiculos/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('vehiculos')
        .delete()
        .eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});

//////// NUEVO //////
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Inicializar express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan('dev')); // Logging
app.use(express.json()); // Para parsear JSON en las peticiones
app.use(express.urlencoded({ extended: true })); // Para parsear datos de formularios

// Configuración de CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Inicializar cliente de Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Rutas para la API

// Autenticación
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Conductores
app.get('/api/conductores', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('conductores')
      .select('*, vehiculos(patente)');
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/conductores', async (req, res) => {
  try {
    const { error } = await supabase
      .from('conductores')
      .upsert([req.body]);
    
    if (error) throw error;
    res.status(201).json({ message: 'Conductor creado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/conductores/:dni', async (req, res) => {
  const { dni } = req.params;
  try {
    const { error } = await supabase
      .from('conductores')
      .update(req.body)
      .eq('dni', dni);
    
    if (error) throw error;
    res.status(200).json({ message: 'Conductor actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/conductores/:dni', async (req, res) => {
  const { dni } = req.params;
  try {
    const { error } = await supabase
      .from('conductores')
      .delete()
      .eq('dni', dni);
    
    if (error) throw error;
    res.status(200).json({ message: 'Conductor eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Pasajeros
app.get('/api/pasajeros', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pasajeros')
      .select('*, vehiculos(patente)');
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/pasajeros', async (req, res) => {
  try {
    const { error } = await supabase
      .from('pasajeros')
      .upsert([req.body]);
    
    if (error) throw error;
    res.status(201).json({ message: 'Pasajero creado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/pasajeros/:dni', async (req, res) => {
  const { dni } = req.params;
  try {
    const { error } = await supabase
      .from('pasajeros')
      .update(req.body)
      .eq('dni', dni);
    
    if (error) throw error;
    res.status(200).json({ message: 'Pasajero actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/pasajeros/:dni', async (req, res) => {
  const { dni } = req.params;
  try {
    const { error } = await supabase
      .from('pasajeros')
      .delete()
      .eq('dni', dni);
    
    if (error) throw error;
    res.status(200).json({ message: 'Pasajero eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vehículos
app.get('/api/vehiculos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('vehiculos')
      .select('*, conductores(nombreCompleto)');
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/vehiculos', async (req, res) => {
  try {
    const { error } = await supabase
      .from('vehiculos')
      .upsert([req.body]);
    
    if (error) throw error;
    res.status(201).json({ message: 'Vehículo creado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/vehiculos/:patente', async (req, res) => {
  const { patente } = req.params;
  try {
    const { error } = await supabase
      .from('vehiculos')
      .update(req.body)
      .eq('patente', patente);
    
    if (error) throw error;
    res.status(200).json({ message: 'Vehículo actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/vehiculos/:patente', async (req, res) => {
  const { patente } = req.params;
  try {
    const { error } = await supabase
      .from('vehiculos')
      .delete()
      .eq('patente', patente);
    
    if (error) throw error;
    res.status(200).json({ message: 'Vehículo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para verificar el estado del servidor
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app; // Para testing