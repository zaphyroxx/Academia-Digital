import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'GET') {
    try {
      const gastos = await sql`
        SELECT * FROM gastos_meta 
        ORDER BY fecha_inicio DESC, created_at DESC
      `;
      res.status(200).json(gastos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener gastos' });
    }
  }
  
  else if (req.method === 'POST') {
    try {
      const { campana, fecha_inicio, fecha_fin, monto } = req.body;
      const resultado = await sql`
        INSERT INTO gastos_meta (campana, fecha_inicio, fecha_fin, monto) 
        VALUES (${campana || ''}, ${fecha_inicio}, ${fecha_fin}, ${monto}) 
        RETURNING *
      `;
      res.status(201).json(resultado[0]);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear gasto' });
    }
  }
  
  else if (req.method === 'PUT') {
    try {
      const { id, campana, fecha_inicio, fecha_fin, monto } = req.body;
      const resultado = await sql`
        UPDATE gastos_meta 
        SET campana = ${campana}, fecha_inicio = ${fecha_inicio}, 
            fecha_fin = ${fecha_fin}, monto = ${monto}
        WHERE id = ${id}
        RETURNING *
      `;
      res.status(200).json(resultado[0]);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar gasto' });
    }
  }
  
  else if (req.method === 'DELETE') {
    try {
      const { id } = req.body;
      await sql`DELETE FROM gastos_meta WHERE id = ${id}`;
      res.status(200).json({ message: 'Gasto eliminado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar gasto' });
    }
  }
}
