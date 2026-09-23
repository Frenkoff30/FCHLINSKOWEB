# FC Hlinsko

Web fotbalového klubu FC Hlinsko. Statické HTML, CSS a jeden JS soubor,
bez frameworku a bez build kroku. Jediná část, která běží na serveru, je
odeslání formulářů ve složce `api/`, a i ta je bez závislostí.

## Struktura

```
index.html                    úvod
404.html                      stránka pro neexistující adresu
klub.html                     o klubu, historie, osobnosti, stadion, oblečení
tymy.html                     přehled mužstev
tym-*.html                    podstránka každého mužstva
zapasy.html                   rozpis a výsledky
kalendar.html                 kalendář tréninků a zápasů
nabor.html                    nábor dětí a přihláška
cleny.html                    členské příspěvky a platební údaje
novinky.html / novinka.html   výpis a detail aktuality
osobnost.html                 profil odchovance, seznam je na Klubu
partneri.html                 partneři a nabídka spolupráce
kontakt.html                  kontakty, formulář, mapa
*-podminky.html, cookies.html právní stránky

robots.txt / sitemap.xml      pro vyhledávače
styles.css                    styly, tokeny v sekci 1
script.js                     data i logika, číslované sekce
api/formular.js               odeslání formulářů, běží na serveru
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
| `KLUBY` | znaky, krátké názvy a weby klubů divize C |
| `TRENINKY` | pravidelný týdenní rozvrh do kalendáře |
| `NOVINKY` | aktuality a jejich detaily |
| `OSOBNOSTI` | odchovanci, karty i podstránky |
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

### Osobnosti

Odchovanci se píšou do pole `OSOBNOSTI`. Skládají se z něj karty na úvodu
i na stránce Klub a k tomu podstránka `osobnost.html?id=...`.

```js
{ id: 'jakub-pesek', jmeno: 'Jakub Pešek', hvezda: true,
  shrnuti: 'Reprezentace ČR, 14 zápasů a 5 gólů.',
  znaky: [{ soubor: 'sparta-praha', klub: 'AC Sparta Praha',
            web: 'https://sparta.cz/' }], foto: null,
  post: 'Křídelní záložník', narozen: 1993,
  kluby: [{ kdy: '1997–2007', kde: 'FC Hlinsko' }],
  obsah: ['první odstavec', 'druhý odstavec'] }
```

`id` musí být unikátní, tvoří adresu podstránky. `hvezda: true` dá jménu
zlatou barvu. Počet karet na úvodu řídí `data-limit` v HTML.

`znaky` stojí na kartě místo názvu klubu a vedou na jeho stránky, proto se
kluby se znakem už do `shrnuti` nepíšou. Nejvýš dva na kartu, soubory jsou
v `images/znaky/`. Když soubor chybí, znak se odebere a nezbyde po něm mezera.

**Kdo má `obsah` prázdný**, ukáže podstránka výzvu k doplnění místo textu.
U starší generace to tak zatím je schválně: o Františku Jílkovi, Petru
Popelkovi, Františku Šílovi a Miroslavu Osvaldovi není na internetu nic
kromě jména a klubu. Vymyslet si životopis je horší než přiznat mezeru,
tohle musí doplnit klub z vlastní kroniky.

### Znaky soupeřů

Pole `KLUBY` spáruje klub s jeho znakem a krátkým názvem:

```js
{ nazev: 'SK Sparta Kolín', kratky: 'Kolín', znak: 'kolin', web: 'https://sparta-kolin.cz/' }
```

`nazev` je plný název z `TABULKA`, `kratky` je ten z `ZAPASY`. Web hledá
bez ohledu na diakritiku, tečky a mezery, takže stejný řádek najde pod
oběma zápisy. Znak se pak ukáže v tabulce a v zápasovém pruhu na úvodu.

Z `web` se v tabulce stane odkaz na stránky klubu, otevře se v nové záložce.
U Hlinska je `null`, na sebe sami neodkazujeme.

Soubory patří do `images/znaky/` jako `znak.webp`, seznam je
v [images/znaky/README.md](images/znaky/README.md). Když soubor chybí nebo
se nenačte, zůstane na jeho místě kolečko se zkratkou názvu. Klub, který
v `KLUBY` není, se chová stejně, takže doplnit se dá postupně.

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

Leží v `images/`, mužstva v `images/tymy/` vždy jako dvojice `nazev.webp`
a `nazev-nahled.webp` (velká a náhled do karty). Výměna fotky = nahradit
soubor stejným názvem.

Fotky jsou ve formátu **WebP**, který je při stejné kvalitě zhruba
o polovinu menší než JPEG. Novou fotku je proto potřeba převést. Nejkratší
cesta, pokud je po ruce Python s knihovnou Pillow:

```bash
python -c "from PIL import Image; im=Image.open('nova.jpg').convert('RGB'); im.thumbnail((1920,1920)); im.save('images/tymy/nazev.webp','WEBP',quality=72,method=6)"
```

Doporučené šířky: hero a velké fotky nejvýš 1920 px, náhledy 760 px,
kvalita 72. Nad 1920 px už to na webu není vidět a soubor jen roste.

Dvě výjimky zůstávají mimo WebP schválně:

- `images/og-hero.jpg` je náhled při sdílení odkazu (1200 × 630). Facebook
  a další čtečky náhledů WebP spolehlivě neumí. Po výměně hero fotky se
  musí přegenerovat.
- `images/znak-fchlinsko.png` drží logo ve strukturovaných datech na
  úvodní stránce. V samotném webu se používá WebP verze.

`images/og-hero.jpg` (1200 × 630) je náhled, který se ukáže při sdílení
odkazu na Facebooku a v chatech. Je to výřez z hero fotky, po výměně hera
se musí přegenerovat.

### Loga institucí

Karty na stránce Partneři v sekci Institucionální podpora čekají na
soubory `nsa.png`, `pardubicky-kraj.png` a `mesto-hlinsko.png` ve složce
`images/partneri/`. Dokud tam nejsou, ukáže se místo loga název
instituce. Nejlépe PNG s průhledným pozadím, výška kolem 160 px.

## Formuláře

Formuláře na stránkách Nábor a Kontakt odesílají zprávu rovnou z webu.
Prohlížeč pošle vyplněné údaje na `/api/formular`, serverová funkce je
zkontroluje a předá službě [Resend](https://resend.com), která je doručí
do klubové schránky. Odpovědět jde rovnou, `reply_to` nese adresu
odesílatele.

Atributy na formuláři:

```html
<form data-formular="kontakt" data-mailto="info@fchlinsko.cz"
      data-subject="Předmět zprávy">
```

`data-formular` říká, podle kterého předpisu v `api/formular.js` se údaje
ověří. Povolené hodnoty jsou `nabor` a `kontakt`. Když odeslání selže,
nabídne web zprávu otevřít v e-mailovém klientu, k tomu slouží
`data-mailto`. Formulář bez `data-formular` jede rovnou přes `mailto:`.

### Zprovoznění

1. Založit účet na resend.com.
2. Přidat a ověřit doménu `fchlinsko.cz` (Resend vypíše DNS záznamy
   DKIM a SPF, které je potřeba doplnit u správce domény).
3. Vytvořit API klíč.
4. Na Vercelu v Settings → Environment Variables nastavit:

| Proměnná | Co drží |
|----------|---------|
| `RESEND_API_KEY` | klíč z Resendu, povinné |
| `FORMULAR_PRIJEMCE` | kam zprávy chodí, výchozí `info@fchlinsko.cz` |
| `FORMULAR_ODESILATEL` | odesílatel, musí být na ověřené doméně |

Bez ověřené domény umí Resend odesílat jen z `onboarding@resend.dev`
a pouze na e-mail majitele účtu. To stačí na vyzkoušení, ne na provoz.

Po změně proměnných je potřeba projekt na Vercelu nasadit znovu, jinak
se nové hodnoty nenačtou.

### Ochrana proti robotům

Ve formuláři je schované pole `web`, které člověk nevidí. Když dorazí
vyplněné, zpráva se zahodí. Stejně dopadne odeslání dřív než tři vteřiny
po načtení stránky. Z jedné IP adresy projde nejvýš pět zpráv za deset
minut. Příjemce je vždy z proměnné prostředí, z požadavku ho přepsat
nejde, takže se z endpointu nedá udělat rozesílač.

## Export zápasů do kalendáře

Na stránce Zápasy a na stránkách mužstev je tlačítko „Přidat do
kalendáře". Vyrobí soubor `.ics` s rozpisem vybrané kategorie, který si
lidé otevřou v telefonu. Skládá se v prohlížeči z pole `ZAPASY`, nic se
nikam neposílá a nic se nenastavuje.

Každý zápas má stálé `UID`, takže opakované stažení zápasy v kalendáři
přepíše a nezdvojí. Čas je v zóně Europe/Prague, délka zápasu dvě hodiny.

Tréninky se schválně neexportují. Rozpis v `TRENINKY` zatím neprošel
trenéry a natahat lidem do telefonu časy, které nesedí, je horší než nic.
Až bude rozpis potvrzený, dá se doplnit.

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
