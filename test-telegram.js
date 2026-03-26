const TelegramBot = require('node-telegram-bot-api');
const HttpsProxyAgent = require('https-proxy-agent');

const botToken = '8598137540:AAHhgjFACuwlDudbDh2VKRLCpDBuSm7cfwc';
const adminId = '481596297';
const proxyUrl = 'http://user279267:o4hwvf@151.244.235.55:6747';

console.log('🤖 Testing Telegram Bot...\n');
console.log(`🌐 Using proxy: ${proxyUrl.replace(/:[^:@]*@/, ':***@')}\n`);

const bot = new TelegramBot(botToken, {
  polling: true,
  request: {
    agent: new HttpsProxyAgent(proxyUrl),
  },
});

// Тест 1: Проверка информации о боте
bot.getMe().then((me) => {
  console.log('✅ Бот найден:');
  console.log(`   Username: @${me.username}`);
  console.log(`   Имя: ${me.first_name}`);
  console.log(`   ID: ${me.id}\n`);
  
  // Тест 2: Отправка сообщения
  console.log('📬 Отправка тестового сообщения...');
  return bot.sendMessage(adminId, `
🤖 *Тест бота TechMaster*

✅ Бот работает!

Время: ${new Date().toLocaleString('ru-RU')}

Это тестовое сообщение из скрипта проверки.
  `.trim(), { parse_mode: 'Markdown' });
}).then(() => {
  console.log('✅ Сообщение отправлено!\n');
  console.log('📱 Проверьте Telegram - должно прийти сообщение.\n');
  
  // Останавливаем бота через 5 секунд
  setTimeout(() => {
    console.log('✅ Тест завершен');
    process.exit(0);
  }, 5000);
}).catch((err) => {
  console.error('❌ Ошибка:', err.message);
  console.log('\nВозможные причины:');
  console.log('1. Вы не нажали Start в боте');
  console.log('2. Неверный токен или Admin ID');
  console.log('3. Бот заблокирован');
  console.log('\nРешение:');
  console.log('1. Найдите бота в Telegram');
  console.log('2. Нажмите Start или /start');
  console.log('3. Запустите тест снова');
  process.exit(1);
});
