import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'GET') {
    try {
      const ventas = await sql`
        SELECT v.*, p.nombre as producto_nombre, mp.nombre as metodo_pago_nombre
        FROM ventas v
        JOIN productos p ON v.producto_id = p.id
        JOIN metodos_pago mp ON v.metodo_pago_id = mp.id
        ORDER BY v.fecha DESC, v.created_at DESC
      `;
      res.status(200).json(ventas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener ventas' });
    }
  }
  
  else if (req.method === 'POST') {
    try {
      const { producto_id, metodo_pago_id, precio, fecha, notas } = req.body;
      const resultado = await sql`
        INSERT INTO ventas (producto_id, metodo_pago_id, precio, fecha, notas) 
        VALUES (${producto_id}, ${metodo_pago_id}, ${precio}, ${fecha}, ${notas || ''}) 
        RETURNING *
      `;
      res.status(201).json(resultado[0]);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear venta' });
    }
  }
  
  else if (req.method === 'DELETE') {
    try {
      const { id } = req.body;
      await sql`DELETE FROM ventas WHERE id = ${id}`;
      res.status(200).json({ message: 'Venta eliminada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar venta' });
    }
  }
}
