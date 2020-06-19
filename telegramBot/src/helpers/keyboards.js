const { Markup, Extra } = require('telegraf');

const keyboards = {
  mainMenu: Markup.inlineKeyboard([
    [Markup.callbackButton('🆕 Нова заявка', 'create_demand')],
    [Markup.callbackButton('📋 Актуальні заявки', 'get_demands_list')],
    [Markup.urlButton('🖥 WEB версія', `http://blood.pp.ua`)],
    [Markup.callbackButton('🤖 Підтримка', 'support')]
  ]).extra(),

  mainMenuMini: Markup.inlineKeyboard([
    [Markup.callbackButton(' 🆕 ', 'create_demand'), Markup.callbackButton(' 📋 ', 'get_demands_list')],
    [Markup.urlButton(' 🖥 ', `http://blood.pp.ua`), Markup.callbackButton(' 🤖 ', 'support')]
  ]).extra(),
  
  mainMenuButton: Markup.inlineKeyboard([
    [Markup.callbackButton('⬅️ На головну', 'main')]
  ]).extra(),
  
  applyButtonTest: Markup.inlineKeyboard([[Markup.callbackButton(' ✅ ', 'apply'), Markup.callbackButton(' ❌ ', 'main')]]).extra(),

  applyButton: Markup.inlineKeyboard([[Markup.callbackButton(' ✅ ', 'apply'), Markup.callbackButton(' ❌ ', 'main')]]).extra(),
  
  disapplyButtonInline: Extra.markdown().markup(m =>
    m.inlineKeyboard([[m.callbackButton(' 🔙 ', 'main'), m.callbackButton(' ❌ ', 'disapply')]])
  ),

  applyButtonInline: Extra.markdown().markup(m =>
    m.inlineKeyboard([[m.callbackButton(' 🔙 ', 'main'), m.callbackButton(' ✅ ', 'apply')]])
  ),
  onDisapplyKeyboard: { inline_keyboard: [[{text: ' 🔙 ', callback_data: 'main'}, {text: ' ✅ ', callback_data: 'apply'}]] },

  onApplyKeyboard: { inline_keyboard: [[{text: ' 🔙 ', callback_data: 'main'}, {text: ' ❌ ', callback_data: 'disapply'}]] },

  disapplyButton: Markup.inlineKeyboard([[Markup.callbackButton(' ❌ ', 'disapply')]]).extra(),

  bloodTypes: Markup.keyboard([['1', '2'], ['3', '4']]).resize().removeKeyboard().extra(),
  
  rhesuses: Markup.keyboard([['+', '-']]).resize().removeKeyboard().extra(),
  
  check: Markup.keyboard([Markup.button('✅ Все вірно!'), Markup.button('❌ Спочатку')]).resize().removeKeyboard().extra(),

  shareContact: Markup.keyboard([Markup.contactRequestButton('📱')]).resize().removeKeyboard().extra(),

  remove: Markup.removeKeyboard().extra(),
};

module.exports = keyboards;