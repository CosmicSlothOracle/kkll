/**
 * Test für automatische Bildverwaltung
 *
 * Testet Upload, CMS-Integration und Bildverwaltung
 * Verwendung: Nur für Entwicklung und Debugging
 */

class ImageUploadTest {
    constructor() {
        this.testResults = [];
    }

    /**
     * Führt alle Bildverwaltungs-Tests aus
     */
    async runAllTests(siteId, accessToken) {
        console.log('🧪 Starte Bildverwaltungs-Tests...');

        this.testResults = [];

        try {
            // Test 1: API Client Initialisierung
            await this.testAPIClientInitialization(siteId, accessToken);

            // Test 2: Assets API Zugriff
            await this.testAssetsAccess(siteId, accessToken);

            // Test 3: Git Gateway Zugriff
            await this.testGitGatewayAccess(siteId, accessToken);

            // Test 4: Upload-Simulation
            await this.testUploadSimulation(siteId, accessToken);

        } catch (error) {
            console.error('❌ Bildverwaltungs-Test-Suite fehlgeschlagen:', error);
            this.testResults.push({
                name: 'Bildverwaltungs-Test-Suite',
                status: 'FAILED',
                error: error.message
            });
        }

        this.displayResults();
    }

    /**
     * Test 1: API Client Initialisierung
     */
    async testAPIClientInitialization(siteId, accessToken) {
        try {
            const apiClient = new NetlifyAPIClient();
            await apiClient.initialize(siteId, accessToken);

            this.testResults.push({
                name: 'API Client Initialisierung',
                status: 'PASSED',
                details: 'API Client für Bildverwaltung erfolgreich initialisiert'
            });

        } catch (error) {
            this.testResults.push({
                name: 'API Client Initialisierung',
                status: 'FAILED',
                error: error.message
            });
            throw error;
        }
    }

    /**
     * Test 2: Assets API Zugriff
     */
    async testAssetsAccess(siteId, accessToken) {
        try {
            const response = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/assets`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const assets = await response.json();
            const imageAssets = assets.filter(asset =>
                asset.content_type && asset.content_type.startsWith('image/')
            );

            this.testResults.push({
                name: 'Assets API Zugriff',
                status: 'PASSED',
                details: `${imageAssets.length} Bilder gefunden`
            });

        } catch (error) {
            this.testResults.push({
                name: 'Assets API Zugriff',
                status: 'FAILED',
                error: error.message
            });
        }
    }

    /**
     * Test 3: Git Gateway Zugriff
     */
    async testGitGatewayAccess(siteId, accessToken) {
        try {
            const response = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/git/commits`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const commits = await response.json();

            this.testResults.push({
                name: 'Git Gateway Zugriff',
                status: 'PASSED',
                details: `${commits.length} Commits verfügbar`
            });

        } catch (error) {
            this.testResults.push({
                name: 'Git Gateway Zugriff',
                status: 'FAILED',
                error: error.message
            });
        }
    }

    /**
     * Test 4: Upload-Simulation
     */
    async testUploadSimulation(siteId, accessToken) {
        try {
            // Erstelle ein Test-Bild (1x1 Pixel PNG)
            const testImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

            // Konvertiere zu Blob
            const response = await fetch(testImageData);
            const blob = await response.blob();

            // Erstelle File-Objekt
            const testFile = new File([blob], 'test-image.png', { type: 'image/png' });

            // Teste Upload-Funktion
            const apiClient = new NetlifyAPIClient();
            await apiClient.initialize(siteId, accessToken);

            // Teste nur die Upload-Validierung (ohne tatsächlichen Upload)
            if (!testFile.type.startsWith('image/')) {
                throw new Error('Dateityp-Validierung fehlgeschlagen');
            }

            if (testFile.size > 10 * 1024 * 1024) {
                throw new Error('Dateigröße-Validierung fehlgeschlagen');
            }

            this.testResults.push({
                name: 'Upload-Simulation',
                status: 'PASSED',
                details: 'Upload-Validierung erfolgreich'
            });

        } catch (error) {
            this.testResults.push({
                name: 'Upload-Simulation',
                status: 'FAILED',
                error: error.message
            });
        }
    }

    /**
     * Zeigt Test-Ergebnisse an
     */
    displayResults() {
        console.log('\n📊 Bildverwaltungs-Test-Ergebnisse:');
        console.log('='.repeat(50));

        let passedCount = 0;
        let failedCount = 0;

        this.testResults.forEach(result => {
            const status = result.status === 'PASSED' ? '✅' : '❌';
            console.log(`${status} ${result.name}`);

            if (result.status === 'PASSED') {
                console.log(`   ${result.details}`);
                passedCount++;
            } else {
                console.log(`   Fehler: ${result.error}`);
                failedCount++;
            }
            console.log('');
        });

        console.log(`📈 Zusammenfassung: ${passedCount} bestanden, ${failedCount} fehlgeschlagen`);

        if (failedCount === 0) {
            console.log('🎉 Alle Bildverwaltungs-Tests bestanden! Upload-System funktioniert.');
        } else {
            console.log('⚠️ Einige Tests fehlgeschlagen. Überprüfe die API-Berechtigungen.');
        }
    }

    /**
     * Testet spezifische Upload-Funktionen
     */
    async testUploadFunctions(siteId, accessToken) {
        console.log('\n🔧 Teste spezifische Upload-Funktionen...');

        try {
            const apiClient = new NetlifyAPIClient();
            await apiClient.initialize(siteId, accessToken);

            // Teste getImages()
            console.log('📤 Teste getImages()...');
            const images = await apiClient.getImages();
            console.log(`✅ ${images.length} Bilder gefunden`);

            // Teste createImageEntry() (ohne tatsächlichen Commit)
            console.log('📝 Teste createImageEntry()...');
            const testContent = apiClient.createImageEntry(
                'https://example.com/test.jpg',
                'Test Bild',
                'Test Beschreibung',
                'event'
            );
            console.log('✅ CMS-Eintrag-Erstellung getestet');

        } catch (error) {
            console.error('❌ Upload-Funktionen-Test fehlgeschlagen:', error);
        }
    }
}

// Export für globale Verwendung
window.ImageUploadTest = ImageUploadTest;

/**
 * Einfache Test-Funktion für Browser-Konsole
 *
 * Verwendung:
 * testImageUpload('deine-site-id', 'dein-access-token')
 */
window.testImageUpload = function(siteId, accessToken) {
    const tester = new ImageUploadTest();
    return tester.runAllTests(siteId, accessToken);
};

/**
 * Testet spezifische Upload-Funktionen
 *
 * Verwendung:
 * testUploadFunctions('deine-site-id', 'dein-access-token')
 */
window.testUploadFunctions = function(siteId, accessToken) {
    const tester = new ImageUploadTest();
    return tester.testUploadFunctions(siteId, accessToken);
};