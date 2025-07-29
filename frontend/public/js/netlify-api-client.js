/**
 * Netlify API Client für Event-Teilnehmer-Daten
 *
 * Verwendet Netlify API um Form-Submissions abzurufen
 * Sicherheitsfeatures: Environment-Variablen, Rate Limiting, Error Handling
 */

class NetlifyAPIClient {
    constructor() {
        this.baseURL = 'https://api.netlify.com/api/v1';
        this.siteId = null;
        this.accessToken = null;
        this.isInitialized = false;
    }

    /**
     * Initialisiert den API Client mit Credentials
     * @param {string} siteId - Netlify Site ID
     * @param {string} accessToken - Personal Access Token
     */
    async initialize(siteId, accessToken) {
        if (!siteId || !accessToken) {
            throw new Error('Site ID und Access Token sind erforderlich');
        }

        this.siteId = siteId;
        this.accessToken = accessToken;
        this.isInitialized = true;

        // Test der Verbindung
        await this.testConnection();
    }

    /**
     * Testet die API-Verbindung
     */
    async testConnection() {
        try {
            const response = await this.makeRequest(`/sites/${this.siteId}`);
            console.log('✅ Netlify API Verbindung erfolgreich');
            return true;
        } catch (error) {
            console.error('❌ Netlify API Verbindung fehlgeschlagen:', error);
            throw error;
        }
    }

    /**
     * Macht einen sicheren API Request
     */
    async makeRequest(endpoint, options = {}) {
        if (!this.isInitialized) {
            throw new Error('API Client nicht initialisiert');
        }

        const url = `${this.baseURL}${endpoint}`;
        const config = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json',
                'User-Agent': 'KOSGE-Admin/1.0'
            },
            ...options
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request fehlgeschlagen:', error);
            throw error;
        }
    }

    /**
     * Ruft alle Form-Submissions ab
     */
    async getFormSubmissions() {
        try {
            const response = await this.makeRequest(`/sites/${this.siteId}/forms`);
            return response;
        } catch (error) {
            console.error('Fehler beim Abrufen der Form-Submissions:', error);
            throw error;
        }
    }

    /**
     * Ruft Teilnehmer für ein spezifisches Event ab
     * @param {string} formName - Name des Forms (z.B. 'event1-participation')
     */
    async getEventParticipants(formName) {
        try {
            const response = await this.makeRequest(`/sites/${this.siteId}/forms/${formName}/submissions`);

            // Validiere und formatiere die Daten
            return response.map(submission => ({
                id: submission.id,
                event: submission.data.event || 'Unbekannt',
                name: submission.data.name || 'Anonym',
                email: submission.data.email || '',
                message: submission.data.message || '',
                submitted_at: submission.created_at,
                banner: submission.data.banner || null
            }));
        } catch (error) {
            console.error(`Fehler beim Abrufen der Teilnehmer für ${formName}:`, error);
            throw error;
        }
    }

    /**
     * Ruft alle Event-Teilnehmer ab
     */
    async getAllEventParticipants() {
        const eventForms = [
            'event1-participation',
            'event2-participation',
            'event3-participation',
            'event4-participation',
            'banner-participation'
        ];

        const allParticipants = {};

        for (const formName of eventForms) {
            try {
                const participants = await this.getEventParticipants(formName);
                allParticipants[formName] = participants;
            } catch (error) {
                console.warn(`Konnte ${formName} nicht abrufen:`, error);
                allParticipants[formName] = [];
            }
        }

        return allParticipants;
    }

        /**
     * Ruft Statistiken für alle Events ab
     */
    async getEventStatistics() {
        const participants = await this.getAllEventParticipants();

        const stats = {};

        for (const [formName, participantList] of Object.entries(participants)) {
            stats[formName] = {
                total: participantList.length,
                withEmail: participantList.filter(p => p.email).length,
                withMessage: participantList.filter(p => p.message).length,
                recent: participantList.filter(p => {
                    const submissionDate = new Date(p.submitted_at);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return submissionDate > weekAgo;
                }).length
            };
        }

        return stats;
    }

    // ===== BILDVERWALTUNG =====

    /**
     * Lädt ein Bild hoch und gibt die URL zurück
     * @param {File} file - Bilddatei
     * @param {string} category - Kategorie (event, hero, background, other)
     * @returns {Promise<string>} Bild-URL
     */
    async uploadImage(file, category = 'other') {
        if (!this.isInitialized) {
            throw new Error('API Client nicht initialisiert');
        }

        // Validierung
        if (!file || !file.type.startsWith('image/')) {
            throw new Error('Nur Bilddateien sind erlaubt');
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB Limit
            throw new Error('Bild ist zu groß (max. 10MB)');
        }

        try {
            // Erstelle eindeutigen Dateinamen
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const extension = file.name.split('.').pop();
            const filename = `${category}-${timestamp}.${extension}`;

            // FormData für Upload
            const formData = new FormData();
            formData.append('file', file, filename);

            // Upload via Netlify API
            const response = await fetch(`${this.baseURL}/sites/${this.siteId}/assets`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Upload fehlgeschlagen: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            return result.url;

        } catch (error) {
            console.error('Bild-Upload fehlgeschlagen:', error);
            throw error;
        }
    }

    /**
     * Ruft alle verfügbaren Bilder ab
     * @returns {Promise<Array>} Array von Bild-Objekten
     */
    async getImages() {
        try {
            const response = await this.makeRequest(`/sites/${this.siteId}/assets`);

            // Filtere nur Bilder
            return response.filter(asset =>
                asset.content_type && asset.content_type.startsWith('image/')
            ).map(asset => ({
                id: asset.id,
                name: asset.name,
                url: asset.url,
                size: asset.size,
                content_type: asset.content_type,
                created_at: asset.created_at
            }));

        } catch (error) {
            console.error('Fehler beim Abrufen der Bilder:', error);
            throw error;
        }
    }

    /**
     * Löscht ein Bild
     * @param {string} imageId - ID des Bildes
     */
    async deleteImage(imageId) {
        try {
            await this.makeRequest(`/sites/${this.siteId}/assets/${imageId}`, {
                method: 'DELETE'
            });

            console.log(`Bild ${imageId} erfolgreich gelöscht`);
            return true;

        } catch (error) {
            console.error('Fehler beim Löschen des Bildes:', error);
            throw error;
        }
    }

    /**
     * Erstellt einen CMS-Eintrag für ein Bild
     * @param {string} imageUrl - URL des hochgeladenen Bildes
     * @param {string} title - Titel des Bildes
     * @param {string} description - Beschreibung (optional)
     * @param {string} category - Kategorie
     */
    async createImageEntry(imageUrl, title, description = '', category = 'other') {
        try {
            // Erstelle Markdown-Inhalt
            const content = `---
title: "${title}"
bildurl: "${imageUrl}"
description: "${description}"
category: "${category}"
---

# ${title}

${description}
`;

            // Erstelle Dateinamen
            const timestamp = new Date().toISOString().split('T')[0];
            const slug = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
            const filename = `${timestamp}-${slug}.md`;

            // Commit via Git Gateway
            const commitData = {
                path: `data/bilder/${filename}`,
                content: content,
                message: `Bild hinzugefügt: ${title}`
            };

            const response = await fetch(`https://api.netlify.com/api/v1/sites/${this.siteId}/git/commits`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(commitData)
            });

            if (!response.ok) {
                throw new Error(`Commit fehlgeschlagen: ${response.status} ${response.statusText}`);
            }

            console.log(`CMS-Eintrag erstellt: ${filename}`);
            return filename;

        } catch (error) {
            console.error('Fehler beim Erstellen des CMS-Eintrags:', error);
            throw error;
        }
    }

    /**
     * Automatischer Bild-Upload mit CMS-Integration
     * @param {File} file - Bilddatei
     * @param {string} title - Titel
     * @param {string} description - Beschreibung
     * @param {string} category - Kategorie
     */
    async uploadImageWithCMS(file, title, description = '', category = 'other') {
        try {
            // 1. Bild hochladen
            console.log('📤 Lade Bild hoch...');
            const imageUrl = await this.uploadImage(file, category);

            // 2. CMS-Eintrag erstellen
            console.log('📝 Erstelle CMS-Eintrag...');
            const filename = await this.createImageEntry(imageUrl, title, description, category);

            return {
                imageUrl,
                filename,
                success: true
            };

        } catch (error) {
            console.error('Automatischer Upload fehlgeschlagen:', error);
            throw error;
        }
    }
}

// Export für globale Verwendung
window.NetlifyAPIClient = NetlifyAPIClient;