"""Real UI: four games, first-attempt grading, hints, persistence and 67 official questions."""
import functools,http.server,threading,shutil,re
from pathlib import Path
from playwright.sync_api import sync_playwright
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
root=Path(__file__).resolve().parent.parent
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(root)))
threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=shutil.which('chromium'),headless=True,args=['--no-sandbox']);page=b.new_page(viewport={'width':1440,'height':1100});errors=[];page.on('pageerror',lambda e:errors.append(e.stack))
 page.goto(base+'#arcade');page.wait_for_selector('.dojo-card');assert page.locator('.dojo-card').count()==4
 def question():
  ident=page.locator('.dojo-round').get_attribute('data-question-id')
  return page.evaluate('async id=>{const m=await import("./dojo-data.js");return m.dojoGames.flatMap(g=>g.questions).find(q=>q.id===id)}',ident)
 def answer(q,value=None):
  value=value or q['answer']
  if q['game']=='composti':
   for c in value:page.get_by_role('button',name=c,exact=True).click()
   page.locator('#dojo-check').click()
  else:page.get_by_role('button',name=value,exact=True).click()
 def saved():return page.evaluate('JSON.parse(localStorage.getItem("n5lab-v1"))')
 # A wrong first attempt is saved; a hint-assisted success must not improve the assessment.
 page.goto(base+'#arcade?game=composti');page.wait_for_selector('#dojo-start');page.locator('#dojo-start').click();q=question();wrong_id=q['id']
 tiles=page.locator('[data-tile]').all_text_contents();wrong=''.join(tiles[:2]);wrong=wrong if wrong!=q['answer'] else ''.join(tiles[2:4]);answer(q,wrong)
 assert saved()['quest']['answers'][wrong_id]['correct'] is False;assert wrong_id in saved()['errors'];page.locator('#dojo-next').click()
 q=question();assisted_id=q['id'];page.locator('#dojo-hint').click();assert page.locator('#dojo-hint-text').is_visible();answer(q);assert assisted_id not in saved()['quest']['answers'];page.locator('#dojo-next').click()
 for _ in range(6):q=question();answer(q);page.locator('#dojo-next').click()
 assert page.get_by_text('6 / 7 senza aiuti',exact=True).is_visible();assert saved()['sessions'][0]['total']==7
 page.locator('#dojo-again').click();page.locator('#dojo-start').click();q=question();assert q['id']==wrong_id;answer(q);assert wrong_id not in saved()['errors'];assert saved()['quest']['answers'][wrong_id]['correct'] is True
 page.reload();page.wait_for_selector('#dojo-start');assert saved()['quest']['answers'][wrong_id]['correct'] is True
 for game in ['tratti','particelle','forme']:
  page.goto(base+'#arcade?game='+game);page.wait_for_selector('#dojo-start');page.locator('#dojo-start').click()
  for i in range(8):
   q=question()
   if game=='tratti' and i==0:
    assert page.locator('.dojo-stroke svg path').count()==2
    page.locator('#dojo-all-strokes').click();assert page.locator('.dojo-stroke svg path').count()==len(q['paths'])+1
   answer(q);page.locator('#dojo-next').click()
  assert page.get_by_text('8 / 8 senza aiuti',exact=True).is_visible(),game
 # Empty error mode has an explicit state and never starts an empty session.
 page.locator('#dojo-again').click();page.wait_for_selector('#dojo-mode');page.locator('#dojo-mode').select_option('errors');page.locator('#dojo-start').click();assert page.locator('#dojo-empty').is_visible()
 # Every official question, including passages and maps, can be answered via the rendered UI.
 page.goto(base+'#ufficiali');page.wait_for_selector('#official-section');page.locator('#official-count').select_option('all');page.locator('#start-official').click()
 official=page.evaluate('async()=> (await import("./official-questions.js")).officialPool("all","2018")')
 for q in official:
  assert page.locator('.official-source').is_visible()
  if q.get('passages'):
   page.wait_for_function('Array.from(document.querySelectorAll(".official-pages img")).every(i=>i.complete&&i.naturalWidth>0)');assert page.locator('.official-pages img').count()==len(q['passages'])
  texts=page.locator('[data-answer]').all_text_contents();idx=next(i for i,t in enumerate(texts) if t.split('. ',1)[-1].strip()==q['answer']);page.locator('[data-answer]').nth(idx).click();page.locator('#confirm').click();assert page.locator('#feedback .wrong').count()==0,q['id'];page.locator('#confirm').click()
 assert page.get_by_text('67 / 67',exact=True).is_visible()
 for width in [1440,768,390]:
  page.set_viewport_size({'width':width,'height':950})
  for route in ['arcade','arcade?game=composti','arcade?game=tratti','arcade?game=particelle','arcade?game=forme','ufficiali','grammatica']:
   page.goto(base+'#'+route);page.wait_for_selector('h1')
   if 'game=' in route:page.locator('#dojo-start').click();page.wait_for_selector('.dojo-round')
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(width,route)
 Path('screenshots').mkdir(exist_ok=True);page.set_viewport_size({'width':1440,'height':1100});page.goto(base+'#arcade');page.wait_for_selector('.dojo-card');page.screenshot(path='screenshots/dojo-games.png',full_page=True)
 page.goto(base+'#arcade?game=composti');page.wait_for_selector('#dojo-start');page.locator('#dojo-start').click();page.screenshot(path='screenshots/dojo-compounds.png',full_page=True)
 assert not errors,errors;b.close()
server.shutdown();print('OK: quattro missioni, indizi esclusi dai voti, errori recuperati, salvataggio dopo ricarica, 67/67 ufficiali con pagine originali e tre viewport.')
