# FC Hlinsko

Web fotbalového klubu FC Hlinsko. Statické HTML, CSS a jeden JS soubor,
bez frameworku a bez build kroku. Nahraje se na hosting tak, jak je.

## Struktura

```
index.html                    úvod
klub.html                     o klubu, historie, osobnosti, stadion, oblečení
tymy.html                     přehled mužstev
tym-*.html                    podstránka každého mužstva
zapasy.html                   rozpis a výsledky
kalendar.html                 kalendář tréninků a zápasů
nabor.html                    nábor dětí a přihláška
cleny.html                    členské příspěvky a platební údaje
novinky.html / novinka.html   výpis a detail aktuality
partneri.html                 partneři a nabídka spolupráce
kontakt.html                  kontakty, formulář, mapa
*-podminky.html, cookies.html právní stránky

styles.css                    styly, tokeny v sekci 1
script.js                     data i logika, číslované sekce
images/                       fotky, znak, loga partnerů
data/                         volitelný zdroj dat, viz data/README.md
```

## Kde se co mění

Obsah, který se aktualizuje, je v polích na začátku `script.js`. HTML se
kvůli běžné údržbě upravovat nemusí.

| Pole | Co drží |
|------|---------|
| `ZAPASY` | všechny zápasy všech mužstev |
| `TABULKA` | tabulka divize C |
| `TRENINKY` | pravidelný týdenní rozvrh do kalendáře |
| `NOVINKY` | aktuality a jejich detaily |
| `TYMY_PREHLED` | mužstva v přepínači na úvodu |
| `NAROZENINY` | narozeniny do bloku na úvodu |
| `PARTNERI` | partneři a jejich úrovně |
| `UPOUTAVKA` | vyskakovací pozvánka na akci |

### Zápasy

```js
{ datum: '2026-08-08T10:30', domaci: true, souper: 'Kolín',
  tym: 'A', typ: 'liga', kolo: 1, misto: 'Olšinky, hřiště č. 1', skore: null }
```

`tym` je `A`, `B`, `dorost-u19`, `zaci-u15`, `pripravka-u11` a podobně,
`typ` je `liga`, `pohar`, `priprava` nebo `turnaj`. `skore` zůstává `null`,
dokud se nehrálo. Web si zápasy sám seřadí a z vyplněných skóre spočítá
zápasový pruh v heru, formu i výsledky na stránce Muži A. Název soutěže
bere z pole `SOUTEZE`.

### Tabulka

Přepisuje se ručně z Fotbal.cz, řádek s `tym: 'FC Hlinsko'` se zvýrazní sám.
Datum poslední aktualizace je v `TABULKA_AKTUALIZOVANO`.

### Aktuality

Nová aktualita = nový objekt v `NOVINKY`. `id` musí být unikátní, používá se
v adrese detailu (`novinka.html?id=...`). Na úvodu se aktuality skládají do
posuvného pásu, počet řídí `data-limit` v HTML.

### Upoutávka

Okno, které se po načtení stránky otevře přes obsah. Ukáže se v období
`od`–`do`, na stránkách ze seznamu `stranky` a každému návštěvníkovi jednou.
Při nové akci je potřeba změnit `id`, jinak se lidem, co zavřeli to minulé,
znovu neukáže. Vypnutí: `UPOUTAVKA = null`.

## Data z FAČR

Zápasy a tabulka jdou místo ručního přepisování brát z JSON souborů ve
složce `data/`. Vrstva je hotová a vypnutá, zapíná se v objektu `ZDROJ`
na začátku `script.js`.

FAČR veřejné API nemá, soubory musí plnit skript na hostingu klubu.
Podrobnosti a podoba souborů jsou v [data/README.md](data/README.md).

Při jakékoli chybě zdroje platí ruční pole `ZAPASY` a `TABULKA`, proto se
nemažou ani po zapnutí.

## Vzhled

Barvy, rozestupy a stíny jsou v `:root` na začátku `styles.css`.

| Proměnná | Použití |
|----------|---------|
| `--green` `#00843C` | klubová zelená ze znaku |
| `--green-deep` `#052E19` | hlavička, hero, tmavé pásy |
| `--green-ink` `#041E11` | patička |
| `--green-light` `#3FBF6B` | akcenty na tmavém |
| `--gold` `#C9A227` | drobné akcenty |

Tmavé bloky mají třídu `on-dark`, která uvnitř přebarví textové proměnné,
takže stejné komponenty fungují na světlém i tmavém pozadí.

V hlavičce je jen znak klubu. Je vyšší než lišta a přesahuje pod ni, při
odrolování se spolu s lištou zmenší. Velikost řídí proměnná `--znak`.
Pravidla pro znak potřebují prefix `.site-head`, jinak je přebije obecné
pravidlo pro `.brand__crest` výš v souboru.

## Fotky

Leží v `images/`, mužstva v `images/tymy/` vždy jako dvojice `nazev.jpg`
a `nazev-nahled.jpg` (velká a náhled do karty). Výměna fotky = nahradit
soubor stejným názvem. Doporučené šířky: hero 1920 px, ostatní 1400 až
1600 px, JPEG kvalita kolem 80.

`images/og-hero.jpg` (1200 × 630) je náhled, který se ukáže při sdílení
odkazu na Facebooku a v chatech. Je to výřez z hero fotky, po výměně hera
se musí přegenerovat.

### Loga institucí

Karty na stránce Partneři v sekci Institucionální podpora čekají na
soubory `nsa.png`, `pardubicky-kraj.png` a `mesto-hlinsko.png` ve složce
`images/partneri/`. Dokud tam nejsou, ukáže se místo loga název
instituce. Nejlépe PNG s průhledným pozadím, výška kolem 160 px.

## Formuláře

Formuláře na stránkách Nábor a Kontakt ověří vyplnění a otevřou e-mailového
klienta (`mailto:`). Adresa se nastavuje atributem na formuláři:

```html
<form data-mailto="info@fchlinsko.cz" data-subject="Předmět zprávy">
```

Pro odesílání přímo z webu by bylo potřeba doplnit serverový skript nebo
službu typu Formspree.

## Cookies

Web sám sledovací cookies nepoužívá. Jediný obsah třetí strany je mapa
Googlu na stránce Kontakt, ta se načte až po souhlasu. Volba se ukládá do
`localStorage` pod klíčem `fch-souhlas`.

## Přístupnost

Responzivní od 320 px bez vodorovného posuvu, dotykové cíle na mobilu
nejméně 40 px, klávesová navigace včetně uzavřeného fokusu v mobilním menu
a v upoutávce, `prefers-reduced-motion`, popisky `alt` a `aria-label`.
Žádné externí skripty ani fonty.

## Lokální náhled

```bash
python -m http.server 5599
```

## Než se to spustí

- Jména v `NAROZENINY` jsou ukázková. U nezletilých je ke zveřejnění jména
  a věku potřeba souhlas rodičů.
- Z tréninků v `TRENINKY` je potvrzený jen čas školičky, zbytek musí projít
  trenéry.
- Rozdělení partnerů do úrovní je návrh, klub ho musí potvrdit.
- Právní texty jsou psané pro FC Hlinsko, z.s. (IČO 64783405), ale klub je
  má před spuštěním zkontrolovat, hlavně kdo prodává klubové oblečení.
