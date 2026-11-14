"""Test nuovi salvataggi, scenette, audio, quiz ufficiali e capsule. Server locale autonomo."""
import functools,http.server,threading,shutil,json,re
from pathlib import Path
from playwright.sync_api import sync_playwright
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
root=Path(__file__).resolve().parent.parent
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(root)))
threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=shutil.which('chromium'),headless=True,args=['--no-sandbox']);page=b.new_page(viewport={'width':1440,'height':1100});errors=[];page.on('pageerror',lambda e:errors.append(e.stack));page.goto(base);page.wait_for_selector('h1')
 for route in ['salvataggi','scenette','arcade','ufficiali','home']:
  page.goto(base+'#'+route);page.wait_for_selector('h1');assert page.locator('h1').is_visible()
 page.goto(base+'#scenette?id=sushi');page.wait_for_selector('#scene-audio');assert 'sushi/dialogue.mp3' in page.locator('#scene-audio').get_attribute('src')
 page.locator('#scene-speed').select_option('0.6');assert page.locator('#scene-audio').evaluate('(a)=>a.playbackRate')==.6
 page.locator('#scene-play').click();page.wait_for_function('document.querySelector("#scene-audio").currentTime>0');assert page.locator('#scene-audio').evaluate('(a)=>!a.paused')
 page.locator('#scene-pause').click();assert page.locator('#scene-audio').evaluate('(a)=>a.paused')
 page.locator('#toggle-reading').click();assert page.locator('#scene-reading').is_visible()
 page.locator('#toggle-translation').click();assert page.locator('#scene-translation').is_visible()
 page.locator('#scene-next').click();assert '2/4' in page.locator('#line-count').inner_text();page.locator('#scene-repeat').click()
 old_audio=page.locator('#scene-audio').element_handle();page.goto(base+'#ufficiali');assert old_audio.evaluate('(a)=>a.paused')
 page.locator('#official-section').select_option('readings');page.locator('#official-count').select_option('all');page.locator('#start-official').click();key={'雨':'あめ','書いて':'かいて','中':'なか','小さい':'ちいさい','火よう日':'かようび','空':'そら','百人':'ひゃくにん','魚':'さかな','半分':'はんぶん','間':'あいだ','三つ':'みっつ','元気':'げんき'}
 for i in range(12):
  assert page.locator('.official-source').is_visible();prompt=page.locator('.question').inner_text();word=re.search('「(.+?)」',prompt)[1];answer=key[word]
  texts=page.locator('[data-answer]').all_text_contents();idx=next(j for j,t in enumerate(texts) if t.split('. ',1)[-1].strip()==answer);page.locator('[data-answer]').nth(idx).click();page.locator('#confirm').click();page.locator('#confirm').click()
 assert page.get_by_text('12 / 12',exact=True).is_visible()
 page.goto(base+'#arcade');assert page.locator('#open-capsule').is_enabled();page.locator('#open-capsule').click();assert page.locator('.collected').count()==1
 saved=page.evaluate('JSON.parse(localStorage.getItem("n5lab-v1"))');assert len(saved['extras']['plates'])==12;assert len(saved['extras']['capsules'])==1
 page.locator('#play-order').click();assert page.locator('.word-bank').is_visible()
 for i in range(page.locator('[data-token]').count()):page.locator(f'[data-token="{i}"]').click()
 page.locator('#check-order').click();assert page.get_by_text('Frase modello ricostruita.',exact=True).is_visible()
 page.goto(base+'#salvataggi');page.wait_for_selector('#save-now');page.locator('#save-now').click();page.wait_for_selector('[data-restore]');page.wait_for_function('document.querySelector("#storage-status")?.innerText.includes("presente")')
 # Simula corruzione del salvataggio primario, senza toccare IndexedDB.
 page.evaluate('localStorage.setItem("n5lab-v1","{corrotto")');page.reload();page.wait_for_selector('#storage-status strong');page.wait_for_function('JSON.parse(localStorage.getItem("n5lab-v1")||"null")?.sessions?.length>0')
 page.goto(base+'#valutazioni');page.wait_for_selector('.skill-score');assert page.locator('.skill-score').first.inner_text()=='100%'
 page.goto(base+'#salvataggi');page.locator('#save-now').click();page.wait_for_selector('[data-restore]')
 page.on('dialog',lambda d:d.accept());page.locator('[data-restore]').first.click();page.wait_for_timeout(400)
 page.goto(base+'#scenette?id=station');page.wait_for_selector('#scene-audio');assert 'station/dialogue.mp3' in page.locator('#scene-audio').get_attribute('src')
 for width in [1440,768,390]:
  page.set_viewport_size({'width':width,'height':950})
  for route in ['home','scenette','scenette?id=library','arcade','ufficiali','salvataggi']:
   page.goto(base+'#'+route);page.wait_for_selector('h1');page.wait_for_timeout(80);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(width,route)
 page.set_viewport_size({'width':1440,'height':1100});page.goto(base+'#arcade');page.wait_for_selector('.capsule-machine');Path('screenshots').mkdir(exist_ok=True);page.screenshot(path='screenshots/sushi-quest.png',full_page=True)
 page.goto(base+'#scenette?id=sushi');page.wait_for_selector('#scene-audio');page.screenshot(path='screenshots/scenette.png',full_page=True)
 page.set_viewport_size({'width':390,'height':844});page.screenshot(path='screenshots/scenette-mobile.png',full_page=True)
 assert not errors,errors;b.close()
server.shutdown();print('OK: audio reale rallentabile, scena, fonte ufficiale e quiz 12/12, capsule, frasi, IndexedDB e recupero dati, ripristino, tre viewport; nessun errore JS.')
