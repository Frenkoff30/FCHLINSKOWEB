/* ==========================================================================
   ODESLÁNÍ FORMULÁŘE PŘES SMTP
   ==========================================================================
   Serverová funkce pro Vercel. Web sám zůstává statický, tohle je jediná
   část, která běží na serveru, a to jen když někdo odešle formulář.

   Proč to nejde z prohlížeče: heslo ke schránce se nesmí dostat do script.js,
   odkud by si ho kdokoli přečetl a rozesílal poštu jménem klubu.

   Odesílá se přes SMTP klubové schránky u Webglobe, ne přes cizí službu.
   Doručitelnost tím řeší doména sama a nic se nikde neověřuje navíc.

   Nastavení v proměnných prostředí na Vercelu:

     SMTP_HOST             povinné, server Webglobe
     SMTP_PORT             nepovinné, výchozí 465
     SMTP_UZIVATEL         povinné, celá adresa schránky, ze které se odesílá,
                           např. formular@fchlinsko.cz
     SMTP_HESLO            povinné, heslo k té schránce
     FORMULAR_PRIJEMCE     kam zprávy chodí, výchozí info@fchlinsko.cz
     FORMULAR_ODESILATEL   adresa v poli Od, výchozí je SMTP_UZIVATEL.
                           Musí být na doméně fchlinsko.cz, jinak zprávu
                           odmítne SPF u příjemce.

   Heslo schránky do repozitáře nepatří, drží ho jen Vercel.
   Podrobnosti a postup jsou v README v sekci Formuláře.
   ========================================================================== */

var nodemailer = require('nodemailer');

/* Podoba formulářů je schválně tady na serveru, ne v požadavku. Prohlížeč
   posílá jen hodnoty, takže z endpointu nejde udělat rozesílač libovolných
   zpráv. Příjemce se bere z prostředí a z požadavku ho nelze přepsat. */
var FORMULARE = {
  nabor: {
    predmet: 'Nábor, nová přihláška z webu',
    pole: [
      { klic: 'dite',      popis: 'Jméno dítěte',           povinne: true, max: 100 },
      { klic: 'rocnik',    popis: 'Ročník narození',        povinne: true, max: 20 },
      { klic: 'kategorie', popis: 'Předpokládaná kategorie',               max: 80 },
      { klic: 'rodic',     popis: 'Jméno rodiče',           povinne: true, max: 100 },
      { klic: 'telefon',   popis: 'Telefon',                povinne: true, max: 40 },
      { klic: 'email',     popis: 'E-mail',                 povinne: true, max: 160, typ: 'email' },
      { klic: 'zprava',    popis: 'Poznámka',                              max: 2000 }
    ]
  },
  kontakt: {
    predmet: 'Zpráva z webu FC Hlinsko',
    pole: [
      { klic: 'jmeno',   popis: 'Jméno a příjmení', povinne: true, max: 100 },
      { klic: 'telefon', popis: 'Telefon',                         max: 40 },
      { klic: 'email',   popis: 'E-mail',           povinne: true, max: 160, typ: 'email' },
      { klic: 'tema',    popis: 'Téma',                            max: 80 },
      { klic: 'zprava',  popis: 'Zpráva',           povinne: true, max: 4000 }
    ]
  }
};

var EMAIL_TVAR = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

/* Nejkratší doba od načtení stránky po odeslání. Roboti odesílají
   okamžitě, člověk musí stránku aspoň projít a naklikat pole. */
var MIN_VTERIN = 3;

/* Hrubé omezení počtu odeslání z jedné adresy. Paměť instance se na
   Vercelu čas od času vyhodí, takže to není pevná hráz, jen zpomalení
   nejhloupějších pokusů. */
var LIMIT_POCET = 5;
var LIMIT_OKNO_MS = 10 * 60 * 1000;
var navstevy = new Map();

function prekrocilLimit(ip) {
  var ted = Date.now();
  var zaznam = navstevy.get(ip) || [];
  zaznam = zaznam.filter(function (t) { return ted - t < LIMIT_OKNO_MS; });
  zaznam.push(ted);
  navstevy.set(ip, zaznam);

  /* Ať mapa neroste donekonečna */
  if (navstevy.size > 500) {
    navstevy.forEach(function (v, k) {
      if (!v.length || ted - v[v.length - 1] > LIMIT_OKNO_MS) navstevy.delete(k);
    });
  }
  return zaznam.length > LIMIT_POCET;
}

function text(v, max) {
  if (typeof v !== 'string') return '';
  /* Řídicí znaky pryč, jinak by šlo do hlaviček e-mailu propašovat nesmysly */
  return v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);
}

/* Spojení se serverem se drží mezi požadavky. Vercel instanci občas
   vyhodí, pak se navaže znovu, nic se tím nerozbije. */
var preprava = null;

function posta() {
  if (preprava) return preprava;
  var port = Number(process.env.SMTP_PORT) || 465;
  preprava = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: port,
    /* Port 465 mluví šifrovaně od začátku, 587 se šifruje až příkazem
       STARTTLS. Nodemailer to podle secure pozná. */
    secure: port === 465,
    auth: {
      user: process.env.SMTP_UZIVATEL,
      pass: process.env.SMTP_HESLO
    }
  });
  return preprava;
}

function odpoved(res, kod, telo) {
  res.status(kod);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.send(JSON.stringify(telo));
}

module.exports = async function (req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return odpoved(res, 405, { chyba: 'Povolena je jen metoda POST.' });
  }

  var telo = req.body;
  if (typeof telo === 'string') {
    try { telo = JSON.parse(telo); } catch (e) { telo = null; }
  }
  if (!telo || typeof telo !== 'object') {
    return odpoved(res, 400, { chyba: 'Neplatný požadavek.' });
  }

  var predpis = FORMULARE[telo.formular];
  if (!predpis) return odpoved(res, 400, { chyba: 'Neznámý formulář.' });

  /* Past na roboty: pole je v HTML schované, člověk ho nevyplní */
  if (text(telo.web, 100)) {
    /* Robotovi se přiznávat nebudeme, ať to nezkouší jinak */
    return odpoved(res, 200, { ok: true });
  }

  /* Na rozdíl od pasti tohle nehlásíme jako úspěch. Past vyplní jen
     robot, ale u času se spletený odhad dá myslet, a tiše zahozená
     přihláška, po které uživateli naskočí „děkujeme“, je to nejhorší,
     co se může stát. Radši ho pošleme zkusit to znovu. */
  var trvani = Number(telo.trvani);
  if (isFinite(trvani) && trvani >= 0 && trvani < MIN_VTERIN) {
    return odpoved(res, 400, { chyba: 'Odeslání proběhlo příliš rychle. Zkuste to prosím ještě jednou.' });
  }

  var ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'neznama';
  if (prekrocilLimit(ip)) {
    return odpoved(res, 429, {
      chyba: 'Zpráv z vaší sítě přišlo hodně za sebou. Zkuste to prosím za chvíli, nebo nám napište přímo.'
    });
  }

  var hodnoty = telo.pole && typeof telo.pole === 'object' ? telo.pole : {};
  var radky = [];
  var chybi = [];
  var odpovedetNa = '';

  predpis.pole.forEach(function (p) {
    var v = text(hodnoty[p.klic], p.max);
    if (!v) {
      if (p.povinne) chybi.push(p.popis);
      return;
    }
    if (p.typ === 'email') {
      if (!EMAIL_TVAR.test(v)) { chybi.push(p.popis); return; }
      if (!odpovedetNa) odpovedetNa = v;
    }
    radky.push(p.popis + ': ' + v);
  });

  if (chybi.length) {
    return odpoved(res, 400, { chyba: 'Chybí nebo je špatně vyplněno: ' + chybi.join(', ') + '.' });
  }

  if (telo.souhlas !== true) {
    return odpoved(res, 400, { chyba: 'Bez souhlasu se zpracováním údajů zprávu odeslat nelze.' });
  }

  if (!process.env.SMTP_HOST || !process.env.SMTP_UZIVATEL || !process.env.SMTP_HESLO) {
    console.error('Chybí nastavení SMTP, formulář nelze odeslat.');
    return odpoved(res, 500, {
      chyba: 'Odesílání zpráv na webu zatím není nastavené. Napište nám prosím přímo e-mailem.'
    });
  }

  var prijemce = process.env.FORMULAR_PRIJEMCE || 'info@fchlinsko.cz';
  var odesilatel = process.env.FORMULAR_ODESILATEL || process.env.SMTP_UZIVATEL;

  var obsah = radky.join('\n')
    + '\n\n---\nOdesláno z formuláře na webu fchlinsko.cz'
    + '\nDatum: ' + new Date().toLocaleString('cs-CZ', { timeZone: 'Europe/Prague' });

  try {
    await posta().sendMail({
      from: 'Web FC Hlinsko <' + odesilatel + '>',
      to: prijemce,
      /* Odpověď půjde rovnou tomu, kdo formulář vyplnil */
      replyTo: odpovedetNa || undefined,
      subject: predpis.predmet,
      text: obsah
    });
  } catch (e) {
    console.error('SMTP zprávu nepřijalo:', e);
    /* Spojení mohlo zůstat viset, příště se naváže znovu */
    preprava = null;
    return odpoved(res, 502, {
      chyba: 'Zprávu se nepodařilo odeslat. Zkuste to prosím znovu, nebo nám napište přímo e-mailem.'
    });
  }

  return odpoved(res, 200, { ok: true });
};
