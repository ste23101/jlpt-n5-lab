"""Verifica illustrazioni anime, icone, video sincronizzato e riduzione movimento."""
import functools,http.server,threading,shutil
from pathlib import Path
from playwright.sync_api import sync_playwright
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
root=Path(__file__).resolve().parent.parent
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(root)));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=shutil.which('chromium'),headless=True,args=['--no-sandbox']);page=b.new_page(viewport={'width':1440,'height':1100});errors=[];page.on('pageerror',lambda e:errors.append(e.stack))
 page.goto(base+'#scenette');page.wait_for_selector('.scene-thumbnail');assert page.locator('.scene-thumbnail').count()==6;box=page.locator('.scene-thumbnail').first.bounding_box();assert abs(box['height']/box['width']-9/16)<.02;assert page.locator('nav a > svg').count()==page.locator('nav a').count();assert page.evaluate('!/[\\u{1F300}-\\u{1FAFF}]/u.test(document.body.innerText)')
 page.goto(base+'#scenette?id=sushi');page.wait_for_selector('#scene-video');assert page.locator('.anime-frame').is_visible();assert page.locator('#scene-motion').get_attribute('aria-pressed')=='true'
 page.locator('#scene-play').click();page.wait_for_function('document.querySelector("#scene-video").currentTime>0.15');assert page.locator('#scene-video').evaluate('(v)=>!v.paused')
 page.locator('#scene-pause').click();assert page.locator('#scene-video').evaluate('(v)=>v.paused')
 page.locator('#scene-speed').select_option('0.75');assert abs(page.locator('#scene-video').evaluate('(v)=>v.playbackRate')-.75)<.02
 page.locator('#scene-motion').click();assert not page.locator('#scene-video').is_visible();assert page.locator('.anime-frame').is_visible()
 page.locator('#scene-motion').click();page.locator('#scene-repeat').click();page.wait_for_function('!document.querySelector("#scene-video").paused');page.locator('#scene-pause').click();assert page.locator('#scene-video').evaluate('(v)=>v.paused')
 page.goto(base+'#scenette?id=station');page.wait_for_selector('.anime-frame');assert page.locator('#scene-video').count()==0
 for width in [1440,768,390]:
  page.set_viewport_size({'width':width,'height':950})
  for route in ['home','scenette','scenette?id=sushi','scenette?id=library','arcade']:
   page.goto(base+'#'+route);page.wait_for_selector('h1');page.wait_for_timeout(100);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(width,route)
 page.set_viewport_size({'width':1440,'height':1100});page.goto(base+'#scenette');page.wait_for_selector('.scene-thumbnail');page.screenshot(path='screenshots/anime-gallery.png',full_page=True)
 page.goto(base+'#scenette?id=sushi');page.wait_for_selector('#scene-video');page.screenshot(path='screenshots/anime-player.png',full_page=True)
 page.set_viewport_size({'width':390,'height':844});page.screenshot(path='screenshots/anime-mobile.png',full_page=True)
 reduced=b.new_context(reduced_motion='reduce');rp=reduced.new_page();rp.goto(base+'#scenette?id=sushi');rp.wait_for_selector('#scene-motion');assert rp.locator('#scene-motion').get_attribute('aria-pressed')=='false';assert not rp.locator('#scene-video').is_visible();rp.locator('#scene-motion').click();assert rp.locator('#scene-video').is_visible();reduced.close()
 assert not errors,errors;b.close()
server.shutdown();print('OK: 6 poster anime, icone SVG, video reale con audio/pausa/velocità, modalità statica, riduzione movimento e layout responsive.')
