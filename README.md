# Open Zohar

Nederlandse werkvertaling met gekoppelde Aramese grondtekst, in de bestaande vormgeving van [Open Vertaling](https://openvertaling.nl/).

## Status op 25 oktober 2026

**Onvolledige deeluitgave.** Beschikbaar: 19 conceptpassages, Zohar I 1a–2a en uitsluitend de openingsalinea van 2b. Dat zijn drie volledig vertaalde foliozijden en één gedeeltelijk folio. Onafhankelijk geredigeerde passages: nul. De volledige Zohar is nog niet vertaald.

Het vertaaldoel omvat Zohar I–III met ingebedde traktaten en addenda; Zohar Chadasj en Tikkoenei Zohar worden afzonderlijk behandeld. De inventaris bevat 167 catalogusonderdelen. Alle overige tekst moet nog worden vertaald. Volgende passage: I 2b, de opening van Rav Hamnoena de Oude. Zie [corpusafbakening](docs/CORPUS.md), [bronnen en rechten](docs/BRONNEN.md), [inventaris](data/corpus.json) en [voortgang](data/progress.json).

## Lezen

Geen installatie of build nodig. Start vanuit deze repository:

~~~sh
python -m http.server 8000
~~~

Open [de lokale lezer](http://localhost:8000/#lezen/zohar-i/1a/1). Gebruik een HTTP-server voor de JSON-laadfunctie. De lezer biedt thema’s, tekstopties, zoeken, deelbare fragmentlinks en afzonderlijke toelichtingen en onzekerheidsmarkeringen.

## Tekstdata en controle

- data/translations/zohar-i-introduction.json: bewerkbare werkvertaling en noten.
- data/sources/: Wikisource-revisies en catalogusmomentopnamen.
- data/source-manifest.json: naamsvermelding, revisies en teksthashes.
- data/library.json: gegenereerde leesdata met bronkoppelingen.
- data/corpus.json en data/progress.json: inventaris, open kwesties en voortgang.

~~~sh
node scripts/build-corpus.mjs
node scripts/validate-corpus.mjs
node --check js/app.js
~~~

Bronnen kunnen met PowerShell 7 via scripts/acquire-sources.ps1 opnieuw op vaste revisies worden opgehaald. Bouw en validatie werken met de lokale bronnen. Nieuwe teksten vereisen rechtencontrole, bronkoppeling en een redactionele status.

## Rechten en vormgeving

Wikisource-bijdragen en de nieuwe Nederlandse bewerking: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), met bronrevisies en bijdragersgeschiedenis per werk. De tekst is met AI vertaald en nog niet onafhankelijk filologisch geredigeerd. Er zijn geen beschermde moderne vertalingen overgenomen. Zie [de verantwoording](docs/BRONNEN.md).

css/openvertaling.css is ongewijzigd overgenomen uit William-Carey-Missions/website-open-bijbelvertaling; herkomst en SHA-256 staan in SOURCE.json. Aanvullingen staan in css/corpus.css. De lokale lettertypen vallen onder de SIL Open Font License; zie licenses/.
