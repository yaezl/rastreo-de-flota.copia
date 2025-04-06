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
