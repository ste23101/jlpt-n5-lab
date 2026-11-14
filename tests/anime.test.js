import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {scenes} from '../scenes-data.js';
test('ogni scenetta ha un’immagine locale anime e la prova sushi è distinta dalle immagini statiche',()=>{const manifest=JSON.parse(fs.readFileSync(new URL('../risorse/anime/manifest.json',import.meta.url)));assert.equal(Object.keys(manifest.scenes).length,6);for(const s of scenes){const a=manifest.scenes[s.id];assert.ok(a.synthetic);assert.ok(fs.existsSync(new URL('../'+a.poster,import.meta.url)));assert.ok(!a.poster.includes('http'));}assert.ok(manifest.scenes.sushi.video);assert.ok(fs.existsSync(new URL('../'+manifest.scenes.sushi.video,import.meta.url)));assert.ok(fs.existsSync(new URL('../'+manifest.scenes.sushi.download,import.meta.url)));assert.ok(!manifest.scenes.station.video);});
test('ogni inquadratura sushi segue la voce, il testo e i tempi originali senza allungamento',()=>{
 const art=JSON.parse(fs.readFileSync(new URL('../risorse/anime/manifest.json',import.meta.url))).scenes.sushi;
 const audio=JSON.parse(fs.readFileSync(new URL('../risorse/audio/manifest.json',import.meta.url))).scenes.sushi;
 assert.equal(art.status,'ready');assert.equal(art.timingMode,'audio-exact');assert.equal(art.shots.length,4);
 art.shots.forEach((shot,i)=>{
  const line=audio.lines[i];assert.equal(shot.speaker,line.speaker);assert.equal(shot.text,scenes.find(s=>s.id==='sushi').lines[i].text);
  assert.equal(shot.start,line.start);assert.equal(shot.audioSrc,line.src);assert.equal(shot.audioSha256,line.sha256);
  assert.equal(createHash('sha256').update(fs.readFileSync(new URL('../'+shot.audioSrc,import.meta.url))).digest('hex'),shot.audioSha256);
  assert.ok(fs.existsSync(new URL('../'+shot.poster,import.meta.url)));assert.ok(shot.videoGeneration);assert.equal(shot.videoModel,'bytedance-omnihuman-v1.5');
 });
 assert.equal(new Set(art.shots.map(s=>s.poster)).size,4);
});
