// api/telegram.js
export default async function handler(req, res) {
  // Разрешаем только POST-запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Получаем данные из запроса
    const { message, chatId } = req.body;
    
    // Получаем токен из переменных окружения Vercel
    const BOT_TOKEN = process.env.BOT_TOKEN;

    if (!BOT_TOKEN) {
      return res.status(500).json({ error: 'BOT_TOKEN not configured' });
    }

    // Отправляем сообщение в Telegram
    const telegramResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId || 'ВАШ_CHAT_ID', // fallback если не указан
        text: message,
        parse_mode: 'HTML'
      })
    });

    const data = await telegramResponse.json();
    
    if (!data.ok) {
      console.error('Telegram API error:', data);
      return res.status(500).json({ error: 'Telegram API error', details: data });
    }

    // Возвращаем ответ от Telegram API
    res.status(200).json(data);
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    res.status(500).json({ error: 'Failed to send message to Telegram' });
  }
}