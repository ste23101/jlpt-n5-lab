"""New navigation, exam guide, contextual furigana, geometric writing, official 2012 and anime consent."""
import functools,http.server,threading,shutil,re
from pathlib import Path
from playwright.sync_api import sync_playwright
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
root=Path(__file__).resolve().parent.parent
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(root)));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=shutil.which('chromium'),headless=True,args=['--no-sandbox']);page=b.new_page(viewport={'width':1440,'height':1100});errors=[];page.on('pageerror',lambda e:errors.append(e.stack))
 page.goto(base+'#studio');page.wait_for_selector('.hub-card');assert page.locator('nav a').count()==6;assert page.locator('nav a > svg').count()==6
 page.goto(base+'#grammatica');page.wait_for_selector('#lessons');assert page.locator('nav [aria-current=page]').get_attribute('href')=='#studio';page.locator('#lessons details').first.locator('summary').click();page.wait_for_selector('.reading-word');word=page.locator('.reading-word').first;assert word.get_attribute('aria-expanded')=='false';word.click();assert word.get_attribute('aria-expanded')=='true';assert word.locator('rt').is_visible();word.press('Enter');assert not word.locator('rt').is_visible()
 page.goto(base+'#scenette?id=sushi');page.wait_for_selector('#scene-next');page.locator('#scene-next').click();page.wait_for_selector('#scene-bubble .reading-word[data-reading="ふたさら"]');page.locator('#scene-bubble .reading-word[data-reading="ふたさら"]').click();assert page.locator('.reading-word[aria-expanded=true] rt').inner_text()=='ふたさら'
 page.goto(base+'#esame');page.wait_for_selector('[data-exam-check]');assert page.locator('nav [aria-current=page]').get_attribute('href')=='#esame';assert '80 / 180' in page.locator('main').inner_text();assert '38 / 120' in page.locator('main').inner_text();page.locator('[data-exam-check="exam-kit"]').check();page.evaluate('localStorage.setItem("n5lab-day","1970-01-01")');page.reload();page.wait_for_selector('[data-exam-check="exam-kit"]');assert page.locator('[data-exam-check="exam-kit"]').is_checked()
 page.goto(base+'#kanji?c=木');page.wait_for_selector('#writing-pad');assert page.locator('#check-writing').is_disabled();page.locator('#model-toggle').click();canvas=page.locator('#writing-pad');canvas.scroll_into_view_if_needed();rect=canvas.bounding_box()
 models=page.evaluate('async()=>(await import("./writing-ui.js")).sampleModels()')
 def draw(strokes):
  for stroke in strokes:
   pts=stroke[::3]+[stroke[-1]]
   page.mouse.move(rect['x']+pts[0][0]*rect['width']/109,rect['y']+pts[0][1]*rect['height']/109);page.mouse.down()
   for x,y in pts[1:]:page.mouse.move(rect['x']+x*rect['width']/109,rect['y']+y*rect['height']/109)
   page.mouse.up()
 draw(models['木']);page.locator('#check-writing').click();assert page.locator('#writing-feedback .wrong').count()==0,page.locator('#writing-feedback').inner_text();assert '4/4' in page.locator('#writing-feedback').inner_text();assert 'Pratica a memoria' in page.locator('#writing-feedback').inner_text()
 page.locator('#undo-ink').click();page.locator('#check-writing').click();assert '3/4' in page.locator('#writing-feedback').inner_text();assert page.locator('#writing-feedback .wrong').count()==1
 page.locator('#clear-ink').click();assert page.locator('#check-writing').is_disabled();canvas.scroll_into_view_if_needed();rect=canvas.bounding_box();draw([[[15,55],[90,55]]]);page.locator('#check-writing').click();assert '1/4' in page.locator('#writing-feedback').inner_text();assert page.locator('#writing-feedback .wrong').count()==1
 assert page.evaluate('Object.keys(JSON.parse(localStorage.getItem("n5lab-v1")).quest?.answers||{}).length')==0
 page.goto(base+'#ufficiali');page.wait_for_selector('#official-edition');page.locator('#official-edition').select_option('2012');assert page.locator('#official-section option').first.inner_text().endswith('33');page.locator('#official-count').select_option('all');page.locator('#start-official').click()
 official=page.evaluate('async()=>(await import("./official-questions.js")).officialPool("all","2012")')
 for q in official:
  page.wait_for_function('document.querySelector(".official-pages img")?.naturalWidth>0');assert '2012' in page.locator('.official-source').inner_text();page.get_by_role('button',name=q['answer'],exact=True).click();page.locator('#confirm').click();assert not page.locator('#feedback .wrong').count();page.locator('#confirm').click()
 assert page.get_by_text('33 / 33',exact=True).is_visible()
 page.goto(base+'#anime?id=pancham');page.wait_for_selector('#load-real-anime');assert page.locator('iframe').count()==0
 page.route('https://www.youtube-nocookie.com/**',lambda route:route.fulfill(status=200,body='<html><body>Test player placeholder</body></html>',content_type='text/html'))
 page.locator('#load-real-anime').click();iframe=page.locator('iframe');assert 'J-3lxsr5CYc' in iframe.get_attribute('src');assert 'end=90' in iframe.get_attribute('src');assert iframe.get_attribute('title')
 page.locator('#anime-done').check();page.reload();page.wait_for_selector('#anime-done');assert page.locator('#anime-done').is_checked();assert page.locator('iframe').count()==0
 for width in [1440,768,390]:
  page.set_viewport_size({'width':width,'height':950})
  for route in ['studio','pratica','esame','ufficiali','anime','anime?id=slugma','kanji?c=休']:
   page.goto(base+'#'+route);page.wait_for_selector('h1');page.wait_for_timeout(70);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(width,route)
 Path('screenshots').mkdir(exist_ok=True);page.set_viewport_size({'width':1440,'height':1100});page.goto(base+'#studio');page.wait_for_selector('.hub-card');page.screenshot(path='screenshots/study-menu.png',full_page=True)
 page.goto(base+'#esame');page.wait_for_selector('[data-exam-check]');page.screenshot(path='screenshots/exam-guide.png',full_page=True)
 assert not errors,errors;b.close()
server.shutdown();print('OK: menu 6 voci, guida/checklist, furigana da mouse e tastiera, disegno corretto/errato/undo, 33/33 ufficiali 2012, consenso anime e tre viewport. Player esterno simulato, riproduzione YouTube non verificata.')
