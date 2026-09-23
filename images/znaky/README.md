# Znaky soupeřů

Znaky klubů divize C. Web je bere podle pole `znak` v `KLUBY`
ve `script.js` a ukazuje je v tabulce soutěže a v zápasovém pruhu
na úvodní stránce.

Formát je **WebP s průhledným pozadím**, delší strana 96 px. Všech
patnáct dohromady váží zhruba 73 kB.

## Co je hotové

| Klub | Soubor |
|------|--------|
| FK Přepeře | `prepere.webp` |
| SK Vysoké Mýto | `vysoke-myto.webp` |
| SK Kosmonosy | `kosmonosy.webp` |
| TJ Jiskra Ústí nad Orlicí | `usti-nad-orlici.webp` |
| SK Sparta Kolín | `kolin.webp` |
| FK Čechie Vykáň | `vykan.webp` |
| FK Turnov (Pěnčín-Turnov) | `turnov.webp` |
| MFK Trutnov | `trutnov.webp` |
| FK Chlumec nad Cidlinou | `chlumec-nad-cidlinou.webp` |
| TJ Dvůr Králové nad Labem | `dvur-kralove.webp` |
| FC Slavia Hradec Králové | `slavia-hradec-kralove.webp` |
| Spartak Police nad Metují | `police-nad-metuji.webp` |
| TJ Svitavy | `svitavy.webp` |
| MFK Chrudim B | `chrudim.webp` |
| FK Letohrad | `letohrad.webp` |

FC Hlinsko tady schválně není, vlastní znak se bere
z `images/znak-fchlinsko.webp`.

## Složka zdroj/

Leží v ní loga tak, jak se stáhla, včetně druhé varianty znaku Slavie
Hradec Králové, která se nakonec nepoužila. Na web se neservírují,
složka je v `.vercelignore`. Hodí se, když bude potřeba znak
přegenerovat jinak velký.

## Nový nebo vyměněný znak

Originál ulož do `zdroj/` a převeď ho:

```bash
python -c "from PIL import Image; im=Image.open('images/znaky/zdroj/logo.png').convert('RGBA'); im=im.crop(im.getbbox()); m=96/max(im.size); im=im.convert('RGBa').resize((round(im.width*m),round(im.height*m)),Image.LANCZOS).convert('RGBA'); im.save('images/znaky/nazev.webp','WEBP',quality=88,method=6)"
```

Převod přes `RGBa` je schválně: bez něj se při zmenšení udělá kolem
znaku světlý lem.

Logo s bílým pozadím místo průhledného potřebuje pozadí nejdřív odstranit,
jinak bude mít znak v zápasovém pruhu bílý čtverec. Přes `PIL` jde vyplavit
bílou spojenou s okrajem, bílé části uvnitř znaku zůstanou.

## Když soubor chybí

Nevadí. Na jeho místě zůstane kolečko se zkratkou názvu. Stejně to dopadne,
když je soubor poškozený nebo špatně pojmenovaný.

Web se ale o chybějící soubor pokusí, takže se v konzoli prohlížeče ukáže
404. Když chceš mít konzoli čistou, dej klubu ve `KLUBY` dočasně
`znak: null`.
