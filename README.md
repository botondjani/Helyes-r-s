# Helyesírás-gyakorló

Webes gyakorlóplatform gyerekeknek, elsőként helyesírással (1–8. osztály), diszgráfia-barát móddal. Később natív app és más tantárgyak (szorzótábla, nyelvtan, angol) ugyanazzal a feladatmotorral.

## Dokumentumok
- [Üzleti terv, mélyelemzés, cselekvési terv](docs/uzleti-terv.md): **ez az aktuális terv.**
- [Összevetés: költözési dobozleltár vs. helyesírás-gyakorló](docs/elemzes-doboz-vs-helyesiras.md)
- Az ötletválasztáshoz vezető kutatás (háttéranyag, `docs/kutatas/`):
  - [Vaultaire-recept és az első ötletkörök](docs/kutatas/vaultaire-recept-terv.md)
  - [Budapesti piactér-ötletek](docs/kutatas/piacter-otletek.md)
  - [Időszerű projektek egységgazdaságtannal](docs/kutatas/idoszeru-projektek.md)
  - [Szerver nélküli ötletek](docs/kutatas/szerver-nelkuli-otletek.md)

## Állapot
**Validációs fázis (2026. okt. 26. – dec. 5.):** teendők és döntési kapuk: [docs/validacio/](docs/validacio/README.md).

## Weboldal (`site/`)
Statikus fake-door oldal: ingyenes, 10 feladatos j/ly gyakorló „értesíts” gombbal, és egy SEO-oldal (`site/j-vagy-ly/`). Élesítés előtt az `app.js`-ben a `WAITLIST_URL`-t a várólista-űrlap címére kell állítani. Helyben megnyitható: `site/index.html`.
