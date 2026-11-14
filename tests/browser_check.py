"""Verifica facoltativa: pip install playwright; python tests/browser_check.py.
Avviare prima npm start. Richiede Chromium di sistema o Playwright Chromium.
"""
import shutil
from pathlib import Path
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=shutil.which('chromium'),headless=True,args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1440,'height':1100})
 errors=[]
 page.on('pageerror',lambda e: errors.append(str(e)))
 page.goto('http://127.0.0.1:4173')
 for route in ['home','piano','flashcard','kana','grammatica','quiz','ascolto','simulazioni','risorse']:
  page.goto('http://127.0.0.1:4173/#'+route)
  page.wait_for_timeout(100)
  assert page.locator('h1').is_visible(),route
 page.goto('http://127.0.0.1:4173/#flashcard')
 page.get_by_text('Mostra la risposta',exact=True).click()
 page.get_by_text('Ricordo ✓',exact=True).click()
 page.reload()
 assert page.evaluate('Object.keys(JSON.parse(localStorage.getItem("n5lab-v1")).cards).length')==1
 page.goto('http://127.0.0.1:4173/#quiz')
 page.locator('#quiz-type').select_option('grammatica')
 page.locator('#start-quiz').click()
 for i in range(10):
  page.locator('[data-answer]').first.click()
  page.locator('#confirm').click()
  assert page.locator('#feedback').inner_text()
  page.locator('#confirm').click()
 assert page.get_by_text('Correzione completa',exact=True).is_visible()
 assert page.evaluate('JSON.parse(localStorage.getItem("n5lab-v1")).sessions.length')==1
 page.locator('#new-quiz').click()
 assert page.locator('#start-quiz').is_visible()
 page.goto('http://127.0.0.1:4173/#simulazioni')
 page.locator('#timer-start').click()
 page.wait_for_timeout(1300)
 assert page.locator('#timer-display').inner_text()!='20:00'
 page.locator('#timer-start').click()
 page.locator('#timer-reset').click()
 assert page.locator('#timer-display').inner_text()=='20:00'
 page.locator('#mock-name').fill('Prova test')
 page.locator('#mock-correct').fill('7')
 page.locator('#mock-total').fill('10')
 page.get_by_role('button',name='Salva il risultato').click()
 assert page.evaluate('JSON.parse(localStorage.getItem("n5lab-v1")).sessions.length')==2
 page.goto('http://127.0.0.1:4173/#grammatica')
 page.locator('#grammar-search').fill('zzzzzz')
 assert page.get_by_text('Nessuna regola trovata.').is_visible()
 page.locator('#grammar-search').fill('particelle')
 assert page.locator('details').count()>0
 page.set_viewport_size({'width':390,'height':844})
 for route in ['home','piano','flashcard','kana','grammatica','quiz','ascolto','simulazioni','risorse']:
  page.goto('http://127.0.0.1:4173/#'+route)
  assert page.evaluate('document.documentElement.scrollWidth<=window.innerWidth'),route
 page.goto('http://127.0.0.1:4173/#risorse')
 with page.expect_download() as info:
  page.locator('#backup').click()
 assert info.value.suggested_filename=='n5-progressi.json'
 page.goto('http://127.0.0.1:4173/#home')
 page.evaluate('localStorage.clear()')
 page.reload()
 Path('screenshots').mkdir(exist_ok=True)
 page.screenshot(path='screenshots/mobile.png',full_page=True)
 page.set_viewport_size({'width':1440,'height':1100})
 page.screenshot(path='screenshots/desktop.png',full_page=True)
 assert not errors,errors
 print('OK: 9 sezioni, flashcard persistenti, quiz completo, timer, diario, ricerca, download, mobile; nessun errore JavaScript.')
 browser.close()
