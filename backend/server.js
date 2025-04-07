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
/* app.post('/api/auth/login', async (req, res) => {
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
}); */

// Conductores
app.get('/api/conductores', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('conductores')
      .select('*, vehiculo(patente)');
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Búsqueda de conductores
app.get('/api/conductores/buscar', async (req, res) => {
  const { q } = req.query;
  try {
    const { data, error } = await supabase
      .from('conductores')
      .select('*, vehiculo(patente)')
      .ilike('nombreCompleto', `%${q}%`)
      .or(`dni.ilike.%${q}%`);
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un conductor específico
app.get('/api/conductores/:dni', async (req, res) => {
  const { dni } = req.params;
  try {
    const { data, error } = await supabase
      .from('conductores')
      .select('*')
      .eq('dni', dni)
      .single();
    
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
      .select('*, vehiculoasignado(patente)');
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Búsqueda de pasajeros
app.get('/api/pasajeros/buscar', async (req, res) => {
  const { q } = req.query;
  try {
    const { data, error } = await supabase
      .from('pasajeros')
      .select('*, vehiculoasignado(patente)')
      .ilike('nombreCompleto', `%${q}%`)
      .or(`dni.ilike.%${q}%`);
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un pasajero específico
app.get('/api/pasajeros/:dni', async (req, res) => {
  const { dni } = req.params;
  try {
    const { data, error } = await supabase
      .from('pasajeros')
      .select('*')
      .eq('dni', dni)
      .single();
    
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
      .select('*, conductores(dni)');
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Búsqueda de vehículos
app.get('/api/vehiculos/buscar', async (req, res) => {
  const { q } = req.query;
  try {
    const { data, error } = await supabase
      .from('vehiculos')
      .select('*, conductores(dni)')
      .ilike('patente', `%${q}%`)
      .or(`marca.ilike.%${q}%`)
      .or(`modelo.ilike.%${q}%`);
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener listado de patentes para selects
app.get('/api/vehiculos/patentes', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('vehiculos')
      .select('patente, marca');
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un vehículo específico
app.get('/api/vehiculos/:patente', async (req, res) => {
  const { patente } = req.params;
  try {
    const { data, error } = await supabase
      .from('vehiculos')
      .select('*')
      .eq('patente', patente)
      .single();
    
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

app.get('/', (req, res) => {
  res.send('Servidor de rastreo de flotas funcionando 🚛📍');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app; // Para testing