export const DEFAULT_EXAM='2026-12-06';
export function daysUntil(exam,now=new Date()){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(exam))return null;
 const [y,m,d]=exam.split('-').map(Number),target=new Date(y,m-1,d);
 if(target.getFullYear()!==y||target.getMonth()!==m-1||target.getDate()!==d)return null;
 return Math.round((Date.UTC(y,m-1,d)-Date.UTC(now.getFullYear(),now.getMonth(),now.getDate()))/86400000);
}
export function sprintPhase(days){
 if(days===null)return 'Scegli la data dell’esame';
 if(days<0)return 'Esame concluso: scegli il prossimo obiettivo';
 if(days===0)return 'Giorno dell’esame: segui la convocazione e arriva in anticipo';
 if(days===1)return 'Ripasso leggero: errori ricorrenti, documenti e riposo';
 if(days<=7)return 'Prove generali: simulazioni ufficiali, ascolto e recupero degli errori';
 if(days<=14)return 'Consolidamento: quiz di lettura dei kanji e lavoro sulle aree deboli';
 return 'Fondamentali: kanji quotidiani, parole d’esempio e ascolto';
}
export function sprintHTML(exam,now=new Date()){
 const days=daysUntil(exam,now);if(days===null)return '';
 return `<section class="card spaced"><span class="tag">${days>=0?'SPRINT VERSO L’ESAME':'IL TUO PERCORSO'}</span><h2 class="spaced">${days===0?'Oggi è il giorno':days>0?`${days} ${days===1?'giorno':'giorni'} al tuo obiettivo`:'Aggiorna il tuo obiettivo'}</h2><p><strong>Adesso:</strong> ${sprintPhase(days)}.</p><p>Routine consigliata: 15 minuti di ripasso kanji, 10 minuti di letture nelle parole, 10 di grammatica o lettura e 15 di ascolto. Aggiungi fino a 5 kanji nuovi al giorno solo se riesci a ripassare quelli precedenti.</p><ol><li><strong>Fino a 15 giorni prima:</strong> dai priorità ai 100 kanji fondamentali. Ricorda una parola per ogni carattere; i 20 extra possono aspettare.</li><li><strong>Da 14 a 8 giorni prima:</strong> alterna quiz di significato e lettura. Usa le valutazioni per dedicare più tempo all’area debole.</li><li><strong>Da 7 a 2 giorni prima:</strong> svolgi prove ufficiali con i tempi previsti; correggi ogni errore e controlla anche l’ascolto.</li><li><strong>Il giorno prima:</strong> ripasso breve, controllo di convocazione e documento, poi riposo.</li></ol><div class="actions"><a class="btn primary" href="#kanji">Ripassa i kanji →</a><a class="btn" href="#valutazioni">Scegli l’area da rinforzare</a><a class="btn" href="#simulazioni">Prove ufficiali</a></div><p class="small spaced">Lo sprint organizza il tempo rimasto; la preparazione effettiva dipende dal tuo livello iniziale. Il percorso in 12 tappe qui sotto resta disponibile come riferimento.</p></section>`;
}
