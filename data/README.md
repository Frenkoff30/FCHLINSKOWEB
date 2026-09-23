# Data z FAČR

Tahle složka je připravená pro automatické doplňování zápasů a tabulky.
Dokud v ní nejsou soubory `zapasy.json` a `tabulka.json` a dokud se ve
`script.js` nezapne `ZDROJ`, web bere data z ručních polí `ZAPASY`
a `TABULKA` ve `script.js`, jako doteď.

## Proč to není napojené rovnou na fotbal.cz

FAČR žádné veřejné API nemá. Fotbal.cz ani is.fotbal.cz data ven v strojově
čitelné podobě nepouští a neoficiální služba Scortes, která to obcházela,
skončila, protože ji is.fotbal.cz začal blokovat.

Prohlížeč se navíc na cizí doménu bez jejího svolení stejně nedostane
(CORS), takže i kdyby API existovalo, web by na něj nemohl sahat přímo.

Mezi web a FAČR proto musí přijít **něco na hostingu klubu**, co si data
jednou za čas vezme a uloží je sem jako dva JSON soubory. Může to být:

- skript (PHP, Python, Node), který běží přes cron třeba jednou za hodinu,
- ruční export, který někdo z klubu jednou týdně nahraje,
- napojení na jinou službu, pokud ji klub má.

Web už je na takové soubory připravený, nic dalšího se v něm měnit nemusí.

## Jak to zapnout

1. Do téhle složky dát `zapasy.json` a `tabulka.json` v podobě popsané níž
   (vzory jsou v souborech `*.priklad.json`).
2. Ve `script.js` v objektu `ZDROJ` přepnout `zapnuto: true`.

Když jsou soubory jinde než v `data/`, změňte `zaklad`. Musí být na stejné
doméně jako web, jinak je potřeba na serveru povolit CORS.

## Podoba souborů

Oba soubory mají stejný tvar jako pole ve `script.js`, takže se dá vzor
okopírovat odtamtud.

### zapasy.json

```json
{
  "aktualizovano": "2026-09-21T10:00:00Z",
  "zapasy": [
    { "datum": "2026-09-26T10:30", "domaci": true, "souper": "Vysoké Mýto",
      "tym": "A", "typ": "liga", "kolo": 8,
      "misto": "Olšinky, hřiště č. 1", "skore": null }
  ]
}
```

| Pole | Povinné | Význam |
|------|---------|--------|
| `datum` | ano | `RRRR-MM-DDTHH:MM`, místní čas |
| `souper` | ano | název soupeře, nesmí být prázdný |
| `domaci` | ne | `true` = doma, chybí-li, bere se `false` |
| `tym` | ne | `A`, `B`, `dorost-u19`, `zaci-u15`, `pripravka-u11` … (chybí-li, `A`) |
| `typ` | ne | `liga`, `pohar`, `priprava`, `turnaj` (chybí-li, `liga`) |
| `misto` | ne | kde se hraje |
| `skore` | ne | `"3:1"` po zápase, jinak `null` |
| `kolo` | ne | číslo kola |
| `soutez` | ne | vlastní název soutěže |
| `nazev` | ne | název turnaje u `typ: "turnaj"` |

### tabulka.json

```json
{
  "aktualizovano": "21. 9. 2026",
  "tabulka": [
    { "poradi": 1, "tym": "FK Přepeře", "z": 7, "v": 6, "r": 0, "p": 1,
      "skore": "24:8", "b": 18 }
  ]
}
```

Povinné je jen `tym`. Chybějící čísla se berou jako nula, chybějící `poradi`
se dopočítá z pořadí v poli. Text z `aktualizovano` se ukáže pod tabulkou
jako „Stav k …“.

## Co když se něco pokazí

Web je stavěný tak, aby ho špatná data nerozbila:

- Soubor chybí, nejde stáhnout nebo je poškozený → platí ruční pole ve `script.js`.
- Jednotlivý řádek je vadný (chybí datum, prázdný soupeř) → zahodí se jen ten řádek.
- Po kontrole nezbude ani jeden řádek → platí ruční pole.
- Stahování trvá dlouho → po `cekaniMs` (výchozí 6 s) se web na data vykašle.

Stažená data si prohlížeč odloží na `platnostMinut` (výchozí 60), takže se
stránka vykreslí okamžitě z poslední známé verze a čerstvá data si dotáhne
na pozadí.

## Ruční pole zůstávají

Pole `ZAPASY` a `TABULKA` ve `script.js` **nemazejte** ani po zapnutí zdroje.
Jsou to zálohy, ze kterých web žije, kdykoliv zdroj selže.
