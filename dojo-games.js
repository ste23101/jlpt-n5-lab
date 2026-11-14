import {escapeHTML as esc,shuffle} from './core.js';
import {dojoGames,missionQuestions} from './dojo-data.js';
import {questState,reward} from './game-core.js';
const icon=name=>`<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><use href="./icons.svg#${name}"></use></svg>`;
const glyphs={composti:'puzzle',tratti:'seed',particelle:'train',forme:'book'};
export function dojoCards(state){
 const answers=questState(state).answers;
 return `<section class="spaced"><div class="section-head"><div><span class="eyebrow muted">QUATTRO NUOVE MISSIONI</span><h2>Il laboratorio delle abilità</h2></div></div><div class="grid two dojo-cards">${dojoGames.map(g=>{const done=g.questions.filter(q=>answers[q.id]).length,wrong=g.questions.filter(q=>answers[q.id]?.correct===false).length;return `<article class="card dojo-card"><div class="dojo-mark">${icon(glyphs[g.id])}</div><span class="tag">${g.category} · ${g.questions.length} sfide</span><h3>${g.title}</h3><p>${g.description}</p><div class="progress"><span style="width:${done/g.questions.length*100}%"></span></div><p class="small">${done}/${g.questions.length} esplorate · ${wrong} da rinforzare</p><a class="btn primary" href="#arcade?game=${g.id}">Entra nel laboratorio →</a></article>`;}).join('')}</div><p class="small spaced">Sessioni brevi da 8 turni, senza vite e senza fretta. Gli errori vengono prima, poi le domande nuove. Gli indizi aiutano a imparare; le risposte date con un indizio non entrano nella valutazione.</p><div class="actions"><a class="btn" href="./risorse/mini-giochi/missioni.html" target="_blank" rel="noopener">72 esercizi da stampare ↗</a><a href="./risorse/mini-giochi/ISPIRAZIONI.md" target="_blank" rel="noopener">Idee e fonti didattiche ↗</a></div></section>`;
}
export function createDojoGames(ctx){
 const {$,main,state,save,recordAnswer}=ctx;
 let alive=false;
 function stop(){alive=false;}
 function open(id){
  const game=dojoGames.find(g=>g.id===id);if(!game)return false;
  stop();alive=true;
  main.innerHTML=`<a href="#arcade">← Tutti i mini giochi</a><div class="eyebrow muted spaced">KANJI QUEST · LABORATORIO</div><h1>${game.title}</h1><p class="sub">${game.description}</p><section class="card dojo-intro"><div class="dojo-mark">${icon(glyphs[id])}</div><h2>Una piccola missione, ogni giorno.</h2><p>Otto turni con correzione spiegata. Le domande già sbagliate hanno la precedenza. Una risposta senza aiuto aggiorna le valutazioni, gli XP e i piattini; usare un indizio lascia la domanda da verificare in seguito.</p><div class="toolbar"><label>Modalità<select id="dojo-mode"><option value="mix">Errori e nuove sfide</option><option value="errors">Solo errori di questo gioco</option></select></label><button id="dojo-start" class="primary">Inizia la missione →</button></div><p class="small">${game.questions.length} esercizi disponibili · progresso salvato sul dispositivo</p></section>`;
  $('#dojo-start').onclick=()=>{
   const items=missionQuestions(shuffle(game.questions),questState(state()).answers,$('#dojo-mode').value);
   if(!items.length){$('#dojo-empty')?.remove();const p=document.createElement('p');p.id='dojo-empty';p.setAttribute('role','status');p.textContent='Nessun errore da ripassare in questo gioco. Scegli “Errori e nuove sfide”.';$('.dojo-intro').append(p);return;}
   run(game,items);
  };return true;
 }
 function run(game,items){
  let index=0,selected=[],locked=false,assisted=false,shown=1,options=[],tiles=[],results=[];
  const frame=()=>`<a href="#arcade">← Tutti i mini giochi</a><div class="eyebrow muted spaced">MISSIONE · ${esc(game.category)}</div><h1>${game.title}</h1>`;
  function next(){selected=[];locked=false;assisted=false;shown=1;const q=items[index];options=shuffle(q.options);
   const letters=[...new Set(items.flatMap(i=>i.game==='composti'?[...i.answer]:[]))];tiles=shuffle([...(q.game==='composti'?[...q.answer]:[]),...shuffle(letters.filter(c=>!q.answer.includes(c))).slice(0,6)]);draw();
  }
  function scene(q){
   if(game.id==='composti')return `<p class="dojo-task">Costruisci: <strong>${esc(q.meaning)}</strong></p><p class="small">Scegli due kanji nell’ordine corretto. Tocca un pezzo nello spazio per toglierlo.</p><div class="dojo-slots" lang="ja">${[0,1].map(i=>selected[i]!==undefined?`<button data-remove="${i}" aria-label="Togli ${esc(tiles[selected[i]])}">${esc(tiles[selected[i]])}</button>`:'<span class="dojo-slot" aria-label="Spazio vuoto">?</span>').join('')}</div><div class="dojo-tiles" lang="ja">${tiles.map((t,i)=>`<button data-tile="${i}" ${selected.includes(i)||locked?'disabled':''}>${esc(t)}</button>`).join('')}</div><button id="dojo-check" class="primary spaced" ${selected.length!==2||locked?'disabled':''}>Forgia la parola</button>`;
   if(game.id==='tratti')return `<p class="dojo-task">Che cosa significa il kanji che sta apparendo?</p><div class="dojo-stroke"><svg viewBox="0 0 109 109" aria-label="${shown} tratti su ${q.paths.length}" role="img"><path d="M0 54.5H109M54.5 0V109" stroke="#ddd5c4" stroke-dasharray="2 3" fill="none"/>${q.paths.slice(0,shown).map(d=>`<path d="${esc(d)}" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>`).join('')}</svg></div><div class="actions"><button id="dojo-stroke" ${shown>=q.paths.length||locked?'disabled':''}>Rivela un tratto</button><button id="dojo-all-strokes" ${shown>=q.paths.length||locked?'disabled':''}>Mostra la forma completa</button><span class="small">${shown}/${q.paths.length} tratti</span></div>${choices()}`;
   if(game.id==='particelle')return `<div class="dojo-train" aria-hidden="true">${icon('train')}<span class="dojo-rail"></span><span>次の駅 · ${esc(q.topic)}</span></div><p class="dojo-sentence" lang="ja">${esc(q.sentence).replace('【　】','<span class="dojo-gap">?</span>')}</p><p>${esc(q.translation)}</p><p class="small">Scegli il biglietto che completa la frase con questo significato.</p>${choices()}`;
   return `<p class="small">TRASFORMAZIONE RICHIESTA · ${esc(q.form)}</p><div class="dojo-transform" lang="ja"><strong>${esc(q.word)}</strong><span aria-hidden="true">→</span><span class="dojo-gap">?</span></div><p class="small">Confronta le forme: una terminazione simile può appartenere a un’altra regola.</p>${choices()}`;
  }
  function choices(){return `<div class="dojo-choices">${options.map((v,i)=>`<button data-dojo-answer="${i}" ${locked?'disabled':''}>${esc(v)}</button>`).join('')}</div>`;}
  function draw(){if(!alive)return;const q=items[index];main.innerHTML=frame()+`<section class="card dojo-round" data-question-id="${q.id}"><div class="section-head"><span class="tag">TURNO ${index+1}/${items.length}</span><span class="small">${results.filter(r=>r.correct&&!r.assisted).length} risposte corrette senza aiuto</span></div><div class="progress"><span style="width:${index/items.length*100}%"></span></div>${scene(q)}<div class="dojo-help spaced"><button id="dojo-hint" ${locked||assisted?'disabled':''}>${assisted?'Indizio utilizzato':'Chiedi un indizio'}</button><span class="small">${assisted?'Questo turno serve al ripasso e non modifica la valutazione.':'Nessuna penalità: con un indizio il turno non fa voto.'}</span></div>${assisted?`<p class="note" id="dojo-hint-text">${esc(q.hint||q.rule||q.explanation)}</p>`:''}<div id="dojo-feedback" role="status"></div></section>`;
   main.querySelectorAll('[data-tile]').forEach(b=>b.onclick=()=>{if(locked)return;selected.push(Number(b.dataset.tile));draw();});main.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{if(locked)return;selected.splice(Number(b.dataset.remove),1);draw();});
   if($('#dojo-check'))$('#dojo-check').onclick=()=>submit(selected.map(i=>tiles[i]).join(''));
   main.querySelectorAll('[data-dojo-answer]').forEach(b=>b.onclick=()=>submit(options[Number(b.dataset.dojoAnswer)]));
   if($('#dojo-stroke'))$('#dojo-stroke').onclick=()=>{shown=Math.min(shown+1,q.paths.length);draw();};if($('#dojo-all-strokes'))$('#dojo-all-strokes').onclick=()=>{shown=q.paths.length;draw();};
   $('#dojo-hint').onclick=()=>{assisted=true;draw();};
  }
  function submit(answer){if(locked||!alive)return;locked=true;const q=items[index],correct=answer===q.answer;results.push({id:q.id,correct,assisted});
   if(!assisted)recordAnswer(q,correct);else{reward(state(),'dojo-study-'+q.id,2);save();}
   draw();$('#dojo-feedback').innerHTML=`<div class="feedback ${correct?'':'wrong'}"><strong>${assisted?'Turno con aiuto.':correct?'Ben fatto.':'Da rinforzare.'}</strong><p>Risposta: <strong lang="ja">${esc(q.answer)}</strong>${q.reading?` · <span lang="ja">${esc(q.reading)}</span>`:''}</p><p>${esc(q.explanation)}</p>${game.id==='tratti'?`<a href="#kanji?c=${encodeURIComponent(q.word)}">Apri tratti e mnemonica nel Kanji Dex →</a>`:''}<button id="dojo-next" class="primary spaced">${index+1===items.length?'Vedi il rapporto':'Prossimo turno →'}</button></div>`;
   $('#dojo-next').onclick=()=>{index++;if(index===items.length)finish();else next();};
  }
  function finish(){const graded=results.filter(r=>!r.assisted),correct=graded.filter(r=>r.correct).length,helped=results.length-graded.length;
   if(graded.length){state().sessions.unshift({date:new Date().toISOString(),category:game.category,correct,total:graded.length});state().sessions=state().sessions.slice(0,500);}reward(state(),'dojo-session-'+game.id,10);save();
   main.innerHTML=frame()+`<section class="card dojo-result"><span class="tag">MISSIONE COMPLETATA</span><h2>${graded.length?`${correct} / ${graded.length} senza aiuti`:'Ripasso guidato completato'}</h2><p>${helped} turni con indizio, esclusi dalla valutazione. Le ultime risposte senza aiuto sono salvate nel rapporto dell’area ${esc(game.category)}.</p><p>Gli errori verranno proposti prima nella prossima missione. Rileggi la correzione, poi verifica di nuovo senza indizi.</p><div class="actions"><button id="dojo-again" class="primary">Un’altra missione</button><a class="btn" href="#valutazioni">Le mie valutazioni</a><a class="btn" href="#arcade">Scegli un altro mini gioco</a></div></section>`;$('#dojo-again').onclick=()=>open(game.id);
  }
  next();
 }
 return {open,stop};
}
