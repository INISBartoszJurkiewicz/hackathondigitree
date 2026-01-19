# Koncepcja 1 – Minimalistyczna Brutalistyczna

Styl inspirowany [effica.framer.ai](https://effica.framer.ai/?utm_source=framer): maksymalny kontrast, typografia jako główny nośnik, zero zbędnych ozdobników.

## Główny klimat
- Czerń #000 jako tło, tekst #F0F0F0, akcent #FFD700.
- Brak gradientów; jedynie płaskie kolory i cienkie linie akcentów.
- Duże nagłówki (96–120 px), masywne CTA, puste przestrzenie.

## Układ strony
- **Hero (100vh):** gigantyczny tytuł „Hack Digitree 2026”, podtytuł o idei, licznik startu (puls), pojedynczy CTA „Zarejestruj się”.
- **O co chodzi (2 kolumny):** Ideator vs Creator, separator linią żółtą, krótkie opisy i mikro-benefity.
- **Timeline (pionowy):** Październik (zapisy/pomysły) → Listopad (formowanie zespołów) → Weekend (hackowanie) → Poniedziałek (Demo Day).
- **Trzy segmenty:** Usprawnienie procesów, Komunikacja i współpraca, Digitree Open; duże numery 01/02/03 w tle, kryteria oceny i kto wybiera zwycięzcę.
- **Formularz:** Toggle Ideator/Creator, dla Ideatora textarea + kategoria, dla Creatora pola umiejętności; czarne tło, białe pola, żółty focus.
- **Live Hub:** Stream + agenda godzinowa + lekki ticker statusu (online/on-site); leaderboard po ocenie.
- **Jury i nagrody:** Kwoty liczące się od 0 do docelowej, puchary, wyróżnienie coachów.
- **FAQ:** Akordeon, proste pytania/odpowiedzi.
- **Footer:** Minimalistyczny, logo i linki.

## Mikroanimacje
- Fade/slide-in sekcji przy scrollu (GSAP ScrollTrigger).
- Glitch na przyciskach przy hoverze (2–3 px „drżenia”).
- Kinetic typography w hero (delikatny parallax liter).
- Countdown z krótkim bounce przy zmianie cyfr.
- Linki z podkreśleniem wjeżdżającym z lewej.
- Sekcje lekko „przyklejają się” przy przewijaniu (pinning).

## CTA i ścieżki
- Primary: „Zarejestruj się” (Ideator/Creator).
- Secondary: „Zgłoś pomysł” (preselect Ideator), „Dołącz jako Creator”.
- W trakcie eventu: „Oglądaj live”, po ocenie: „Zobacz leaderboard”.

## Wskazówki techniczne
- Next.js + Tailwind; animacje GSAP (ScrollTrigger) lub Framer Motion dla hover.
- Lenis dla smooth scroll.
- Formy: Supabase/Firebase auth + zapisy do DB.
- Obrazy WebP, lazy loading; transform/opacity dla płynności (GPU).

