# Design system 4810

Tutti i token sono in `src/styles/global.css` (sezioni 1 e 2).

## Font
- **Fraunces** (variabile, serif di carattere): titoli molto grandi.
- **Instrument Sans** (variabile, anche condensato): testo, etichette e titoli del noleggio.
Entrambi sono serviti dal sito stesso, con fallback metrici: nessun salto di layout.

## Palette di base
Inchiostro `#14110F` · Pietra `#6B635B` · Osso `#F4F0E8` · Carta `#FBF9F4` · Ember (logo) `#CB6015` / `#A44C0E` per testi e pulsanti.

## Un'identità per attività (`data-theme`)
| Attività | Sfondo | Accento | Titoli | Raggi | Layout di apertura |
|---|---|---|---|---|---|
| Noleggio — sportivo | blu notte `#0E1A22` | ghiaccio `#7FC0DE` / `#1F6182` | sans condensato corsivo maiuscolo | 0 | foto tagliata in diagonale, nastro dei marchi |
| Negozio — editoriale | carta `#FBF9F4` | nero | serif sottile, spaziatura stretta | 0 | testata da rivista, griglia asimmetrica |
| Outlet | carta | rosso `#A83A0C` | serif sottile | 0 | "−70%" gigante riempito con la foto |
| Ristorante — caldo | legno `#1F140E` | brace `#E8A172` | serif pieno | 10px | foto del camino a tutto schermo, menu tipografici |
| Pasticceria — golosa | crema `#FBF3EA` | lilla `#C8A2C8` / `#6F3F73` | serif corsivo | tondi, archi | arco centrale, foto sovrapposte |
| Chalet — lusso silenzioso | bosco `#141B18` | salvia `#9FC4B6` / `#2F5246` | serif leggerissimo | 2px | foto piena, testo piccolo, molto vuoto |

## Foto
Un solo trattamento colore per tutte (`--photo-grade`) più una velatura del tema (`--photo-tint`), così sembrano un unico servizio fotografico. Solo foto ≥ 1200 px.

## Movimento (GSAP + Lenis)
Titoli riga per riga · parallasse leggera · foto che si rivelano con una maschera (direzione diversa per sezione) · passaggio di colore tra i capitoli della home · galleria orizzontale "fissata" su desktop · zoom leggero al passaggio del mouse.
Con *riduci movimento* o su connessioni lente gli effetti si spengono; sul telefono partono al primo gesto.
