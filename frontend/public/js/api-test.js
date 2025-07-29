/**
 * Einfacher Test für Netlify API-Integration
 *
 * Testet die API-Verbindung und zeigt Ergebnisse an
 * Verwendung: Nur für Entwicklung und Debugging
 */

class NetlifyAPITest {
    constructor() {
        this.testResults = [];
    }

    /**
     * Führt alle Tests aus
     */
    async runAllTests(siteId, accessToken) {
        console.log('🧪 Starte Netlify API Tests...');

        this.testResults = [];

        try {
            // Test 1: API Client Initialisierung
            await this.testAPIClientInitialization(siteId, accessToken);

            // Test 2: Site Information
            await this.testSiteInformation(siteId, accessToken);

            // Test 3: Forms Access
            await this.testFormsAccess(siteId, accessToken);

            // Test 4: Submissions Access
            await this.testSubmissionsAccess(siteId, accessToken);

        } catch (error) {
            console.error('❌ Test-Suite fehlgeschlagen:', error);
            this.testResults.push({
                name: 'Test-Suite',
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
                details: 'API Client erfolgreich initialisiert'
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
     * Test 2: Site Information abrufen
     */
    async testSiteInformation(siteId, accessToken) {
        try {
            const response = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const siteData = await response.json();

            this.testResults.push({
                name: 'Site Information',
                status: 'PASSED',
                details: `Site: ${siteData.name} (${siteData.url})`
            });

        } catch (error) {
            this.testResults.push({
                name: 'Site Information',
                status: 'FAILED',
                error: error.message
            });
        }
    }

    /**
     * Test 3: Forms Zugriff
     */
    async testFormsAccess(siteId, accessToken) {
        try {
            const response = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/forms`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const formsData = await response.json();

            this.testResults.push({
                name: 'Forms Zugriff',
                status: 'PASSED',
                details: `${formsData.length} Forms gefunden`
            });

        } catch (error) {
            this.testResults.push({
                name: 'Forms Zugriff',
                status: 'FAILED',
                error: error.message
            });
        }
    }

    /**
     * Test 4: Submissions Zugriff
     */
    async testSubmissionsAccess(siteId, accessToken) {
        const testForms = ['event1-participation', 'banner-participation'];
        let successCount = 0;

        for (const formName of testForms) {
            try {
                const response = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/forms/${formName}/submissions`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const submissions = await response.json();
                    successCount++;
                    console.log(`✅ ${formName}: ${submissions.length} Submissions`);
                }

            } catch (error) {
                console.warn(`⚠️ ${formName}: ${error.message}`);
            }
        }

        if (successCount > 0) {
            this.testResults.push({
                name: 'Submissions Zugriff',
                status: 'PASSED',
                details: `${successCount}/${testForms.length} Forms erfolgreich`
            });
        } else {
            this.testResults.push({
                name: 'Submissions Zugriff',
                status: 'FAILED',
                error: 'Keine Submissions gefunden'
            });
        }
    }

    /**
     * Zeigt Test-Ergebnisse an
     */
    displayResults() {
        console.log('\n📊 Test-Ergebnisse:');
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
            console.log('🎉 Alle Tests bestanden! API-Integration funktioniert.');
        } else {
            console.log('⚠️ Einige Tests fehlgeschlagen. Überprüfe die Credentials.');
        }
    }
}

// Export für globale Verwendung
window.NetlifyAPITest = NetlifyAPITest;

/**
 * Einfache Test-Funktion für Browser-Konsole
 *
 * Verwendung:
 * testNetlifyAPI('deine-site-id', 'dein-access-token')
 */
window.testNetlifyAPI = function(siteId, accessToken) {
    const tester = new NetlifyAPITest();
    return tester.runAllTests(siteId, accessToken);
};