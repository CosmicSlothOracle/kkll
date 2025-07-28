# KOSGE Website - Netlify Forms Version

## Überblick

Dies ist die offizielle Website für Kollektiv für solidarische Gesundheit e.V. (KOSGE), ein Kollektiv für solidarische Gesundheit in Berlin. Die Website ist mehrsprachig, responsiv und zugänglich gestaltet.

## Features

### Mehrsprachigkeit

- Die Website ist in mehreren Sprachen verfügbar:
  - Deutsch (Standard)
  - Englisch
  - Türkisch
  - Russisch
  - Arabisch
  - Einfache Sprache (Deutsch)
- Sprachauswahl ist in der oberen rechten Ecke der Website verfügbar
- Benutzerspracheinstellungen werden im Browser-LocalStorage gespeichert

### Responsive Design

- Die Website ist vollständig responsiv und funktioniert auf allen Geräten (Desktop, Tablet, Mobile)
- Adaptives Layout, das sich je nach Bildschirmgröße ändert
- Mobile-freundliche Navigation

### Interaktive Elemente

- Hero-Slideshow mit automatischen Übergängen
- Hover-Effekte auf interaktiven Elementen für bessere Benutzererfahrung
- Sanfte Übergänge und Animationen

### Netlify Forms Integration

- Event-Teilnahme-Formulare verwenden Netlify Forms
- Banner-Auswahl-Formular auf der Teilnahme-Seite
- Automatische Datenspeicherung im Netlify Dashboard
- Keine Backend-Abhängigkeiten

## Projektstruktur

```
frontend/
├── public/                    # Statische Frontend-Dateien
│   ├── index.html            # Hauptseite (Deutsch)
│   ├── teilnahme.html        # Teilnahme-Seite
│   ├── _redirects            # Netlify Redirects
│   ├── css/                  # Stylesheets
│   │   ├── admin.css        # Admin Styles (nicht mehr verwendet)
│   │   └── style.css        # Hauptstyles
│   ├── img/                  # Bilder
│   │   └── kosge_logo.svg   # KOSGE Logo
│   ├── js/                   # JavaScript-Dateien
│   │   ├── logo-animation.js # Logo Animation
│   │   └── main.js          # Haupt-JavaScript
│   └── locales/              # Frontend Lokalisierung
│       ├── ar.html          # Arabisch
│       ├── einfach.html     # Einfach Deutsch
│       ├── en.html          # Englisch
│       ├── ru.html          # Russisch
│       └── tr.html          # Türkisch
├── locales/                  # Übersetzungsdateien
│   ├── ar.html              # Arabische Lokalisierung
│   ├── einfach.html         # Einfache deutsche Lokalisierung
│   ├── en.html              # Englische Lokalisierung
│   ├── language_config.json # Sprachkonfiguration
│   ├── ru.html              # Russische Lokalisierung
│   └── tr.html              # Türkische Lokalisierung
└── translate_tool/           # Übersetzungstools
    ├── translate_html.py    # HTML Übersetzungstool
    └── translation_validator.py # Übersetzungsvalidierung
```

## Netlify Forms

Die Website verwendet Netlify Forms für alle Benutzerdaten:

### Event-Teilnahme-Formulare

- `event1-participation` - Teilnahme für Event 1
- `event2-participation` - Teilnahme für Event 2
- `event3-participation` - Teilnahme für Event 3
- `event4-participation` - Teilnahme für Event 4

### Banner-Teilnahme-Formular

- `banner-participation` - Banner-Auswahl und Teilnahme

Alle Formulardaten werden automatisch im Netlify Dashboard gespeichert und können dort eingesehen werden.

## Lokale Entwicklung

Um die Website lokal zu starten:

1. Repository klonen
2. In das Projektverzeichnis navigieren
3. Lokalen Webserver starten:
   ```
   cd frontend/public
   python -m http.server 8000
   ```
4. Browser öffnen und zu `http://localhost:8000` navigieren

## Deployment

Die Website wird automatisch über Netlify deployed:

- **Frontend**: Netlify (https://berlin-kosge.netlify.app)
- **Forms**: Netlify Forms (automatisch integriert)
- **Assets**: Externe Links (Storj, Postimg)

## Übersetzung

Die Website verwendet ein benutzerdefiniertes Python-Skript für Übersetzungen. Um Übersetzungen zu aktualisieren:

1. Änderungen an der Hauptdatei `index.html` (Deutsche Version) vornehmen
2. Übersetzungsskript ausführen:
   ```
   python translate_tool/translate_html.py
   ```
3. Das Skript generiert aktualisierte HTML-Dateien für alle unterstützten Sprachen im `locales/` Verzeichnis

## Kontakt

Bei Fragen oder Problemen kontaktieren Sie bitte:

- E-Mail: info@kosge-berlin.de
- Telefon: +49 1520 7240947
