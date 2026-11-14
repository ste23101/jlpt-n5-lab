# Letture delle frasi

Le parole sottolineate nelle frasi di studio, negli esempi di grammatica e nei dialoghi mostrano il furigana con un tocco o con Invio/Spazio. Un secondo tocco lo nasconde. Il sito usa elementi ruby e pulsanti accessibili, con stato aperto/chiuso.

Le letture sono precompilate in `furigana-data.js` per 521 parole e frasi del progetto. Non si sceglie una lettura generica di ciascun kanji: il generatore analizza le parole nel loro contesto. Le forme irregolari comuni, come 二皿（ふたさら）, 二人（ふたり）e 今日（きょう）, sono gestite esplicitamente. Le parole non riconosciute restano testo; il sistema non inventa una lettura.

Le immagini dei quesiti ufficiali conservano il furigana del fascicolo. Le domande dei quiz e i pulsanti delle risposte non ricevono suggerimenti automatici che possano rivelare la soluzione.

Per rigenerare dopo aver cambiato le frasi: `npm ci`, poi `npm run build:readings`. Il generatore usa [kuromoji.js](https://github.com/takuyaa/kuromoji.js), Apache 2.0, e il dizionario MeCab IPADIC; licenza e avvisi completi sono nella cartella `licenze/`. Al browser arriva solo il piccolo risultato precompilato: niente tokenizer o dizionario da scaricare, niente API e nessun testo inviato a servizi esterni.
