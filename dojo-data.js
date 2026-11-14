import {dex} from './kanji-dex.js';
// Esercizi originali. Le storie sono mnemoniche didattiche, non etimologie.
const compounds=[
['日本','にほん','Giappone','日 (sole) + 本 (origine): ricorda il paese del sole che sorge.'],
['学校','がっこう','scuola','学 (studio) + 校 (scuola): due caratteri legati allo studio. La lettura ha っ.'],
['先生','せんせい','insegnante','先 (prima) + 生 (vita): immagina chi ha imparato prima e ora ti guida.'],
['学生','がくせい','studente','学 (studio) + 生 (vita): una persona che dedica la sua vita allo studio.'],
['電車','でんしゃ','treno','電 (elettricità) + 車 (veicolo): un veicolo elettrico sui binari.'],
['火山','かざん','vulcano','火 (fuoco) + 山 (montagna): una montagna di fuoco. 山 diventa ざん nel composto.'],
['花火','はなび','fuochi d’artificio','花 (fiore) + 火 (fuoco): fiori di fuoco nel cielo. 火 qui diventa び.'],
['休日','きゅうじつ','giorno di riposo','休 (riposo) + 日 (giorno): un giorno per riposare.'],
['毎日','まいにち','ogni giorno','毎 (ogni) + 日 (giorno): una piccola abitudine quotidiana.'],
['来月','らいげつ','mese prossimo','来 (venire) + 月 (mese): il mese che viene.'],
['来年','らいねん','anno prossimo','来 (venire) + 年 (anno): l’anno che viene.'],
['今年','ことし','quest’anno','今 (ora) + 年 (anno). La parola intera si legge ことし: non sommare letture isolate.'],
['入口','いりぐち','entrata','入 (entrare) + 口 (bocca/apertura). 口 diventa ぐち.'],
['出口','でぐち','uscita','出 (uscire) + 口 (apertura): il passaggio per uscire.'],
['人口','じんこう','popolazione','人 (persone) + 口 (bocche): immagina di contare tutte le persone della città.'],
['天気','てんき','tempo atmosferico','天 (cielo) + 気 (energia): guarda il cielo per sapere che tempo fa.'],
['元気','げんき','salute ed energia','元 (origine) + 気 (energia): l’energia che ti fa stare bene.'],
['大人','おとな','adulto','大 (grande) + 人 (persona). Memorizza おとな come parola intera.'],
['外国','がいこく','paese straniero','外 (fuori) + 国 (paese): un paese oltre il proprio.'],
['会社','かいしゃ','azienda','会 (incontro) + 社 (società): persone che lavorano insieme.'],
['名前','なまえ','nome','名 (nome) + 前 (davanti): immagina il tuo nome sul cartellino davanti a te.'],
['新聞','しんぶん','giornale','新 (nuovo) + 聞 (ascoltare): le notizie nuove che arrivano ogni giorno.'],
['時間','じかん','tempo / durata','時 (tempo) + 間 (intervallo): il tempo fra due momenti.'],
['午前','ごぜん','mattina / prima di mezzogiorno','午 (mezzogiorno) + 前 (prima): le ore prima di mezzogiorno.']
];
export const compoundQuestions=compounds.map(([answer,reading,meaning,hint],i)=>({id:`dojo-compound-${i+1}`,category:'kanji',game:'composti',answer,reading,meaning,hint,prompt:`Componi la parola che significa «${meaning}».`,options:[answer,...[5,11,17].map(n=>compounds[(i+n)%compounds.length][0])],explanation:`${answer}（${reading}）: ${meaning}. ${hint}`,requirements:['Riconoscere i kanji dentro parole complete.']}));
const particles=[
['駅【　】友だちを待ちます。','で',['に','へ','の'],'Aspetto un amico alla stazione.','で marca il luogo dell’azione 待つ; non il luogo di esistenza.','Luogo dell’azione'],
['机の上【　】本があります。','に',['で','を','と'],'Sulla scrivania c’è un libro.','に marca il luogo di esistenza con あります.','Luogo di esistenza'],
['私は毎朝パン【　】食べます。','を',['に','で','へ'],'Mangio pane ogni mattina.','を marca l’oggetto di 食べる: ciò che si mangia.','Oggetto'],
['田中さん【　】会いました。','に',['を','で','の'],'Ho incontrato Tanaka.','会う usa に per la persona incontrata.','Verbo e particella'],
['電車【　】学校へ行きます。','で',['を','の','が'],'Vado a scuola in treno.','で indica il mezzo di trasporto.','Mezzo'],
['七時【　】起きます。','に',['で','を','と'],'Mi alzo alle sette.','に marca un orario preciso.','Orario'],
['家【　】出ます。','を',['が','で','と'],'Esco di casa.','Con 出る, を può indicare il luogo che si lascia.','Partenza'],
['友だち【　】映画を見ます。','と',['が','へ','の'],'Guardo un film insieme a un amico.','と marca la persona con cui si fa qualcosa.','Compagnia'],
['これは私【　】本です。','の',['を','へ','で'],'Questo è il mio libro.','の collega il possessore al nome.','Possesso'],
['朝から夜【　】働きます。','まで',['から','だけ','より'],'Lavoro dalla mattina fino alla sera.','から indica l’inizio e まで la fine dell’intervallo.','Limite temporale'],
['東京【　】大阪まで行きます。','から',['まで','だけ','より'],'Vado da Tokyo fino a Osaka.','から marca il punto iniziale; まで quello finale.','Origine'],
['私は学生です。妹【　】学生です。','も',['を','へ','で'],'Sono studente. Anche mia sorella lo è.','も significa anche e si sostituisce a は in questo contesto.','Aggiunta'],
['水を一杯【　】飲みました。','だけ',['から','まで','より'],'Ho bevuto soltanto un bicchiere d’acqua.','だけ limita la quantità: soltanto uno.','Limitazione'],
['日本語【　】手紙を書きます。','で',['を','が','へ'],'Scrivo una lettera in giapponese.','で indica la lingua o lo strumento impiegato.','Lingua e strumento'],
['母【　】花をあげます。','に',['を','で','が'],'Regalo dei fiori a mia madre.','に marca il destinatario di あげる.','Destinatario'],
['図書館へ本を借り【　】行きます。','に',['を','と','が'],'Vado in biblioteca a prendere un libro in prestito.','Radice della forma ます + に行く esprime lo scopo: 借ります → 借りに.','Scopo'],
['どこ【　】行きません。','にも',['をも','でも','のも'],'Non vado da nessuna parte.','どこにも + negativo significa da nessuna parte.','Interrogativo e negazione'],
['このりんごは三つ【　】百円です。','で',['を','に','が'],'Queste mele costano cento yen per tre.','Quantità + で + prezzo indica il prezzo complessivo.','Prezzo totale'],
['寒いです【　】、窓を閉めます。','から',['まで','より','だけ'],'Poiché fa freddo, chiudo la finestra.','から dopo una frase introduce la causa.','Causa'],
['日曜日【　】勉強しません。月曜日は勉強します。','は',['を','で','と'],'La domenica non studio; il lunedì sì.','は mette a contrasto due giorni.','Contrasto'],
['これは何【　】。','ですか',['でした','では','をです'],'Che cos’è questo?','ですか forma una domanda cortese dopo un nome o un interrogativo.','Domanda cortese'],
['パン【　】牛乳などを買います。','や',['の','へ','に'],'Compro pane, latte e altre cose.','や…など elenca esempi senza chiudere la lista.','Elenco aperto'],
['コーヒー【　】お茶、どちらが好きですか。','と',['を','が','の'],'Fra caffè e tè, quale preferisci?','XとY、どちらが… chiede di scegliere fra due elementi.','Scelta fra due'],
['私【　】作ったケーキです。','が',['を','へ','で'],'È una torta che ho fatto io.','が marca il soggetto della frase relativa 私が作った.','Soggetto nella relativa']
];
export const particleQuestions=particles.map(([sentence,answer,others,translation,explanation,topic],i)=>({id:`dojo-particle-${i+1}`,category:'grammatica',game:'particelle',sentence,answer,options:[answer,...others],translation,topic,prompt:`Completa: ${sentence}\n${translation}`,explanation,requirements:[topic]}));
const forms=[
['書く','forma て','書いて',['書って','書きて','書んで'],'く → いて: 書く → 書いて。','く → いて'],
['聞く','forma て','聞いて',['聞って','聞きて','聞んで'],'Anche 聞く appartiene ai verbi in く: 聞いて。','く → いて'],
['泳ぐ','forma て','泳いで',['泳いて','泳んで','泳ぎて'],'ぐ → いで, con il suono sonorizzato: 泳いで。','ぐ → いで'],
['話す','forma て','話して',['話って','話しで','話いて'],'す → して: 話して。','す → して'],
['待つ','forma て','待って',['待いて','待ちて','待んで'],'う・つ・る dei verbi godan → って: 待って。','つ → って'],
['買う','forma て','買って',['買いて','買うて','買んで'],'う dei verbi godan → って: 買って。','う → って'],
['帰る','forma て','帰って',['帰て','帰りて','帰んで'],'帰る è godan, anche se termina in る: 帰って。','る godan → って'],
['飲む','forma て','飲んで',['飲って','飲みて','飲いて'],'む・ぶ・ぬ → んで: 飲んで。','む → んで'],
['遊ぶ','forma て','遊んで',['遊って','遊びて','遊いて'],'ぶ → んで: 遊んで。','ぶ → んで'],
['読む','forma て','読んで',['読って','読みて','読いて'],'む → んで: 読んで。','む → んで'],
['行く','forma て','行って',['行いて','行きて','行んで'],'Eccezione importante: 行く → 行って, non 行いて。','行く: eccezione'],
['食べる','forma て','食べて',['食べって','食べりて','食べんで'],'食べる è ichidan: togli る e aggiungi て。','Ichidan: る → て'],
['見る','forma て','見て',['見って','見りて','見いて'],'見る è ichidan: togli る e aggiungi て。','Ichidan: る → て'],
['する','forma て','して',['すって','するて','しんで'],'する è irregolare: して。','する → して'],
['来る','forma て','来て',['来って','来りて','来んで'],'来る → 来て, letto きて。 Il kanji resta 来 e cambia la lettura.','来る → 来て（きて）'],
['買う','forma ない','買わない',['買あない','買いない','買うない'],'Per i godan in う, la forma negativa usa わ: 買わない。','う → わない'],
['書く','forma ない','書かない',['書きない','書くない','書けない'],'La finale godan passa alla riga あ: く → かない。 書けない è invece potenziale negativo.','く → かない'],
['食べる','forma ない','食べない',['食べらない','食べるない','食べりない'],'Ichidan: togli る e aggiungi ない。','Ichidan: る → ない'],
['する','forma ない','しない',['すない','さない','するない'],'する ha il negativo irregolare しない。','する → しない'],
['来る','forma ない','来ない',['来らない','来るない','来りない'],'来る → 来ない, letto こない。','来る → 来ない（こない）'],
['飲む','passato piano','飲んだ',['飲った','飲みた','飲いた'],'La trasformazione corrisponde alla forma て: 飲んで → 飲んだ。','む → んだ'],
['行く','passato piano','行った',['行いた','行きた','行んだ'],'Come la forma て, 行く ha il passato eccezionale 行った。','行く → 行った'],
['高い','passato cortese','高かったです',['高いでした','高くでした','高かったでした'],'Aggettivo in い: togli い e aggiungi かったです。','い → かったです'],
['静か','negativo cortese','静かじゃありません',['静かくないです','静かないです','静かいません'],'Aggettivo in な: usa じゃありません (oppure ではありません). Non usare la trasformazione degli aggettivi in い.','な: じゃありません']
];
export const formQuestions=forms.map(([word,form,answer,others,explanation,rule],i)=>({id:`dojo-form-${i+1}`,category:'grammatica',game:'forme',word,form,answer,options:[answer,...others],rule,prompt:`Trasforma 「${word}」: ${form}.`,explanation,requirements:[rule]}));
const strokeChars='日月木本山川人口目耳手火水金土田中上下大小休林森';
export const strokeQuestions=[...strokeChars].map(word=>{const c=dex.find(k=>k.word===word);return {id:`km-${c.id}`,category:'kanji',game:'tratti',word,paths:c.paths,answer:c.meaning,options:[c.meaning,...dex.filter(x=>x.meaning!==c.meaning).slice(0,3).map(x=>x.meaning)],prompt:'Quale significato ha il kanji che sta apparendo?',explanation:`${word}: ${c.meaning}. ${c.mnemonic} Esempio: ${c.example.word}（${c.example.reading}）.`,hint:`Radicale: ${c.radicalName}.`,requirements:['Riconoscere forma e ordine dei tratti.']};});
export const dojoQuestions=[...compoundQuestions,...particleQuestions,...formQuestions];
export const dojoGames=[
{id:'composti',title:'Officina dei composti',icon:'本',category:'kanji',description:'Scegli due kanji e costruisci una parola. Scopri come cambia la lettura nel composto.',questions:compoundQuestions},
{id:'tratti',title:'Il kanji misterioso',icon:'木',category:'kanji',description:'Rivela un tratto alla volta e riconosci il carattere. Puoi chiedere un indizio senza perdere vite.',questions:strokeQuestions},
{id:'particelle',title:'Il treno delle particelle',icon:'電',category:'grammatica',description:'Consegna il biglietto giusto allo spazio vuoto: luogo, mezzo, orario e destinatario.',questions:particleQuestions},
{id:'forme',title:'La fucina delle forme',icon:'文',category:'grammatica',description:'Trasforma verbi e aggettivi: forma て, negativo, passato ed eccezioni.',questions:formQuestions}
];
// Failed answers first, then unseen questions, then answered ones. Stable IDs
// share the existing assessment and prevent reward farming by switching games.
export function missionQuestions(pool,answers={},mode='mix',count=8){
 const selected=mode==='errors'?pool.filter(q=>answers[q.id]?.correct===false):pool;
 const rank=q=>answers[q.id]?.correct===false?0:answers[q.id]?2:1;
 return [...selected].sort((a,b)=>rank(a)-rank(b)).slice(0,count);
}
