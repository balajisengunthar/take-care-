// Telegram Bot API Notification Utility

export const TELEGRAM_BOT_TOKEN = '8876872216:AAHjc8UHnHjxyaGu7H7iJeJ5n4LYR6jx9FI';
export const TELEGRAM_CHAT_ID   = '@proportionx';

export async function sendTelegramNotification(message) {
  if (!TELEGRAM_BOT_TOKEN) {
    console.warn('Telegram Bot token not configured.');
    return;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  // First check if there are recent chats/updates from user
  try {
    const updatesRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`);
    const updatesData = await updatesRes.json();
    let detectedChatId = null;
    if (updatesData.ok && updatesData.result && updatesData.result.length > 0) {
      // Pick the latest chat ID from user interactions
      const lastUpdate = updatesData.result[updatesData.result.length - 1];
      if (lastUpdate.message && lastUpdate.message.chat) {
        detectedChatId = lastUpdate.message.chat.id;
      }
    }

    const targetIds = detectedChatId ? [detectedChatId, '@proportionx'] : ['@proportionx'];

    for (const chatId of targetIds) {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      });
      const result = await response.json();
      if (result.ok) {
        console.log(`Telegram notification successfully sent to ${chatId}:`, result);
        return result;
      } else {
        console.warn(`Telegram API warning for ${chatId}:`, result.description);
      }
    }
  } catch (err) {
    console.error('Telegram notification error:', err);
  }
}
