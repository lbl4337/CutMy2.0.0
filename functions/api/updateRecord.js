export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
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
    const db = env.DB;

    // 如果只更新 processStatus
    if (data.processStatus && !data.client) {
      await db.prepare('UPDATE work_records SET processStatus = ? WHERE id = ?')
        .bind(data.processStatus, data.id)
        .run();
    } else {
      // 完整更新
      await db.prepare(`
        UPDATE work_records SET 
          client = ?, req = ?, total = ?, paid = ?, paidStatus = ?, 
          prodStatus = ?, processStatus = ?, board = ?, address = ?, 
          contact = ?, note = ?, date = ?, delivery = ?
        WHERE id = ?
      `).bind(
        data.client, data.req || null, data.total, data.paid || 0,
        data.paidStatus || '未收', data.prodStatus || '未完成',
        data.processStatus || 'pending',
        data.board || null, data.address || null, data.contact || null,
        data.note || null, data.date, data.delivery || null, data.id
      ).run();
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('更新失败:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}