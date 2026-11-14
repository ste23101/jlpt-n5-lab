import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {navigationGroup,persistentChecks} from '../site-sections.js';
import {readingData} from '../furigana-data.js';
import {officialQuestions,officialPool} from '../official-questions.js';
import {assessWriting,compareWriting,resample} from '../writing-core.js';
import {animeLessons} from '../anime-lessons.js';
test('sei gruppi di navigazione conservano tutte le vecchie destinazioni',()=>{
 assert.equal(new Set(Object.values(navigationGroup)).size,6);assert.deepEqual(persistentChecks(['daily-one','exam-kit','anime-slugma']),['exam-kit','anime-slugma']);assert.equal(navigationGroup.kanji,'studio');assert.equal(navigationGroup.ufficiali,'esame');assert.equal(navigationGroup.salvataggi,'valutazioni');assert.equal(navigationGroup.anime,'pratica');
});
test('furigana: token ricompongono il testo e letture contestuali corrette',()=>{
 for(const [text,parts] of Object.entries(readingData)){assert.equal(parts.map(p=>p.text).join(''),text);for(const p of parts)if(p.reading)assert.ok(!/[ァ-ヶ*]/.test(p.reading),p.reading);}
 const find=(sentence,word)=>readingData[sentence]?.find(p=>p.text===word)?.reading;
 assert.equal(find('まぐろを二皿ください。','二皿'),'ふたさら');assert.equal(find('今日は公園へ行きましょう。','今日'),'きょう');assert.ok(Object.keys(readingData).length>500);
});
test('33 nuove schede del 2012, risposte e ritagli confrontati con la chiave',()=>{
 const key=JSON.parse(fs.readFileSync(new URL('../risorse/ufficiali/chiave-2012.json',import.meta.url))).v;const bank=officialPool('all','2012');assert.equal(bank.length,33);assert.equal(officialQuestions.length,100);
 bank.forEach((q,i)=>{assert.equal(q.answer,`Risposta ${key[i]}`);assert.equal(q.source.question,i+1);assert.match(q.source.url,/sample2012/);assert.ok(q.numericOptions);assert.ok(fs.existsSync(new URL('../'+q.passages[0].src,import.meta.url)));});
});
test('scrittura: forma e direzione, nessun via libera a tratti mancanti o piccoli scarabocchi',()=>{
 const one=[[[10,50],[90,50]]],ten=[[[10,50],[90,50]],[[50,10],[50,90]]],models={'一':one,'十':ten};
 const shifted=ten.map(s=>s.map(([x,y])=>[x*.8+5,y*.8+12]));let a=assessWriting(shifted,models,'十');assert.ok(a.coherent);assert.equal(a.suggestions[0].word,'十');assert.equal(a.target.score,100);
 a=assessWriting(one,models,'十');assert.ok(!a.coherent);assert.ok(!a.target.count);assert.equal(a.suggestions[0].word,'一');
 const reverse=compareWriting([[...one[0]].reverse()],one);assert.deepEqual(reverse.directions,[1]);assert.ok(reverse.score<100);
 assert.ok(assessWriting([],models,'十').empty);assert.ok(assessWriting([[[1,1],[2,2]]],models,'十').empty);assert.deepEqual(resample([[1,1]]),[]);
});
test('anime: tre fonti ufficiali e nessun URL video copiato nella repo',()=>{
 assert.equal(animeLessons.length,3);for(const l of animeLessons){assert.match(l.source,/^https:\/\/www.pokemon.co.jp\/ex\/poketoon\//);assert.match(l.videoId,/^[\w-]{11}$/);assert.ok(l.study&&l.translation&&l.explanation);assert.ok(l.options.includes(l.answer));}
});
