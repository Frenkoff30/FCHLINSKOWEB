# FC Hlinsko — web klubu

Statický web (HTML + CSS + JS, bez frameworku a bez build kroku).
Nahraje se na hosting jako běžné soubory, nic se nekompiluje.

## Struktura

```
index.html      Úvod
klub.html       O klubu, historie, osobnosti, stadion, klubové oblečení
tymy.html       Muži A a B, dorost, žáci, přípravky, tabulky
zapasy.html     Rozpis zápasů a odkazy na tabulky
kalendar.html   Kalendář tréninků a zápasů všech mužstev
nabor.html      Nábor dětí, kategorie, přihláška
cleny.html      Informace pro členy: příspěvky, platební údaje, termíny
partneri.html   Partneři a nabídka spolupráce
kontakt.html    Kontakty, formulář, mapa

ochrana-osobnich-udaju.html   Zásady zpracování osobních údajů (GDPR)
cookies.html                  Zásady cookies a tlačítko pro změnu souhlasu
obchodni-podminky.html        Obchodní podmínky prodeje klubového oblečení
reklamacni-rad.html           Reklamační řád

styles.css      Kompletní styly (design systém v sekci 1: TOKENY)
script.js       Navigace, rozpis zápasů, tabulka, lightbox, formuláře
images/         Fotky, znak klubu, loga partnerů
data/           Připravené místo pro automatická data z FAČR (viz data/README.md)
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
| `typ`    | `liga`, `pohar`, `priprava`, `turnaj` |
| `misto`  | Kde se hraje |
| `skore`  | `null` dokud se nehrálo, po zápase např. `'3:1'`, vždy domácí:hosté |
| `kolo`   | Číslo kola u mistrovských zápasů (nepovinné) |
| `soutez` | Vlastní název soutěže, např. `'Pohár starších žáků'` (nepovinné) |
| `nazev`  | Jen u `typ: 'turnaj'`: název turnaje, účastníci se píší do `souper` |

Stránka Zápasy má záložku pro každé mužstvo (Muži A, Muži B, Dorost, Žáci,
Přípravky). V záložce jsou nahoře nadcházející zápasy (od nejbližšího) a pod nimi
odehrané (od posledního). Odkaz zapasy.html#muzi-b rovnou otevře béčko
(dále #muzi-a, #dorost, #zaci, #pripravky). Odehraný zápas bez
skóre se ukáže jako –:–, stačí pak doplnit `skore`.

Z vyplněných skóre web sám počítá:

- **Hero úvodní stránky**: poslední odehraný a příští zápas mužů A (s odpočtem „Za 5 dní“).
  Obě karty se dají rozkliknout, vedou na stránku Muži A a na rozpis.
- **Stránku Muži A**: posledních šest výsledků, formu z posledních pěti zápasů a tabulku

Výsledky ani tabulka už na úvodní stránce nejsou, patří na podstránky mužstev.

Po zápase tedy stačí doplnit skóre a všechno se přepočítá. Název soutěže
u mistrovských zápasů bere web z pole `SOUTEZE` (`A: 'Divize C'`).

Odehrané zápasy web sám zobrazí světleji. Filtry nad rozpisem fungují
podle polí `typ` a `tym`.

### Zápasový pruh v heru

Pruh na spodní hraně hera je kreslený jako kus hřiště: u obou krajů vápno
s brankovištěm a puntíkem (`.hero__vapno`), uprostřed půlicí čára se
středovým kruhem (`.hbar__line`). Na mobilu se vápna schovají, na úzkém
pruhu by jen rušila.

Obě karty se dají rozkliknout a mají to napsané na štítku se šipkou
(`.hm__go`). Podsvícení při najetí se řídí výsledkem, třídu přidává
`script.js` podle skóre:

| Třída | Kdy | Barva |
|-------|-----|-------|
| `hm--v` | výhra | zelená |
| `hm--p` | prohra | červená |
| `hm--r` | remíza | neutrální bílá |
| `hm--next` | nadcházející zápas | klubová zlatá |

V `ZAPASY` je podzim 2026 mužů A (Divize C) a mužů B (1.B třída sk. A) včetně
výsledků do 20. 9. 2026 (fotbalunas.cz, livesport.cz), předkolo MOL Cupu a přípravný
zápas s Ústím. U mládeže jsou jen zápasy z programu na fchlinsko.cz, bez výsledků:
ty jsou jen na Fotbal.cz a je potřeba je doplnit ručně.

## Fotografie

Fotky pocházejí z původního webu fchlinsko.cz, jde tedy o materiál klubu:

| Soubor | Kde se používá |
|--------|----------------|
| `HERO3.jpeg` | Hero na úvodní stránce, nová tribuna |
| `HERO2.jpeg` | Hero na stránce Zápasy |
| `HERO1.jpeg` | Hero na stránce Partneři |
| `stadion-tribuna.jpg` | Stadion na stránce Klub (výřez z HERO2) |
| `kontakt-olsinky.jpg` | Hero stránky Kontakt (výřez z HERO3) |
| `areal-otevreni.jpg` | Novinka Slavnostní otevření areálu (výřez z HERO1) |
| `og-olsinky.jpg` | Náhled úvodní stránky při sdílení (1200 x 630) |
| `hero-travnik.jpg` | Hero na stránkách Novinky a Přípravka U8, neutrální trávník |
| `areal-olsinky.jpg` | Hero stránky Klub |
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

## Kalendář a tréninky

Stránka kalendar.html (v menu Zápasy → Kalendář) skládá do měsíce zápasy
z pole `ZAPASY` a tréninky z pole `TRENINKY` ve `script.js`. Na počítači je
mřížka s popisky a vedle program vybraného dne, na mobilu mřížka s barevnými
tečkami a program pod ní. Filtr mužstev funguje i přes adresu, např.
kalendar.html#muzi-a nebo #skolicka.

```js
{ tym: 'A', dny: [2, 4], od: '18:00', do: '19:30', misto: 'Olšinky, hřiště č. 1' },
```

`dny` jsou dny v týdnu (1 = pondělí, 7 = neděle). Tréninky se ukazují jen v období
`TRENINKY_OBDOBI` a ne ve dnech v poli `VOLNO` (svátky, zrušené tréninky).

> **Pozor:** skutečný je zatím jen čas školičky (úterý a čtvrtek od 16:30).
> Ostatní časy tréninků jsou ukázkové a musí je potvrdit trenéři.

## Tabulka soutěže

Tabulka Divize C je v poli `TABULKA` v `script.js` a ukazuje se na úvodní
stránce v bloku áčka a na stránce Muži A. Ve sbaleném stavu je vidět osm řádků
kolem Hlinska, tlačítkem „Celá tabulka“ se rozbalí celá.

```js
var TABULKA = [
  { poradi: 1, tym: 'FK Přepeře', z: 7, v: 6, r: 0, p: 1, skore: '24:8', b: 18 },
  ...
];
var TABULKA_AKTUALIZOVANO = '21. 9. 2026';
```

Řádek s `tym: 'FC Hlinsko'` se automaticky zvýrazní. Data je potřeba po každém
kole opsat ručně z Fotbal.cz nebo fotbalunas.cz, klub tam nemá veřejné API.
Počet řádků ve sbaleném stavu řídí atribut `data-okno` v HTML.

## Narozeniny

Pole `NAROZENINY` v `script.js`. Na úvodu se ukážou ti, kdo slavili za
posledních 7 dní nebo budou slavit v příštích 31 dnech (atributy `data-dni-zpet`
a `data-dni-dopredu`), nejvýš 8 karet. Kdo slaví dnes, dostane zlatou kartu.
Když nikdo neslaví, sekce se sama schová.

```js
{ jmeno: 'Jan Novák', datum: '1998-09-24', tym: 'Muži A' },
```

> **Pozor:** jména jsou zatím ukázková. U nezletilých je ke zveřejnění jména
> a věku potřeba souhlas rodičů.

## Partneři

Pole `PARTNERI` v `script.js`, vykresluje se na úvodu i na stránce Partneři.
Úroveň určuje pole `uroven`: `'generalni'`, `'hlavni'` nebo `'partner'`.

Na úvodu je každá úroveň nekonečný běžící pás (`data-partneri="karusel"`),
řady jezdí střídavě doleva a doprava a po najetí myší se zastaví. Na stránce
Partneři je statická mřížka (`data-partneri` bez hodnoty). Rychlost pásů je
v `KARUSEL_RYCHLOST`. Při zapnutém omezení pohybu v systému se místo pásů
ukáže mřížka.
Rozdělení je zatím návrh, klub ho musí potvrdit.

### Volná pozice generálního partnera

Generálního partnera klub nemá. Dokud v poli `PARTNERI` nikdo s úrovní
`'generalni'` není, web na jeho místo sám vykreslí nabídku z objektu
`VOLNA_POZICE` ve `script.js` (co partner dostane a odkaz na stránku
Partneři). Jakmile se přidá skutečný generální partner, nabídka zmizí
a nic dalšího se nenastavuje.

## Cookies a právní stránky

Web sám nepoužívá sledovací cookies. Jediný obsah třetí strany, který může
cookies ukládat, je mapa Googlu na stránce Kontakt, ta se proto načte až po
souhlasu v liště (nebo po kliknutí na „Zobrazit mapu“). Volba se ukládá do
`localStorage` pod klíčem `fch-souhlas`, na stránce Cookies ji jde změnit.

Odkazy na čtyři právní stránky jsou v patičce všech stránek. Texty jsou psané
pro FC Hlinsko, z.s. (IČO 64783405), ale **před spuštěním je musí klub
zkontrolovat**, hlavně kdo je prodávajícím klubového oblečení a jak se platí.

## Aktuality

Všechny aktuality jsou v poli `NOVINKY` ve `script.js`, web je sám seřadí od
nejnovější. Na úvodní stránce se skládají do vodorovného pásu (karusel), na
stránce Novinky do mřížky.

Nová aktualita = zkopírovat blok v poli `NOVINKY` a přepsat `id`, `datum`,
`nadpis`, `perex`, `obsah` a obrázek. Pole `id` musí být unikátní, používá se
v adrese článku (`novinka.html?id=...`).

### Pás aktualit

Pás se ovládá prstem, šipkami po stranách a tečkami pod ním. Počet karet
neřeší, na počítači ukazuje dvě a na mobilu jednu. Když se všechny karty
vejdou naráz, šipky i tečky se samy schovají.

Kolik aktualit se na úvodu nabídne, řídí `data-limit` na pásu v `index.html`.

## Přepínač mužstev na úvodu

Sekce „Naše mužstva“ je řada štítků s kategoriemi a pod nimi fotka vybraného
mužstva s odkazem na jeho podstránku. Podrobnosti (soupisky, rozpisy, tabulky)
jsou schválně až na podstránkách.

Obsah je v poli `TYMY_PREHLED` ve `script.js`:

```js
{ zkratka: 'U15', nazev: 'Starší žáci U15', soutez: '3. liga starších žáků, sk. A',
  foto: 'images/tymy/zaci-u15.jpg', odkaz: 'tym-zaci-u15.html' },
```

Pořadí v poli = pořadí štítků, první mužstvo se ukáže po načtení stránky.

## Vyskakovací upoutávka

Okno s pozvánkou na akci, které se po načtení stránky samo otevře. Řídí ho
objekt `UPOUTAVKA` ve `script.js`:

```js
var UPOUTAVKA = {
  id: 'planeo-cup-u11-2026',      // změňte při nové akci, jinak se okno lidem neukáže znovu
  od: '2026-09-16', do: '2026-09-23',   // období, kdy se okno ukazuje (do včetně)
  stranky: ['index.html', ''],    // prázdné pole = na všech stránkách
  ...
};
```

Po datu `do` se okno samo přestane zobrazovat, nemusí se nic mazat. Každému
návštěvníkovi se ukáže jednou, zavření si prohlížeč pamatuje pod klíčem
`fch-upoutavka`. Upoutávku vypnete tak, že místo objektu napíšete `null`.

Okno počká, dokud návštěvník nevyřeší lištu se souhlasem cookies, aby ji
nepřekrylo.

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

## Hlavička

V liště je jen znak klubu, bez nápisu (`.brand--znak`). Znak je vyšší než
lišta a kouskem přesahuje pod ni do hera. Při odrolování se spolu s lištou
plynule zmenší a přesah se zkrátí (třída `is-stuck`).

Velikost řídí jediná proměnná `--znak`, výška se dopočítá z poměru stran
souboru, takže se znak nikdy nedeformuje:

| Stav | `--znak` | Přesah pod lištu |
|------|----------|------------------|
| Nahoře stránky | 108 px | 69 px |
| Po odrolování | 62 px | 24 px |
| Mobil, nahoře | 72 px | — |
| Mobil, odrolováno | 52 px | — |

Výšky lišty jsou v proměnných `--head-h` a `--head-h-sm`.

> **Pozor:** pravidla pro znak musí mít prefix `.site-head`, jinak je přebije
> obecné `.site-head.is-stuck .brand__crest` výš v souboru.

Odkazy na Facebook a Instagram jsou na počítači v horní liště. Ta se pod
620 px skrývá, odkazy proto naskočí přímo do hlavičky vedle hamburgeru
(`.nav__social`).

## Formuláře

Formuláře na stránkách Nábor a Kontakt ověří vyplnění a pak otevřou
e-mailového klienta s předvyplněnou zprávou (`mailto:`). Nepotřebují
žádný server ani PHP.

Adresa se nastavuje atributem na formuláři:

```html
<form data-mailto="info@fchlinsko.cz" data-subject="Předmět zprávy">
```

Pokud bude klub chtít odesílání přímo z webu bez otevírání e-mailu,
je potřeba doplnit serverový skript nebo službu typu Formspree.

## Přístupnost a technické

- Responzivní od 320 px výš, bez vodorovného posuvu (ověřeno na 320, 360,
  375, 414, 600, 768, 900 a 1024 px na všech stránkách)
- Tabulky se pod 620 px skládají pod sebe místo vodorovného posouvání
- Dotykové cíle na mobilu mají nejméně 40 px
- Klávesová navigace včetně přeskočení na obsah a uzavřeného fokusu v mobilním menu
- Respektuje `prefers-reduced-motion`
- Popisky `alt` u všech obrázků, `aria-label` u ikonových tlačítek
- Strukturovaná data `SportsClub` na úvodní stránce
- Bez sledovacích cookies a trackerů, bez externích skriptů (Google Fonts, mapa až po souhlasu)

## Data z FAČR

Zápasy a tabulka jdou místo ručního přepisování brát z JSON souborů, které
někdo doplňuje automaticky. Vrstva je hotová a **vypnutá**, zapíná se
v objektu `ZDROJ` na začátku `script.js`:

```js
var ZDROJ = {
  zapnuto: false,          // true = web bere data ze souborů
  zaklad: 'data/',         // složka s JSON soubory
  cesty: { zapasy: 'zapasy.json', tabulka: 'tabulka.json' },
  platnostMinut: 60,       // jak dlouho data platí, než se stáhnou znovu
  cekaniMs: 6000           // po jaké době se stahování vzdá
};
```

> **Pozor:** FAČR veřejné API nemá. Fotbal.cz data ven nepouští a neoficiální
> Scortes skončil, protože ho is.fotbal.cz začal blokovat. Web se proto nedá
> napojit přímo na fotbal.cz. Mezi web a FAČR musí přijít skript na hostingu
> klubu, který data jednou za čas stáhne a uloží je do `data/` jako dva JSON
> soubory. Podobu souborů i celý postup popisuje **`data/README.md`**, vzory
> jsou v `data/*.priklad.json`.

Jak to funguje, když je zdroj zapnutý:

1. Stránka se hned vykreslí z dat uložených v prohlížeči z minule, na síť
   se nečeká.
2. Na pozadí se stáhne čerstvá verze a když se liší, web se překreslí.

Špatná data web nerozbijí. Vadný řádek se zahodí, poškozený nebo chybějící
soubor se ignoruje a platí ruční pole `ZAPASY` a `TABULKA` ve `script.js`.
**Ta se proto nemažou ani po zapnutí zdroje**, jsou to zálohy.

## Publikace

Nahrát obsah složky do webového kořene. Žádná instalace není potřeba.
Lokální náhled například:

```bash
python -m http.server 5599
```
