# Audio delle scenette

Sono inclusi **6 dialoghi completi e 24 battute MP3**, generati tramite il collegamento ElevenLabs con modello `eleven_v4` e tag espressivi. Voci professionali giapponesi: **Momoka - Bright, Clear and Soothing** e **Makoto-san - Warm, Friendly AI Assistant** (accento standard). `voci.json` documenta i profili selezionati e `manifest.json` registra file, durate e identificativi delle generazioni. Non contiene URL temporanei o credenziali.

La connessione del plugin ha consentito la generazione senza configurare una chiave nella repository o nell’ambiente. Lo script API descritto sotto è un’alternativa per future generazioni, non è richiesto per usare il sito.

I dialoghi in `../dialoghi/scenette.json` sono originali. Gli eventuali file MP3 prodotti con ElevenLabs sono **audio sintetici di studio**, non registrazioni ufficiali JLPT e non voci di personaggi o persone imitate.

Il browser legge `manifest.json`: se un audio non è ancora stato generato, l’interfaccia lo segnala e offre la sintesi del dispositivo quando è disponibile una voce giapponese. Non finge che un file mancante sia ElevenLabs.

## Credenziali solo nell’ambiente

Configura `ELEVENLABS_API_KEY` come segreto dell’ambiente cloud. Non aggiungerlo al codice, alla Pages, a un file versionato o a un messaggio. `scripts/generate_dialogue_audio.py` lo legge con `os.environ` e non lo stampa. Le richieste passano direttamente all’API ElevenLabs. Il frontend non chiama servizi a pagamento: ascoltare gli MP3 già generati non usa credito API.

```sh
python3 scripts/generate_dialogue_audio.py --list-voices
python3 scripts/generate_dialogue_audio.py --scene sushi --max-characters 600
```

Lo script richiede Python 3, `ffmpeg` e `ffprobe`. Cerca nell’account voci con categoria professionale e giapponese verificato; usa due ID distinti, mai inventati. Se non sono disponibili almeno due voci, si ferma prima delle richieste audio e chiede di aggiungerle dalla Voice Library. Per selezionare voci precise: `--voice-staff ID --voice-learner ID`.

Usa il modello `eleven_v3`, controllato tramite l’elenco modelli dell’account, e tag di recitazione come `[warmly]`, `[curious]` e `[hesitant]`. I tag sono indicazioni interpretative, non garantiscono un’enfasi identica in ogni generazione. Non inserisce effetti ambientali che possano coprire le parole. La riproduzione si può rallentare nel sito senza rigenerare audio.

La prima prova è limitata alla scenetta sushi e a 600 caratteri di testo/tag; consuma il credito dell’account ElevenLabs. `--scene all --max-characters 4000` abilita esplicitamente il lotto completo, entro 4000 caratteri. I file compatibili già presenti vengono riutilizzati. In caso di timeout viene lasciato un marcatore `.pending`, ignorato da Git: verificare l’esito nella History del provider prima di rimuoverlo e tentare di nuovo. Nessun retry automatico su una generazione dall’esito incerto.

Il manifest conserva solo informazioni pubblicabili: percorsi audio, voci scelte, tempi e modello. Controllare ascoltando pronuncia e chiarezza prima del commit. Verificare che il piano ElevenLabs e le voci scelte consentano la pubblicazione degli audio; il fatto che la repository sia pubblica rende accessibili gli MP3, non la chiave.

Documentazione: [tag](https://elevenlabs.io/docs/help-center/product/core-capabilities/text-to-speech/how-do-audio-tags-work-with-eleven-v3-and-v4), [API voci](https://elevenlabs.io/docs/api-reference/voices/search), [API TTS](https://elevenlabs.io/docs/api-reference/text-to-speech/convert).
