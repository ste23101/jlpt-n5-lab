import kuromoji from 'kuromoji';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {grammar,vocab,listening} from '../data.js';
import {dex} from '../kanji-dex.js';
import {scenes} from '../scenes-data.js';
import {animeLessons} from '../anime-lessons.js';
import {dojoQuestions} from '../dojo-data.js';
const tokenizer=await new Promise((resolve,reject)=>kuromoji.builder({dicPath:fileURLToPath(new URL('../node_modules/kuromoji/dict/',import.meta.url))}).build((e,t)=>e?reject(e):resolve(t)));
const strings=[...animeLessons.map(l=>l.study),...grammar.map(g=>g.example),...vocab.map(v=>v.word),...dex.flatMap(c=>[c.example.word,`${c.example.word}（${c.example.reading}）`]),...scenes.flatMap(s=>s.lines.map(l=>l.text)),...dojoQuestions.flatMap(q=>[q.sentence,q.word,q.answer,...(q.sentence||'').split('【　】')]),...listening.map(q=>q.text)].filter(s=>s&&/\p{Script=Han}/u.test(s));
const overrides={'二皿':'ふたさら','一人':'ひとり','二人':'ふたり','三つ':'みっつ','四時':'よじ','七時':'しちじ','九時':'くじ','何時':'なんじ','何人':'なんにん','二十日':'はつか','二十歳':'はたち','今日':'きょう','明日':'あした','昨日':'きのう','日本':'にほん'};
const kana=s=>s.replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60));
const data={};
for(const text of new Set(strings)){
 const tokens=tokenizer.tokenize(text),parts=[];
 for(let i=0;i<tokens.length;i++){
  const t=tokens[i],offset=t.word_position-1,override=Object.keys(overrides).sort((a,b)=>b.length-a.length).find(w=>text.startsWith(w,offset));
  if(override){let end=offset;let j=i;while(j<tokens.length&&end<offset+override.length){end=tokens[j].word_position-1+tokens[j].surface_form.length;j++;}if(end===offset+override.length){parts.push({text:override,reading:overrides[override]});i=j-1;continue;}}
  parts.push({text:t.surface_form,...(/\p{Script=Han}/u.test(t.surface_form)&&t.reading&&t.reading!=='*'?{reading:kana(t.reading)}:{})});
 }
 if(parts.map(p=>p.text).join('')===text)data[text]=parts;
}
fs.writeFileSync(new URL('../furigana-data.js',import.meta.url),'// Letture contestuali precompilate con kuromoji/IPADIC; vedi risorse/FURIGANA.md.\nexport const readingData='+JSON.stringify(data)+';\n');
console.log('Letture preparate per',Object.keys(data).length,'parole e frasi.');
