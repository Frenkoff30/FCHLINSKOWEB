# Data z FAČR

Volitelný zdroj zápasů a tabulky. Dokud tu nejsou `zapasy.json`
a `tabulka.json` a dokud se ve `script.js` nezapne `ZDROJ`, web bere data
z ručních polí `ZAPASY` a `TABULKA`.

## Proč to není napojené rovnou na fotbal.cz

FAČR veřejné API nemá a is.fotbal.cz data ven v strojově čitelné podobě
nepouští. Neoficiální Scortes, který to obcházel, skončil kvůli blokování.
Prohlížeč se navíc na cizí doménu bez jejího svolení nedostane (CORS).

Data sem tedy musí dodat něco na hostingu klubu: skript spouštěný cronem,
ruční export, nebo jiná služba, kterou klub používá. Web už s takovými
soubory umí pracovat.

## Zapnutí

1. Nahrát sem `zapasy.json` a `tabulka.json` (vzory v `*.priklad.json`).
2. Ve `script.js` v objektu `ZDROJ` nastavit `zapnuto: true`.

Jiné umístění souborů řeší `zaklad`. Musí být na stejné doméně jako web,
jinak je potřeba na serveru povolit CORS.

## Podoba souborů

Stejná jako pole ve `script.js`.

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

Povinné je `datum` ve tvaru `RRRR-MM-DDTHH:MM` a neprázdný `souper`.
Volitelné: `domaci` (výchozí `false`), `tym` (výchozí `A`), `typ` (výchozí
`liga`), `misto`, `skore` ve tvaru `"3:1"`, `kolo`, `soutez`, `nazev`.

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

Povinný je jen `tym`. Chybějící čísla se berou jako nula, chybějící `poradi`
se dopočítá z pořadí v poli. Text z `aktualizovano` se ukáže pod tabulkou.

## Chování při chybě

- Soubor chybí, nejde stáhnout nebo je poškozený → platí ruční pole.
- Vadný řádek → zahodí se jen ten řádek.
- Nezbude ani jeden řádek → platí ruční pole.
- Stahování trvá déle než `cekaniMs` (výchozí 6 s) → web na data nečeká.

Stažená data si prohlížeč drží `platnostMinut` (výchozí 60). Stránka se
vykreslí z poslední známé verze a čerstvá se dotáhne na pozadí.

Ruční pole `ZAPASY` a `TABULKA` ve `script.js` jsou záloha, nemažou se.
