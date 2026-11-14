# Idee didattiche e materiali originali

Le nuove attività usano meccaniche comuni di apprendimento e gioco, con esercizi e interfaccia originali. Non copiano banche domande, testi, personaggi o grafica dei servizi citati e non sono affiliate a essi.

- [WaniKani](https://www.wanikani.com/): collegare kanji, vocaboli, componenti e mnemoniche, con ripasso nel tempo. L’Officina applica questi principi a 24 parole complete, incluse letture che non si ricavano dalla semplice somma dei caratteri. Le storie italiane sono inventate dal progetto.
- [Anki Manual · Studying](https://docs.ankiweb.net/studying.html): provare a ricordare prima di vedere la soluzione e rivedere gli elementi difficili. Le missioni danno priorità alle risposte errate, poi alle nuove; la pianificazione delle flashcard del sito rimane separata. Non è un’implementazione dell’algoritmo FSRS di Anki.
- [Bunpro · Grammar Library](https://bunpro.jp/): organizzare la grammatica per strutture ed esempi in contesto. Qui particelle e trasformazioni hanno esempi italiani/giapponesi e spiegazioni originali; nessuna domanda Bunpro è riprodotta.
- [KanjiVG](https://kanjivg.tagaini.net/): il kanji misterioso rivela i tratti già presenti nel Kanji Dex; valgono licenza e attribuzione in `../CREDITI.md`.

`missioni.json` e `missioni.html` contengono i 72 nuovi quesiti originali. Il gioco dei tratti usa 24 kanji del Dex e condivide gli identificativi delle relative domande di significato: cambiare modalità non crea valutazioni duplicate né premi ripetuti nella giornata.

Gli indizi possono suggerire la risposta: per questo un turno con indizio viene escluso dalla valutazione, dal conteggio dei quesiti esplorati e dai piattini. Riceve solo XP di studio limitati alla giornata. Le risposte senza aiuto aggiornano l’ultima risposta distinta e il quaderno degli errori, salvati con gli stessi backup del resto del sito.
