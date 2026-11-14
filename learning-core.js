export function extras(s){return s.extras??={plates:[],capsules:[],audioRate:1};}
export function addPlate(s,id,date=new Date()){const e=extras(s),key=`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}:${id}`;if(e.plates.includes(key)||e.plates.length>=10000)return false;e.plates.push(key);return true;}
export function plateBalance(s){const e=extras(s);return Math.max(0,e.plates.length-e.capsules.length*5);}
export const stamps=[['山','Montagna','Un passo verso la vetta'],['水','Acqua','La costanza scorre ogni giorno'],['木','Albero','Le radici crescono col ripasso'],['火','Fuoco','Accendi la curiosità'],['月','Luna','Riposa per ricordare'],['日','Sole','Una nuova giornata di studio'],['友','Amico','Le parole creano incontri'],['本','Libro','Le storie lasciano tracce'],['花','Fiore','Il ricordo sboccia'],['空','Cielo','Lascia spazio alle scoperte'],['魚','Pesce','Segui il flusso del dialogo'],['金','Tesoro','Il tesoro è ciò che hai imparato']];
export function openCapsule(s){const e=extras(s);if(plateBalance(s)<5)return null;const index=e.capsules.length%stamps.length;e.capsules.push(index);return stamps[index];}
export function validExtras(e){return e===undefined||!!e&&typeof e==='object'&&Array.isArray(e.plates)&&e.plates.length<=10000&&e.plates.every(x=>typeof x==='string'&&x.length<=200)&&new Set(e.plates).size===e.plates.length&&Array.isArray(e.capsules)&&e.capsules.length<=2000&&e.capsules.length*5<=e.plates.length&&e.capsules.every(x=>Number.isInteger(x)&&x>=0&&x<stamps.length)&&Number.isFinite(e.audioRate)&&e.audioRate>=.6&&e.audioRate<=1.25;}
export const orderPuzzles=[
{id:'order-1',translation:'Mangio pane ogni mattina.',tokens:['毎朝、','パンを','食べます。'],explanation:'Il tempo precede l’oggetto con を e il verbo va alla fine.'},
{id:'order-2',translation:'In biblioteca studio giapponese.',tokens:['図書館で','日本語を','勉強します。'],explanation:'で marca il luogo dell’azione, を l’oggetto.'},
{id:'order-3',translation:'Nella stanza c’è un gatto.',tokens:['部屋に','猫が','います。'],explanation:'に per il luogo di esistenza; が per ciò che c’è; います per un animale.'},
{id:'order-4',translation:'Vado a scuola alle sette.',tokens:['七時に','学校へ','行きます。'],explanation:'に marca l’orario preciso; へ la direzione; 行きます chiude la frase.'},
{id:'order-5',translation:'Prima di dormire leggo un libro.',tokens:['寝る','前に、','本を','読みます。'],explanation:'寝る前に = prima di dormire. Il verbo principale è 読みます.'},
{id:'order-6',translation:'Posso bere il tè qui?',tokens:['ここで','お茶を','飲んでも','いいですか。'],explanation:'飲んでもいいですか chiede il permesso; ここで indica il luogo.'},
{id:'order-7',translation:'Vado a comprare un libro.',tokens:['本を','買いに','行きます。'],explanation:'Radice di 買います + に行く indica lo scopo dello spostamento.'},
{id:'order-8',translation:'Poiché fa freddo, chiudo la finestra.',tokens:['寒いですから、','窓を','閉めます。'],explanation:'から introduce la ragione; 窓を è l’oggetto di 閉めます.'}
];
export const builderQuestions=[
['休','亻 + 木','Una persona accanto a un albero: la storia del riposo.',['体','本','林']],
['男','田 + 力','Campo e forza sono i componenti visibili di 男.',['女','力','田']],
['林','木 + 木','Due alberi formano 林, bosco.',['森','本','休']],
['森','木 + 木 + 木','Tre alberi ti aiutano a riconoscere 森, foresta.',['林','木','校']],
['本','木 + 一','Una linea aggiunta vicino alla base di 木 distingue 本.',['木','休','大']],
['字','宀 + 子','Sotto il tetto 宀 riconosci 子: 字 significa carattere scritto.',['学','安','名']],
['安','宀 + 女','Tetto e 女 sono i componenti visibili di 安.',['字','母','家']],
['聞','門 + 耳','Un orecchio dentro il portale: la storia per ricordare 聞.',['問','間','耳']]
].map(([answer,pieces,explanation,others],i)=>({id:`builder-${i}`,category:'kanji',prompt:`Quale carattere riconosci attraverso queste forme?\n${pieces}`,answer,options:[answer,...others],explanation:explanation+' È un aiuto visivo, non una spiegazione etimologica.',requirements:['Riconoscere i componenti grafici dei kanji.']}));
