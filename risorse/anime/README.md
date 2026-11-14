# Scenette anime

Sei illustrazioni originali generate tramite ElevenLabs Creative Studio con `gpt-image-2.5-sunburst`. Personaggi adulti fittizi, senza personaggi di opere esistenti o loghi commerciali.

## Il dialogo sushi

Quattro inquadrature in `sushi-shots/` seguono il contenuto effettivo delle quattro battute:

| Inizio | Voce | Azione |
| --- | --- | --- |
| 0 s | Hana | Saluta e chiede cosa mangiare; banco vuoto. |
| 2,926 s | Ren | Ordina due piattini di tonno, mostrando due dita. |
| 5,042 s | Hana | Propone il tè, indicando una tazza verde. |
| 7,393 s | Ren | Accetta cortesemente; non mangia e non beve. |

Ogni immagine con un solo personaggio è stata animata da `bytedance-omnihuman-v1.5` usando come input **l'MP3 originale della rispettiva battuta**, non un testo da reinterpretare. Le voci sono Momoka e Makoto-san, sintetiche ElevenLabs. Il labiale è generato automaticamente e può avere imprecisioni su un volto disegnato.

`sushi-dialogue-motion-v2.mp4` è il montaggio silenzioso usato dal player insieme agli MP3. `sushi-dialogue-v2.mp4` contiene anche la voce per il download. `sushi-ja.vtt` contiene i sottotitoli giapponesi. Gli inizi delle inquadrature seguono il manifest audio, con arrotondamento al fotogramma (30 fps). Nessun rallentamento o allungamento globale: se una generazione finisce pochi millisecondi prima della battuta, viene mantenuto il solo ultimo fotogramma. La voce originale non viene stirata.

Lo script `scripts/assemble_anime_dialogue.py` verifica gli hash dei quattro MP3 e ricostruisce il montaggio dai quattro sorgenti video. Il manifest registra per ogni inquadratura testo, voce, tempi, hash, modello e identificativo di generazione.

La precedente clip generica Kling è stata eliminata perché azioni e turni non seguivano il dialogo. Le altre cinque scene restano illustrazioni statiche. Nel player, anche disattivando il movimento l'immagine sushi segue la battuta corrente; l'impostazione del dispositivo “riduci movimento” viene rispettata.

Risorse didattiche originali, non ufficiali JLPT e non affiliate a Kura Sushi. Percorsi locali senza link firmati, chiavi o credenziali. Riprodurre i file non chiama API a pagamento.
