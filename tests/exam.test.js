import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULT_EXAM,daysUntil,sprintPhase} from '../exam-plan.js';
test('obiettivo e conto alla rovescia per giorni di calendario',()=>{assert.equal(DEFAULT_EXAM,'2026-12-06');assert.equal(daysUntil(DEFAULT_EXAM,new Date(2026,10,14,23,59)),22);assert.equal(daysUntil(DEFAULT_EXAM,new Date(2026,11,6,15)),0);assert.equal(daysUntil(DEFAULT_EXAM,new Date(2026,11,7)),-1);assert.equal(daysUntil('2026-02-30'),null);});
test('lo sprint cambia fase avvicinandosi all’esame',()=>{assert.match(sprintPhase(22),/Fondamentali/);assert.match(sprintPhase(14),/Consolidamento/);assert.match(sprintPhase(7),/Prove generali/);assert.match(sprintPhase(1),/Ripasso leggero/);assert.match(sprintPhase(0),/Giorno dell’esame/);});
