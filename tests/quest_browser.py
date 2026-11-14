"""Verifica estesa del percorso Kanji Quest; avviare prima npm start."""
import json,shutil,re
from pathlib import Path
from playwright.sync_api import sync_playwright
cards=json.loads(Path('risorse/kanji-base.json').read_text());by_word={c['word']:c for c in cards};by_example={c['example']['word']:c['example']['reading'] for c in cards}
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=shutil.which('chromium'),headless=True,args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':1100});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:4173');page.evaluate('localStorage.clear()');page.reload()
 assert page.get_by_text('La tua avventura comincia qui.',exact=True).is_visible()
 for route in ['kanji','radicali','gioco','valutazioni','piano','flashcard','kana','grammatica','quiz','ascolto','simulazioni','risorse']:
  page.goto('http://127.0.0.1:4173/#'+route);assert page.locator('h1').is_visible(),route
 page.goto('http://127.0.0.1:4173/#kanji')
 assert page.locator('.dex-card').count()==120
 page.locator('#dex-filter').select_option('fondamentali');assert page.locator('.dex-card').count()==100
 page.locator('#dex-filter').select_option('all');page.locator('#dex-search').fill('zzzzz');assert page.locator('.dex-card').count()==0
 page.goto('http://127.0.0.1:4173/#kanji?c=%E6%97%A5')
 assert page.locator('#stroke-model path').count()==4
 page.locator('#favorite').click();assert page.locator('#favorite').inner_text()=='★ Preferito'
 page.locator('#favorite').click();assert page.locator('#favorite').inner_text()=='☆ Salva preferito'
 page.locator('#kanji-note').fill('<img src=x onerror=alert(1)> La mia storia')
 page.locator('#save-note').click();page.reload();assert '<img' in page.locator('#kanji-note').input_value()
 page.locator('#step-stroke').click();assert page.locator('#stroke-counter').inner_text().startswith('1/')
 page.locator('#animate-strokes').click();page.locator('#model-toggle').click();assert not page.locator('#stroke-model').is_visible()
 page.locator('#model-toggle').click();pad=page.locator('#writing-pad').bounding_box();page.mouse.move(pad['x']+50,pad['y']+50);page.mouse.down();page.mouse.move(pad['x']+150,pad['y']+150);page.mouse.up()
 page.locator('#clear-ink').click()
 page.locator('#kanji-known').click();page.locator('#kanji-known').click()
 assert page.evaluate('Object.values(JSON.parse(localStorage.getItem("n5lab-v1")).quest.rewards).reduce((a,b)=>a+b,0)')==3
 page.goto('http://127.0.0.1:4173/#quiz');page.locator('#quiz-type').select_option('kanji');page.locator('#start-quiz').click()
 for i in range(10):
  prompt=page.locator('.question').inner_text();w=re.search('「(.+?)」',prompt)[1]
  answer=by_word[w]['meaning'] if prompt.startswith('Qual') else by_example[w]
  options=page.locator('[data-answer]');index=next(j for j,t in enumerate(options.all_text_contents()) if t.split('. ',1)[-1].strip()==answer)
  options.nth(index).click();page.locator('#confirm').click();page.locator('#confirm').click()
 assert page.get_by_text('10 / 10',exact=True).is_visible()
 page.goto('http://127.0.0.1:4173/#valutazioni')
 assert page.locator('.skill-card').first.locator('.skill-score').inner_text()=='100%'
 assert page.locator('.skill-card').first.get_by_text('Buona base',exact=True).is_visible()
 page.goto('http://127.0.0.1:4173/#gioco')
 words=page.locator('.match-kanji').all_text_contents()
 for word in words:
  page.get_by_role('button',name=word,exact=True).click()
  page.get_by_role('button',name=by_word[word]['meaning'],exact=True).click()
 assert 'Giardino completato' in page.locator('#match-status').inner_text()
 assert page.locator('.matched').count()==12
 page.goto('http://127.0.0.1:4173/#risorse')
 assert page.get_by_text('Porta il tuo dojo con te.',exact=True).is_visible()
 for width in [1440,768,390]:
  page.set_viewport_size({'width':width,'height':950})
  for route in ['home','kanji','kanji?c=%E8%AA%9E','radicali','gioco','valutazioni','quiz','risorse']:
   page.goto('http://127.0.0.1:4173/#'+route)
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(width,route)
 Path('screenshots').mkdir(exist_ok=True)
 page.set_viewport_size({'width':1440,'height':1100});page.goto('http://127.0.0.1:4173/#home');page.screenshot(path='screenshots/quest-desktop.png',full_page=True)
 page.goto('http://127.0.0.1:4173/#kanji?c=%E4%BC%91');page.screenshot(path='screenshots/quest-kanji.png',full_page=True)
 page.set_viewport_size({'width':390,'height':844});page.screenshot(path='screenshots/quest-mobile.png',full_page=True)
 for source,target in [('quaderno-kanji.html','quaderno-kanji.pdf'),('guida-esame.html','guida-esame.pdf')]:
  page.goto('http://127.0.0.1:4173/risorse/'+source)
  page.pdf(path='risorse/'+target,format='A4',print_background=True,margin={'top':'12mm','bottom':'12mm','left':'12mm','right':'12mm'})
 assert not errors,errors
 print('OK: Dex 120 schede, filtri, radicali, note sicure, preferiti, tratti, penna, XP deduplicati, quiz 10/10, valutazione, gioco completo, responsive a 3 larghezze, PDF; nessun errore JavaScript.')
 b.close()
