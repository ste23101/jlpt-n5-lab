import {readingData} from './furigana-data.js';
export function startFurigana(root=document.querySelector('#main')){
 const decorate=target=>{
  if(!target?.isConnected||target.closest?.('.reading-word'))return;
  const walker=document.createTreeWalker(target,NodeFilter.SHOW_TEXT),nodes=[];
  while(walker.nextNode()){
   const node=walker.currentNode,parent=node.parentElement;
   if(!parent||!parent.closest('[lang="ja"],.example,.speech-bubble,.dojo-sentence')||parent.closest('button,a,svg,script,style,textarea,input,.quiz-box,.reading-word,[data-no-reading]'))continue;
   if(readingData[node.data.trim()])nodes.push(node);
  }
  for(const node of nodes){const value=node.data,key=value.trim(),parts=readingData[key];if(!parts.some(p=>p.reading))continue;const fragment=document.createDocumentFragment();fragment.append(document.createTextNode(value.slice(0,value.indexOf(key))));
   for(const part of parts){if(!part.reading){fragment.append(document.createTextNode(part.text));continue;}const button=document.createElement('button');button.type='button';button.className='reading-word';button.lang='ja';button.dataset.reading=part.reading;button.setAttribute('aria-expanded','false');button.setAttribute('aria-label',`Mostra lettura di ${part.text}`);const ruby=document.createElement('ruby'),rt=document.createElement('rt');ruby.append(document.createTextNode(part.text));rt.textContent=part.reading;rt.hidden=true;ruby.append(rt);button.append(ruby);fragment.append(button);}
   fragment.append(document.createTextNode(value.slice(value.indexOf(key)+key.length)));node.replaceWith(fragment);
  }
 };
 const click=e=>{const b=e.target.closest('.reading-word');if(!b||!root.contains(b))return;const expanded=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',String(expanded));b.querySelector('rt').hidden=!expanded;b.setAttribute('aria-label',`${b.querySelector('ruby').firstChild.textContent}${expanded?' · '+b.dataset.reading:' · mostra lettura'}`);};
 root.addEventListener('click',click);decorate(root);const observer=new MutationObserver(records=>{const targets=new Set(records.map(r=>r.type==='characterData'?r.target.parentElement:r.target));for(const target of targets)if(target instanceof Element&&!target.closest('.reading-word'))decorate(target);});observer.observe(root,{childList:true,characterData:true,subtree:true});return()=>{observer.disconnect();root.removeEventListener('click',click);};
}
