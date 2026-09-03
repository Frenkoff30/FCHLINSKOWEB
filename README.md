# FC Hlinsko — web klubu

Statický web (HTML + CSS + JS, bez frameworku a bez build kroku).
Nahraje se na hosting jako běžné soubory, nic se nekompiluje.

## Struktura

```
index.html      Úvod
klub.html       O klubu, historie, osobnosti, stadion, klubové oblečení
tymy.html       Muži A a B, dorost, žáci, přípravky, tabulky
zapasy.html     Rozpis zápasů a odkazy na tabulky
nabor.html      Nábor dětí, kategorie, přihláška
partneri.html   Partneři a nabídka spolupráce
kontakt.html    Kontakty, formulář, mapa

styles.css      Kompletní styly (design systém v sekci 1: TOKENY)
script.js       Navigace, rozpis zápasů, tabulka, lightbox, formuláře
images/         Fotky, znak klubu, loga partnerů
favicon.*       Ikony webu
```

## Jak se upravují zápasy

Všechny zápasy jsou na **jednom místě** v `script.js`, hned na začátku
v poli `ZAPASY`. Web je sám seřadí podle data a vykreslí na stránce Zápasy.

```js
{ datum: '2026-08-08T10:30', domaci: true, souper: 'Kolín',
  tym: 'A', typ: 'liga', misto: 'Olšinky, hřiště č. 1', skore: null },
```

| Pole     | Význam |
|----------|--------|
| `datum`  | `RRRR-MM-DDTHH:MM`, 24hodinový formát, místní čas |
| `domaci` | `true` = hrajeme doma, `false` = venku |
| `souper` | Název soupeře |
| `tym`    | `A`, `B`, `dorost`, `zaci`, `pripravky` |
| `typ`    | `liga`, `pohar`, `priprava` |
| `misto`  | Kde se hraje |
| `skore`  | `null` dokud se nehrálo, po zápase např. `'3:1'` |

Odehrané zápasy web sám zobrazí světleji. Filtry nad rozpisem fungují
podle polí `typ` a `tym`.

> **Pozor:** v `ZAPASY` je zatím rozpis z původního webu (červenec a srpen 2026).
> Před spuštěním je potřeba doplnit aktuální rozlosování.

## Fotografie

Fotky pocházejí z původního webu fchlinsko.cz, jde tedy o materiál klubu:

| Soubor | Kde se používá |
|--------|----------------|
| `hero-olsinky.jpg` | Hero na úvodní stránce, areál Olšinky s tribunou |
| `hero-travnik.jpg` | Hero na stránce Zápasy, neutrální trávník |
| `olsinky-panorama.jpg` | Stadion na stránce Klub, hero Partneři a Kontakt |
| `areal-olsinky.jpg` | Hero stránky Klub, karta aktuality |
| `tym-mladez.jpg` | Hero stránky Nábor, blok náboru na úvodu |
| `tymy/*.jpg` | Fotky jednotlivých mužstev, dvojice `nazev.jpg` (velká) a `nazev-nahled.jpg` (do karty) |
| `znak-fchlinsko.png`, `znak-fchlinsko@3x.png` | Znak klubu |
| `partneri/*.png` | Loga partnerů |

Výměna fotky = nahradit soubor ve složce `images/` stejným názvem,
nebo přepsat `src` v příslušné stránce. Doporučené šířky: hero 1920 px,
ostatní 1400 až 1600 px, JPEG kvalita zhruba 80.

## Fotky mužstev a lightbox

Každá kategorie na stránce Týmy má fotku, kterou lze kliknutím zvětšit přes celou
obrazovku. Zavírá se křížkem, klávesou Esc nebo kliknutím mimo fotku.

Pro nové mužstvo stačí do `images/tymy/` nahrát dvojici souborů a v `tymy.html`
zkopírovat blok `<article class="catcard">`:

```html
<a class="teamphoto" href="images/tymy/nazev.jpg"
   data-full="images/tymy/nazev.jpg" data-popis="Popisek do lightboxu">
  <img src="images/tymy/nazev-nahled.jpg" alt="Popis fotky" loading="lazy">
  ...
</a>
```

Doporučené rozměry: velká fotka do 1500 px na delší straně, náhled 760 x 475 px.

## Tabulka soutěže na úvodní stránce

Blok áčka na úvodu umí zobrazit průběžnou tabulku. Ve výchozím stavu je pole
`TABULKA` v `script.js` prázdné, takže se tabulka vůbec nevykreslí a zůstane jen
odkaz na Fotbal.cz. Jakmile do pole doplníte řádky, tabulka se objeví sama:

```js
var TABULKA = [
  { poradi: 1, tym: 'FC Hlinsko', z: 6, v: 4, r: 1, p: 1, skore: '12:6', b: 13 }
];
var TABULKA_AKTUALIZOVANO = '15. 9. 2026';
```

Řádek s `tym: 'FC Hlinsko'` se automaticky zvýrazní klubovou zelenou.
Data je potřeba udržovat ručně podle Fotbal.cz, klub tam nemá veřejné API.

## Aktuality

Aktuality jsou dvě karty v `index.html` v sekci `<!-- AKTUALITY -->`.
Nová aktualita = zkopírovat blok `<article class="card">` a přepsat
obrázek, datum, nadpis a text.

## Design systém

Barvy, rozestupy a stíny jsou v `styles.css` nahoře v `:root`.
Změnou jedné proměnné se přebarví celý web.

| Proměnná | Hodnota | Použití |
|----------|---------|---------|
| `--green` | `#00843C` | Hlavní klubová zelená ze znaku |
| `--green-dk` | `#00602B` | Tmavší odstín, hover stavy |
| `--green-deep` | `#052E19` | Hlavička, hero, tmavé pásy |
| `--green-ink` | `#041E11` | Patička |
| `--green-light` | `#3FBF6B` | Akcenty na tmavém pozadí |
| `--gold` | `#C9A227` | Jen drobné akcenty, například štítek Nábor otevřen |

Tmavé bloky mají třídu `on-dark`, která uvnitř přebarví textové proměnné,
takže stejné komponenty fungují na světlém i tmavém pozadí.

Pruh `stripe-band` je motiv sekaného trávníku, používá se jako předěl sekcí.

## Formuláře

Formuláře na stránkách Nábor a Kontakt ověří vyplnění a pak otevřou
e-mailového klienta s předvyplněnou zprávou (`mailto:`). Nepotřebují
žádný server ani PHP.

Adresa se nastavuje atributem na formuláři:

```html
<form data-mailto="fotbal-hlinsko@seznam.cz" data-subject="Předmět zprávy">
```

Pokud bude klub chtít odesílání přímo z webu bez otevírání e-mailu,
je potřeba doplnit serverový skript nebo službu typu Formspree.

## Přístupnost a technické

- Responzivní od 375 px výš, bez vodorovného posuvu
- Tabulky se pod 620 px skládají pod sebe místo vodorovného posouvání
- Dotykové cíle na mobilu mají nejméně 40 px
- Klávesová navigace včetně přeskočení na obsah a uzavřeného fokusu v mobilním menu
- Respektuje `prefers-reduced-motion`
- Popisky `alt` u všech obrázků, `aria-label` u ikonových tlačítek
- Strukturovaná data `SportsClub` na úvodní stránce
- Bez cookies, bez trackerů, bez externích skriptů (načítá se jen Google Fonts)

## Publikace

Nahrát obsah složky do webového kořene. Žádná instalace není potřeba.
Lokální náhled například:

```bash
python -m http.server 5599
```
