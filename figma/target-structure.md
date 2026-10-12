# Target production structure

```text
src/
  app/
    App.jsx
    AppRouter.jsx
    AppShell.jsx
  assets/
    fonts/
    images/
  components/
    feedback/
      EmptyState.jsx
      ErrorState.jsx
      LoadingSkeleton.jsx
    layout/
      AppHeader.jsx
      MobileBottomNav.jsx
      PageHeader.jsx
      SiteFooter.jsx
    ui/
      Button.jsx
      IconButton.jsx
      SearchField.jsx
      SelectField.jsx
      SourceBadge.jsx
  features/
    adhkar/
      api/adhkarApi.js
      components/DhikrCard.jsx
      pages/AdhkarPage.jsx
    hadith/
      api/hadithApi.js
      components/HadithCard.jsx
      pages/HadithPage.jsx
    prayer-times/
      api/prayerTimesApi.js
      components/PrayerTimesTable.jsx
      pages/PrayerTimesPage.jsx
    quran/
      api/quranApi.js
      api/recitationsApi.js
      components/AudioPlayer.jsx
      components/SurahPicker.jsx
      components/Verse.jsx
      data/surahs.js
      hooks/useQuranReader.js
      pages/QuranReaderPage.jsx
    tafsir/
      api/tafsirApi.js
      components/TafsirPanel.jsx
      pages/TafsirPage.jsx
  lib/
    httpClient.js
    storage.js
  styles/
    globals.css
    tokens.css
  main.jsx
```

## Migration order

1. Add tokens and the new app shell without moving feature behavior.
2. Introduce the shared surah dataset and API client/error model.
3. Refactor Quran first because it contains the most shared state and audio.
4. Refactor Tafsir to reuse surah metadata and Quran content primitives.
5. Refactor Prayer Times, Hadith, and Adhkar one feature at a time.
6. Remove old wrappers and generic files only after their imports reach zero.

Keep each step buildable. Do not rename and redesign every feature in one commit.
