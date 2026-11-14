# Kanji Quest · Il tuo dojo per il JLPT N5

Un percorso di studio in italiano con schede kanji, componenti, storie mnemoniche, ripasso programmato, quiz e valutazioni. Tema giocoso con mappa, XP, livelli e medaglie: il gioco premia la costanza, mentre il rapporto per area misura gli esercizi svolti.

## Apri il sito

**Sito pubblico:** https://ste23101.github.io/jlpt-n5-lab/

GitHub Pages attivo dal branch `main`, cartella radice. Gli aggiornamenti pubblicati su `main` avviano una nuova distribuzione.

Progetto indipendente, non affiliato a JLPT, Japan Foundation o JEES. Il sito non garantisce il superamento dell’esame e non converte le percentuali dei quiz in punteggi ufficiali.

## Il Kanji Dex

**120 schede**, divise in 100 fondamentali e 20 di esplorazione. Sono una selezione didattica del progetto, non una lista ufficiale o esaustiva N5.

Ogni scheda contiene:

- significato in italiano, letture on/kun, parola d’esempio con lettura;
- radicale classico di dizionario, numero Kangxi e varianti frequenti;
- componenti grafici estratti dai diagrammi KanjiVG, distinti dal radicale;
- mnemonica originale, esplicitamente presentata come storia inventata, non etimologia;
- diagramma locale, animazione dei tratti, avanzamento per singolo tratto;
- lavagna per tracciare a mano, con modello nascondibile (pratica libera, senza riconoscimento o voto automatico);
- preferiti, appunti personali, ripasso programmato e verifica di significato/lettura.

Sono inclusi fisicamente **120 SVG KanjiVG** e i metadati KANJIDIC2. Vedi [fonti e licenze](risorse/CREDITI.md). I dati originali sono stati estratti il 14 novembre 2026. Il manifest contiene gli SHA-256 dei diagrammi scaricati.

## Studio e gioco

- Mappa di 5 isole: numeri e tempo, natura e colori, persone e vita, viaggi e luoghi, scuola e azioni.
- **240 domande kanji**, **75 sui radicali**, **219 di lessico**, **30 di grammatica**, **10 di lettura**, **6 dialoghi** originali: 580 quesiti complessivi.
- Giardino delle coppie: 6 abbinamenti fra kanji e significati, nessun limite di tempo.
- XP: +3 per carta valutata, +5 per risposta corretta, +10 per sessione completata per area, +15 per giardino completato. Ogni specifica azione assegna il premio una sola volta al giorno; le risposte corrette ripetute il giorno stesso non moltiplicano gli XP.
- Livelli ogni 100 XP, serie di giorni di pratica e medaglie. Nessuna vita da perdere o contenuto bloccato.
- 208 carte kana, 219 parole, 35 schede di grammatica in italiano.
- Ripasso: errore dopo 10 minuti; successo dopo 1 giorno, poi intervallo doppio fino a 30 giorni. Le autovalutazioni delle carte misurano la familiarità dichiarata, non la preparazione verificata.
- Timer dei quiz, correzioni motivate e ripasso degli errori, inclusi quelli dei kanji.

## Valutazioni e piano dell’esame

Il rapporto separa **kanji, radicali, lessico, grammatica, lettura e ascolto**. Per ogni area mostra risposte corrette, numero di domande distinte, percentuale e suggerimento di ripasso. Conta l’ultima risposta a ciascuna domanda: ripetere lo stesso quesito non aumenta la dimensione del campione. Le risposte non date in una sessione terminata contano come errori.

Le etichette hanno queste regole: meno di 5 risposte “Da esplorare”; da 5 a 9 “Primi indizi”; da 10 risposte, sotto 60% “Da rinforzare”, 60–79% “In crescita”, almeno 80% “Buona base”. Sono fasce didattiche, non probabilità di promozione. I 6 dialoghi interni costituiscono un campione piccolo: usare anche registrazioni e prove ufficiali.

Obiettivo confermato: **6 dicembre 2026**, preimpostato anche per i salvataggi precedenti con data vuota. Le date personalizzate già salvate restano invariate. Il conto alla rovescia usa giorni di calendario; lo sprint distingue fondamentali, consolidamento, simulazioni e ripasso leggero in base al tempo rimasto. Il percorso in 12 tappe resta come riferimento. Verificare iscrizione e convocazione con l’organizzatore locale.

## Risorse scaricabili incluse

La sezione Inventario offre:

- `risorse/quaderno-kanji.pdf` e versione HTML: 120 schede con griglie di scrittura;
- `risorse/guida-esame.pdf` e versione HTML: metodo, 12 tappe, 35 regole, 40 esercizi originali con correzioni, foglio errori e checklist;
- `risorse/kanji-anki.tsv`: fronte, retro con letture/radicale/mnemonica, tag; importare in Anki con tabulazioni e “Consenti HTML nei campi”;
- `risorse/lessico-anki.tsv`: mazzo introduttivo italiano;
- `risorse/kanji-base.csv`, `kanji-base.json`, SVG e licenze;
- `risorse/pacchetto-studio.zip`: raccolta delle risorse, con attribuzioni.

I PDF/audio ufficiali non sono redistribuiti: il sito collega i [workbook JLPT 2012 e 2018](https://www.jlpt.jp/e/samples/sampleindex.html), con audio, trascrizioni, soluzioni e fogli risposta. Timer separato per lessico (20 minuti), grammatica e lettura (40), ascolto (circa 30). Diario delle prove su carta e cronologia dei risultati.

## Avvio e verifica

Nessuna dipendenza npm, build, backend o API key. Python 3 e browser moderno:

```sh
npm start
```

Apri http://localhost:4173. Non usare `file://` per l’app: utilizza moduli JavaScript. I quaderni HTML in `risorse/` si possono invece aprire direttamente dal pacchetto estratto.

Controlli automatici con Node.js 22 o successivo:

```sh
npm run check
```

I test verificano opzioni dei quiz, dati delle carte, file locali e hash, coerenza dei tratti, intervalli, premi giornalieri, streak, percentuali, compatibilità e limiti dei backup.

Verifica facoltativa nel browser (Python Playwright e Chromium): avvia il server, poi `python3 tests/quest_browser.py`. Controlla anche filtri, schede, preferiti, appunti, animazioni, lavagna, quiz corretto 10/10, valutazione, gioco completato e layout a 1440/768/390 pixel. Genera anche i PDF dai quaderni HTML. La verifica generale precedente rimane in `tests/browser_check.py`.

## GitHub Pages

Il sito è statico, con percorsi relativi adatti a `/jlpt-n5-lab/`. Configurazione: **Settings → Pages → Deploy from a branch → main → /(root)**. `.nojekyll` disabilita l’elaborazione Jekyll. Lo script `scripts/publish.sh` gestisce la creazione iniziale e la prima pubblicazione; per aggiornare un sito già presente usa un normale commit e push al branch `main`.

## Dati sul dispositivo

Salvataggio nel browser in `localStorage` (`n5lab-v1`): progressi, valutazioni, appunti, preferiti e XP. Non c’è sincronizzazione fra dispositivi. Esportare/importare il JSON nella sezione Risorse. I backup precedenti restano compatibili; l’importazione valida i dati e chiede conferma prima di sostituirli. Nessun analytics. Font da Google Fonts con fallback locali. La sintesi vocale richiede una voce giapponese del sistema; disponibilità e trattamento dipendono dalla voce installata. In assenza di voce sono indicati gli audio ufficiali.

## Fonti d’esame

Verificate il 14 novembre 2026:

- [Formato, tempi e calendario](https://www.jlpt.jp/e/guideline/testsections.html).
- [Soglie](https://www.jlpt.jp/e/guideline/results.html): N5 totale almeno 80/180, lingua e lettura 38/120, ascolto 19/60; bisogna rispettare tutte le condizioni e sostenere tutte le sezioni.
- [FAQ](https://www.jlpt.jp/e/faq/index.html): punteggi calibrati; nessuna lista completa ufficiale dei contenuti del formato attuale.
- [Esempi ufficiali](https://www.jlpt.jp/e/samples/forlearners.html), [workbook](https://www.jlpt.jp/e/samples/sampleindex.html), [organizzatori e iscrizione](https://www.jlpt.jp/e/application/overseas_index.html).
- [Irodori](https://www.irodori.jpf.go.jp/en/), [Minato](https://minato-jf.jp/), [Anki](https://apps.ankiweb.net/).

## Licenze

Codice dell’app MIT. Dati e materiali derivati da KanjiVG e KANJIDIC2 hanno licenze separate: **CC BY-SA 3.0 per gli SVG originali KanjiVG**, **CC BY-SA 4.0 per gli estratti KANJIDIC2 e le schede aggregate adattate**. Il file LICENSE MIT non si applica ai materiali di terzi o ai dataset derivati: dettagli in [risorse/CREDITI.md](risorse/CREDITI.md). Marchi e materiali esterni appartengono ai rispettivi titolari.

## Aggiornamento: salvataggi, scenette, quesiti ufficiali e Sushi Quest

- **Diario e salvataggi** (`#salvataggi`): copia primaria localStorage, seconda copia IndexedDB, fino a 5 punti di ripristino locali, recupero automatico della copia leggibile più recente, backup JSON e richiesta facoltativa di conservazione persistente al browser. Prima di importare o ripristinare viene conservato il progresso attuale. Azzerare tutti i progressi cancella anche le copie precedenti. Nessuna sincronizzazione automatica o account: le due copie rimangono sullo stesso dispositivo; cancellare tutti i dati del sito può eliminarle entrambe. Esportare il JSON per conservarlo separatamente o trasferirlo.
- **Scenette e dialoghi** (`#scenette`): sushi, stazione, negozio, biblioteca, parco e aula. Sei dialoghi originali, 24 battute, attori illustrati, lettura in kana, traduzione, spiegazione e 12 domande di comprensione.
- **Audio ElevenLabs realmente inclusi**: 6 MP3 completi e 24 MP3 delle battute, generati con modello `eleven_v4`, voci professionali giapponesi standard **Momoka** e **Makoto-san**, con tag espressivi. Player da 0,6× a 1,25× con pitch preservato, ripetizione di una frase, pausa e ripresa. Gli MP3 sono generati prima e pubblicati come file: ascoltarli non consuma credito API. Nessuna chiave è nel browser o nella repository. Gli audio sono sintetici di studio, non ufficiali JLPT.
- **12 quesiti ufficiali** (`#ufficiali`): workbook 2018 N5, lessico, 問題1, domande 1–12. Fonte e requisiti accanto a ogni domanda; soluzioni confrontate con la chiave originale. Riproduzione didattica gratuita con attribuzione, secondo Site Policy JLPT §1(4): vedere [condizioni e attribuzione](risorse/ufficiali/ATTRIBUZIONE.md). Sono inclusi i PDF scritti N5 lessico e soluzioni; gli audio ufficiali e gli altri contenuti di terzi esclusi non vengono riprodotti. Questa sezione aggiorna la precedente scelta di tenere tutti i materiali ufficiali fuori dal pacchetto.
- **Sushi Quest** (`#arcade`): una risposta corretta distinta al giorno vale un piattino, cinque piattini aprono una capsula; collezione di 12 sigilli a rotazione. Niente acquisti o premi a pagamento. Aggiunge 8 giochi di ricomposizione di frasi e 8 domande sui componenti dei kanji. È un gioco originale, non affiliato a Kura Sushi e non una copia dei marchi/personaggi Bikkura Pon.

La banca conta ora **612 quesiti** complessivi, oltre alle 8 frasi da ricomporre. Le domande delle scenette usano gli MP3 ElevenLabs anche durante il quiz; il numero di risposte distinte e l’ultima risposta continuano a governare le valutazioni. I vecchi backup restano compatibili.

Per creare nuovi audio fuori dal browser è disponibile `scripts/generate_dialogue_audio.py`: richiede una chiave in una variabile segreta dell’ambiente e non la stampa. Non serve per riprodurre i file già pubblicati. I file creati in questo aggiornamento sono stati generati dal plugin ElevenLabs collegato, senza chiavi locali. [Dettagli audio e alternative di generazione](risorse/audio/README.md).

Verifica aggiuntiva: `python3 tests/learning_browser.py` avvia un server temporaneo e controlla riproduzione MP3 rallentata, scene, quesiti ufficiali 12/12, premi, frasi, copia IndexedDB, recupero di un salvataggio corrotto, ripristino e layout a tre larghezze.
