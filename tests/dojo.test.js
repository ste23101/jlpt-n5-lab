import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {dojoGames,dojoQuestions,missionQuestions,strokeQuestions} from '../dojo-data.js';
import {officialQuestions,officialPool} from '../official-questions.js';
import {kanjiQuestions} from '../quest.js';

test('67 quesiti ufficiali: ogni risposta coincide con la chiave del fascicolo e mantiene la fonte',()=>{
 const keys=JSON.parse(fs.readFileSync(new URL('../risorse/ufficiali/chiave-2018.json',import.meta.url)));
 assert.equal(officialQuestions.length,67);
 for(const q of officialQuestions){
  const kind=q.id.split('-')[2],offset=kind==='r'?27:1,key=keys[kind][q.source.question-offset];
  assert.equal(q.answer,q.options[key-1],q.id);assert.equal(new Set(q.options).size,4,q.id);
  assert.ok(q.explanation&&q.requirements.length);assert.match(q.source.url,/^https:\/\/www.jlpt.jp\/samples\/sample2018\/pdf\/N5[VGR].pdf$/);
  assert.ok(fs.existsSync(new URL('../'+q.source.local,import.meta.url)));
  for(const page of q.passages||[])assert.ok(fs.existsSync(new URL('../'+page.src,import.meta.url)),page.src);
 }
 assert.equal(officialPool('vocabulary').length,35);assert.equal(officialPool('writing').length,8);assert.equal(officialPool('grammar').length,26);assert.equal(officialPool('reading').length,6);
 assert.equal(new Set(officialQuestions.map(q=>q.id)).size,67);
});
test('quattro giochi, 72 esercizi nuovi e 24 kanji collegati alle valutazioni esistenti',()=>{
 assert.equal(dojoGames.length,4);assert.equal(dojoQuestions.length,72);assert.equal(new Set(dojoQuestions.map(q=>q.id)).size,72);
 for(const game of dojoGames){assert.equal(game.questions.length,24);for(const q of game.questions){assert.equal(new Set(q.options).size,4,q.id);assert.ok(q.options.includes(q.answer));assert.ok(q.explanation);}}
 const existing=new Map(kanjiQuestions().map(q=>[q.id,q]));for(const q of strokeQuestions){assert.equal(q.answer,existing.get(q.id).answer);assert.ok(q.paths.length);}
});
test('missioni: errori prima delle nuove, risposte già corrette per ultime; nessun errore inventato',()=>{
 const pool=dojoQuestions.slice(0,5),answers={[pool[0].id]:{correct:true},[pool[3].id]:{correct:false}};
 const m=missionQuestions(pool,answers);assert.equal(m[0].id,pool[3].id);assert.equal(m.at(-1).id,pool[0].id);
 assert.deepEqual(missionQuestions(pool,answers,'errors').map(q=>q.id),[pool[3].id]);assert.deepEqual(missionQuestions(pool,{},'errors'),[]);
 assert.equal(missionQuestions(dojoQuestions,{},'mix').length,8);
});
