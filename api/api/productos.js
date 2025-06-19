import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'GET') {
    try {
      const productos = await sql`SELECT * FROM productos ORDER BY id`;
      res.status(200).json(productos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener productos' });
    }
  }
  
  else if (req.method === 'POST') {
    try {
      const { nombre, precio } = req.body;
      const resultado = await sql`
        INSERT INTO productos (nombre, precio) 
        VALUES (${nombre}, ${precio}) 
        RETURNING *
      `;
      res.status(201).json(resultado[0]);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear producto' });
    }
  }
  
  else if (req.method === 'PUT') {
    try {
      const { id, nombre, precio } = req.body;
      const resultado = await sql`
        UPDATE productos 
        SET nombre = ${nombre}, precio = ${precio}
        WHERE id = ${id}
        RETURNING *
      `;
      res.status(200).json(resultado[0]);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar producto' });
    }
  }
  
  else if (req.method === 'DELETE') {
    try {
      const { id } = req.body;
      await sql`DELETE FROM productos WHERE id = ${id}`;
      res.status(200).json({ message: 'Producto eliminado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar producto' });
    }
  }
}
