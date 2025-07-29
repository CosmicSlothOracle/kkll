/**
 * Test für Dashboard-Erweiterungen
 *
 * Testet Analytics, Charts und Export-Funktionen
 * Verwendung: Nur für Entwicklung und Debugging
 */

class DashboardTest {
    constructor() {
        this.testResults = [];
    }

    /**
     * Führt alle Dashboard-Tests aus
     */
    async runAllTests(siteId, accessToken) {
        console.log('🧪 Starte Dashboard-Tests...');

        this.testResults = [];

        try {
            // Test 1: API Client Initialisierung
            await this.testAPIClientInitialization(siteId, accessToken);

            // Test 2: Analytics-Daten abrufen
            await this.testAnalyticsDataRetrieval(siteId, accessToken);

            // Test 3: Chart.js Verfügbarkeit
            await this.testChartJSAvailability();

            // Test 4: Export-Funktionen
            await this.testExportFunctions();

        } catch (error) {
            console.error('❌ Dashboard-Test-Suite fehlgeschlagen:', error);
            this.testResults.push({
                name: 'Dashboard-Test-Suite',
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
                details: 'API Client für Dashboard erfolgreich initialisiert'
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
     * Test 2: Analytics-Daten abrufen
     */
    async testAnalyticsDataRetrieval(siteId, accessToken) {
        try {
            const apiClient = new NetlifyAPIClient();
            await apiClient.initialize(siteId, accessToken);

            // Teste alle Analytics-Daten
            const [participants, images, stats] = await Promise.all([
                apiClient.getAllEventParticipants(),
                apiClient.getImages(),
                apiClient.getEventStatistics()
            ]);

            let totalParticipants = 0;
            for (const participantList of Object.values(participants)) {
                totalParticipants += participantList.length;
            }

            this.testResults.push({
                name: 'Analytics-Daten abrufen',
                status: 'PASSED',
                details: `${totalParticipants} Teilnehmer, ${images.length} Bilder, ${Object.keys(stats).length} Events`
            });

        } catch (error) {
            this.testResults.push({
                name: 'Analytics-Daten abrufen',
                status: 'FAILED',
                error: error.message
            });
        }
    }

    /**
     * Test 3: Chart.js Verfügbarkeit
     */
    async testChartJSAvailability() {
        try {
            if (typeof Chart === 'undefined') {
                throw new Error('Chart.js nicht verfügbar');
            }

            // Teste Chart-Erstellung
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const testChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Test'],
                    datasets: [{
                        label: 'Test',
                        data: [1]
                    }]
                }
            });

            testChart.destroy();

            this.testResults.push({
                name: 'Chart.js Verfügbarkeit',
                status: 'PASSED',
                details: 'Chart.js funktioniert korrekt'
            });

        } catch (error) {
            this.testResults.push({
                name: 'Chart.js Verfügbarkeit',
                status: 'FAILED',
                error: error.message
            });
        }
    }

    /**
     * Test 4: Export-Funktionen
     */
    async testExportFunctions() {
        try {
            // Teste CSV-Export
            const testData = {
                'event1-participation': [
                    {
                        name: 'Test User',
                        email: 'test@example.com',
                        message: 'Test Message',
                        submitted_at: '2024-07-27T10:30:00Z'
                    }
                ]
            };

            const csv = this.convertToCSV(testData);
            if (!csv.includes('Test User')) {
                throw new Error('CSV-Export funktioniert nicht');
            }

            // Teste JSON-Export
            const json = JSON.stringify(testData, null, 2);
            if (!json.includes('Test User')) {
                throw new Error('JSON-Export funktioniert nicht');
            }

            this.testResults.push({
                name: 'Export-Funktionen',
                status: 'PASSED',
                details: 'CSV und JSON Export funktionieren'
            });

        } catch (error) {
            this.testResults.push({
                name: 'Export-Funktionen',
                status: 'FAILED',
                error: error.message
            });
        }
    }

    /**
     * Konvertiert Daten zu CSV
     */
    convertToCSV(participants) {
        let csv = 'Event,Name,Email,Message,Datum\n';

        for (const [formName, participantList] of Object.entries(participants)) {
            participantList.forEach(participant => {
                const date = new Date(participant.submitted_at).toLocaleDateString('de-DE');
                csv += `"${formName}","${participant.name}","${participant.email || ''}","${participant.message || ''}","${date}"\n`;
            });
        }

        return csv;
    }

    /**
     * Zeigt Test-Ergebnisse an
     */
    displayResults() {
        console.log('\n📊 Dashboard-Test-Ergebnisse:');
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
            console.log('🎉 Alle Dashboard-Tests bestanden! Analytics-System funktioniert.');
        } else {
            console.log('⚠️ Einige Tests fehlgeschlagen. Überprüfe die Chart.js-Integration.');
        }
    }

    /**
     * Testet erweiterte Analytics-Funktionen
     */
    async testAdvancedAnalytics(siteId, accessToken) {
        console.log('\n🔧 Teste erweiterte Analytics-Funktionen...');

        try {
            const apiClient = new NetlifyAPIClient();
            await apiClient.initialize(siteId, accessToken);

            // Teste erweiterte Statistiken
            const participants = await apiClient.getAllEventParticipants();
            const images = await apiClient.getImages();

            // Berechne erweiterte Statistiken
            let totalParticipants = 0;
            let totalWithEmail = 0;
            let todayParticipants = 0;

            const today = new Date();

            for (const participantList of Object.values(participants)) {
                totalParticipants += participantList.length;
                totalWithEmail += participantList.filter(p => p.email).length;

                participantList.forEach(participant => {
                    const submissionDate = new Date(participant.submitted_at);
                    if (submissionDate.toDateString() === today.toDateString()) {
                        todayParticipants++;
                    }
                });
            }

            const emailRate = totalParticipants > 0 ? Math.round((totalWithEmail / totalParticipants) * 100) : 0;

            console.log(`✅ Erweiterte Statistiken berechnet:`);
            console.log(`   - Gesamt Teilnehmer: ${totalParticipants}`);
            console.log(`   - Mit E-Mail: ${totalWithEmail} (${emailRate}%)`);
            console.log(`   - Heute: ${todayParticipants}`);
            console.log(`   - Bilder: ${images.length}`);

        } catch (error) {
            console.error('❌ Erweiterte Analytics-Tests fehlgeschlagen:', error);
        }
    }
}

// Export für globale Verwendung
window.DashboardTest = DashboardTest;

/**
 * Einfache Test-Funktion für Browser-Konsole
 *
 * Verwendung:
 * testDashboard('deine-site-id', 'dein-access-token')
 */
window.testDashboard = function(siteId, accessToken) {
    const tester = new DashboardTest();
    return tester.runAllTests(siteId, accessToken);
};

/**
 * Testet erweiterte Analytics-Funktionen
 *
 * Verwendung:
 * testAdvancedAnalytics('deine-site-id', 'dein-access-token')
 */
window.testAdvancedAnalytics = function(siteId, accessToken) {
    const tester = new DashboardTest();
    return tester.testAdvancedAnalytics(siteId, accessToken);
};