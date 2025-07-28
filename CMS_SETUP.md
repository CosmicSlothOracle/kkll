# 🎯 KOSGE CMS Setup - Bild-Management

## ✅ Ziel erreicht!

Person gibt eine Bild-URL ein → klickt „Speichern" → GitHub Commit → Netlify auto-deployt → Bild erscheint im Frontend

## 🔧 Implementierte Komponenten

### 1. Admin-Interface

- **Datei**: `/admin/index.html`
- **URL**: `https://deine-domain.netlify.app/admin`
- **Features**: Netlify CMS Interface mit KOSGE-Design

### 2. CMS-Konfiguration

- **Datei**: `/admin/config.yml`
- **Features**:
  - Bild-URL Eingabe
  - Titel und Beschreibung
  - Kategorien (event, hero, background, other)
  - Automatische Slug-Generierung

### 3. Datenstruktur

- **Ordner**: `/data/bilder/`
- **Format**: Markdown-Dateien mit Frontmatter
- **Beispiel**:
  ```markdown
  ---
  title: "Event 1"
  bildurl: "https://example.com/bild.jpg"
  description: "Beschreibung des Bildes"
  category: "event"
  ---
  ```

### 4. Frontend-Integration

- **Script**: `/frontend/public/js/cms-loader.js`
- **Link**: Footer-Link "Bilder verwalten"
- **Features**: Automatisches Laden der CMS-Bilder

## 🚀 Netlify Setup (einmalig)

### Schritt 1: Identity aktivieren

1. Gehe zu [Netlify Dashboard](https://app.netlify.com)
2. Wähle dein Projekt
3. Gehe zu **Site settings** → **Identity**
4. Klicke **Enable Identity**

### Schritt 2: Git Gateway aktivieren

1. Gehe zu **Site settings** → **Identity** → **Services**
2. Klicke **Enable Git Gateway**

### Schritt 3: Benutzer einladen

1. Gehe zu **Identity** → **Users**
2. Klicke **Invite users**
3. Gib deine E-Mail-Adresse ein
4. Bestätige die Einladung per E-Mail

## 📝 Verwendung

### 1. Admin-Zugang

- Gehe zu `https://deine-domain.netlify.app/admin`
- Logge dich mit deiner E-Mail-Adresse ein
- Du erhältst ein Passwort per E-Mail

### 2. Bild hinzufügen

1. Klicke **"New Bild-Links"**
2. Fülle die Felder aus:
   - **Titel**: Name des Bildes
   - **Bild-URL**: Vollständige URL zum Bild
   - **Beschreibung**: Optional
   - **Kategorie**: event, hero, background oder other
3. Klicke **"Publish"**

### 3. Automatisches Deploy

- Netlify erstellt automatisch einen GitHub Commit
- Deploy startet automatisch
- Nach 1-2 Minuten ist das Bild im Frontend verfügbar

## 🔧 Technische Details

### Ordnerstruktur

```
ko-2/
├── admin/
│   ├── config.yml          # CMS-Konfiguration
│   └── index.html          # Admin-Interface
├── data/
│   └── bilder/             # Markdown-Dateien
├── frontend/
│   └── public/
│       ├── js/
│       │   └── cms-loader.js  # CMS-Loader
│       └── index.html         # Frontend mit Admin-Link
└── netlify.toml            # Netlify-Konfiguration
```

### JavaScript API

```javascript
// Warten bis Bilder geladen sind
await window.cmsLoader.waitForLoad();

// Bilder nach Kategorie holen
const eventBilder = window.cmsLoader.getEventBilder();
const heroBilder = window.cmsLoader.getHeroBilder();
const backgroundBilder = window.cmsLoader.getBackgroundBilder();
```

## 🎨 Frontend-Integration

Das CMS ist bereits in das Frontend integriert:

1. **Admin-Link**: Im Footer unter "Bilder verwalten"
2. **CMS-Loader**: Automatisches Laden der Bilder
3. **Event-System**: `cmsBilderLoaded` Event für Custom-Integration

## 🔒 Sicherheit

- **Admin-Zugang**: Nur eingeladene Benutzer
- **Git Gateway**: Sichere Verbindung zu GitHub
- **HTTPS**: Automatisch von Netlify bereitgestellt

## 🚨 Troubleshooting

### Problem: Admin-Seite lädt nicht

- **Lösung**: Prüfe ob Identity in Netlify aktiviert ist
- **Prüfung**: Gehe zu Site settings → Identity

### Problem: Bilder werden nicht angezeigt

- **Lösung**: Prüfe die Bild-URLs im CMS
- **Prüfung**: Öffne die Markdown-Dateien in `/data/bilder/`

### Problem: Deploy schlägt fehl

- **Lösung**: Prüfe die GitHub-Berechtigungen
- **Prüfung**: Gehe zu Site settings → Build & deploy → Environment

## ✅ Status: Fertig!

Das CMS-System ist vollständig implementiert und einsatzbereit. Nach dem Netlify-Setup können Bilder über das Admin-Interface verwaltet werden.
