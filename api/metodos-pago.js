import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'GET') {
    try {
      const metodos = await sql`SELECT * FROM metodos_pago ORDER BY nombre`;
      res.status(200).json(metodos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener métodos de pago' });
    }
  }
  
  else if (req.method === 'POST') {
    try {
      const { nombre } = req.body;
      const resultado = await sql`
        INSERT INTO metodos_pago (nombre) 
        VALUES (${nombre}) 
        RETURNING *
      `;
      res.status(201).json(resultado[0]);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear método de pago' });
    }
  }
  
  else if (req.method === 'PUT') {
    try {
      const { id, nombre } = req.body;
      const resultado = await sql`
        UPDATE metodos_pago 
        SET nombre = ${nombre}
        WHERE id = ${id}
        RETURNING *
      `;
      res.status(200).json(resultado[0]);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar método de pago' });
    }
  }
  
  else if (req.method === 'DELETE') {
    try {
      const { id } = req.body;
      await sql`DELETE FROM metodos_pago WHERE id = ${id}`;
      res.status(200).json({ message: 'Método de pago eliminado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar método de pago' });
    }
  }
}
