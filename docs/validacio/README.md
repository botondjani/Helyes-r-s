# Validációs fázis (2026. okt. 26. – dec. 5.)

A cél: **fejlesztés előtt** kideríteni, van-e elég kereslet és fizetési hajlandóság. Részletek: [üzleti terv, 12–13. fejezet](../uzleti-terv.md).

## Döntési kapuk
| Kapu | Határidő | Tovább, ha… | Leállás, ha… |
|---|---|---|---|
| **0. Kereslet** | **2026. nov. 7.** | A top 20 kulcsszó együtt **≥ 20 000 keresés/hó**, és **≥ 6/10** interjúalany „kipróbálná, fizetne” | < 10 000 keresés/hó **és** ≤ 2/10 |
| **1. Fake-door** | **2026. dec. 5.** | A mini-gyakorlót végigcsinálók **≥ 3%-a** kattint a „Teljes csomag, értesíts” gombra, és **≥ 150** feliratkozó | < 1% |

## Teendők
### 1. hét (okt. 26. – nov. 1.)
- [x] Név- és domainellenőrzés → [nev-es-domain.md](nev-es-domain.md)
- [x] Kulcsszólista előkészítése → [kulcsszavak.csv](kulcsszavak.csv), útmutató: [kulcsszo-utmutato.md](kulcsszo-utmutato.md)
- [ ] **Te:** Keyword Planner-lekérdezés (kb. 30 perc), az eredmény beírása a CSV-be
- [x] Versenytárs-áttekintés első köre → [versenytarsak.md](versenytarsak.md)
- [ ] **Te:** az Okosdoboz és az áruházi találatok kézi átnézése a versenytárs-fájl ellenőrzőlistája szerint (kb. 1 óra)
- [x] Interjú-útmutató és toborzószövegek → [interju-utmutato.md](interju-utmutato.md)
- [ ] **Te:** 10 interjúalany megkeresése (5 szülő, ebből 3 diszgráfiás gyerekkel; 3 fejlesztőpedagógus; 2 tanító)

### 2. hét (nov. 2. – 8.)
- [ ] 10 interjú lebonyolítása (20–30 perc, online is jó)
- [ ] Az interjú-összesítő kitöltése → **0. kapu, nov. 7.**

### 3. hét (nov. 9. – 15.)
- [x] Ingyenes j/ly mini-gyakorló „értesíts” gombbal (vázlat kész) → [`site/`](../../site/)
- [ ] **Te:** a domain megvásárlása, a várólista-űrlap létrehozása, élesítés (Cloudflare Pages)
- [ ] 3 SEO-oldal élesítése (az első: [`site/j-vagy-ly/`](../../site/j-vagy-ly/))

### 4–6. hét (nov. 16. – dec. 5.)
- [ ] Napi 1 SEO-oldal (szólisták, évfolyam-feladatok)
- [ ] 30 fejlesztőpedagógus megkeresése (szöveg: interjú-útmutató, „B” sablon)
- [ ] Hasznos posztok szülői csoportokban (szöveg: interjú-útmutató, „C” sablon)
- [ ] **1. kapu, dec. 5.**

## Mérés (backend nélkül, a validációhoz)
- **Látogatók:** Cloudflare Web Analytics (sütimentes).
- **Gombkattintás:** a „Teljes csomag, értesíts” gomb a várólista-űrlapra visz. Az **űrlapmegnyitások** száma ÷ a mini-gyakorlót befejezők száma = kattintási arány. Az űrlap saját statisztikája mutatja a megnyitásokat.
- **Feliratkozók:** a várólista-űrlap beküldései.
