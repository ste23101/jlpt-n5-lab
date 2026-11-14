# N5 Lab — JLPT N5 in italiano

Laboratorio statico per preparare il JLPT N5: percorso di studio, pratica attiva e risorse ufficiali. Progetto indipendente, non affiliato a Japan Foundation, JEES o JLPT. Non garantisce il superamento dell’esame.

## Cosa contiene

- Scrivania con routine quotidiana, riepilogo dei progressi e conto alla rovescia.
- Piano in 12 tappe con checkpoint e data dell’esame personalizzabile.
- **219 parole**, **208 carte kana** (hiragana, katakana, dakuten e combinazioni), **90 kanji** con esempi di lettura nelle parole.
- Ripasso programmato: errore dopo 10 minuti, successo dopo 1 giorno, intervallo doppio fino a 30 giorni; pratica libera.
- **35 schede di grammatica** spiegate in italiano.
- **259 domande di lessico, grammatica e lettura**; quiz casuali, timer facoltativo, spiegazioni, correzione e ripasso degli errori.
- **6 dialoghi originali** per l’ascolto con sintesi vocale giapponese, se installata sul dispositivo. La registrazione naturale resta disponibile tramite i link ufficiali.
- Workbook ufficiali 2012 e 2018, timer separato 20/40/30 minuti e diario delle prove su carta.
- Esportazione TSV per Anki; backup e ripristino JSON dei progressi.
- Layout adattabile al telefono, navigazione da tastiera e foglio di stampa.

La selezione è introduttiva e non costituisce una lista completa o ufficiale dei contenuti N5. Integrare con un corso completo e i workbook. Il JLPT non pubblica una lista esaustiva per il formato attuale.

## Avvio locale

Servono Python 3 e un browser moderno. Non servono installazioni npm per usare il sito.

```sh
python3 -m http.server 4173
```

Aprire http://localhost:4173. Usare un server HTTP: i moduli JavaScript non sono pensati per l’apertura diretta con `file://`.

## Verifica

Con Node.js 22 o successivo:

```sh
npm run check
```

I test controllano integrità e unicità dei contenuti, opzioni dei quiz, ripasso programmato, validazione dei backup e neutralizzazione HTML. Per il controllo facoltativo nel browser: installare Python Playwright e Chromium; avviare il server locale e poi `python3 tests/browser_check.py`. La workflow GitHub esegue i controlli JavaScript a ogni push e pull request.

## Pubblicazione su GitHub Pages

Il progetto usa solo HTML/CSS/JS con percorsi relativi: funziona anche sotto `/jlpt-n5-lab/`, senza build, backend, API key o database.

Lo script crea una **nuova repository pubblica**, invia il commit locale e configura GitHub Pages da `main`, cartella `/`. Richiede Git, `gh` autenticato con permessi di creazione repository e amministrazione Pages. Prima va eseguito un commit locale.

```sh
gh auth login
bash scripts/publish.sh
```

Se la repository pubblica è già stata creata vuota sul proprio account, lo script la riutilizza dopo aver verificato che sia vuota. Rifiuta repository esistenti non vuote, account differenti, remoti inattesi e working tree con modifiche non salvate. È possibile specificare un altro nome: `bash scripts/publish.sh nome-repository`.

Alternativa manuale:

1. Creare una repository pubblica e caricare i file nella radice del branch `main`.
2. Aprire **Settings → Pages → Build and deployment**.
3. Selezionare **Deploy from a branch → main → /(root)** e salvare.
4. Attendere il deploy e aprire l’URL indicato da GitHub. Non basta creare la repository perché il sito sia pubblico.

Riferimento: [documentazione GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Fonti e regole dell’esame

Verificate il **14 novembre 2026**:

- [Formato e tempi JLPT](https://www.jlpt.jp/e/guideline/testsections.html): N5 lessico 20 minuti, grammatica e lettura 40, ascolto circa 30; la durata dell’ascolto può variare.
- [Soglie ufficiali](https://www.jlpt.jp/e/guideline/results.html): totale almeno 80/180; lingua e lettura almeno 38/120; ascolto almeno 19/60. Devono essere soddisfatte tutte le condizioni e vanno sostenute tutte le sezioni.
- [FAQ JLPT](https://www.jlpt.jp/e/faq/index.html): punteggi calibrati e assenza di liste esaustive pubblicate di contenuti.
- [Workbook ufficiali 2012 e 2018](https://www.jlpt.jp/e/samples/sampleindex.html): PDF, audio, fogli risposta, soluzioni e trascrizioni. I vecchi volumi precedono la variazione dei tempi del 2020.
- [Domande di esempio](https://www.jlpt.jp/e/samples/forlearners.html): introduzione alle tipologie, non prova completa.
- [Irodori](https://www.irodori.jpf.go.jp/en/), [Minato](https://minato-jf.jp/), [Anki](https://apps.ankiweb.net/).
- [Iscrizione e organizzatori locali](https://www.jlpt.jp/e/application/overseas_index.html).

I quiz interni sono esercizi originali e mostrano percentuali grezze, **non punteggi JLPT su 180**. L’obiettivo didattico del 75% per area non è una soglia ufficiale né una previsione di promozione. Non vengono ripubblicati PDF o audio ufficiali protetti.

## Dati e limitazioni

I progressi sono salvati in `localStorage`, separatamente per browser e origine; non si sincronizzano. Cancellare i dati del browser elimina i progressi: esportare il JSON. L’importazione valida il formato e chiede conferma prima di sostituire i dati. Non importare backup da fonti sconosciute.

Nessun analytics o account. I font sono caricati da Google Fonts, con fallback locali. La sintesi vocale richiede una voce `ja-JP` o equivalente; disponibilità, qualità e trattamento dell’audio dipendono dal dispositivo e dalla voce. In assenza di voce il sito mostra un messaggio e rimanda alle registrazioni ufficiali. Il timer usa il tempo reale; cambiando sezione del sito viene azzerato.

## Struttura

- `index.html`, `style.css`: struttura e presentazione.
- `data.js`: contenuti didattici originali.
- `core.js`: funzioni pure (ripasso, quiz, validazione).
- `app.js`: interazioni e salvataggio locale.
- `tests/`: controlli automatici e verifica browser facoltativa.
- `scripts/publish.sh`: creazione repository e configurazione Pages.

Licenza MIT per il codice e i contenuti originali di questo progetto. Risorse esterne, nomi e marchi appartengono ai rispettivi titolari.
