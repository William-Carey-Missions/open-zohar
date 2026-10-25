# Naslagwerk — implementatieplan

> Uitvoering: werk de stappen achtereenvolgens af met superpowers:executing-plans en testgestuurde verificatie.

**Goal:** Personen en woorden vanuit de tekst begrijpelijk maken met bronverantwoorde naslagartikelen.
**Architecture:** Statische JSON, een zelfstandige herkenningsmodule en een DOM-module binnen de bestaande lezer.
**Tech Stack:** JavaScript, HTML, CSS, Node-validatie en Chromium-browsercontroles.
**Spec:** docs/ONTWERP-NASLAG.md

## Globale eisen

Alleen open-zohar wijzigen. Basisstylesheet ongewijzigd. Bronnen per artikel. Geen historische identificatie zonder onderbouwing. Volledige corpusvertaling niet claimen.

## Reviewfocus

- Overlappende namen: langste volledige naam koppelen.
- Korte trefwoorden en Hebreeuwse klinkertekens: geen links midden in andere woorden.
- Toetsenbord en mobiel: uitleg sluiten en terugkeren naar de tekst.
- Ontbrekende data of onbekende lemma’s: lezer blijft werken.
- Onzekere identiteit en contextbetekenis zichtbaar houden.

## Taken

- [x] tests/knowledge.test.cjs: herkenning, woordgrenzen, diakritische zoekvormen en veilige URL’s eerst met een falende test vastleggen.
- [x] js/knowledge-core.js: tokenize(text, entries, language), searchEntries(entries, query), safeExternalUrl(url).
- [x] data/knowledge.json: lemma’s en wikiartikelen met stabiele id’s, gecontroleerde bronverwijzingen en verwante artikelen.
- [x] scripts/check-knowledge.cjs: browsercontrole eerst laten falen op de ontbrekende naamlink.
- [x] js/knowledge-ui.js, js/app.js, index.html, css/corpus.css: lemmaoverzichten, zoeken, contextdialoog, volledige artikelen en teruglinks integreren.
- [x] data/translations/zohar-i-introduction.json en scripts/build-corpus.mjs: letterdialoog aanvullen, foliodekking en voortgang automatisch afleiden.
- [x] scripts/validate-knowledge.mjs: bronnen, gerelateerde lemma’s, passage-id’s en naamverwijzingen controleren.
- [x] Corpusvalidatie, volledige browsertests, visuele controle, onafhankelijke codereview.

## Controle-uitkomst

Zes gedragstests, corpus- en naslagvalidatie en beide browsercontroles slagen. Een onafhankelijke codereview vond één navigatiefout: interne tekstverwijzingen lieten de contextdialoog open. Die fout is met een falende browsertest aangetoond en hersteld. Bestaande negentien passages behouden hun Nederlandse tekst, grondtekst en bronhashes. Filologische en historische vakcontrole blijven open.
