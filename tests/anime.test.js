import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {scenes} from '../scenes-data.js';
test('ogni scenetta ha un’immagine locale anime e la prova sushi è distinta dalle immagini statiche',()=>{const manifest=JSON.parse(fs.readFileSync(new URL('../risorse/anime/manifest.json',import.meta.url)));assert.equal(Object.keys(manifest.scenes).length,6);for(const s of scenes){const a=manifest.scenes[s.id];assert.ok(a.synthetic);assert.ok(fs.existsSync(new URL('../'+a.poster,import.meta.url)));assert.ok(!a.poster.includes('http'));}assert.ok(manifest.scenes.sushi.video);assert.ok(fs.existsSync(new URL('../'+manifest.scenes.sushi.video,import.meta.url)));assert.ok(fs.existsSync(new URL('../'+manifest.scenes.sushi.download,import.meta.url)));assert.ok(!manifest.scenes.station.video);});
