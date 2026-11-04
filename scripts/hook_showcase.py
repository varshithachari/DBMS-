with open('public/js/architectureLab.js', 'r', encoding='utf-8') as f:
    text = f.read()

target = 'initGrafanaConsole();'
replacement = '''initGrafanaConsole();
  if (typeof selectCharacteristicShowcase === 'function') {
    selectCharacteristicShowcase('scalability');
  }'''

if 'selectCharacteristicShowcase(\'scalability\');' not in text:
    text = text.replace(target, replacement, 1)
    with open('public/js/architectureLab.js', 'w', encoding='utf-8') as f:
        f.write(text)
    print('Successfully hooked selectCharacteristicShowcase into init')
else:
    print('Already hooked')
