# Open Zohar

Nederlandse werkvertaling met gekoppelde Aramese grondtekst, in de bestaande vormgeving van [Open Vertaling](https://openvertaling.nl/).

## Status op 25 oktober 2026

**Onvolledige deeluitgave.** De actuele aantallen conceptpassages, volledig vertaalde bronfolia en het percentage van het hoofdregister staan in [het voortgangsregister](data/progress.json) en in de lokale leesomgeving. Onafhankelijk geredigeerde passages: nul. De volledige Zohar is nog niet vertaald.

Het vertaaldoel omvat Zohar I–III met ingebedde traktaten en addenda; Zohar Chadasj en Tikkoenei Zohar worden afzonderlijk behandeld. De inventaris bevat 167 catalogusonderdelen. De nog onvoltooide tekst en de vastgestelde bronlacunes staan afzonderlijk in het voortgangsregister. Zie [corpusafbakening](docs/CORPUS.md), [bronnen en rechten](docs/BRONNEN.md), [inventaris](data/corpus.json) en [voortgang](data/progress.json).

## Lezen

Geen installatie of build nodig. Start vanuit deze repository:

~~~sh
python -m http.server 8000
~~~

Open [de lokale lezer](http://localhost:8000/#lezen/zohar-i/1a/1). Gebruik een HTTP-server voor de JSON-laadfunctie. De lezer biedt thema’s, tekstopties, zoeken, deelbare fragmentlinks en afzonderlijke toelichtingen en onzekerheidsmarkeringen.

## Woordenboek en wiki

Het [woordenboek](http://127.0.0.1:8137/#woordenboek) bevat 56 contextgebonden woordlemma’s; de [wiki](http://127.0.0.1:8137/#wiki) bevat 24 artikelen over personen, begrippen en teksten. Namen zoals [Rabbi Chizkia](http://127.0.0.1:8137/#wiki/rabbi-chizkia) zijn in beide tekstkolommen aanklikbaar. Korte uitleg, volledige artikelen, bronnen en teruglinks blijven binnen dezelfde lezer.

De inhoud staat in data/knowledge.json. Het is een groeiend naslagwerk, geen volledig historisch woordenboek. Alternatieve lezingen en onzekere identificaties blijven zichtbaar.

## Tekstdata en controle

- data/translations/: bewerkbare werkvertalingen en noten, verdeeld over tekstblokken.
- data/sources/: Wikisource-revisies en catalogusmomentopnamen.
- data/source-manifest.json: naamsvermelding, revisies en teksthashes.
- data/library.json: gegenereerde leesdata met bronkoppelingen.
- data/corpus.json en data/progress.json: inventaris, open kwesties en voortgang.

~~~sh
node scripts/build-corpus.mjs
node scripts/validate-corpus.mjs
node --check js/app.js
node --test tests/knowledge.test.cjs tests/source-segments.test.mjs
node scripts/validate-knowledge.mjs
~~~

Bronnen kunnen met PowerShell 7 via scripts/acquire-sources.ps1 opnieuw op vaste revisies worden opgehaald. Bouw en validatie werken met de lokale bronnen. Nieuwe teksten vereisen rechtencontrole, bronkoppeling en een redactionele status.

## Rechten en vormgeving

Wikisource-bijdragen en de nieuwe Nederlandse bewerking: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), met bronrevisies en bijdragersgeschiedenis per werk. De tekst is met AI vertaald en nog niet onafhankelijk filologisch geredigeerd. Er zijn geen beschermde moderne vertalingen overgenomen. Zie [de verantwoording](docs/BRONNEN.md).

css/openvertaling.css is ongewijzigd overgenomen uit William-Carey-Missions/website-open-bijbelvertaling; herkomst en SHA-256 staan in SOURCE.json. Aanvullingen staan in css/corpus.css. De lokale lettertypen vallen onder de SIL Open Font License; zie licenses/.

De browsercontroles scripts/check-reader.cjs en scripts/check-knowledge.cjs gebruiken een lokaal beschikbare Playwright-installatie met Chromium. Er is geen browserpakket nodig voor normaal gebruik van de website.
