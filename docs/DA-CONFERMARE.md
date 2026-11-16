# Da confermare con i proprietari

Ogni voce qui sotto compare sul sito come **[DA CONFERMARE]** (EN: [TO BE CONFIRMED], FR: [À CONFIRMER]).
Per correggerla basta modificare **un solo file**: `src/data/site.json` (orari, indirizzi, telefoni, link) oppure `src/data/hotels.json` / `src/data/reviews.json`.

## Orari e indirizzi in conflitto sul sito attuale
1. **Noleggio (4810 Rental), chiusura invernale** — 18:30 (home), 18:00 (pagina Rental), 19:00 (Contatti e FAQ). → `services.rental.hours.winter`
2. **Noleggio d'estate** — la FAQ dice "aperto solo durante la stagione invernale", altre pagine danno l'orario estivo 8:00–18:30. Il noleggio è aperto d'estate?
3. **Ristorante / pasticceria** — Home, Food e Sweet Bakery: lun 6:30–20:30, **martedì chiuso**, mer–gio 6:30–20:30, ven–dom 6:30–21:30. Contatti: "tutti i giorni 6:00–22:30". FAQ: "tutti i giorni 6:00–20:00". Sul sito nuovo è mostrato il primo orario con l'etichetta [DA CONFERMARE].
4. **Pranzo** — 12:00–15:30 (Food, Servizi; "fino alle 16:00 in alta stagione") oppure 12:00–14:30 (Sweet Bakery).
5. **Indirizzo dell'Outlet** — "Passage Truchet 1" (home) oppure "Via Donzelli 5" (Outlet, Shopping, Contatti).
6. **Giorni di apertura dell'Outlet** — "venerdì, sabato e domenica" (home) oppure "sabato e domenica" (altre pagine), nei periodi di alta stagione. Quali sono i periodi di alta stagione?
7. **Piatti per celiaci** — la FAQ dice di no (cucina non separata), la pagina Sweet Bakery dice che pensate "ai clienti celiaci o vegani" e Tripadvisor indica "opzioni senza glutine".

## Informazioni mancanti
8. **Chalet**: indirizzo/i, numero e nomi degli chalet, posti letto, servizi (wifi, parcheggio, ecc.), prezzi, telefono. Su Booking compaiono "We are 4810 Chalet Les Crampons" e "We Are 4810 La Corde d'Escalade" (Via delle Forges 3): sono vostri? Possiamo usare questi nomi?
9. **ID Google Analytics 4** (formato G-XXXXXXXXXX) → `analytics.ga4`. Finché manca, GA non viene caricato.
10. **Listino e-bike**: sul sito c'è il PDF "estate 2025" (75/65/55 € giornata). È ancora valido?
11. **Sconto 15% sulle prenotazioni online**: è valido per la stagione 2026/27?
12. **Transfer gratuito per la cena** (riquadro "DINNER FREE TRANSFER", rimosso perché il testo parlava del pranzo): esiste un servizio navetta per la cena? Se sì, con quali orari e condizioni?
13. **Recensioni Google**: non è stato possibile leggerle in modo automatico. Sul sito ci sono 6 recensioni vere da Tripadvisor (testo originale). Se volete quelle di Google, mandateci il testo e il nome come compaiono su Google.
14. **Prezzi del noleggio sci**: sono solo nel sistema Wintersteiger; volete anche una tabella "a partire da" sul sito?
15. **Moduli** (e-bike, eventi, contatti): oggi aprono l'email del cliente già compilata. Se preferite un modulo che invia direttamente (es. Formspree/Netlify Forms), serve un account.

## Hotel convenzionati (pagina Hotel convenzionati)
Link corretti: Gran Baita → granbaitacourmayeur.com · Hotel Centrale → hotelcentralecourmayeur.com/it · Villa Novecento → villanovecento.it · Meublé Laurent → vacanzemontebianco.com (home).
Da verificare:
16. **Hotel Crest et Duc** — il vecchio link Alpissima è rotto e l'hotel non è più nel sito Alpissima. Nome e sito attuali?
17. **Meublé Laurent** — il sito ora si chiama "Maison Laurent". Nome corretto?
18. **Hotel Lo Scoiattolo** — il sito rimanda ad "AF Luxury Suites" e il telefono è lo stesso del Grand Hotel Courmayeur. Convenzione e telefono ancora validi?
19. **Hotel Les Jumeaux** — il sito rimanda a un dominio esterno con certificato non valido.
20. **Hotel Camosci** (La Saxe) — il dominio non è più attivo.
21. **Residence Le Talus** — il dominio non risponde.
22. Più in generale: l'elenco delle convenzioni è aggiornato alla stagione 2026/27?

## Da fare lato hosting (non nel codice)
- Puntare `4810courmayeur.com`, `www.4810courmayeur.com` e `www.4810courmayeur.it` con redirect 301 a `https://4810courmayeur.it/` (regole pronte in `public/_redirects` e `public/.htaccess`; su Kinsta si impostano in MyKinsta → Redirects).
- Inviare `https://4810courmayeur.it/sitemap.xml` a Google Search Console.
