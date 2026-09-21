# Moje Menu — PWA

Prosta aplikacja typu Progressive Web App do używania na iPhonie przez Safari.

## Co zawiera
- tygodniowe menu A–U,
- przepisy otwierane po literze,
- listę zakupów z odhaczaniem,
- sekcję „Zużyj najpierw”,
- działanie offline po pierwszym uruchomieniu.

## Jak uruchomić lokalnie na komputerze
W folderze projektu uruchom prosty serwer HTTP, np.:

```bash
python3 -m http.server 8000
```

Potem otwórz `http://localhost:8000`.

## Jak używać na iPhonie
PWA musi być otwierana z adresu HTTPS (lub z lokalnego serwera w tej samej sieci). Najprościej wrzucić cały folder na dowolny statyczny hosting HTTPS, np. GitHub Pages, Netlify, Cloudflare Pages albo Vercel.

Po otwarciu strony w Safari:
1. stuknij przycisk Udostępnij,
2. wybierz „Dodaj do ekranu początkowego”,
3. zatwierdź nazwę „Moje Menu”.

Od tej pory aplikacja uruchamia się z ikony i działa w trybie pełnoekranowym.
