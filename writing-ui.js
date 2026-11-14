import {dex} from './kanji-dex.js';
import {assessWriting} from './writing-core.js';
import {escapeHTML as esc} from './core.js';
let cachedModels;
export function sampleModels(){
 if(cachedModels)return cachedModels;
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 109 109');svg.style.cssText='position:absolute;width:0;height:0;overflow:hidden';document.body.append(svg);const models={};
 for(const c of dex)models[c.word]=c.paths.map(d=>{const path=document.createElementNS(ns,'path');path.setAttribute('d',d);svg.append(path);const length=path.getTotalLength();const samples=Array.from({length:32},(_,i)=>{const p=path.getPointAtLength(length*i/31);return[p.x,p.y];});path.remove();return samples;});
 svg.remove();cachedModels=models;return models;
}
export function attachWritingPad(c){
 const canvas=document.querySelector('#writing-pad'),context=canvas.getContext('2d'),feedback=document.querySelector('#writing-feedback');let strokes=[],current=null,pointer=null;
 const point=e=>{const r=canvas.getBoundingClientRect();return[(e.clientX-r.left)*109/r.width,(e.clientY-r.top)*109/r.height];};
 function redraw(){context.clearRect(0,0,canvas.width,canvas.height);context.lineWidth=7;context.lineCap='round';context.strokeStyle='#bd5336';for(const stroke of [...strokes,...(current?[current]:[])]){context.beginPath();stroke.forEach(([x,y],i)=>context[i?'lineTo':'moveTo'](x*canvas.width/109,y*canvas.height/109));context.stroke();}document.querySelector('#check-writing').disabled=!strokes.length;document.querySelector('#undo-ink').disabled=!strokes.length;}
 canvas.onpointerdown=e=>{if(pointer!==null)return;e.preventDefault();pointer=e.pointerId;canvas.setPointerCapture(pointer);current=[point(e)];feedback.textContent='';};
 canvas.onpointermove=e=>{if(e.pointerId!==pointer||!current)return;const events=e.getCoalescedEvents?.();for(const event of events?.length?events:[e])current.push(point(event));redraw();};
 canvas.onpointerup=e=>{if(e.pointerId!==pointer)return;current.push(point(e));if(current.length>1)strokes.push(current);current=null;pointer=null;redraw();};
 canvas.onpointercancel=()=>{current=null;pointer=null;redraw();};
 document.querySelector('#clear-ink').onclick=()=>{strokes=[];current=null;pointer=null;feedback.textContent='';redraw();};document.querySelector('#undo-ink').onclick=()=>{strokes.pop();feedback.textContent='';redraw();};
 document.querySelector('#check-writing').onclick=()=>{const result=assessWriting(strokes,sampleModels(),c.word);if(result.empty){feedback.textContent=result.message;return;}const t=result.target,guided=!document.querySelector('#stroke-model').classList.contains('hidden');feedback.innerHTML=`<div class="feedback ${result.coherent?'':'wrong'}"><strong>${result.coherent?'Tratti coerenti con il modello.':'Confronta ancora la forma.'}</strong><p>${guided?'Pratica guidata con modello visibile.':'Pratica a memoria con modello nascosto.'} Compatibilità geometrica con ${esc(c.word)}: <strong>${t.score}%</strong>.</p><ul><li>Numero di tratti: ${result.strokes}/${result.expectedStrokes}${t.count?' · corretto':' · prova ad animare il modello'}.</li><li>Forma complessiva: ${t.shape}% · sequenza: ${t.sequence}%.</li>${t.directions.length?`<li>Controlla la direzione dei tratti ${t.directions.join(', ')}.</li>`:''}</ul><p>Forme più simili fra i 120 modelli: ${result.suggestions.map(r=>`${esc(r.word)} (${r.score}%)`).join(' · ')}.</p><p class="small">È un confronto geometrico locale, non un riconoscimento certo o un voto di calligrafia. Guarda anche proporzioni, ordine e modello animato. Questo risultato non modifica le valutazioni dei quiz.</p></div>`;};
 redraw();
}
