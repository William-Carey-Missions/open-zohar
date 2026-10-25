# Naslagwerk en leesverbindingen

## Doel en vorm

De Nederlandse lezer krijgt een woordenboek voor Aramese/Hebreeuwse woorden en een wiki voor personen, begrippen en tekstgeschiedenis. De bestaande Open Vertaling-stijl, lokale JSON-data en fragmentroutes blijven uitgangspunt.

Namen en termen in beide tekstkolommen openen een toegankelijke korte uitleg. Een gewone link naar het volledige lemma blijft beschikbaar voor toetsenbord, nieuwe tabbladen en deelbare verwijzingen. Artikelen tonen primaire bronnen, onzekerheid en verwijzingen terug naar beschikbare passages. Woordenboek en wiki zijn apart doorzoekbaar; de algemene zoekfunctie doorzoekt ook de naslaginhoud.

## Inhoud

Alle benoemde personen en centrale technische begrippen van de beschikbare passages krijgen inhoudelijke uitleg. Rabbi Chizkia krijgt een artikel over zijn functie in de openingspassage en de variant Rabbi Elazar. Historische personen worden niet zonder bewijs met een Zohar-personage gelijkgesteld. Betekenissen zijn contextgebonden werknotities, geen claim van een volledig historisch woordenboek.

## Aanpak

Een nieuwe module voor tekstherkenning en zoeken werkt onafhankelijk van de DOM; een aparte module verzorgt de naslagweergave. Een bestaande grote webframework-infrastructuur zou de zelfstandige leesomgeving onnodig veranderen. Een losse externe wiki zou de bronkoppelingen versnipperen. Daarom worden beide naslagwerken in dezelfde statische toepassing opgenomen.

## Randvoorwaarden

Geen betaalde diensten, moderne vertalingen of wijzigingen aan andere projecten. Nieuwe uitleg is in eigen Nederlands geschreven met bronnen. Alleen bevestigde trefvormen worden gekoppeld; korte namen als Mi en Ma mogen niet midden in een woord worden herkend. HTML wordt als tekst behandeld. Bij een ontbrekende naslagdataset blijft de lezer bruikbaar. Onbekende lemma-id’s geven een begrijpelijke melding.

De vertaling wordt daarnaast aangevuld met het vervolg van de letterdialoog, met behoud van bestaande passage-id’s en bronhashes. De huidige brondigitalisering bevat vier letterafbeeldingen; deze krijgen afzonderlijke bronverwijzingen en herkenbare markeringen in de vereenvoudigde grondtekst. De totale uitgave blijft als onvolledig en concept gemarkeerd.
