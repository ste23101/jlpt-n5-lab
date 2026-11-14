import {officialExtra} from './official-extra.js';
// Riproduzione didattica gratuita: policy JLPT §1(4). Vedi risorse/ufficiali/ATTRIBUZIONE.md.
const rows=[
['あしたは 雨ですか。','雨',['ゆき','はれ','くもり','あめ'],3,'雨 si legge あめ. Non confondere pioggia, neve e cielo sereno.','Leggere un kanji di natura in una frase breve.'],
['きょうしつで 書いて ください。','書いて',['かいて','きいて','はいて','ひいて'],0,'書いて è la forma て di 書く: かいて.','Riconoscere la lettura del verbo con gli okurigana.'],
['しゃしんは はこの 中に あります。','中',['そば','そと','なか','よこ'],2,'中に si legge なかに e indica che la fotografia è dentro la scatola.','Distinguere letture di posizione e particella に.'],
['この いすは 小さいです。','小さい',['ちいさい','ちさい','しいさい','しさい'],0,'小さい si legge ちいさい: conserva la vocale lunga ちい.','Riconoscere la vocale lunga nella lettura di un aggettivo.'],
['あしたは 火よう日です。','火よう日',['どようび','すいようび','かようび','にちようび'],2,'火よう日 si legge かようび: martedì.','Leggere i giorni della settimana e i loro kanji.'],
['きれいな 空ですね。','空',['いえ','うみ','にわ','そら'],3,'空 in questa frase si legge そら, cielo.','Scegliere la lettura del kanji nel contesto.'],
['せいとは 百人 います。','百人',['ひゃくにん','びゃくにん','ひゃくじん','びゃくじん'],0,'百人 si legge ひゃくにん. 人 qui è il contatore delle persone, にん.','Leggere numeri e contatori di persone.'],
['魚が たくさん いますよ。','魚',['ねこ','とり','いぬ','さかな'],3,'魚 in questa frase si legge さかな, pesce.','Riconoscere kanji comuni di animali.'],
['パンを 半分 ともだちに あげました。','半分',['はんふん','はんぶん','ほんぶん','ほんふん'],1,'半分 si legge はんぶん: metà. Attenzione alla sonorizzazione ぶ.','Leggere composti con dakuten.'],
['ぎんこうと スーパーの 間に ほそい みちが あります。','間',['あいた','となり','あいだ','どなり'],2,'間 qui si legge あいだ: tra la banca e il supermercato.','Distinguere あいだ e となり nel contesto spaziale.'],
['たまごを 三つ とって ください。','三つ',['いつつ','みっつ','さんつ','ごつ'],1,'三つ si legge みっつ. Il contatore in つ ha letture proprie.','Riconoscere il contatore tradizionale e la consonante doppia.'],
['きょうは 元気が いいですね。','元気',['けんき','げんき','でんき','てんき'],1,'元気 si legge げんき. でんき e てんき sono parole diverse.','Leggere composti e distinguere suoni simili.']
];
const initialQuestions=rows.map(([sentence,target,options,index,explanation,requirement],i)=>({id:`official-2018-v-${i+1}`,category:'kanji',prompt:`${sentence}\n\nCome si legge 「${target}」?`,answer:options[index],options,explanation,requirements:[requirement,'Hiragana, vocali lunghe e suoni sonorizzati.'],source:{title:'JLPT Official Practice Workbook Vol. 2 (2018) · N5 · Lessico',url:'https://www.jlpt.jp/samples/sample2018/pdf/N5V.pdf',local:'./risorse/ufficiali/N5V-2018.pdf',page:i<6?1:2,pdfPage:i<6?3:4,question:i+1,attribution:'Source: Official Worldwide Japanese-Language Proficiency Test Website (https://www.jlpt.jp/)',policy:'https://www.jlpt.jp/e/policy.html'}}));

export const officialQuestions=[...initialQuestions,...officialExtra];
export const officialSections=[
 {id:'all',title:'Tutti i quesiti',description:'Lessico, grammatica e lettura del workbook 2018.'},
 {id:'vocabulary',title:'Lessico completo',description:'Letture, grafie, parole in contesto e parafrasi.'},
 {id:'readings',title:'Letture dei kanji',description:'Problema 1: le 12 letture del primo laboratorio.'},
 {id:'writing',title:'Scrivere kanji e katakana',description:'Problema 2: scegli la grafia corretta.'},
 {id:'grammar',title:'Grammatica',description:'Particelle, forme, ordine con ★ e completamento del testo.'},
 {id:'reading',title:'Comprensione scritta',description:'Avvisi, memo, racconti e ricerca di informazioni.'}
];
export function officialPool(id='all'){
 return officialQuestions.filter(q=>id==='all'||id==='vocabulary'&&q.id.includes('-v-')||id==='readings'&&q.id.includes('-v-')&&q.source.question<=12||id==='writing'&&q.id.includes('-v-')&&q.source.question>=13&&q.source.question<=20||id==='grammar'&&q.id.includes('-g-')||id==='reading'&&q.id.includes('-r-'));
}
