/* ==========================================================================
   FC HLINSKO / script.js
   Vanilla JS, bez závislostí.
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     ROZPIS ZÁPASŮ, JEDINÉ MÍSTO, KDE SE ZÁPASY UPRAVUJÍ
     ------------------------------------------------------------------------
     Přidejte nový zápas na konec pole, web ho sám seřadí podle data
     a vykreslí na stránce Zápasy.

     datum:  'RRRR-MM-DDTHH:MM'  (24h, místní čas)
     domaci: true = hrajeme doma
     souper: název soupeře
     tym:    'A' | 'B' | 'dorost-u19' | 'dorost-u17' | 'zaci-u15' | 'zaci-u13'
             | 'pripravka-u11' | 'pripravka-u10' | 'pripravka-u9' | 'pripravka-u8'
             Podle toho se zapas objevi na stránce daného mužstva. Stačí
             i hrubší 'dorost', 'zaci' nebo 'pripravka', pak se ukáže
             u všech mužstev dané kategorie.
     typ:    'liga' | 'pohar' | 'priprava' | 'turnaj'
     skore:  null dokud se nehraje, po zápase např. '3:1'. Vždy ve tvaru
             domácí:hosté, tedy u venkovního zápasu je naše skóre vpravo.
             Odehraný zápas bez skóre se ukáže jako –:– (výsledek chybí).
     kolo:   číslo kola u mistrovských zápasů (nepovinné)
     soutez: vlastní název soutěže, např. 'Pohár starších žáků' (nepovinné)
     nazev:  jen u turnajů, název místo dvojice týmů; do souper
             se pak píší účastníci (nepovinné)

     Z vyplněných skóre se samo počítá: poslední a příští zápas v heru
     úvodní stránky, poslední výsledky a forma u bloku áčka.
     ---------------------------------------------------------------------- */
  var ZAPASY = [
    /* Muži A, letní příprava */
    { datum: '2026-07-11T10:00', domaci: false, souper: 'Čáslav',          tym: 'A', typ: 'priprava', misto: 'Hřiště Chotusice',              skore: null },
    { datum: '2026-07-15T18:00', domaci: true,  souper: 'Žďár n/S.',       tym: 'A', typ: 'priprava', misto: 'Olšinky, hřiště č. 2',          skore: null },
    { datum: '2026-07-18T10:30', domaci: false, souper: 'Ždírec n/D.',     tym: 'A', typ: 'priprava', misto: 'Ždírec nad Doubravou',          skore: null },
    { datum: '2026-07-22T18:00', domaci: true,  souper: 'Chotěboř',        tym: 'A', typ: 'priprava', misto: 'Olšinky, hřiště č. 1',          skore: null },
    { datum: '2026-07-25T10:30', domaci: true,  souper: 'Ústí n/O.',       tym: 'A', typ: 'priprava', misto: 'Olšinky, hřiště č. 1',          skore: '2:4' },
    { datum: '2026-07-29T18:00', domaci: true,  souper: 'Velká Bíteš',     tym: 'A', typ: 'priprava', misto: 'Olšinky, hřiště č. 1',          skore: null },
    { datum: '2026-08-01T17:00', domaci: false, souper: 'Heřmanův Městec', tym: 'A', typ: 'pohar',    misto: 'Heřmanův Městec, předkolo MOL Cup', skore: '3:0' },

    /* Muži A, Divize C 2026/2027, podzim */
    { datum: '2026-08-08T10:30', domaci: true,  souper: 'Kolín',           tym: 'A', typ: 'liga', kolo: 1,  misto: 'Olšinky, hřiště č. 1', skore: '1:1' },
    { datum: '2026-08-15T10:30', domaci: true,  souper: 'Dvůr Králové',    tym: 'A', typ: 'liga', kolo: 2,  misto: 'Olšinky, hřiště č. 1', skore: '3:2' },
    { datum: '2026-08-23T17:00', domaci: false, souper: 'Svitavy',         tym: 'A', typ: 'liga', kolo: 3,  misto: 'Svitavy',              skore: '0:6' },
    { datum: '2026-08-29T10:30', domaci: true,  souper: 'Vykáň',           tym: 'A', typ: 'liga', kolo: 4,  misto: 'Olšinky, hřiště č. 1', skore: '2:1' },
    { datum: '2026-09-05T17:00', domaci: false, souper: 'Ústí n/O.',       tym: 'A', typ: 'liga', kolo: 5,  misto: 'Ústí nad Orlicí',      skore: '2:1' },
    { datum: '2026-09-12T10:30', domaci: true,  souper: 'Trutnov',         tym: 'A', typ: 'liga', kolo: 6,  misto: 'Olšinky, hřiště č. 1', skore: '1:0' },
    { datum: '2026-09-19T10:30', domaci: false, souper: 'Přepeře',         tym: 'A', typ: 'liga', kolo: 7,  misto: 'Přepeře',              skore: '5:0' },
    { datum: '2026-09-26T10:30', domaci: true,  souper: 'Vysoké Mýto',     tym: 'A', typ: 'liga', kolo: 8,  misto: 'Olšinky, hřiště č. 1', skore: null },
    { datum: '2026-10-04T10:15', domaci: false, souper: 'Chlumec n/C.',    tym: 'A', typ: 'liga', kolo: 9,  misto: 'Chlumec nad Cidlinou', skore: null },
    { datum: '2026-10-10T10:30', domaci: true,  souper: 'Kosmonosy',       tym: 'A', typ: 'liga', kolo: 10, misto: 'Olšinky, hřiště č. 1', skore: null },
    { datum: '2026-10-18T15:30', domaci: false, souper: 'Police n/M.',     tym: 'A', typ: 'liga', kolo: 11, misto: 'Police nad Metují',    skore: null },
    { datum: '2026-10-24T10:30', domaci: true,  souper: 'Turnov',          tym: 'A', typ: 'liga', kolo: 12, misto: 'Olšinky, hřiště č. 1', skore: null },
    { datum: '2026-10-31T14:00', domaci: false, souper: 'Chrudim B',       tym: 'A', typ: 'liga', kolo: 13, misto: 'Chrudim',              skore: null },
    { datum: '2026-11-07T10:30', domaci: true,  souper: 'Letohrad',        tym: 'A', typ: 'liga', kolo: 14, misto: 'Olšinky, hřiště č. 1', skore: null },
    { datum: '2026-11-14T10:15', domaci: false, souper: 'Slavia HK',       tym: 'A', typ: 'liga', kolo: 15, misto: 'Hradec Králové',       skore: null },

    /* Muži B, 1.B třída skupina A 2026/2027, podzim */
    { datum: '2026-08-16T17:00', domaci: false, souper: 'Sezemice',        tym: 'B', typ: 'liga', kolo: 2,  misto: 'Sezemice',             skore: '3:2' },
    { datum: '2026-08-19T18:00', domaci: false, souper: 'Jehnědí',         tym: 'B', typ: 'liga', kolo: 1,  misto: 'Jehnědí',              skore: '0:5' },
    { datum: '2026-08-22T17:00', domaci: true,  souper: 'Heřmanův Městec B', tym: 'B', typ: 'liga', kolo: 3, misto: 'Olšinky, Hlinsko',   skore: '0:6' },
    { datum: '2026-08-29T17:00', domaci: false, souper: 'Pardubičky B',    tym: 'B', typ: 'liga', kolo: 4,  misto: 'Pardubice',            skore: '5:0' },
    { datum: '2026-09-06T17:00', domaci: true,  souper: 'Dolní Újezd B',   tym: 'B', typ: 'liga', kolo: 5,  misto: 'Olšinky, Hlinsko',     skore: '3:0' },
    { datum: '2026-09-12T14:30', domaci: false, souper: 'Chroustovice',    tym: 'B', typ: 'liga', kolo: 6,  misto: 'Chroustovice',         skore: '0:0' },
    { datum: '2026-09-20T16:30', domaci: true,  souper: 'Moravany',        tym: 'B', typ: 'liga', kolo: 7,  misto: 'Olšinky, Hlinsko',     skore: '0:3' },
    { datum: '2026-09-26T16:00', domaci: false, souper: 'Dříteč',          tym: 'B', typ: 'liga', kolo: 8,  misto: 'Dříteč',               skore: null },
    { datum: '2026-10-03T16:00', domaci: true,  souper: 'Býšť',            tym: 'B', typ: 'liga', kolo: 9,  misto: 'Olšinky, Hlinsko',     skore: null },
    { datum: '2026-10-10T15:30', domaci: false, souper: 'Rosice',          tym: 'B', typ: 'liga', kolo: 10, misto: 'Rosice',               skore: null },
    { datum: '2026-10-17T15:30', domaci: true,  souper: 'Načešice',        tym: 'B', typ: 'liga', kolo: 11, misto: 'Olšinky, Hlinsko',     skore: null },
    { datum: '2026-10-25T14:30', domaci: false, souper: 'Miřetice',        tym: 'B', typ: 'liga', kolo: 12, misto: 'Miřetice',             skore: null },
    { datum: '2026-11-01T14:00', domaci: true,  souper: 'Morašice',        tym: 'B', typ: 'liga', kolo: 13, misto: 'Olšinky, Hlinsko',     skore: null },

    /* Mládež, podle programu utkání na fchlinsko.cz. Výsledky doplnit z Fotbal.cz. */
    { datum: '2026-09-16T17:00', domaci: true,  souper: 'Slatiňany',       tym: 'zaci-u15', typ: 'pohar', soutez: 'Pohár starších žáků', misto: 'Olšinky, Hlinsko', skore: null },
    { datum: '2026-09-19T09:00', domaci: true,  souper: 'Litomyšl, Česká Třebová, Chrudim', tym: 'pripravka', typ: 'turnaj', nazev: 'Turnaj starších a mladších přípravek', misto: 'Olšinky, Hlinsko', skore: null },
    { datum: '2026-09-19T09:30', domaci: false, souper: 'Přelouč',         tym: 'zaci-u15', typ: 'liga', misto: 'Přelouč', skore: null },
    { datum: '2026-09-19T11:30', domaci: false, souper: 'Přelouč',         tym: 'zaci-u13', typ: 'liga', misto: 'Přelouč', skore: null },
    { datum: '2026-09-23T12:00', domaci: true,  souper: 'Svitavy, Orlicko, Česká Třebová, Humpolec, Žďár n/S.', tym: 'pripravka-u11', typ: 'turnaj', nazev: 'Planeo CUP U11 (ročník 2016)', misto: 'Olšinky, Hlinsko', skore: null }
  ];

  /* ------------------------------------------------------------------------
     ZDROJ DAT Z FAČR
     ------------------------------------------------------------------------
     Pole ZAPASY a TABULKA výš jsou ruční záloha, se kterou web funguje vždy.
     Tenhle blok umí místo nich vzít data ze souborů, které někdo doplňuje
     automaticky, a ruční pole tím přepsat.

     POZOR: FAČR žádné veřejné API nemá, fotbal.cz data ven nepouští a
     neoficiální Scortes skončil, protože ho is.fotbal.cz začal blokovat.
     Web se proto NEPŘIPOJUJE přímo na fotbal.cz, ani to nejde. Potřebuje
     mezikrok na hostingu klubu: skript, který si data jednou za čas stáhne
     a uloží je jako dva JSON soubory v podobě popsané níž. Tenhle blok už
     s takovými soubory umí pracovat, stačí ho zapnout.

     Zapnutí: zapnuto: true a zaklad nastavit na složku s JSON soubory.

     zapnuto:        false = web bere jen ruční pole ZAPASY a TABULKA
     zaklad:         složka s JSON soubory, musí být na stejné doméně jako web
                     (jinak je potřeba na straně serveru povolit CORS)
     cesty:          názvy obou souborů
     platnostMinut:  jak dlouho se data drží v prohlížeči, než se stáhnou znovu
     cekaniMs:       po jaké době se stahování vzdá a nechá ruční pole

     Očekávaná podoba zapasy.json (stejná jako pole ZAPASY):

       { "aktualizovano": "2026-09-21T10:00:00Z",
         "zapasy": [
           { "datum": "2026-08-08T10:30", "domaci": true, "souper": "Kolín",
             "tym": "A", "typ": "liga", "kolo": 1,
             "misto": "Olšinky, hřiště č. 1", "skore": "1:1" }
         ] }

     Očekávaná podoba tabulka.json (stejná jako pole TABULKA):

       { "aktualizovano": "21. 9. 2026",
         "tabulka": [
           { "poradi": 1, "tym": "FK Přepeře", "z": 7, "v": 6, "r": 0, "p": 1,
             "skore": "24:8", "b": 18 }
         ] }

     Když soubor chybí, nejde stáhnout nebo je poškozený, web se nezhroutí
     a zůstane u ručních polí.
     ---------------------------------------------------------------------- */
  var ZDROJ = {
    zapnuto: false,
    zaklad: 'data/',
    cesty: { zapasy: 'zapasy.json', tabulka: 'tabulka.json' },
    platnostMinut: 60,
    cekaniMs: 6000
  };

  /* Popisek mužstva u zápasu na stránce Zápasy */
  var TYM_NAZEV = {
    'A': 'Muži A', 'B': 'Muži B',
    'dorost-u19': 'Dorost U19', 'dorost-u17': 'Dorost U17', 'dorost': 'Dorost',
    'zaci-u15': 'Starší žáci U15', 'zaci-u13': 'Mladší žáci U13', 'zaci': 'Žáci',
    'pripravka-u11': 'Přípravka U11', 'pripravka-u10': 'Přípravka U10',
    'pripravka-u9': 'Přípravka U9', 'pripravka-u8': 'Přípravka U8', 'pripravka': 'Přípravky',
    'skolicka': 'Fotbalová školička'
  };

  /* Krátký popisek mužstva do políček kalendáře */
  var TYM_ZKR = {
    'A': 'A', 'B': 'B', 'dorost-u19': 'U19', 'dorost-u17': 'U17', 'dorost': 'Dorost',
    'zaci-u15': 'U15', 'zaci-u13': 'U13', 'zaci': 'Žáci',
    'pripravka-u11': 'U11', 'pripravka-u10': 'U10', 'pripravka-u9': 'U9', 'pripravka-u8': 'U8',
    'pripravka': 'Přípravky', 'skolicka': 'Školička'
  };

  /* ------------------------------------------------------------------------
     TRÉNINKY, PRAVIDELNÝ TÝDENNÍ ROZVRH PRO KALENDÁŘ
     ------------------------------------------------------------------------
     tym:    klíč mužstva jako v ZAPASY ('A', 'zaci-u15', 'skolicka' ...)
     dny:    dny v týdnu, 1 = pondělí ... 7 = neděle
     od, do: čas 'HH:MM'
     misto:  kde se trénuje

     Tréninky se v kalendáři ukážou jen v období TRENINKY_OBDOBI a ne ve
     dnech uvedených ve VOLNO (svátky, zrušené tréninky).

     POZOR: skutečný je zatím jen čas školičky (web klubu: úterý a čtvrtek
     od 16:30). Ostatní časy jsou UKÁZKOVÉ, musí je potvrdit trenéři.
     ---------------------------------------------------------------------- */
  var TRENINKY = [
    { tym: 'A',             dny: [2, 4], od: '18:00', do: '19:30', misto: 'Olšinky, hřiště č. 1' },
    { tym: 'B',             dny: [1, 3], od: '18:00', do: '19:30', misto: 'Olšinky, hřiště č. 2' },
    { tym: 'dorost-u19',    dny: [1, 3], od: '16:30', do: '18:00', misto: 'Olšinky, hřiště č. 1' },
    { tym: 'dorost-u17',    dny: [2, 4], od: '16:30', do: '18:00', misto: 'Olšinky, hřiště č. 2' },
    { tym: 'zaci-u15',      dny: [1, 3], od: '16:00', do: '17:30', misto: 'Olšinky, hřiště č. 2' },
    { tym: 'zaci-u13',      dny: [2, 4], od: '16:00', do: '17:30', misto: 'Olšinky, hřiště č. 1' },
    { tym: 'pripravka-u11', dny: [1, 3], od: '16:00', do: '17:15', misto: 'Olšinky, hřiště č. 2' },
    { tym: 'pripravka-u10', dny: [2, 4], od: '16:00', do: '17:15', misto: 'Olšinky, hřiště č. 2' },
    { tym: 'pripravka-u9',  dny: [1, 3], od: '16:30', do: '17:30', misto: 'Olšinky, hřiště č. 2' },
    { tym: 'pripravka-u8',  dny: [2, 5], od: '16:30', do: '17:30', misto: 'Olšinky, hřiště č. 2' },
    { tym: 'skolicka',      dny: [2, 4], od: '16:30', do: '17:30', misto: 'Olšinky, zadní travnaté hřiště' }
  ];

  var TRENINKY_OBDOBI = { od: '2026-08-03', do: '2026-11-22' };

  /* Dny bez tréninků: 28. 9., 28. 10. a 17. 11. jsou státní svátky */
  var VOLNO = ['2026-09-28', '2026-10-28', '2026-11-17'];

  /* Název soutěže podle mužstva, ukazuje se u mistrovských zápasů */
  var SOUTEZE = {
    'A': 'Divize C', 'B': '1.B třída, sk. A',
    'dorost-u19': '4. liga dorostu U19', 'dorost-u17': '4. liga dorostu U17',
    'zaci-u15': '3. liga starších žáků', 'zaci-u13': '3. liga mladších žáků'
  };

  var TYP_NAZEV = { liga: 'Mistrovské utkání', pohar: 'MOL Cup', priprava: 'Přípravné utkání', turnaj: 'Turnaj' };
  var MESICE = ['led', 'úno', 'bře', 'dub', 'kvě', 'čvn', 'čvc', 'srp', 'zář', 'říj', 'lis', 'pro'];
  var MESICE_DLOUHE = ['ledna', 'února', 'března', 'dubna', 'května', 'června',
                      'července', 'srpna', 'září', 'října', 'listopadu', 'prosince'];

  /* ------------------------------------------------------------------------
     NOVINKY, JEDINÉ MÍSTO, KDE SE NOVINKY PÍŠÍ
     ------------------------------------------------------------------------
     Novou novinku přidejte kamkoliv do pole, web ji sám seřadí od nejnovější
     a vykreslí na stránce Novinky. Na úvodní stránku se automaticky dostanou
     jen ty nejnovější (kolik, řídí atribut data-limit v index.html).

     id:           krátký název bez diakriktiky a mezer, tvoří adresu článku
                   (novinka.html?id=...), musí být u každé novinky jiné
     datum:        'RRRR-MM-DD'
     stitek:       štítek nad fotkou, např. 'Akce pro děti' (nepovinné)
     stitekZlaty:  true = zlatý štítek místo zeleného (nepovinné)
     obrazek:      cesta k fotce, sirka a vyska jsou její rozměry v pixelech
     popisObrazku: popis fotky pro čtečky a vyhledávače
     nadpis:       titulek novinky
     perex:        krátký odstavec do karty na výpisu
     obsah:        pole odstavců, ze kterých se skládá samotný článek
     odkaz:        kam vede odkaz pod textem, odkazText je jeho popisek
                   (obojí vynechte, pokud odkaz nemá být)
     ---------------------------------------------------------------------- */
  var NOVINKY = [
    {
      id: 'planeo-cup-u11-v-olsinkach',
      datum: '2026-09-23',
      stitek: 'Turnaj', stitekZlaty: true,
      obrazek: 'images/tymy/pripravka-u11.jpg', sirka: 1500, vyska: 858,
      popisObrazku: 'Starší přípravka U11 FC Hlinsko',
      nadpis: 'PLANEO Cup U11 hostíme v Olšinkách',
      perex: 'Turnaj ročníku 2016 se hraje u nás v Olšinkách. Kromě domácí U11 přijedou '
           + 'Svitavy, Orlicko, Česká Třebová, Humpolec a Žďár nad Sázavou.',
      obsah: [
        'Turnaj PLANEO Cup kategorie U11 pro ročník 2016 se hraje v areálu Olšinky. '
          + 'Začínáme ve 12:00.',
        'Kromě domácí přípravky nastoupí Svitavy, Orlicko, Česká Třebová, Humpolec '
          + 'a Žďár nad Sázavou. Vstup na mládežnická utkání je zdarma.',
        'Přijďte kluky a holky podpořit, u přípravek platí víc než jinde, že se hraje '
          + 'hlavně pro radost a fandící rodiče jsou slyšet.'
      ],
      odkaz: 'kalendar.html#pripravky', odkazText: 'Program přípravek'
    },
    {
      id: 'fotbalovy-den-a-drazba-dresu',
      datum: '2026-07-18',
      stitek: 'Akce pro děti',
      obrazek: 'images/tym-mladez.jpg', sirka: 1400, vyska: 933,
      popisObrazku: 'Mládežníci FC Hlinsko na hřišti',
      nadpis: 'Fotbalový den a dražba dresů',
      perex: 'Děti od 5 do 9 let si vyzkouší cvičení z našich tréninků. Součástí dne je '
           + 'dražba podepsaných dresů, výtěžek putuje přípravkám FC Hlinsko.',
      obsah: [
        'Fotbalový den je otevřený dětem od pěti do devíti let. Vyzkouší si cvičení, '
          + 'která používáme na běžných trénincích našich přípravek.',
        'Součástí dne je dražba podepsaných dresů. Celý výtěžek putuje přípravkám '
          + 'FC Hlinsko.'
      ],
      odkaz: 'nabor.html', odkazText: 'Info o náboru'
    },
    {
      id: 'slavnostni-otevreni-arealu-olsinky',
      datum: '2026-07-18',
      stitek: 'Areál', stitekZlaty: true,
      obrazek: 'images/areal-otevreni.jpg', sirka: 1600, vyska: 1000,
      popisObrazku: 'Nová tribuna a hlavní hrací plocha areálu Olšinky od branky',
      nadpis: 'Slavnostní otevření areálu Olšinky',
      perex: 'Utkání přípravek, exhibiční zápas staré gardy, soutěže, hudba a občerstvení. '
           + 'Přijďte si prohlédnout nový areál.',
      obsah: [
        'Program otevření nového areálu Olšinky začíná utkáními přípravek. Po nich '
          + 'nastoupí stará garda k exhibičnímu zápasu.',
        'Pro návštěvníky jsou připravené soutěže, hudba a občerstvení. Areál si můžete '
          + 'během dne v klidu projít.'
      ],
      odkaz: 'klub.html#stadion', odkazText: 'Náš stadion'
    }
  ];

  /* ------------------------------------------------------------------------
     NAROZENINY
     ------------------------------------------------------------------------
     Na úvodní stránce se samy ukážou ti, kdo slavili za posledních pár dní
     nebo budou slavit v nejbližším měsíci (rozsah řídí atributy
     data-dni-zpet a data-dni-dopredu v index.html). Když nikdo neslaví,
     celá sekce se schová.

     jmeno:  jméno a příjmení
     datum:  datum narození 'RRRR-MM-DD', z roku se počítá věk
     tym:    mužstvo nebo funkce, např. 'Muži A', 'Trenér U11'

     POZOR: zatím UKÁZKOVÁ JMÉNA, před spuštěním nahradit skutečnými.
     U nezletilých hráčů je ke zveřejnění potřeba souhlas rodičů.
     ---------------------------------------------------------------------- */
  var NAROZENINY = [
    { jmeno: 'Tomáš Dvořák',     datum: '1994-09-17', tym: 'Muži A' },
    { jmeno: 'Adam Kučera',      datum: '2010-09-21', tym: 'Dorost U17' },
    { jmeno: 'Matěj Horák',      datum: '2012-09-23', tym: 'Žáci U15' },
    { jmeno: 'Petr Šimek',       datum: '1990-09-26', tym: 'Muži B' },
    { jmeno: 'Ema Svobodová',    datum: '2016-09-29', tym: 'Přípravka U10' },
    { jmeno: 'Jakub Marek',      datum: '2008-10-02', tym: 'Dorost U19' },
    { jmeno: 'Martin Krejčí',    datum: '1987-10-08', tym: 'Trenér U9' },
    { jmeno: 'Ondřej Pospíšil',  datum: '2014-10-12', tym: 'Žáci U13' },
    { jmeno: 'Lukáš Veselý',     datum: '1999-11-03', tym: 'Muži A' }
  ];

  /* ------------------------------------------------------------------------
     PARTNEŘI
     ------------------------------------------------------------------------
     Vykreslí se na úvodní stránce i na stránce Partneři, rozdělení podle
     úrovně. Pořadí v poli = pořadí na webu.

     uroven: 'generalni' | 'hlavni' | 'partner'
     web:    odkaz na stránky partnera (nepovinné)

     Generálního partnera klub zatím nemá. Dokud v poli nikdo s úrovní
     'generalni' není, web na jeho místo sám vykreslí volnou pozici
     s nabídkou (viz VOLNA_POZICE níž). Jakmile se přidá skutečný partner,
     nabídka zmizí a nic dalšího se nastavovat nemusí.
     ---------------------------------------------------------------------- */
  var PARTNERI = [
    { nazev: 'Tatra mléko',          logo: 'images/partneri/tatra.png',         web: 'https://www.tatramleko.cz',             uroven: 'hlavni' },
    { nazev: 'Pivovar Rychtář',      logo: 'images/partneri/rychtar.png',       web: 'https://pivo-rychtar.cz',               uroven: 'hlavni' },
    { nazev: 'MIAS OC',              logo: 'images/partneri/mias.png',          web: 'https://miasoc.cz',                     uroven: 'hlavni' },
    { nazev: 'Instav',               logo: 'images/partneri/instav.png',        web: 'https://www.instav.cz',                 uroven: 'hlavni' },
    { nazev: 'Renos',                logo: 'images/partneri/renos.png',         web: 'https://www.renos.cz',                  uroven: 'hlavni' },
    { nazev: 'Linea Art',            logo: 'images/partneri/lineaart.png',      web: 'https://lineaart.cz',                   uroven: 'partner' },
    { nazev: 'Euro Wellness',        logo: 'images/partneri/euro-wellness.png', web: 'https://www.spa-virivky.cz',            uroven: 'partner' },
    { nazev: 'Steak Bar Bison',      logo: 'images/partneri/bison.png',         web: 'http://www.bisonsteak.cz',              uroven: 'partner' },
    { nazev: 'Edera',                logo: 'images/partneri/edera.png',         web: 'https://www.edera.cz',                  uroven: 'partner' },
    { nazev: 'Trigi',                logo: 'images/partneri/trigi.png',         web: 'https://trigi.cz',                      uroven: 'partner' },
    { nazev: 'Huky elektromontáže',  logo: 'images/partneri/huky.png',          web: 'https://www.elektro-montaze-prodej.com', uroven: 'partner' }
  ];

  /* ------------------------------------------------------------------------
     MUŽSTVA PRO PŘEPÍNAČ NA ÚVODNÍ STRÁNCE
     ------------------------------------------------------------------------
     Na úvodu je jen přepínač s fotkou, podrobnosti (soupisky, rozpisy,
     tabulky) jsou až na podstránce každého mužstva. Pořadí v poli = pořadí
     štítků, první mužstvo se ukáže po načtení stránky.

     zkratka: text na štítku (Muži A, U19, ...)
     nazev:   celý název pod fotkou
     soutez:  soutěž nebo krátký popis
     foto:    velká fotka mužstva
     odkaz:   podstránka mužstva
     ---------------------------------------------------------------------- */
  var TYMY_PREHLED = [
    { zkratka: 'Muži A',   nazev: 'Muži A',              soutez: 'Divize, skupina C',            foto: 'images/tymy/muzi-a.jpg',         odkaz: 'tym-muzi-a.html' },
    { zkratka: 'Muži B',   nazev: 'Muži B',              soutez: '1.B třída, skupina A',         foto: 'images/tymy/muzi-b.jpg',         odkaz: 'tym-muzi-b.html' },
    { zkratka: 'U19',      nazev: 'Starší dorost U19',   soutez: '4. liga dorostu, skupina A',   foto: 'images/tymy/dorost-u19.jpg',     odkaz: 'tym-dorost-u19.html' },
    { zkratka: 'U17',      nazev: 'Mladší dorost U17',   soutez: '4. liga mladšího dorostu',     foto: 'images/tymy/dorost-u17.jpg',     odkaz: 'tym-dorost-u17.html' },
    { zkratka: 'U15',      nazev: 'Starší žáci U15',     soutez: '3. liga starších žáků, sk. A', foto: 'images/tymy/zaci-u15.jpg',       odkaz: 'tym-zaci-u15.html' },
    { zkratka: 'U13',      nazev: 'Mladší žáci U13',     soutez: '3. liga mladších žáků, sk. A', foto: 'images/tymy/zaci-u13.jpg',       odkaz: 'tym-zaci-u13.html' },
    { zkratka: 'U11',      nazev: 'Starší přípravka U11', soutez: 'Soutěž starších přípravek',   foto: 'images/tymy/pripravka-u11.jpg',  odkaz: 'tym-pripravka-u11.html' },
    { zkratka: 'U10',      nazev: 'Mladší přípravka U10', soutez: 'Okresní soutěž přípravek',    foto: 'images/tymy/pripravka-u10.jpg',  odkaz: 'tym-pripravka-u10.html' },
    { zkratka: 'U9',       nazev: 'Mladší přípravka U9',  soutez: 'Okresní soutěž přípravek',    foto: 'images/tymy/pripravka-u9.jpg',   odkaz: 'tym-pripravka-u9.html' },
    { zkratka: 'U8',       nazev: 'Mladší přípravka U8',  soutez: 'Nejmladší soutěžní kategorie', foto: 'images/hero-travnik.jpg',       odkaz: 'tym-pripravka-u8.html' },
    { zkratka: 'Školička', nazev: 'Fotbalová školička',   soutez: 'Od pěti let, bez soutěží',    foto: 'images/tymy/skolicka.jpg',       odkaz: 'nabor.html' }
  ];

  var UROVNE_PARTNERU = [
    { klic: 'generalni', jeden: 'Generální partner', vice: 'Generální partneři' },
    { klic: 'hlavni',    jeden: 'Hlavní partner',    vice: 'Hlavní partneři' },
    { klic: 'partner',   jeden: 'Partner',           vice: 'Partneři' }
  ];

  /* ------------------------------------------------------------------------
     VOLNÁ POZICE GENERÁLNÍHO PARTNERA
     ------------------------------------------------------------------------
     Ukáže se jen tehdy, když v PARTNERI nikdo s úrovní 'generalni' není.
     Body jsou to, co klub generálnímu partnerovi skutečně nabízí, ať má
     zájemce hned jasno, co za to dostane.
     ---------------------------------------------------------------------- */
  var VOLNA_POZICE = {
    uroven: 'generalni',
    titulek: 'Tady může být vaše logo',
    text: 'Generálního partnera zatím nemáme. Je to jediné místo v klubu, '
        + 'které nese jméno firmy na dresech áčka i na čele webu.',
    body: [
      'Logo na přední straně dresů všech mužstev',
      'Jméno v hlášení a na panelu u hlavní tribuny',
      'Nejvyšší pozice tady na webu a na sítích klubu'
    ],
    odkaz: 'partneri.html#stat-se-partnerem',
    odkazText: 'Co to obnáší'
  };


  /* ------------------------------------------------------------------------
     VYSKAKOVACÍ UPOUTÁVKA
     ------------------------------------------------------------------------
     Okno, které se po načtení stránky samo otevře přes obsah. Používá se na
     jednorázové akce, jako je turnaj nebo zápas, na který chce klub pozvat.

     id:       klíč, pod kterým si prohlížeč pamatuje, že návštěvník okno zavřel.
               Při nové akci ho ZMĚŇTE, jinak se okno lidem znovu neukáže.
     od, do:   období, kdy se okno ukazuje ('RRRR-MM-DD', do včetně). Po datu do
               se okno samo přestane zobrazovat, nemusí se nic mazat.
     stranky:  na kterých stránkách se ukáže. Prázdné pole = na všech.
     prodleva: za kolik milisekund po načtení stránky okno naskočí.

     Upoutávku vypnete tak, že místo objektu napíšete null.
     ---------------------------------------------------------------------- */
  var UPOUTAVKA = {
    id: 'planeo-cup-u11-2026',
    od: '2026-09-16',
    do: '2026-09-23',
    stranky: ['index.html', ''],
    prodleva: 900,
    stitek: 'PLANEO Cup U11',
    nadpis: 'Turnaj přípravek hostíme v Olšinkách',
    text: 'Ročník 2016 se utká v areálu Olšinky. Kromě naší U11 přijedou Svitavy, '
        + 'Orlicko, Česká Třebová, Humpolec a Žďár nad Sázavou. Vstup zdarma.',
    obrazek: 'images/tymy/pripravka-u11.jpg',
    popisObrazku: 'Starší přípravka U11 FC Hlinsko',
    udaje: [
      { k: 'Kdy', v: 'Středa 23. 9. od 12:00' },
      { k: 'Kde', v: 'Areál Olšinky, Hlinsko' },
      { k: 'Kategorie', v: 'U11, ročník 2016' }
    ],
    odkaz: 'novinka.html?id=planeo-cup-u11-v-olsinkach',
    odkazText: 'Více o turnaji',
    odkaz2: 'kalendar.html#pripravky',
    odkaz2Text: 'Program přípravek'
  };

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  function parseDatum(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(s);
    if (!m) return new Date(s);
    return new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], 0, 0);
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* ------------------------------------------------------------------------
     TLAČÍTKO NAHORU JAKO ZELENOBÍLÝ MÍČ
     Prostřední pětiúhelník míří nahoru a nese šipku. Vzor míče se při najetí
     pootočí o pětinu otáčky (vypadá pak stejně), po kliknutí se zakutálí.
     ---------------------------------------------------------------------- */
  var MIC_NAHORU = '<svg class="mic" viewBox="0 0 100 100" aria-hidden="true">'
    + '<defs>'
      + '<radialGradient id="mic-kuze" cx="36%" cy="30%" r="78%"><stop offset="0" stop-color="#fff"/>'
      + '<stop offset=".62" stop-color="#F2F5F3"/><stop offset="1" stop-color="#C7D2CB"/></radialGradient>'
      + '<radialGradient id="mic-stin" cx="36%" cy="30%" r="80%"><stop offset=".58" stop-color="#04180D" stop-opacity="0"/>'
      + '<stop offset="1" stop-color="#04180D" stop-opacity=".42"/></radialGradient>'
      + '<radialGradient id="mic-lesk"><stop offset="0" stop-color="#fff" stop-opacity=".75"/>'
      + '<stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>'
      + '<clipPath id="mic-orez"><circle cx="50" cy="50" r="47"/></clipPath>'
    + '</defs>'
    + '<circle cx="50" cy="50" r="47" fill="url(#mic-kuze)"/>'
    + '<g class="mic__vzor" clip-path="url(#mic-orez)">'
      + '<path fill="none" stroke="#00602B" stroke-width="2.4" stroke-linecap="round" d="M50.00 29.50L50.00 18.00M63.31 8.33L85.52 24.46M69.50 43.67L80.43 40.11M93.75 49.79L85.27 75.89M62.05 66.58L68.81 75.89M63.72 91.54L36.28 91.54M37.95 66.58L31.19 75.89M14.73 75.89L6.25 49.79M30.50 43.67L19.57 40.11M14.48 24.46L36.69 8.33"/>'
      + '<g fill="#00843C" stroke="#00602B" stroke-width="2.2" stroke-linejoin="round">'
      + '<polygon points="50,18 36.69,8.33 41.77,-7.33 58.23,-7.33 63.31,8.33"/>'
      + '<polygon points="80.43,40.11 85.52,24.46 101.98,24.46 107.06,40.11 93.75,49.79"/>'
      + '<polygon points="68.81,75.89 85.27,75.89 90.35,91.54 77.04,101.21 63.72,91.54"/>'
      + '<polygon points="31.19,75.89 36.28,91.54 22.96,101.21 9.65,91.54 14.73,75.89"/>'
      + '<polygon points="19.57,40.11 6.25,49.79 -7.06,40.11 -1.98,24.46 14.48,24.46"/>'
      + '<polygon points="50,29.50 69.50,43.67 62.05,66.58 37.95,66.58 30.50,43.67"/>'
      + '</g>'
    + '</g>'
    + '<circle cx="50" cy="50" r="47" fill="url(#mic-stin)"/>'
    + '<ellipse cx="32" cy="24" rx="17" ry="10" fill="url(#mic-lesk)" transform="rotate(-30 32 24)"/>'
    + '<path d="M50 59V41.5M42.8 48.7L50 41.5L57.2 48.7" fill="none" stroke="#fff" stroke-width="5" '
    + 'stroke-linecap="round" stroke-linejoin="round"/>'
    + '<circle cx="50" cy="50" r="47" fill="none" stroke="rgba(4,30,17,.28)" stroke-width="1.6"/>'
  + '</svg>';

  /* ------------------------------------------------------------------------
     1. HLAVIČKA A TLAČÍTKO NAHORU
     ---------------------------------------------------------------------- */
  function initHeader() {
    var head = $('.site-head');
    var toTop = $('.to-top');
    if (!head && !toTop) return;

    var tick = false;
    function onScroll() {
      if (tick) return;
      tick = true;
      window.requestAnimationFrame(function () {
        var y = window.pageYOffset;
        if (head) head.classList.toggle('is-stuck', y > 30);
        if (toTop) toTop.classList.toggle('is-on', y > 640);
        tick = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (toTop) {
      toTop.innerHTML = MIC_NAHORU;
      toTop.addEventListener('click', function () {
        /* Míč se při výkopu nahoru zakutálí */
        toTop.classList.remove('is-kop');
        void toTop.offsetWidth;
        toTop.classList.add('is-kop');
        window.setTimeout(function () { toTop.classList.remove('is-kop'); }, 800);
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    }
  }

  /* ------------------------------------------------------------------------
     2. MOBILNÍ MENU
     ---------------------------------------------------------------------- */
  function initDrawer() {
    var burger = $('.burger');
    var drawer = $('.drawer');
    var scrim = $('.scrim');
    var closeBtn = $('.drawer__close');
    if (!burger || !drawer) return;

    var lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      drawer.classList.add('is-open');
      if (scrim) scrim.classList.add('is-on');
      burger.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      drawer.removeAttribute('aria-hidden');
      document.body.classList.add('is-locked');
      var first = drawer.querySelector('a, button');
      if (first) first.focus();
    }

    function close() {
      drawer.classList.remove('is-open');
      if (scrim) scrim.classList.remove('is-on');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
      if (lastFocus) lastFocus.focus();
    }

    burger.addEventListener('click', function () {
      drawer.classList.contains('is-open') ? close() : open();
    });
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (scrim) scrim.addEventListener('click', close);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) close();
    });

    $$('.dnav a', drawer).forEach(function (a) { a.addEventListener('click', close); });

    $$('.dnav__toggle', drawer).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var sub = btn.parentElement.parentElement.querySelector('.dnav__sub');
        if (!sub) return;
        var isOpen = sub.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    });

    drawer.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = $$('a[href], button:not([disabled]), input, select, textarea', drawer)
        .filter(function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ------------------------------------------------------------------------
     3. AKTIVNÍ POLOŽKA NAVIGACE
     ---------------------------------------------------------------------- */
  function initActiveNav() {
    var here = location.pathname.split('/').pop() || 'index.html';
    $$('.menu__link[href], .dnav__link[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#' || href.indexOf('http') === 0) return;
      var file = href.split('#')[0].split('/').pop() || 'index.html';
      /* data-stranky: položka svítí i na dalších stránkách, např. Zápasy v Kalendáři */
      var stranky = (a.getAttribute('data-stranky') || file).split(' ');
      if (stranky.indexOf(here) >= 0) {
        a.classList.add('is-active');
        a.setAttribute('aria-current', 'page');
      }
    });
  }

  /* ------------------------------------------------------------------------
     4. ODHALOVÁNÍ PŘI SCROLLU
     ---------------------------------------------------------------------- */
  function initReveal() {
    var items = $$('.reveal');
    if (!items.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------------
     5. ROZPIS ZÁPASŮ
     ---------------------------------------------------------------------- */
  /* Sedi zapas do kategorie? 'dorost' bere i 'dorost-u19'. */
  function tymSedi(tym, klic) {
    tym = String(tym || '');
    return tym === klic || tym.indexOf(klic + '-') === 0;
  }

  var IKONA_DRES = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M8 3 3 6l2 4 2-1v12h10V9l2 1 2-4-5-3a4 4 0 0 1-8 0z"/></svg>';
  var IKONA_CAS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
  var IKONA_MISTO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';

  /* ukazTym: na stránce Zápasy je u každého zápasu i popisek mužstva */
  function fixtureHtml(z, now, ukazTym) {
    var d = parseDatum(z.datum);
    var odehrano = d.getTime() < now;
    var turnaj = z.typ === 'turnaj';

    var cls = ['fixture'];
    if (z.domaci) cls.push('is-home');
    if (z.typ === 'pohar') cls.push('is-cup');
    if (odehrano) cls.push('is-done');

    var zvyrazni = function (n) {
      return n === 'FC Hlinsko' ? '<b>' + esc(n) + '</b>' : esc(n);
    };
    var tymy = turnaj
      ? '<b>' + esc(z.nazev || TYP_NAZEV.turnaj) + '</b>'
      : zvyrazni(z.domaci ? 'FC Hlinsko' : z.souper) + '<i>vs</i>' + zvyrazni(z.domaci ? z.souper : 'FC Hlinsko');

    var badge = turnaj
      ? '<span class="fixture__badge fixture__badge--home">Turnaj</span>'
      : z.typ === 'pohar'
        ? '<span class="fixture__badge fixture__badge--cup">Pohár</span>'
        : (z.domaci ? '<span class="fixture__badge fixture__badge--home">Doma</span>'
                    : '<span class="fixture__badge">Venku</span>');

    /* Odehraný zápas bez výsledku: raději –:– než čas výkopu */
    var vpravo;
    var v = vysledek(z);
    if (z.skore) {
      vpravo = '<div class="fixture__time' + (v ? ' fixture__time--' + v : '') + '"'
        + (v ? ' title="' + VYSLEDEK[v].nazev + '"' : '') + '>' + esc(z.skore) + '</div>';
    }
    else if (odehrano && !turnaj) vpravo = '<div class="fixture__time fixture__time--na" title="Výsledek zatím nemáme">–:–</div>';
    else vpravo = '<div class="fixture__time">' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + '</div>';

    var info = [];
    if (ukazTym && TYM_NAZEV[z.tym]) info.push('<span class="fixture__tym">' + IKONA_DRES + esc(TYM_NAZEV[z.tym]) + '</span>');
    info.push('<span>' + IKONA_CAS + esc(turnaj ? TYP_NAZEV.turnaj : soutezZapasu(z)) + '</span>');
    info.push('<span>' + IKONA_MISTO + esc(z.misto) + '</span>');
    if (turnaj && z.souper) info.push('<span class="fixture__ucast">Hrají: ' + esc(z.souper) + '</span>');

    return '<article class="' + cls.join(' ') + '">' +
      '<div class="fixture__date">' +
        '<span class="fixture__day">' + d.getDate() + '.</span>' +
        '<span class="fixture__mon">' + MESICE[d.getMonth()] + ' ' + d.getFullYear() + '</span>' +
      '</div>' +
      '<div class="fixture__main">' +
        '<div class="fixture__teams">' + tymy + '</div>' +
        '<div class="fixture__info">' + info.join('') + '</div>' +
      '</div>' +
      '<div class="fixture__right">' + vpravo + badge + '</div>' +
    '</article>';
  }

  /* Filtr na stránce Zápasy: mužstvo (včetně podkategorií, 'zaci' bere
     i 'zaci-u15'), případně typ zápasu */
  function sediFiltr(z, filtr) {
    if (!filtr || filtr === 'vse') return true;
    return z.typ === filtr || tymSedi(z.tym, filtr);
  }

  /* Rozpis na stránce Zápasy: nahoře nadcházející (od nejbližšího),
     pod nimi odehrané (od posledního) */
  function initFixtureList() {
    var host = $('#fixture-list');
    if (!host) return;

    /* Skupina ukáže prvních pár zápasů, zbytek schová za tlačítko */
    function skupina(nadpis, polozky, limit) {
      var vice = polozky.length > limit + 2 ? polozky.slice(limit) : [];
      var hlavni = vice.length ? polozky.slice(0, limit) : polozky;
      return '<div class="fixgroup">' +
        '<h3 class="fixgroup__h">' + nadpis + ' <span>' + polozky.length + '</span></h3>' +
        '<div class="fixtures">' + hlavni.join('') + '</div>' +
        (vice.length
          ? '<div class="fixtures fixgroup__vice" hidden>' + vice.join('') + '</div>' +
            '<button class="link-arrow fixgroup__btn" type="button" aria-expanded="false">' +
              '<span>Zobrazit všechny (' + polozky.length + ')</span>' + IKONA_DOLU + '</button>'
          : '') +
      '</div>';
    }

    /* Posluchač patří k obalu, který překreslení přežije, proto jen poprvé */
    if (!host.hasAttribute('data-vazano')) {
      host.setAttribute('data-vazano', '');
      host.addEventListener('click', function (e) {
        var btn = e.target.closest('.fixgroup__btn');
        if (!btn) return;
        var box = btn.previousElementSibling;
        var otevrit = box.hidden;
        box.hidden = !otevrit;
        btn.setAttribute('aria-expanded', otevrit ? 'true' : 'false');
        btn.querySelector('span').textContent = otevrit
          ? 'Zobrazit méně'
          : 'Zobrazit všechny (' + btn.closest('.fixgroup').querySelectorAll('.fixture').length + ')';
      });
    }

    function render(filtr) {
      var now = Date.now();
      var data = ZAPASY.filter(function (z) { return sediFiltr(z, filtr); });
      /* Zápas je "nadcházející" ještě dvě hodiny po výkopu, pokud nemá skóre */
      var jeBudouci = function (z) {
        return !z.skore && parseDatum(z.datum).getTime() > now - 2 * 3600 * 1000;
      };
      var budouci = data.filter(jeBudouci)
        .sort(function (a, b) { return parseDatum(a.datum) - parseDatum(b.datum); });
      var odehrane = data.filter(function (z) { return !jeBudouci(z); })
        .sort(function (a, b) { return parseDatum(b.datum) - parseDatum(a.datum); });

      if (!data.length) {
        host.innerHTML = '<p class="sec-lead">Rozpis tohoto mužstva zatím nemáme. Kompletní '
          + 'rozlosování najdete v tabulkách na Fotbal.cz níže.</p>';
        return;
      }

      /* Popisek mužstva jen tam, kde záložka zahrnuje víc kategorií */
      var vicTymu = filtr !== 'A' && filtr !== 'B';
      var html = function (z) { return fixtureHtml(z, now, vicTymu); };
      host.innerHTML =
        (budouci.length ? skupina('Nadcházející', budouci.map(html), 6) : '') +
        (odehrane.length ? skupina('Odehrané výsledky', odehrane.map(html), 8) : '');
    }

    var tlacitka = $$('[data-filter]');

    /* Počet zápasů v záložce */
    tlacitka.forEach(function (btn) {
      var klic = btn.getAttribute('data-filter');
      var n = ZAPASY.filter(function (z) { return sediFiltr(z, klic); }).length;
      btn.insertAdjacentHTML('beforeend', ' <span class="tab__n">' + n + '</span>');
    });

    function vyber(btn, zapsat) {
      tlacitka.forEach(function (b) {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      render(btn.getAttribute('data-filter'));
      var kotva = btn.getAttribute('data-kotva');
      if (zapsat && kotva && window.history && history.replaceState) {
        history.replaceState(null, '', '#' + kotva);
      }
    }

    tlacitka.forEach(function (btn) {
      btn.addEventListener('click', function () { vyber(btn, true); });
    });

    /* zapasy.html#muzi-b rovnou otevře béčko */
    var zAdresy = location.hash.slice(1);
    var start = tlacitka.filter(function (b) { return b.getAttribute('data-kotva') === zAdresy; })[0]
      || tlacitka.filter(function (b) { return b.classList.contains('is-active'); })[0]
      || tlacitka[0];
    if (start) vyber(start, false);
    else render('vse');
  }

  /* ------------------------------------------------------------------------
     6. MARQUEE PARTNERŮ
     ---------------------------------------------------------------------- */
  function initMarquee() {
    $$('.marquee__track').forEach(function (track) {
      if (track.dataset.cloned === '1') return;
      track.innerHTML += track.innerHTML;
      track.dataset.cloned = '1';
    });
  }

  /* ------------------------------------------------------------------------
     7. FORMULÁŘE
     ---------------------------------------------------------------------- */
  function initForms() {
    $$('form[data-mailto]').forEach(function (form) {
      var note = form.querySelector('.form__note');

      function setErr(field, on, msg) {
        var wrap = field.closest('.field');
        if (!wrap) return;
        wrap.classList.toggle('has-error', on);
        var err = wrap.querySelector('.field__err');
        if (err && msg) err.textContent = msg;
        field.setAttribute('aria-invalid', on ? 'true' : 'false');
      }

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = true;
        var prvni = null;

        $$('[required]', form).forEach(function (f) {
          var val = (f.type === 'checkbox') ? f.checked : f.value.trim();
          var bad = !val;
          if (!bad && f.type === 'email') {
            bad = !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(f.value.trim());
          }
          setErr(f, bad, f.type === 'email' ? 'Zadejte platný e-mail.' : 'Toto pole je povinné.');
          if (bad) { ok = false; if (!prvni) prvni = f; }
        });

        if (!ok) {
          if (note) { note.className = 'form__note is-bad'; note.textContent = 'Zkontrolujte prosím zvýrazněná pole.'; }
          if (prvni) prvni.focus();
          return;
        }

        var to = form.getAttribute('data-mailto');
        var predmet = form.getAttribute('data-subject') || 'Zpráva z webu FC Hlinsko';
        var radky = [];

        $$('input, select, textarea', form).forEach(function (f) {
          if (f.type === 'checkbox' || !f.name) return;
          var lab = form.querySelector('label[for="' + f.id + '"]');
          var popis = lab ? lab.textContent.replace('*', '').trim() : f.name;
          radky.push(popis + ': ' + f.value.trim());
        });

        window.location.href = 'mailto:' + to +
          '?subject=' + encodeURIComponent(predmet) +
          '&body=' + encodeURIComponent(radky.join('\n') + '\n\nOdesláno z webu fchlinsko.cz');

        if (note) {
          note.className = 'form__note is-ok';
          note.textContent = 'Otevíráme váš e-mailový klient s předvyplněnou zprávou. Pokud se nic nestalo, napište nám přímo na ' + to + '.';
        }
      });

      $$('[required]', form).forEach(function (f) {
        f.addEventListener('input', function () {
          var wrap = f.closest('.field');
          if (wrap && wrap.classList.contains('has-error')) setErr(f, false);
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     8. LIGHTBOX PRO FOTKY MUŽSTEV
     ---------------------------------------------------------------------- */
  function initLightbox() {
    var spousteci = $$('.teamphoto[data-full]');
    if (!spousteci.length) return;

    var box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Fotografie mužstva');
    box.innerHTML =
      '<button class="lightbox__close" type="button" aria-label="Zavřít fotografii">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
      '</button>' +
      '<div><img class="lightbox__img" alt=""><p class="lightbox__cap"></p></div>';
    document.body.appendChild(box);

    var img = box.querySelector('.lightbox__img');
    var cap = box.querySelector('.lightbox__cap');
    var zavrit = box.querySelector('.lightbox__close');
    var posledni = null;

    function otevri(el) {
      posledni = el;
      img.src = el.getAttribute('data-full');
      img.alt = el.getAttribute('data-popis') || '';
      cap.textContent = el.getAttribute('data-popis') || '';
      box.classList.add('is-on');
      document.body.classList.add('is-locked');
      zavrit.focus();
    }

    function zavri() {
      box.classList.remove('is-on');
      document.body.classList.remove('is-locked');
      if (posledni) posledni.focus();
    }

    spousteci.forEach(function (el) {
      el.addEventListener('click', function (e) { e.preventDefault(); otevri(el); });
    });

    zavrit.addEventListener('click', zavri);
    box.addEventListener('click', function (e) { if (e.target === box) zavri(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && box.classList.contains('is-on')) zavri();
    });
  }

  /* ------------------------------------------------------------------------
     9. TABULKA SOUTĚŽE MUŽŮ A
     ------------------------------------------------------------------------
     Opisuje se ručně z Fotbal.cz nebo fotbalunas.cz po každém kole.
     Řádek s tym: 'FC Hlinsko' se sám zvýrazní. Zůstane-li pole prázdné,
     panel s tabulkou se vůbec nezobrazí.

     Nezapomeňte pak aktualizovat i datum v TABULKA_AKTUALIZOVANO.
     ---------------------------------------------------------------------- */
  var TABULKA = [
    { poradi: 1,  tym: 'FK Přepeře',                z: 7, v: 6, r: 0, p: 1, skore: '24:8',  b: 18 },
    { poradi: 2,  tym: 'SK Vysoké Mýto',            z: 7, v: 5, r: 2, p: 0, skore: '24:12', b: 17 },
    { poradi: 3,  tym: 'SK Kosmonosy',              z: 7, v: 5, r: 1, p: 1, skore: '23:10', b: 16 },
    { poradi: 4,  tym: 'TJ Jiskra Ústí nad Orlicí', z: 7, v: 4, r: 2, p: 1, skore: '16:7',  b: 14 },
    { poradi: 5,  tym: 'FC Hlinsko',                z: 7, v: 4, r: 1, p: 2, skore: '14:11', b: 13 },
    { poradi: 6,  tym: 'SK Sparta Kolín',           z: 7, v: 3, r: 3, p: 1, skore: '13:12', b: 12 },
    { poradi: 7,  tym: 'FK Čechie Vykáň',           z: 6, v: 3, r: 1, p: 2, skore: '16:9',  b: 10 },
    { poradi: 8,  tym: 'FK Turnov',                 z: 7, v: 3, r: 1, p: 3, skore: '17:14', b: 10 },
    { poradi: 9,  tym: 'MFK Trutnov',               z: 7, v: 3, r: 1, p: 3, skore: '12:10', b: 10 },
    { poradi: 10, tym: 'FK Chlumec nad Cidlinou',   z: 7, v: 3, r: 1, p: 3, skore: '12:13', b: 10 },
    { poradi: 11, tym: 'TJ Dvůr Králové nad Labem', z: 7, v: 2, r: 1, p: 4, skore: '8:11',  b: 7 },
    { poradi: 12, tym: 'FC Slavia Hradec Králové',  z: 6, v: 2, r: 1, p: 3, skore: '11:15', b: 7 },
    { poradi: 13, tym: 'Spartak Police nad Metují', z: 7, v: 2, r: 0, p: 5, skore: '10:17', b: 6 },
    { poradi: 14, tym: 'TJ Svitavy',                z: 7, v: 1, r: 2, p: 4, skore: '6:14',  b: 5 },
    { poradi: 15, tym: 'MFK Chrudim B',             z: 7, v: 0, r: 1, p: 6, skore: '10:33', b: 1 },
    { poradi: 16, tym: 'FK Letohrad',               z: 7, v: 0, r: 0, p: 7, skore: '8:28',  b: 0 }
  ];
  var TABULKA_AKTUALIZOVANO = '21. 9. 2026';

  var IKONA_SIPKA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" '
    + 'aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var IKONA_DOLU = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" '
    + 'aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';

  function initTable() {
    $$('[data-tabulka]').forEach(function (host) {
      if (!TABULKA.length) {
        var panel = host.closest('.apanel');
        (panel || host).remove();
        return;
      }

      /* Ve sbaleném stavu je vidět jen okno řádků kolem Hlinska */
      var okno = parseInt(host.getAttribute('data-okno'), 10) || 0;
      var nas = 0;
      TABULKA.forEach(function (t, i) { if (t.tym === 'FC Hlinsko') nas = i; });
      var od = 0;
      var sbalit = okno > 0 && okno < TABULKA.length;
      if (sbalit) {
        od = Math.max(0, Math.min(nas - Math.floor(okno / 2), TABULKA.length - okno));
      }

      var radky = TABULKA.map(function (t, i) {
        var cls = [];
        if (t.tym === 'FC Hlinsko') cls.push('is-us');
        if (sbalit && (i < od || i >= od + okno)) cls.push('is-extra');
        return '<tr' + (cls.length ? ' class="' + cls.join(' ') + '"' : '') + '>' +
          '<td class="c-pos">' + esc(t.poradi) + '.</td>' +
          '<th class="c-team" scope="row">' + esc(t.tym) + '</th>' +
          '<td>' + esc(t.z) + '</td>' +
          '<td class="c-opt">' + esc(t.v) + '</td>' +
          '<td class="c-opt">' + esc(t.r) + '</td>' +
          '<td class="c-opt">' + esc(t.p) + '</td>' +
          '<td class="c-score">' + esc(t.skore) + '</td>' +
          '<td class="c-pts">' + esc(t.b) + '</td>' +
        '</tr>';
      }).join('');

      host.innerHTML =
        '<div class="ltable-wrap">' +
          '<table class="ltable' + (sbalit ? ' is-collapsed' : '') + '">' +
            '<caption class="sr-only">Průběžná tabulka soutěže, stav k ' + esc(TABULKA_AKTUALIZOVANO) + '</caption>' +
            '<thead><tr>' +
              '<th scope="col" class="c-pos"><abbr title="Pořadí">#</abbr></th>' +
              '<th scope="col" class="c-team">Tým</th>' +
              '<th scope="col"><abbr title="Zápasy">Z</abbr></th>' +
              '<th scope="col" class="c-opt"><abbr title="Výhry">V</abbr></th>' +
              '<th scope="col" class="c-opt"><abbr title="Remízy">R</abbr></th>' +
              '<th scope="col" class="c-opt"><abbr title="Prohry">P</abbr></th>' +
              '<th scope="col" class="c-score">Skóre</th>' +
              '<th scope="col" class="c-pts"><abbr title="Body">B</abbr></th>' +
            '</tr></thead>' +
            '<tbody>' + radky + '</tbody>' +
          '</table>' +
        '</div>' +
        '<div class="apanel__foot">' +
          (sbalit
            ? '<button class="link-arrow ltable-toggle" type="button" aria-expanded="false">'
              + '<span>Celá tabulka</span>' + IKONA_DOLU + '</button>'
            : '') +
          (TABULKA_AKTUALIZOVANO ? '<span class="apanel__note">Stav k ' + esc(TABULKA_AKTUALIZOVANO) + '</span>' : '') +
        '</div>';

      var btn = $('.ltable-toggle', host);
      var tbl = $('.ltable', host);
      /* Panely vedle sebe drží stejnou výšku jen ve sbaleném stavu */
      var mrizka = host.closest('.ateam__data, .data-grid');
      if (btn && tbl) {
        btn.addEventListener('click', function () {
          var zavreno = tbl.classList.toggle('is-collapsed');
          btn.setAttribute('aria-expanded', zavreno ? 'false' : 'true');
          btn.querySelector('span').textContent = zavreno ? 'Celá tabulka' : 'Sbalit tabulku';
          if (mrizka) mrizka.classList.toggle('is-open', !zavreno);
        });
      }
    });
  }

  /* ------------------------------------------------------------------------
     9b. VÝSLEDKY, FORMA A ZÁPASY V HERU
     ---------------------------------------------------------------------- */
  var DNY = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'];
  var VYSLEDEK = {
    v: { nazev: 'Výhra', zkratka: 'V' },
    r: { nazev: 'Remíza', zkratka: 'R' },
    p: { nazev: 'Prohra', zkratka: 'P' }
  };

  /* Výsledek z pohledu Hlinska: 'v', 'r', 'p', nebo null když se nehrálo */
  function vysledek(z) {
    var m = /^\s*(\d+)\s*:\s*(\d+)\s*$/.exec(String(z.skore || ''));
    if (!m) return null;
    var nase = z.domaci ? +m[1] : +m[2];
    var jejich = z.domaci ? +m[2] : +m[1];
    return nase > jejich ? 'v' : (nase < jejich ? 'p' : 'r');
  }

  function zapasyTymu(klic) {
    return ZAPASY
      .filter(function (z) { return tymSedi(z.tym, klic); })
      .sort(function (a, b) { return parseDatum(a.datum) - parseDatum(b.datum); });
  }

  function datumKratce(d) {
    return DNY[d.getDay()] + ' ' + d.getDate() + '. ' + (d.getMonth() + 1) + '.';
  }

  function cas(d) { return pad(d.getHours()) + ':' + pad(d.getMinutes()); }

  /* Kolik dní zbývá do zápasu, česky */
  function zaKolik(d, now) {
    if (d.getTime() <= now) return 'Právě se hraje';
    var dnes = new Date(now); dnes.setHours(0, 0, 0, 0);
    var den = new Date(d.getTime()); den.setHours(0, 0, 0, 0);
    var n = Math.round((den - dnes) / 86400000);
    if (n <= 0) return 'Dnes';
    if (n === 1) return 'Zítra';
    return 'Za ' + n + (n <= 4 ? ' dny' : ' dní');
  }

  /* Soupeř bez znaku dostane kolečko se zkratkou */
  function zkratka(nazev) {
    var slovo = String(nazev).replace(/[^A-Za-zÀ-ž]+/g, ' ').trim().split(' ')[0] || '?';
    return slovo.slice(0, 3).toUpperCase();
  }

  function tymLogo(nazev) {
    if (nazev === 'FC Hlinsko') {
      return '<span class="tlogo tlogo--nas"><img src="images/znak-fchlinsko.png" alt="" width="220" height="290"></span>';
    }
    return '<span class="tlogo" aria-hidden="true">' + esc(zkratka(nazev)) + '</span>';
  }

  function soutezZapasu(z) {
    var nazev = z.soutez
      || (z.typ === 'liga' ? (SOUTEZE[z.tym] || TYP_NAZEV.liga) : (TYP_NAZEV[z.typ] || ''));
    return nazev + (z.kolo ? ' · ' + z.kolo + '. kolo' : '');
  }

  /* Polovina zápasového pruhu v heru: nadpis s údaji vlevo, zápas vpravo */
  function heroKarta(z, posledni, now) {
    var d = parseDatum(z.datum);
    var dom = z.domaci ? 'FC Hlinsko' : z.souper;
    var hos = z.domaci ? z.souper : 'FC Hlinsko';
    var v = posledni ? vysledek(z) : null;
    var skore = v ? String(z.skore).replace(/\s/g, '').split(':') : null;

    var stred = v
      ? '<span class="hm__score"><span class="sr-only">Skóre </span>' + esc(skore[0])
        + '<i aria-hidden="true">:</i><span class="sr-only"> : </span>' + esc(skore[1]) + '</span>'
        + '<span class="hm__res hm__res--' + v + '">' + VYSLEDEK[v].nazev + '</span>'
      : '<span class="hm__date">' + datumKratce(d) + '</span>'
        + '<span class="hm__score">' + cas(d) + '</span>'
        + '<span class="hm__when">' + esc(zaKolik(d, now)) + '</span>';

    /* Místo se na mobilu schová, aby se údaje vešly na jeden řádek */
    var meta = posledni
      ? esc(soutezZapasu(z) + ' · ' + datumKratce(d))
      : esc(soutezZapasu(z)) + '<span class="hm__misto"> · ' + esc(z.misto) + '</span>';

    /* Domácí: znak a jméno k výsledku, hosté: jméno a znak od výsledku */
    var tym = function (n, strana) {
      var jmeno = '<span class="hm__name">' + esc(n) + '</span>';
      return '<span class="hm__team hm__team--' + strana + (n === 'FC Hlinsko' ? ' is-us' : '') + '">' +
        (strana === 'dom' ? tymLogo(n) + jmeno : jmeno + tymLogo(n)) + '</span>';
    };

    /* Na konci je štítek s šipkou, aby bylo na první pohled vidět,
       že se celý zápas dá rozkliknout */
    var go = '<span class="hm__go">' + (posledni ? 'Výsledky' : 'Rozpis')
      + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" '
      + 'aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>';

    /* Třída podle výsledku obarví podsvícení karty při najetí:
       výhra zeleně, prohra červeně, remíza neutrálně */
    return '<a class="hm' + (posledni ? ' hm--last hm--' + v : ' hm--next') + '" href="'
      + (posledni ? 'tym-muzi-a.html#vysledky' : 'zapasy.html#muzi-a') + '">' +
      '<span class="hm__head">' +
        '<span class="hm__label">' + (posledni ? 'Poslední zápas' : 'Příští zápas') + '</span>' +
        '<span class="hm__meta">' + meta + '</span>' +
        go +
      '</span>' +
      '<span class="hm__match">' + tym(dom, 'dom') + '<span class="hm__center">' + stred + '</span>' + tym(hos, 'hos') + '</span>' +
    '</a>';
  }

  function initHeroZapasy() {
    var host = $('[data-hero-zapasy]');
    if (!host) return;
    var klic = host.getAttribute('data-hero-zapasy') || 'A';
    var now = Date.now();
    var vse = zapasyTymu(klic);

    var odehrane = vse.filter(function (z) { return vysledek(z); });
    var posledni = odehrane[odehrane.length - 1];
    /* Příští = první bez skóre, který nezačal před víc než dvěma hodinami */
    var dalsi = vse.filter(function (z) {
      return !z.skore && parseDatum(z.datum).getTime() > now - 2 * 3600 * 1000;
    })[0];

    if (!posledni && !dalsi) {
      var pruh = host.closest('.hero__bar');
      (pruh || host).remove();
      return;
    }

    /* Mezi oběma zápasy půlicí čára se středovým kruhem */
    host.innerHTML = (posledni ? heroKarta(posledni, true, now) : '') +
      (posledni && dalsi ? '<span class="hbar__line" aria-hidden="true"></span>' : '') +
      (dalsi ? heroKarta(dalsi, false, now) : '');
    if (!(posledni && dalsi)) host.classList.add('is-single');
  }

  function initVysledky() {
    $$('[data-vysledky]').forEach(function (host) {
      var klic = host.getAttribute('data-vysledky');
      var limit = parseInt(host.getAttribute('data-limit'), 10) || 5;
      var data = zapasyTymu(klic).filter(function (z) { return vysledek(z); }).slice(-limit);

      /* Forma z posledních pěti: nejstarší vlevo, poslední zápas vpravo */
      var forma = $('[data-forma="' + klic + '"]', host.closest('.apanel') || document);
      if (forma) {
        forma.innerHTML = data.length
          ? '<span class="forma__k">Forma</span>' + data.slice(-5).map(function (z) {
              var v = vysledek(z);
              return '<span class="fm fm--' + v + '" title="' + VYSLEDEK[v].nazev + ', ' + esc(z.souper) + '">'
                + VYSLEDEK[v].zkratka + '</span>';
            }).join('')
          : '';
      }

      if (!data.length) {
        host.innerHTML = '<p class="apanel__empty">Výsledky se tu objeví po prvním odehraném zápase.</p>';
        return;
      }

      host.innerHTML = '<ol class="results">' + data.reverse().map(function (z) {
        var d = parseDatum(z.datum);
        var v = vysledek(z);
        var dom = z.domaci ? 'FC Hlinsko' : z.souper;
        var hos = z.domaci ? z.souper : 'FC Hlinsko';
        var jmeno = function (n, strana) {
          return '<span class="rrow__team rrow__team--' + strana + (n === 'FC Hlinsko' ? ' is-us' : '') + '">' + esc(n) + '</span>';
        };
        return '<li class="rrow">' +
          '<span class="rrow__date"><b>' + d.getDate() + '. ' + (d.getMonth() + 1) + '.</b>' + DNY[d.getDay()] + '</span>' +
          jmeno(dom, 'dom') +
          '<span class="rrow__score">' + esc(String(z.skore).replace(/\s/g, '')) + '</span>' +
          jmeno(hos, 'hos') +
          '<span class="fm fm--' + v + '" title="' + VYSLEDEK[v].nazev + '">' + VYSLEDEK[v].zkratka + '</span>' +
        '</li>';
      }).join('') + '</ol>';
    });
  }

  /* ------------------------------------------------------------------------
     9c. NAROZENINY
     ---------------------------------------------------------------------- */
  function slovoRok(n) { return n === 1 ? 'rok' : (n >= 2 && n <= 4 ? 'roky' : 'let'); }

  function initNarozeniny() {
    $$('[data-narozeniny]').forEach(function (host) {
      var zpet = parseInt(host.getAttribute('data-dni-zpet'), 10);
      var dopredu = parseInt(host.getAttribute('data-dni-dopredu'), 10);
      var limit = parseInt(host.getAttribute('data-limit'), 10) || 8;
      if (isNaN(zpet)) zpet = 7;
      if (isNaN(dopredu)) dopredu = 30;

      var dnes = new Date(); dnes.setHours(0, 0, 0, 0);
      var vyber = [];

      NAROZENINY.forEach(function (n) {
        var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(n.datum);
        if (!m) return;
        /* Letošní, loňské i příští narozeniny, kvůli přelomu roku */
        [-1, 0, 1].forEach(function (posun) {
          var rok = dnes.getFullYear() + posun;
          var d = new Date(rok, +m[2] - 1, +m[3]);
          var rozdil = Math.round((d - dnes) / 86400000);
          if (rozdil >= -zpet && rozdil <= dopredu) {
            vyber.push({ n: n, d: d, rozdil: rozdil, vek: rok - (+m[1]) });
          }
        });
      });

      vyber.sort(function (a, b) { return a.rozdil - b.rozdil; });
      /* Když je jich moc, jako první odpadnou ti, kdo už slavili */
      while (vyber.length > limit && vyber[0].rozdil < 0) vyber.shift();
      vyber = vyber.slice(0, limit);

      if (!vyber.length) {
        var sekce = host.closest('section');
        if (sekce) sekce.hidden = true;
        return;
      }

      host.innerHTML = vyber.map(function (x, i) {
        var r = x.rozdil;
        var kdy = r === 0 ? 'Dnes slaví'
          : r === 1 ? 'Zítra'
          : r === -1 ? 'Včera'
          : r > 0 ? 'Za ' + r + (r <= 4 ? ' dny' : ' dní')
          : 'Před ' + (-r) + ' dny';
        var cls = 'bday reveal' + (r === 0 ? ' is-today' : '') + (r < 0 ? ' is-past' : '');
        return '<article class="' + cls + '" data-d="' + ((i % 4) + 1) + '">' +
          '<div class="bday__date"><span class="bday__day">' + x.d.getDate() + '.</span>' +
            '<span class="bday__mon">' + MESICE_DLOUHE[x.d.getMonth()] + '</span></div>' +
          '<div class="bday__body">' +
            '<span class="bday__when">' + kdy + '</span>' +
            '<h3 class="bday__name">' + esc(x.n.jmeno) + '</h3>' +
            '<p class="bday__meta">' + esc(x.n.tym) +
              (x.vek > 0 ? '<span aria-hidden="true"> · </span><b>' + x.vek + ' ' + slovoRok(x.vek) + '</b>' : '') +
            '</p>' +
          '</div>' +
        '</article>';
      }).join('');
    });
  }

  /* ------------------------------------------------------------------------
     9d. PARTNEŘI PODLE ÚROVNĚ
     ---------------------------------------------------------------------- */
  /* Kopie loga v karuselu jsou jen na oko, čtečky a Tab je přeskočí */
  function logoPartnera(p, kopie, lina) {
    var img = '<img src="' + esc(p.logo) + '" alt="' + (kopie ? '' : esc(p.nazev)) + '"'
      + (lina ? ' loading="lazy"' : '') + ' decoding="async">';
    var skryt = kopie ? ' aria-hidden="true" tabindex="-1"' : '';
    return p.web
      ? '<a class="plogo" href="' + esc(p.web) + '" target="_blank" rel="noopener"' + skryt + '>' + img + '</a>'
      : '<span class="plogo"' + (kopie ? ' aria-hidden="true"' : '') + '>' + img + '</span>';
  }

  /* data-partneri="karusel": každá úroveň je nekonečný běžící pás.
     Sada log se opakuje, dokud je jich aspoň MIN, aby i jediný generální
     partner vyplnil celou šířku a jezdil dokola. */
  var KARUSEL_MIN = { generalni: 4, hlavni: 8, partner: 12 };
  var KARUSEL_RYCHLOST = { generalni: 28, hlavni: 38, partner: 42 };   /* px za sekundu */

  /* Nabídka na místě úrovně, kterou zatím nikdo nemá obsazenou */
  function volnaPozice(u) {
    if (!VOLNA_POZICE || VOLNA_POZICE.uroven !== u.klic) return '';
    return '<div class="ptier ptier--volna reveal">' +
      '<h3 class="ptier__h"><span>' + esc(u.jeden) + '</span></h3>' +
      '<a class="pfree" href="' + esc(VOLNA_POZICE.odkaz) + '">' +
        '<span class="pfree__ramec" aria-hidden="true">' +
          '<img src="images/znak-fchlinsko.png" alt="" width="220" height="290" loading="lazy">' +
          '<b>Volné místo</b>' +
        '</span>' +
        '<span class="pfree__text">' +
          '<span class="pfree__h">' + esc(VOLNA_POZICE.titulek) + '</span>' +
          '<span class="pfree__p">' + esc(VOLNA_POZICE.text) + '</span>' +
          '<span class="pfree__body">' + VOLNA_POZICE.body.map(function (b) {
            return '<span>' + esc(b) + '</span>';
          }).join('') + '</span>' +
          '<span class="pfree__cta">' + esc(VOLNA_POZICE.odkazText) +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" ' +
            'aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
          '</span>' +
        '</span>' +
      '</a></div>';
  }

  function initPartneri() {
    $$('[data-partneri]').forEach(function (host) {
      var karusel = host.getAttribute('data-partneri') === 'karusel' && !reduceMotion;

      host.innerHTML = UROVNE_PARTNERU.map(function (u, i) {
        var seznam = PARTNERI.filter(function (p) { return p.uroven === u.klic; });
        /* Prázdná úroveň: buď nabídka volného místa, nebo se vynechá */
        if (!seznam.length) return volnaPozice(u);
        var hlava = '<h3 class="ptier__h"><span>' + (seznam.length > 1 ? u.vice : u.jeden) + '</span></h3>';

        if (!karusel) {
          return '<div class="ptier ptier--' + u.klic + ' reveal" data-d="' + (i + 1) + '">' + hlava +
            '<div class="ptier__grid">' + seznam.map(function (p) {
              return logoPartnera(p, false, true);
            }).join('') + '</div></div>';
        }

        var sada = [];
        while (sada.length < (KARUSEL_MIN[u.klic] || 10)) sada = sada.concat(seznam);
        /* Dvě stejné poloviny, animace posouvá pás přesně o jednu z nich */
        var polozky = sada.concat(sada).map(function (p, j) {
          return logoPartnera(p, j >= seznam.length, false);
        }).join('');

        return '<div class="ptier ptier--' + u.klic + ' reveal" data-d="' + (i + 1) + '">' + hlava +
          '<div class="marquee ptier__pas' + (i % 2 ? ' marquee--rev' : '') + '">' +
            '<div class="marquee__track" data-cloned="1" data-rychlost="' + (KARUSEL_RYCHLOST[u.klic] || 40) + '">' +
              polozky +
            '</div>' +
          '</div></div>';
      }).join('');

      /* Stejná rychlost pohybu bez ohledu na počet log */
      $$('.ptier__pas .marquee__track', host).forEach(function (track) {
        var pul = track.scrollWidth / 2;
        var rychlost = parseFloat(track.getAttribute('data-rychlost')) || 40;
        if (pul > 0) track.style.animationDuration = Math.round(pul / rychlost) + 's';
      });
    });
  }

  /* ------------------------------------------------------------------------
     9f. KALENDÁŘ (kalendar.html)
     ------------------------------------------------------------------------
     Měsíc s tréninky (TRENINKY) a zápasy (ZAPASY). Na počítači mřížka
     s popisky a vedle program vybraného dne, na mobilu mřížka s tečkami
     a program dne pod ní.
     ---------------------------------------------------------------------- */
  var MESICE_NOM = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
                    'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];
  var DNY_DLOUHE = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];

  function ymd(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function denTydne(d) { return (d.getDay() + 6) % 7 + 1; }   /* 1 = pondělí */
  function slovoAkce(n) { return n === 1 ? 'událost' : (n >= 2 && n <= 4 ? 'události' : 'událostí'); }

  /* Všechny události v rozsahu dnů, rozdělené podle data 'RRRR-MM-DD' */
  function kalAkce(od, doDne, filtr, typy) {
    var mapa = {};
    var pridej = function (k, a) { (mapa[k] = mapa[k] || []).push(a); };
    var sedi = function (tym) { return filtr === 'vse' || tymSedi(tym, filtr); };

    if (typy.zapasy) {
      ZAPASY.forEach(function (z) {
        var d = parseDatum(z.datum);
        if (d < od || d > doDne || !sedi(z.tym)) return;
        var turnaj = z.typ === 'turnaj';
        var dom = z.domaci ? 'FC Hlinsko' : z.souper;
        var hos = z.domaci ? z.souper : 'FC Hlinsko';
        pridej(ymd(d), {
          cas: cas(d),
          trida: (z.typ === 'pohar' || turnaj) ? 'pohar' : (z.domaci ? 'doma' : 'venku'),
          kratce: (TYM_ZKR[z.tym] || '') + ' · ' + (turnaj ? (z.nazev || 'Turnaj') : z.souper),
          typ: (turnaj ? 'Turnaj' : 'Zápas') + ' · ' + (TYM_NAZEV[z.tym] || '')
            + (turnaj ? '' : ' · ' + soutezZapasu(z)),
          nazev: turnaj ? (z.nazev || 'Turnaj') : dom + ' – ' + hos,
          misto: z.misto + (turnaj && z.souper ? ' · hrají ' + z.souper : ''),
          stav: z.skore || (turnaj ? '' : (z.domaci ? 'Doma' : 'Venku'))
        });
      });
    }

    if (typy.treninky) {
      var obdOd = parseDatum(TRENINKY_OBDOBI.od + 'T00:00');
      var obdDo = parseDatum(TRENINKY_OBDOBI.do + 'T23:59');
      for (var d = new Date(od.getTime()); d <= doDne; d.setDate(d.getDate() + 1)) {
        var k = ymd(d);
        if (d < obdOd || d > obdDo || VOLNO.indexOf(k) >= 0) continue;
        var dt = denTydne(d);
        TRENINKY.forEach(function (t) {
          if (t.dny.indexOf(dt) < 0 || !sedi(t.tym)) return;
          pridej(k, {
            cas: t.od, konec: t.do, trida: 'trenink',
            kratce: 'Trénink ' + (TYM_ZKR[t.tym] || ''),
            typ: 'Trénink',
            nazev: TYM_NAZEV[t.tym] || t.tym,
            misto: t.misto, stav: ''
          });
        });
      }
    }

    Object.keys(mapa).forEach(function (k) {
      mapa[k].sort(function (a, b) { return a.cas < b.cas ? -1 : (a.cas > b.cas ? 1 : 0); });
    });
    return mapa;
  }

  function initKalendar() {
    var box = $('[data-kalendar]');
    if (!box) return;

    var mrizka = $('[data-kal-mrizka]', box);
    var panel = $('[data-kal-den]', box);
    var nadpis = $('[data-kal-mesic]', box);
    var dnes = new Date(); dnes.setHours(0, 0, 0, 0);
    var dnesKlic = ymd(dnes);

    var rok = dnes.getFullYear();
    var mesic = dnes.getMonth();
    var filtr = 'vse';
    var typy = { zapasy: true, treninky: true };
    var vybrany = null;
    var akce = {};

    function vychoziDen() {
      if (dnes.getFullYear() === rok && dnes.getMonth() === mesic) return dnesKlic;
      var posl = new Date(rok, mesic + 1, 0).getDate();
      for (var i = 1; i <= posl; i++) {
        var k = ymd(new Date(rok, mesic, i));
        if (akce[k]) return k;
      }
      return ymd(new Date(rok, mesic, 1));
    }

    function chipy(seznam) {
      var zapasy = seznam.filter(function (a) { return a.trida !== 'trenink'; });
      var treninky = seznam.filter(function (a) { return a.trida === 'trenink'; });
      var polozky = zapasy.map(function (a) {
        return '<span class="kchip kchip--' + a.trida + '"><b>' + esc(a.cas) + '</b>' + esc(a.kratce) + '</span>';
      });
      /* Víc než dva tréninky za den se sloučí do jednoho řádku */
      if (treninky.length > 2) {
        polozky.push('<span class="kchip kchip--trenink"><b>' + esc(treninky[0].cas) + '</b>Tréninky (' + treninky.length + ')</span>');
      } else {
        treninky.forEach(function (a) {
          polozky.push('<span class="kchip kchip--trenink"><b>' + esc(a.cas) + '</b>' + esc(a.kratce) + '</span>');
        });
      }
      if (polozky.length > 3) {
        var zbytek = polozky.length - 2;
        polozky = polozky.slice(0, 2).concat('<span class="kchip kchip--vic">+ ' + zbytek + ' další</span>');
      }
      return polozky.join('');
    }

    function tecky(seznam) {
      var tridy = [];
      seznam.forEach(function (a) { if (tridy.indexOf(a.trida) < 0) tridy.push(a.trida); });
      return tridy.map(function (t) { return '<i class="kdot kdot--' + t + '"></i>'; }).join('');
    }

    function renderDen() {
      var c = vybrany.split('-');
      var d = new Date(+c[0], +c[1] - 1, +c[2]);
      var seznam = akce[vybrany] || [];
      var jeDnes = vybrany === dnesKlic;

      var obsah = seznam.length
        ? '<ul class="kal__list">' + seznam.map(function (a) {
            return '<li class="kitem kitem--' + a.trida + '">' +
              '<span class="kitem__cas">' + esc(a.cas) + (a.konec ? '<small>do ' + esc(a.konec) + '</small>' : '') + '</span>' +
              '<span class="kitem__txt">' +
                '<span class="kitem__typ">' + esc(a.typ) + '</span>' +
                '<strong class="kitem__nazev">' + esc(a.nazev) + '</strong>' +
                '<span class="kitem__misto">' + esc(a.misto) + '</span>' +
              '</span>' +
              (a.stav ? '<span class="kitem__stav">' + esc(a.stav) + '</span>' : '') +
            '</li>';
          }).join('') + '</ul>'
        : '<p class="kal__prazdno">Na tento den není nic naplánováno.</p>';

      panel.innerHTML =
        '<span class="kal__den-sub">' + (jeDnes ? 'Dnes' : 'Program dne') +
          (seznam.length ? ' · ' + seznam.length + ' ' + slovoAkce(seznam.length) : '') + '</span>' +
        '<h3 class="kal__den-h">' + DNY_DLOUHE[d.getDay()] + ' ' + d.getDate() + '. ' + MESICE_DLOUHE[d.getMonth()] + '</h3>' +
        obsah;
    }

    function render() {
      var prvni = new Date(rok, mesic, 1);
      var start = new Date(rok, mesic, 1 - (denTydne(prvni) - 1));
      var posledni = new Date(rok, mesic + 1, 0);
      var konec = new Date(rok, mesic, posledni.getDate() + (7 - denTydne(posledni)), 23, 59);

      akce = kalAkce(start, konec, filtr, typy);
      nadpis.textContent = MESICE_NOM[mesic] + ' ' + rok;
      if (!vybrany || +vybrany.split('-')[1] - 1 !== mesic || +vybrany.split('-')[0] !== rok) {
        vybrany = vychoziDen();
      }

      var html = '';
      for (var d = new Date(start.getTime()); d <= konec; d.setDate(d.getDate() + 1)) {
        var k = ymd(d);
        var seznam = akce[k] || [];
        var cls = ['kal__cell'];
        if (d.getMonth() !== mesic) cls.push('is-out');
        if (k === dnesKlic) cls.push('is-today');
        if (k === vybrany) cls.push('is-sel');
        if (denTydne(d) >= 6) cls.push('is-vikend');
        var popis = DNY_DLOUHE[d.getDay()] + ' ' + d.getDate() + '. ' + MESICE_DLOUHE[d.getMonth()] +
          (seznam.length ? ', ' + seznam.length + ' ' + slovoAkce(seznam.length) : ', bez programu');
        html += '<button class="' + cls.join(' ') + '" type="button" data-den="' + k + '"' +
          ' aria-label="' + popis + '"' + (k === vybrany ? ' aria-pressed="true"' : ' aria-pressed="false"') + '>' +
          '<span class="kal__num">' + d.getDate() + '</span>' +
          (seznam.length ? '<span class="kal__chips" aria-hidden="true">' + chipy(seznam) + '</span>' +
                           '<span class="kal__dots" aria-hidden="true">' + tecky(seznam) + '</span>' : '') +
        '</button>';
      }
      mrizka.innerHTML = html;
      renderDen();
    }

    function vyberDen(k) {
      var c = k.split('-');
      if (+c[0] !== rok || +c[1] - 1 !== mesic) {
        rok = +c[0]; mesic = +c[1] - 1; vybrany = k; render();
      } else {
        vybrany = k;
        $$('.kal__cell', mrizka).forEach(function (b) {
          var ano = b.getAttribute('data-den') === k;
          b.classList.toggle('is-sel', ano);
          b.setAttribute('aria-pressed', ano ? 'true' : 'false');
        });
        renderDen();
      }
      /* Na mobilu je program pod mřížkou, posuneme se k němu */
      if (window.innerWidth < 1200 && panel.getBoundingClientRect().top > window.innerHeight - 120) {
        panel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
      }
    }

    /* Ať se kalendář dá překreslit po příchodu nových dat, aniž by se
       posluchače kliknutí navěsily podruhé */
    kalendarPrekresli = render;

    mrizka.addEventListener('click', function (e) {
      var b = e.target.closest('[data-den]');
      if (b) vyberDen(b.getAttribute('data-den'));
    });

    $$('[data-kal]', box).forEach(function (b) {
      b.addEventListener('click', function () {
        var co = b.getAttribute('data-kal');
        if (co === 'dnes') { rok = dnes.getFullYear(); mesic = dnes.getMonth(); vybrany = dnesKlic; }
        else {
          mesic += co === 'next' ? 1 : -1;
          if (mesic < 0) { mesic = 11; rok--; }
          if (mesic > 11) { mesic = 0; rok++; }
          vybrany = null;
        }
        render();
      });
    });

    /* Zápasy / Tréninky, aspoň jedno musí zůstat zapnuté */
    $$('[data-kal-typ]', box).forEach(function (b) {
      b.addEventListener('click', function () {
        var klic = b.getAttribute('data-kal-typ');
        var jiny = klic === 'zapasy' ? 'treninky' : 'zapasy';
        if (typy[klic] && !typy[jiny]) return;
        typy[klic] = !typy[klic];
        b.classList.toggle('is-active', typy[klic]);
        b.setAttribute('aria-pressed', typy[klic] ? 'true' : 'false');
        render();
      });
    });

    /* Mužstvo, kalendar.html#muzi-a rovnou vyfiltruje áčko */
    var tymy = $$('[data-kal-tym]', box);
    function vyberTym(btn, zapsat) {
      tymy.forEach(function (x) {
        x.classList.toggle('is-active', x === btn);
        x.setAttribute('aria-pressed', x === btn ? 'true' : 'false');
      });
      filtr = btn.getAttribute('data-kal-tym');
      render();
      if (zapsat && window.history && history.replaceState) {
        var kotva = btn.getAttribute('data-kotva');
        history.replaceState(null, '', kotva ? '#' + kotva : location.pathname + location.search);
      }
    }
    tymy.forEach(function (b) { b.addEventListener('click', function () { vyberTym(b, true); }); });

    var zAdresy = location.hash.slice(1);
    var start = zAdresy && tymy.filter(function (b) { return b.getAttribute('data-kotva') === zAdresy; })[0];
    if (start) vyberTym(start, false);
    else render();
  }

  /* ------------------------------------------------------------------------
     9e. COOKIES A OBSAH TŘETÍCH STRAN
     ------------------------------------------------------------------------
     Web sám žádné cookies nepotřebuje. Jediný obsah třetí strany, který je
     může ukládat, je mapa Googlu na stránce Kontakt, ta se proto načte až
     se souhlasem. Volba se pamatuje v localStorage prohlížeče.
     ---------------------------------------------------------------------- */
  var SOUHLAS_KLIC = 'fch-souhlas';

  function nactiSouhlas() {
    try {
      var s = JSON.parse(window.localStorage.getItem(SOUHLAS_KLIC) || 'null');
      return s && typeof s.externi === 'boolean' ? s : null;
    } catch (e) { return null; }
  }

  function ulozSouhlas(externi) {
    try {
      window.localStorage.setItem(SOUHLAS_KLIC, JSON.stringify({ externi: externi, datum: new Date().toISOString() }));
    } catch (e) { /* bez úložiště se lišta ukáže znovu, nic horšího se nestane */ }
  }

  function nactiMapy() {
    $$('[data-mapa]').forEach(function (box) {
      if (box.querySelector('iframe')) return;
      var f = document.createElement('iframe');
      f.src = box.getAttribute('data-mapa');
      f.title = box.getAttribute('data-mapa-titulek') || 'Mapa';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      box.innerHTML = '';
      box.appendChild(f);
      box.classList.add('is-loaded');
    });
  }

  function initCookies() {
    var souhlas = nactiSouhlas();
    var lista = null;

    function stav() {
      var s = nactiSouhlas();
      $$('[data-cookies-stav]').forEach(function (el) {
        el.textContent = !s ? 'Zatím jste nevybrali.'
          : s.externi ? 'Povoleno vše, včetně obsahu třetích stran.'
          : 'Jen nezbytné, obsah třetích stran je blokovaný.';
      });
    }

    function zavri() {
      if (!lista) return;
      lista.classList.remove('is-on');
      document.body.classList.remove('has-cookiebar');
    }

    function zvol(externi) {
      ulozSouhlas(externi);
      if (externi) nactiMapy();
      stav();
      zavri();
    }

    function otevri() {
      if (!lista) {
        lista = document.createElement('div');
        lista.className = 'cookiebar';
        lista.setAttribute('role', 'region');
        lista.setAttribute('aria-label', 'Souhlas s cookies');
        lista.innerHTML =
          '<div class="cookiebar__txt">' +
            '<p class="cookiebar__h">Cookies a obsah třetích stran</p>' +
            '<p>Náš web sám žádné sledovací cookies nepoužívá. Mapa na stránce Kontakt se načítá od Googlu, ' +
            'který může ukládat vlastní cookies, proto ji zobrazíme jen s vaším souhlasem. ' +
            '<a href="cookies.html">Více o cookies</a></p>' +
          '</div>' +
          '<div class="cookiebar__btns">' +
            '<button class="btn btn--sm btn--ghost" type="button" data-souhlas="ne">Jen nezbytné</button>' +
            '<button class="btn btn--sm" type="button" data-souhlas="ano">Povolit vše</button>' +
          '</div>';
        document.body.appendChild(lista);
        $$('[data-souhlas]', lista).forEach(function (b) {
          b.addEventListener('click', function () { zvol(b.getAttribute('data-souhlas') === 'ano'); });
        });
      }
      /* Vyjetí až v dalším snímku, aby proběhla animace */
      window.requestAnimationFrame(function () {
        lista.classList.add('is-on');
        document.body.classList.add('has-cookiebar');
      });
    }

    if (!souhlas) otevri();
    else if (souhlas.externi) nactiMapy();

    $$('[data-mapa-nacist]').forEach(function (b) {
      b.addEventListener('click', nactiMapy);
    });

    $$('[data-cookies-nastaveni]').forEach(function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); otevri(); });
    });

    stav();
  }

  /* ------------------------------------------------------------------------
     10. NOVINKY
     ---------------------------------------------------------------------- */
  function datumText(iso) {
    var d = new Date(String(iso) + 'T00:00');
    if (isNaN(d.getTime())) return iso;
    return d.getDate() + '. ' + MESICE_DLOUHE[d.getMonth()] + ' ' + d.getFullYear();
  }

  function initNews() {
    var hosts = $$('[data-novinky]');
    if (!hosts.length) return;

    var razeno = NOVINKY.slice().sort(function (a, b) {
      return a.datum < b.datum ? 1 : (a.datum > b.datum ? -1 : 0);
    });

    hosts.forEach(function (host) {
      var limit = parseInt(host.getAttribute('data-limit'), 10);
      var vyber = limit > 0 ? razeno.slice(0, limit) : razeno;

      if (!vyber.length) {
        host.innerHTML = '<p class="sec-lead">Zatím tu nic nového nemáme. '
          + 'Sledujte nás na Facebooku.</p>';
        return;
      }

      host.innerHTML = vyber.map(function (n, i) {
        var stitek = n.stitek
          ? '<span class="card__tag' + (n.stitekZlaty ? ' card__tag--gold' : '') + '">'
            + esc(n.stitek) + '</span>'
          : '';
        var odkaz = '<div class="card__foot">'
          + '<a class="link-arrow card__link" href="novinka.html?id='
          + encodeURIComponent(n.id) + '">Číst dál'
          + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" '
          + 'aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
          + '</a></div>';
        return '<article class="card card--sm card--news reveal" data-d="' + ((i % 3) + 1) + '">'
          + '<div class="card__media">' + stitek
            + '<img src="' + esc(n.obrazek) + '" alt="' + esc(n.popisObrazku || '')
            + '" loading="lazy" width="' + esc(n.sirka || 1400)
            + '" height="' + esc(n.vyska || 933) + '">'
          + '</div>'
          + '<div class="card__body">'
            + '<span class="card__date">' + esc(datumText(n.datum)) + '</span>'
            + '<h3 class="card__title">' + esc(n.nadpis) + '</h3>'
            + '<p class="card__text">' + esc(n.perex || n.text) + '</p>'
            + odkaz
          + '</div>'
        + '</article>';
      }).join('');
    });
  }

  /* ------------------------------------------------------------------------
     9b. PŘEPÍNAČ MUŽSTEV NA ÚVODU
     ------------------------------------------------------------------------
     Řada štítků s kategoriemi a pod ní fotka vybraného mužstva s odkazem na
     jeho podstránku. Skládá se z pole TYMY_PREHLED. Fotky se přednačítají až
     po prvním přepnutí, úvodní stránka tak nestahuje jedenáct fotek zbytečně.
     ---------------------------------------------------------------------- */
  function initTymyPas() {
    var host = $('[data-tymy-pas]');
    if (!host || !TYMY_PREHLED.length) return;

    host.innerHTML =
      '<div class="teamsw__tabs" role="tablist" aria-label="Mužstva klubu">' +
        TYMY_PREHLED.map(function (t, i) {
          return '<button class="teamsw__tab' + (i ? '' : ' is-on') + '" type="button" role="tab"'
            + ' id="teamsw-tab-' + i + '" aria-controls="teamsw-panel"'
            + ' aria-selected="' + (i ? 'false' : 'true') + '" tabindex="' + (i ? '-1' : '0') + '">'
            + esc(t.zkratka) + '</button>';
        }).join('') +
      '</div>' +
      '<a class="teamsw__panel" id="teamsw-panel" role="tabpanel" href="#">' +
        '<img class="teamsw__foto" src="" alt="" width="1500" height="937" loading="lazy" decoding="async">' +
        '<span class="teamsw__veil" aria-hidden="true"></span>' +
        '<span class="teamsw__info">' +
          '<span class="teamsw__soutez"></span>' +
          '<span class="teamsw__nazev"></span>' +
        '</span>' +
        '<span class="teamsw__go">Více o týmu'
          + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" '
          + 'aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>' +
      '</a>';

    var tabs = $$('.teamsw__tab', host);
    var panel = $('.teamsw__panel', host);
    var foto = $('.teamsw__foto', host);
    var nazev = $('.teamsw__nazev', host);
    var soutez = $('.teamsw__soutez', host);
    var kde = 0;

    function ukaz(i, presunFokus) {
      var t = TYMY_PREHLED[i];
      if (!t) return;
      kde = i;

      tabs.forEach(function (b, n) {
        b.classList.toggle('is-on', n === i);
        b.setAttribute('aria-selected', n === i ? 'true' : 'false');
        b.tabIndex = n === i ? 0 : -1;
      });

      foto.src = t.foto;
      foto.alt = 'Mužstvo ' + t.nazev + ' FC Hlinsko';
      nazev.textContent = t.nazev;
      soutez.textContent = t.soutez;
      panel.href = t.odkaz;
      panel.setAttribute('aria-labelledby', 'teamsw-tab-' + i);

      /* Fotka po přepnutí krátce prosvitne, ať je změna vidět */
      if (!reduceMotion) {
        panel.classList.remove('is-new');
        void panel.offsetWidth;
        panel.classList.add('is-new');
      }

      /* Vybraný štítek doskrolovat do viditelné části řady */
      if (tabs[i].scrollIntoView) {
        tabs[i].scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
      if (presunFokus) tabs[i].focus();
    }

    tabs.forEach(function (b, i) {
      b.addEventListener('click', function () { ukaz(i); });
    });

    /* Šipkami mezi kategoriemi, Home a End na okraje */
    $('.teamsw__tabs', host).addEventListener('keydown', function (e) {
      var posun = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 1, ArrowUp: -1 }[e.key];
      if (posun) {
        e.preventDefault();
        ukaz((kde + posun + tabs.length) % tabs.length, true);
      } else if (e.key === 'Home') {
        e.preventDefault(); ukaz(0, true);
      } else if (e.key === 'End') {
        e.preventDefault(); ukaz(tabs.length - 1, true);
      }
    });

    ukaz(0);
    foto.loading = 'eager';
  }

  /* ------------------------------------------------------------------------
     10b. POSUVNÝ PÁS (KARUSEL)
     ------------------------------------------------------------------------
     Obecná komponenta pro vodorovné pásy karet. Obal má atribut data-rail,
     uvnitř je .rail__track s kartami. Šipky a tečky si pás doplní sám podle
     toho, kolik karet se do něj vejde. Když se vejdou všechny, ovládání se
     schová. Posouvá se prstem, šipkami i klávesnicí, nic se nezamyká.
     ---------------------------------------------------------------------- */
  function initRails() {
    $$('[data-rail]').forEach(function (rail) {
      var track = $('.rail__track', rail);
      if (!track) return;

      var prev = $('.rail__nav--prev', rail);
      var next = $('.rail__nav--next', rail);
      var dots = $('[data-rail-dots]', rail);

      function karty() { return $$(':scope > *', track); }

      /* O kolik se posunout: šířka jedné karty i s mezerou */
      function krok() {
        var k = karty();
        if (k.length < 2) return track.clientWidth;
        return Math.round(k[1].getBoundingClientRect().left - k[0].getBoundingClientRect().left);
      }

      /* Kolik „stránek“ pás má, tedy kolik poloh tlačítek dává smysl */
      function stran() {
        var d = krok();
        if (!d) return 1;
        return Math.max(1, Math.round((track.scrollWidth - track.clientWidth) / d) + 1);
      }

      function aktivni() {
        var d = krok();
        return d ? Math.round(track.scrollLeft / d) : 0;
      }

      /* Vlastní animace posunu. Prohlížeč umí scrollTo se smooth, ale zarážky
         (scroll-snap) mu ji strhnou zpátky na první kartu, proto se posouvá
         ručně po snímcích a zarážky se na tu chvíli vypnou. */
      var bezi = null;

      function posunNa(cil) {
        var meze = track.scrollWidth - track.clientWidth;
        cil = Math.max(0, Math.min(cil, meze));
        var od = track.scrollLeft;
        var delta = cil - od;
        if (Math.abs(delta) < 1) return;

        if (bezi) window.cancelAnimationFrame(bezi);

        /* Bez animace: omezený pohyb v systému, nebo skrytá záložka, kde
           prohlížeč snímky nekreslí a pás by zůstal viset na místě */
        if (reduceMotion || document.hidden) {
          track.style.scrollSnapType = 'none';
          track.scrollLeft = cil;
          track.style.scrollSnapType = '';
          return;
        }

        var zacatek = 0;
        var doba = 380;
        track.style.scrollSnapType = 'none';

        bezi = window.requestAnimationFrame(function snimek(t) {
          if (!zacatek) zacatek = t;
          var p = Math.min(1, (t - zacatek) / doba);
          /* Rozjezd a dojezd, uprostřed nejrychleji */
          var e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
          track.scrollLeft = od + delta * e;
          if (p < 1) {
            bezi = window.requestAnimationFrame(snimek);
          } else {
            bezi = null;
            track.style.scrollSnapType = '';
          }
        });
      }

      function jdi(i) { posunNa(i * krok()); }

      function prekresliTecky(pocet, kde) {
        if (!dots) return;
        if (dots.children.length !== pocet) {
          dots.innerHTML = '';
          for (var i = 0; i < pocet; i++) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'rail__dot';
            b.setAttribute('aria-label', 'Přejít na ' + (i + 1) + '. položku');
            (function (n) {
              b.addEventListener('click', function () { jdi(n); });
            }(i));
            dots.appendChild(b);
          }
        }
        $$('.rail__dot', dots).forEach(function (b, i) {
          b.classList.toggle('is-on', i === kde);
          b.setAttribute('aria-current', i === kde ? 'true' : 'false');
        });
      }

      function stav() {
        /* Rezerva kvůli zaokrouhlování šířek a vnitřnímu odsazení pásu */
        var vule = 8;
        var prostor = track.scrollWidth - track.clientWidth;
        var jePas = prostor > vule;
        rail.classList.toggle('is-static', !jePas);

        if (prev) prev.disabled = track.scrollLeft <= vule;
        if (next) next.disabled = track.scrollLeft >= prostor - vule;

        prekresliTecky(jePas ? stran() : 0, aktivni());
      }

      if (prev) prev.addEventListener('click', function () { jdi(Math.max(0, aktivni() - 1)); });
      if (next) next.addEventListener('click', function () { jdi(aktivni() + 1); });

      var tick = false;
      track.addEventListener('scroll', function () {
        if (tick) return;
        tick = true;
        window.requestAnimationFrame(function () { stav(); tick = false; });
      }, { passive: true });

      window.addEventListener('resize', stav, { passive: true });
      stav();
    });
  }

  /* ------------------------------------------------------------------------
     10d. NAČÍTÁNÍ DAT ZE ZDROJE (viz ZDROJ nahoře v souboru)
     ------------------------------------------------------------------------
     Postup je schválně dvoufázový, aby stránka nikdy nečekala na síť:

     1. Při načtení se vezmou data uložená v prohlížeči z minule a hned
        přepíšou ruční pole. Stránka se tedy vykreslí okamžitě.
     2. Na pozadí se stáhne čerstvá verze. Když přijde a od uložené se liší,
        web se překreslí. Když nepřijde, nic se neděje a platí, co bylo.

     Všechno je obalené v try, takže zablokované localStorage, výpadek sítě
     ani poškozený JSON stránku nerozbijí.
     ---------------------------------------------------------------------- */
  var ZDROJ_KLIC = 'fch-zdroj-';

  function zdrojUrl(klic) {
    var zaklad = ZDROJ.zaklad || '';
    if (zaklad && zaklad.slice(-1) !== '/') zaklad += '/';
    return zaklad + (ZDROJ.cesty[klic] || (klic + '.json'));
  }

  function zdrojZPameti(klic) {
    try {
      var s = JSON.parse(window.localStorage.getItem(ZDROJ_KLIC + klic) || 'null');
      return s && s.data ? s : null;
    } catch (e) { return null; }
  }

  function zdrojDoPameti(klic, data) {
    try {
      window.localStorage.setItem(ZDROJ_KLIC + klic,
        JSON.stringify({ cas: Date.now(), data: data }));
    } catch (e) { /* plná nebo zakázaná paměť prohlížeče, nevadí */ }
  }

  function zdrojCerstve(zaznam) {
    if (!zaznam) return false;
    return (Date.now() - zaznam.cas) < (ZDROJ.platnostMinut || 60) * 60000;
  }

  /* Stažení s časovým stropem, ať se čekání nikdy neprotáhne */
  function zdrojStahni(klic) {
    if (!window.fetch) return Promise.resolve(null);

    var vzdano = false;
    var strop = new Promise(function (hotovo) {
      window.setTimeout(function () { vzdano = true; hotovo(null); }, ZDROJ.cekaniMs || 6000);
    });

    var stahovani = window.fetch(zdrojUrl(klic), { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { return vzdano ? null : j; })
      .catch(function () { return null; });

    return Promise.race([stahovani, strop]);
  }

  /* --- Kontrola tvaru dat -------------------------------------------------
     Vadný řádek se zahodí, ne aby kvůli jedné chybě zmizel celý rozpis.
     Když po kontrole nezbude nic, vrací se null a platí ruční pole. */
  function zdrojZapasy(json) {
    var pole = json && (json.zapasy || json);
    if (!pole || !pole.length) return null;

    var ok = [];
    for (var i = 0; i < pole.length; i++) {
      var z = pole[i];
      if (!z || typeof z.datum !== 'string' || isNaN(parseDatum(z.datum).getTime())) continue;
      if (typeof z.souper !== 'string' || !z.souper) continue;
      ok.push({
        datum: z.datum,
        domaci: !!z.domaci,
        souper: z.souper,
        tym: z.tym || 'A',
        typ: z.typ || 'liga',
        misto: z.misto || '',
        skore: typeof z.skore === 'string' && /^\s*\d+\s*:\s*\d+\s*$/.test(z.skore) ? z.skore : null,
        kolo: typeof z.kolo === 'number' ? z.kolo : undefined,
        soutez: typeof z.soutez === 'string' ? z.soutez : undefined,
        nazev: typeof z.nazev === 'string' ? z.nazev : undefined
      });
    }
    return ok.length ? ok : null;
  }

  function zdrojTabulka(json) {
    var pole = json && (json.tabulka || json);
    if (!pole || !pole.length) return null;

    var cislo = function (h) { return typeof h === 'number' && isFinite(h) ? h : 0; };
    var ok = [];
    for (var i = 0; i < pole.length; i++) {
      var r = pole[i];
      if (!r || typeof r.tym !== 'string' || !r.tym) continue;
      ok.push({
        poradi: cislo(r.poradi) || (i + 1),
        tym: r.tym,
        z: cislo(r.z), v: cislo(r.v), r: cislo(r.r), p: cislo(r.p),
        skore: typeof r.skore === 'string' ? r.skore : '0:0',
        b: cislo(r.b)
      });
    }
    return ok.length ? ok : null;
  }

  /* Překreslení všech míst, která z dat žijí. initKalendar si svoji
     překreslovací funkci uloží do kalendarPrekresli, aby se posluchače
     kliknutí nevěšely podruhé. */
  var kalendarPrekresli = null;

  function zdrojPrekresli() {
    initHeroZapasy();
    initVysledky();
    initTable();
    initFixtureList();
    initTeamFixtures();
    if (kalendarPrekresli) kalendarPrekresli();
    initReveal();
    initRails();
  }

  /* Fáze 1: co je v paměti prohlížeče, použít hned. Vrací true, když se
     některé z polí přepsalo. */
  function zdrojZPametiPouzij() {
    var zmena = false;

    var z = zdrojZPameti('zapasy');
    var zz = z && zdrojZapasy(z.data);
    if (zz) { ZAPASY = zz; zmena = true; }

    var t = zdrojZPameti('tabulka');
    var tt = t && zdrojTabulka(t.data);
    if (tt) {
      TABULKA = tt;
      if (t.data && t.data.aktualizovano) TABULKA_AKTUALIZOVANO = t.data.aktualizovano;
      zmena = true;
    }
    return zmena;
  }

  /* Fáze 2: čerstvá data na pozadí. Stahuje se jen to, čemu vypršela
     platnost, ať web nezatěžuje hosting při každém překliknutí stránky. */
  function zdrojObnov() {
    var ukoly = [];

    ['zapasy', 'tabulka'].forEach(function (klic) {
      if (zdrojCerstve(zdrojZPameti(klic))) return;
      ukoly.push(zdrojStahni(klic).then(function (json) {
        return { klic: klic, json: json };
      }));
    });

    if (!ukoly.length) return;

    Promise.all(ukoly).then(function (vysledky) {
      var zmena = false;

      vysledky.forEach(function (v) {
        if (!v.json) return;
        if (v.klic === 'zapasy') {
          var zz = zdrojZapasy(v.json);
          if (!zz) return;
          zdrojDoPameti('zapasy', v.json);
          ZAPASY = zz;
          zmena = true;
        } else {
          var tt = zdrojTabulka(v.json);
          if (!tt) return;
          zdrojDoPameti('tabulka', v.json);
          TABULKA = tt;
          if (v.json.aktualizovano) TABULKA_AKTUALIZOVANO = v.json.aktualizovano;
          zmena = true;
        }
      });

      if (zmena) zdrojPrekresli();
    });
  }

  function initZdroj() {
    if (!ZDROJ || !ZDROJ.zapnuto) return false;
    return zdrojZPametiPouzij();
  }

  /* ------------------------------------------------------------------------
     10c. VYSKAKOVACÍ UPOUTÁVKA
     ------------------------------------------------------------------------
     Okno s pozvánkou na akci. Řídí se objektem UPOUTAVKA nahoře v souboru:
     ukáže se jen v zadaném období, jen na vybraných stránkách a každému
     návštěvníkovi jednou. Zavírá se křížkem, klávesou Esc nebo kliknutím
     mimo okno, fokus se přitom nedostane mimo něj.
     ---------------------------------------------------------------------- */
  var UPOUTAVKA_KLIC = 'fch-upoutavka';

  /* Dnešek proti období 'RRRR-MM-DD', datum do je včetně celého dne */
  function upoutavkaPlati(u) {
    var ted = new Date();
    if (u.od && ted < new Date(u.od + 'T00:00')) return false;
    if (u.do && ted > new Date(u.do + 'T23:59:59')) return false;
    return true;
  }

  function upoutavkaNaStrance(u) {
    if (!u.stranky || !u.stranky.length) return true;
    var tady = location.pathname.split('/').pop();
    return u.stranky.indexOf(tady) >= 0;
  }

  /* Prohlížeč si pamatuje jen id naposledy zavřené upoutávky */
  function upoutavkaZavrena(id) {
    try { return localStorage.getItem(UPOUTAVKA_KLIC) === id; } catch (e) { return false; }
  }

  function initUpoutavka() {
    var u = typeof UPOUTAVKA !== 'undefined' ? UPOUTAVKA : null;
    if (!u || !upoutavkaPlati(u) || !upoutavkaNaStrance(u) || upoutavkaZavrena(u.id)) return;

    var obal = document.createElement('div');
    obal.className = 'upoutavka';
    obal.setAttribute('role', 'dialog');
    obal.setAttribute('aria-modal', 'true');
    obal.setAttribute('aria-labelledby', 'upoutavka-nadpis');

    var udaje = (u.udaje || []).map(function (r) {
      return '<div><dt>' + esc(r.k) + '</dt><dd>' + esc(r.v) + '</dd></div>';
    }).join('');

    var tlacitka = '<a class="btn" href="' + esc(u.odkaz) + '">' + esc(u.odkazText) + '</a>'
      + (u.odkaz2 ? '<a class="btn btn--ghost" href="' + esc(u.odkaz2) + '">'
          + esc(u.odkaz2Text) + '</a>' : '');

    obal.innerHTML =
      '<div class="upoutavka__scrim" data-zavrit></div>' +
      '<div class="upoutavka__okno">' +
        '<button class="upoutavka__x" type="button" aria-label="Zavřít upoutávku" data-zavrit>' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" ' +
          'aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
        '</button>' +
        (u.obrazek
          ? '<div class="upoutavka__foto"><img src="' + esc(u.obrazek) + '" alt="'
            + esc(u.popisObrazku || '') + '" width="1500" height="858"></div>'
          : '') +
        '<div class="upoutavka__telo">' +
          (u.stitek ? '<span class="upoutavka__stitek">' + esc(u.stitek) + '</span>' : '') +
          '<h2 class="upoutavka__nadpis" id="upoutavka-nadpis">' + esc(u.nadpis) + '</h2>' +
          (u.text ? '<p class="upoutavka__text">' + esc(u.text) + '</p>' : '') +
          (udaje ? '<dl class="dl upoutavka__udaje">' + udaje + '</dl>' : '') +
          '<div class="btn-row">' + tlacitka + '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(obal);

    var okno = $('.upoutavka__okno', obal);
    var vratitFokus = document.activeElement;

    function zavri() {
      obal.classList.remove('is-on');
      try { localStorage.setItem(UPOUTAVKA_KLIC, u.id); } catch (e) {}
      document.removeEventListener('keydown', naKlavesu);
      document.body.style.overflow = '';
      window.setTimeout(function () {
        if (obal.parentNode) obal.parentNode.removeChild(obal);
        if (vratitFokus && vratitFokus.focus) vratitFokus.focus();
      }, reduceMotion ? 0 : 220);
    }

    /* Esc zavírá, Tab cykluje uvnitř okna */
    function naKlavesu(e) {
      if (e.key === 'Escape') { e.preventDefault(); zavri(); return; }
      if (e.key !== 'Tab') return;
      var prvky = $$('a[href], button:not([disabled])', okno);
      if (!prvky.length) return;
      var prvni = prvky[0];
      var posledni = prvky[prvky.length - 1];
      if (e.shiftKey && document.activeElement === prvni) { e.preventDefault(); posledni.focus(); }
      else if (!e.shiftKey && document.activeElement === posledni) { e.preventDefault(); prvni.focus(); }
    }

    $$('[data-zavrit]', obal).forEach(function (b) {
      b.addEventListener('click', zavri);
    });
    document.addEventListener('keydown', naKlavesu);

    function otevri() {
      obal.classList.add('is-on');
      document.body.style.overflow = 'hidden';
      var prvni = $('.upoutavka__x', obal);
      if (prvni) prvni.focus();
    }

    /* Nejdřív ať návštěvník vyřeší lištu se souhlasem cookies, upoutávka
       by ji jinak překryla. Bez odpovědi se okno neukáže vůbec. */
    if (nactiSouhlas()) {
      window.setTimeout(otevri, u.prodleva || 800);
    } else {
      var ceka = window.setInterval(function () {
        if (!nactiSouhlas()) return;
        window.clearInterval(ceka);
        window.setTimeout(otevri, 600);
      }, 400);
    }
  }

  /* ------------------------------------------------------------------------
     11. DETAIL NOVINKY (novinka.html?id=...)
     ---------------------------------------------------------------------- */
  function initArticle() {
    var host = $('[data-novinka]');
    if (!host) return;

    var sip = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" '
      + 'stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    var zpet = '<a class="link-arrow" href="novinky.html">Všechny novinky' + sip + '</a>';

    var m = /[?&]id=([^&]*)/.exec(location.search);
    var id = m ? decodeURIComponent(m[1]) : '';
    var n = null;
    NOVINKY.forEach(function (x) { if (x.id === id) n = x; });

    var elNadpis = $('[data-novinka-nadpis]');
    var elMeta = $('[data-novinka-meta]');
    var elDrobek = $('[data-novinka-drobek]');

    if (!n) {
      if (elNadpis) elNadpis.textContent = 'Novinka nenalezena';
      if (elMeta) elMeta.textContent = 'Tenhle článek na webu není, možná se přesunul.';
      if (elDrobek) elDrobek.textContent = 'Novinka nenalezena';
      host.innerHTML = '<div class="clanek"><div class="clanek__foot">' + zpet + '</div></div>';
      return;
    }

    document.title = n.nadpis + ' | FC Hlinsko';
    if (elNadpis) elNadpis.textContent = n.nadpis;
    if (elDrobek) elDrobek.textContent = n.nadpis;
    if (elMeta) {
      elMeta.textContent = (n.stitek ? n.stitek + ' · ' : '') + datumText(n.datum);
    }

    var odstavce = (n.obsah && n.obsah.length ? n.obsah : [n.perex || n.text || ''])
      .map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('');

    var extra = n.odkaz
      ? '<a class="link-arrow" href="' + esc(n.odkaz) + '">'
        + esc(n.odkazText || 'Více') + sip + '</a>'
      : '';

    host.innerHTML = '<article class="clanek">'
      + '<figure class="clanek__img"><img src="' + esc(n.obrazek) + '" alt="'
        + esc(n.popisObrazku || '') + '" width="' + esc(n.sirka || 1400)
        + '" height="' + esc(n.vyska || 933) + '"></figure>'
      + odstavce
      + '<div class="clanek__foot">' + extra + zpet + '</div>'
    + '</article>';
  }

  /* ------------------------------------------------------------------------
     13. ROZPIS ZÁPASŮ NA STRÁNCE MUŽSTVA
     ---------------------------------------------------------------------- */
  function initTeamFixtures() {
    $$('[data-rozpis]').forEach(function (host) {
      var klic = host.getAttribute('data-rozpis');
      var now = Date.now();

      var data = ZAPASY.slice()
        .filter(function (z) { return tymSedi(z.tym, klic); })
        .sort(function (a, b) { return parseDatum(a.datum) - parseDatum(b.datum); });

      if (!data.length) {
        host.innerHTML = '<p class="sec-lead">Rozpis téhle kategorie zatím nemáme. '
          + 'Zápasy se sem doplní samy, jakmile je přidáme do rozpisu.</p>';
        return;
      }

      host.innerHTML = data.map(function (z) {
        return fixtureHtml(z, now);
      }).join('');
    });
  }

  /* ------------------------------------------------------------------------
     12. ROK V PATIČCE
     ---------------------------------------------------------------------- */
  function initYear() {
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  function boot() {
    /* Data ze zdroje musí být na místě dřív, než se cokoliv vykreslí */
    initZdroj();

    initHeader();
    initDrawer();
    initActiveNav();
    initNews();
    initArticle();
    /* Vše, co vkládá prvky s třídou .reveal, musí proběhnout před initReveal */
    initHeroZapasy();
    initVysledky();
    initTable();
    initNarozeniny();
    initTymyPas();
    initPartneri();
    initKalendar();
    initReveal();
    initFixtureList();
    initTeamFixtures();
    initMarquee();
    /* Pásy až po vykreslení karet, počítají se ze skutečných šířek */
    initRails();
    initForms();
    initLightbox();
    initCookies();
    initYear();
    /* Upoutávka až nakonec, ať nepřekryje lištu se souhlasem cookies */
    initUpoutavka();
    /* Čerstvá data na pozadí, stránka na ně nečeká */
    if (ZDROJ && ZDROJ.zapnuto) zdrojObnov();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
