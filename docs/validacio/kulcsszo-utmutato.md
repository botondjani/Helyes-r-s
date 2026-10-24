# Kulcsszó-felmérés: lépésről lépésre (kb. 30 perc)

Volumenadatot egyik elérhető connector sem adott (Semrush: nincs API-egység, Similarweb: nincs kredit), ezért a **Google Keyword Plannert** használjuk. Ingyenes, csak egy Google Ads-fiók kell hozzá, kampányt nem kell indítani.

## Lépések
1. Nyisd meg: **ads.google.com → Eszközök → Kulcsszótervező**. Ha az Ads új kampányt kér, válaszd az „Expert mode” / „Szakértői mód” lehetőséget, és lépj ki kampány nélkül.
2. **„Keresési mennyiség és előrejelzések”** → másold be a [`kulcsszavak.csv`](kulcsszavak.csv) első oszlopát (a kulcsszavakat ékezetesen is beírhatod).
3. **Hely:** Magyarország. **Nyelv:** magyar. **Időszak:** az elmúlt 12 hónap.
4. Exportáld CSV-be, és írd be az értékeket a `havi_kereses_also` és a `havi_kereses_felso` oszlopba. Fizetett Ads-költés nélkül a Google sávokat ad, pl. „1E–10E”.
5. A **„Kulcsszóötletek felfedezése”** fülön írd be: `j ly`, `helyesírás feladatok`, `diszgráfia`. A 10 legjobb új ötletet add hozzá a CSV-hez.

## Kiegészítő, ingyenes jelzések
- **Google Trends** (trends.google.com, Magyarország, 5 év): „helyesírás feladatok”, „diszgráfia”. Ebből a szezonalitás és a trend látszik.
- **Google automatikus kiegészítés:** gépeld be: „j ly ”, „helyesírás feladatok ”, „tollbamondás ”, és jegyezd fel a javaslatokat.
- **„Kapcsolódó kérdések”** a Google-találatoknál: ezek lesznek a SEO-oldalak kérdései.

## Hogyan értékeljük (0. kapu)
- A sávok alsó és felső értékének középértékét összeadjuk a **top 20 kulcsszóra** (volumen szerint).
- **Tovább:** ≥ 20 000/hó. **Szürke zóna:** 10 000–20 000. **Leállás:** < 10 000 (ha az interjúk is gyengék).
- Külön nézzük a **diszgráfia** csoportot: ha itt ≥ 3000/hó a kereslet, a szakemberi csatorna erős.
