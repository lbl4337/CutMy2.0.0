export async function onRequest(context) {
  const { request, env } = context;

  // CORS 预检
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400'
      }
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: '只支持 POST 请求' }), {
      status: 405,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }

  try {
    const data = await request.json();
    const db = env.DB;  // 绑定 D1 数据库

    // 插入数据
    const result = await db.prepare(`
      INSERT INTO work_records 
      (client, req, total, paid, paidStatus, prodStatus, processStatus, board, address, contact, note, date, delivery) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.client,
      data.req || null,
      data.total,
      data.paid || 0,
      data.paidStatus || '未收',
      data.prodStatus || '未完成',
      data.processStatus || 'pending',
      data.board || null,
      data.address || null,
      data.contact || null,
      data.note || null,
      data.date,
      data.delivery || null
    ).run();

    return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('保存失败:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}