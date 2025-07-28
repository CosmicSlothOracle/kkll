/**
 * CMS Loader für KOSGE
 * Lädt Bilder aus den Netlify CMS Markdown-Dateien
 */

class CMSLoader {
    constructor() {
        this.bilderData = [];
        this.isLoaded = false;
    }

    /**
     * Lädt alle Bild-Daten aus dem data/bilder/ Ordner
     */
    async loadBilder() {
        try {
            // Versuche die Bilder-Index-Datei zu laden
            const response = await fetch('/data/bilder/index.json');
            if (response.ok) {
                this.bilderData = await response.json();
            } else {
                // Fallback: Lade einzelne Markdown-Dateien
                await this.loadBilderFromFiles();
            }
            this.isLoaded = true;
            this.dispatchLoadEvent();
        } catch (error) {
            console.warn('CMS Loader: Konnte Bilder nicht laden:', error);
            this.isLoaded = true;
            this.dispatchLoadEvent();
        }
    }

    /**
     * Fallback: Lade Bilder aus einzelnen Markdown-Dateien
     */
    async loadBilderFromFiles() {
        // Hier könnten wir eine Liste bekannter Bild-Dateien laden
        // Für jetzt verwenden wir die statischen Bilder
        this.bilderData = [
            {
                title: "Event 1",
                bildurl: "https://i.postimg.cc/L5fgbxQJ/image.png",
                category: "event"
            },
            {
                title: "Event 2",
                bildurl: "https://i.postimg.cc/L5fgbxQJ/image.png",
                category: "event"
            },
            {
                title: "Event 3",
                bildurl: "https://i.postimg.cc/L5fgbxQJ/image.png",
                category: "event"
            },
            {
                title: "Event 4",
                bildurl: "https://i.postimg.cc/L5fgbxQJ/image.png",
                category: "event"
            }
        ];
    }

    /**
     * Holt Bilder nach Kategorie
     */
    getBilderByCategory(category) {
        return this.bilderData.filter(bild => bild.category === category);
    }

    /**
     * Holt alle Event-Bilder
     */
    getEventBilder() {
        return this.getBilderByCategory('event');
    }

    /**
     * Holt alle Hero-Bilder
     */
    getHeroBilder() {
        return this.getBilderByCategory('hero');
    }

    /**
     * Holt alle Hintergrund-Bilder
     */
    getBackgroundBilder() {
        return this.getBilderByCategory('background');
    }

    /**
     * Event dispatchen wenn Bilder geladen sind
     */
    dispatchLoadEvent() {
        const event = new CustomEvent('cmsBilderLoaded', {
            detail: { bilder: this.bilderData }
        });
        document.dispatchEvent(event);
    }

    /**
     * Wartet bis Bilder geladen sind
     */
    async waitForLoad() {
        if (this.isLoaded) {
            return this.bilderData;
        }

        return new Promise((resolve) => {
            document.addEventListener('cmsBilderLoaded', () => {
                resolve(this.bilderData);
            }, { once: true });
        });
    }
}

// Globale Instanz erstellen
window.cmsLoader = new CMSLoader();

// Automatisch laden wenn DOM bereit ist
document.addEventListener('DOMContentLoaded', () => {
    window.cmsLoader.loadBilder();
});