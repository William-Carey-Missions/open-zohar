# Bronnen, rechten en tekstbeleid

Gecontroleerd op 25 oktober 2026.

## Gebruikte tekstgetuige

Voor de eerste 19 passages: Hebreeuwse Wikisource, ongevocaliseerde tekstcontainer [זוהר חלק א, revisie 3085399](https://he.wikisource.org/w/index.php?oldid=3085399), gewijzigd 28 september 2026. Naamsvermelding: **de bijdragers aan de Hebreeuwse Wikisource**, met hun [paginageschiedenis](https://he.wikisource.org/w/index.php?title=%D7%96%D7%95%D7%94%D7%A8_%D7%97%D7%9C%D7%A7_%D7%90&action=history). Wikisource kwalificeert de tekst als nog niet nagekeken. Het project heeft deze grondtekst niet kritisch vastgesteld.

[Het rechtenbeleid van Wikisource](https://he.wikisource.org/w/index.php?oldid=2914737) vermeldt CC BY-SA 4.0 voor bijdragen. De overgenomen digitale tekst, de Nederlandse bewerking en de nieuwe toelichtingen worden gedeeld onder [Creative Commons Naamsvermelding–GelijkDelen 4.0 Internationaal](https://creativecommons.org/licenses/by-sa/4.0/). Er wordt geen aanspraak gemaakt op nieuwe rechten in de middeleeuwse tekst zelf. Vermeld bij hergebruik Open Zohar en de Wikisource-bijdragers, link naar bronrevisie en licentie, vermeld wijzigingen en behoud de toepasselijke gelijkdelenvoorwaarden.

Wijzigingen: navigatie en opmaak verwijderd, citaatsjablonen tot tekst teruggebracht, een bronvoetnoot over de naam Chizkia afzonderlijk toegelicht, stabiele alineanummers toegevoegd en een nieuwe Nederlandse werkvertaling gemaakt. Varianten tussen haakjes blijven in de grondtekst staan en worden toegelicht. De ruwe wikitekst blijft lokaal bewaard. De Nederlandse tekst bevat geen overgenomen moderne vertaling. Zij is met AI opgesteld en moet nog onafhankelijk door een kenner van het Zohar-Aramees worden gecontroleerd.

## Verworven en onderzochte bronnen

| Bron | Rechten/gebruik | Verwerving en status |
| --- | --- | --- |
| Wikisource, 30 containers met prefix זוהר חלק | CC BY-SA 4.0 voor digitale bijdragen; historische tekst zelf oud | 29 tekstcontainers en één omleiding met vaste revisies; brondekking niet gecollationeerd |
| Wikisource, תיקוני זהר שלם | Wikisource-publicatie onder CC BY-SA 4.0; noemt hebrew.grimoar.cz als herkomst | Afzonderlijke ongevocaliseerde getuige bewaard; niet vertaald en niet volledig gecollationeerd |
| Wikisource, זהר חדש | CC BY-SA 4.0 voor de index | Index en één verwijspagina bewaard; die verwijst naar een gevocaliseerde parasha-tekst. Geen volledige grondtekst verworven |
| Sefaria, drie werkindexen | Catalogusmetadata, geen editiegrondtekst | Schema’s, titels en referentieconcordanties opgeslagen; afwijkingen blijven gemarkeerd |
| Sefaria, Vocalized Zohar, Israel 2013; Sulam Edition, Jerusalem 1945 | Licentie onbekend volgens versiegegevens | Geen tekst geïmporteerd of vertaald |
| Sefaria, Soncino 1933 | Platform vermeldt Public Domain; geen vaststelling voor ieder rechtsgebied | Niet gekopieerd en niet als vertaalbasis gebruikt |
| Moderne kritische uitgaven en vertalingen | Geen hergebruikstoestemming vastgesteld | Alleen bibliografische informatie, geen beschermde vertaaltekst |

[Sefaria’s rechtenuitleg per afzonderlijke versie](https://developers.sefaria.org/docs/usage-of-our-name-and-logo) en [Zohar-versiegegevens](https://www.sefaria.org/Zohar?tab=versions) onderbouwen waarom bibliotheekbrede aannames onvoldoende zijn. Een Public Domain-label bij Sefaria geldt niet automatisch voor een andere digitalisering.

## Reproduceerbaarheid

[data/source-manifest.json](../data/source-manifest.json) noemt ieder bewaard Wikisource-record, bestand, pagina, revisie, tijdstempel, naamsvermelding en SHA-256 van de exacte wikitekst. Iedere lezerpassage bevat tevens sectiemarkering, alineanummer en SHA-256 van de geselecteerde ruwe alinea. De selectie wordt uit het volledige bronbestand gereconstrueerd.

Herbouw met node scripts/build-corpus.mjs en controleer met node scripts/validate-corpus.mjs. scripts/acquire-sources.ps1 kan dezelfde revisies ophalen en weigert afwijkende teksthashes. Bouw en controle werken zonder netwerk. Sefaria-indexen zijn gedateerde momentopnamen; -RefreshCatalogues haalt een nieuwe stand op, waarna de inventaris opnieuw moet worden onderzocht.

## Vertaalbeleid

- Direct uit de Aramese/Hebreeuwse tekst; helder Nederlands met behoud van vragen, herhalingen, argumentatie en tekstgrenzen.
- Tora, Mi, Ma, Eleh en Elohim blijven staan wanneer hun vorm de uitleg draagt. JHWH geeft de geschreven Godsnaam weer zonder uitspraak vast te leggen.
- Bijbelcitaten worden opnieuw vertaald binnen de passage; geen moderne Bijbelvertaling wordt gekopieerd.
- Doorlopende zinnen krijgen een zichtbare folio-overgang. Zohar I 1a:1 is een eigen alineareferentie, geen alineanummer uit een andere editie.
- Toelichting, tekstvarianten en onzekerheden zijn afzonderlijke velden. Mystieke identificaties worden niet ongemerkt in de vertaling ingevoegd.
- Concept: vertaling opgesteld en bronkoppeling gecontroleerd; onafhankelijke filologische en inhoudelijke redactie staat open. Gereviewd vereist een vastgelegde onafhankelijke controle.
- Bestaande passage-id’s niet hernummeren; gewijzigde segmentering vereist een concordantie.

## Begrippenlijst

| Term | Weergave |
| --- | --- |
| Knesset Jisraël | gemeenschap van Israël; mystieke betekenis apart toegelicht |
| din / rachamim | oordeel / ontferming |
| machsjavah | Gedachte wanneer de mystieke trede bedoeld is |
| berit | verbond; lichamelijke en mystieke betekenis blijven zichtbaar |
| Mi / Ma / Eleh | Wie / Wat / deze; termen behouden bij letteruitleg |
| Koedsja berich hoe | de Heilige, gezegend zij Hij |
| chevraya | metgezellen |
| botsina | lamp/lichtbron; onzekerheid bij de passage vermeld |

Zie [CORPUS.md](CORPUS.md) voor de corpusafbakening en bibliografie. Vormgeving en lettertypen blijven afzonderlijk verantwoord in SOURCE.json en licenses/.
