document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('fraudTransactionForm');
    const fraudResult = document.getElementById('fraudResult');
    const checkAnomalousBtn = document.getElementById('checkAnomalousBtn');
    const loadAllTransactionsBtn = document.getElementById('loadAllTransactionsBtn');
    const refreshHistoryBtn = document.getElementById('refreshHistoryBtn');
    const transactionHistory = document.getElementById('transactionHistory');
    
    // API Testing buttons
    const testSubmitApi = document.getElementById('testSubmitApi');
    const testAnomalousApi = document.getElementById('testAnomalousApi');
    const testDataApi = document.getElementById('testDataApi');
    const apiTestResults = document.getElementById('apiTestResults');

    const API_BASE = window.location.hostname === 'localhost'
        ? 'http://localhost:3001'
        : 'https://trustlens-fraud-api.onrender.com';

    // Utility function to display results
    function displayResult(result) {
        const isAnomalous = result.anomalous;
        const reasons = result.reasons || [];
        
        const resultHTML = `
            <div class="${isAnomalous ? 'fraud-alert-danger' : 'fraud-alert-safe'} p-6 rounded-lg mb-4">
                <div class="flex items-center mb-4">
                    <div class="text-3xl mr-3">${isAnomalous ? '🚨' : '✅'}</div>
                    <div>
                        <h3 class="text-xl font-bold">
                            ${isAnomalous ? 'FRAUD DETECTED!' : 'Transaction Safe'}
                        </h3>
                        <p class="text-sm opacity-90">Transaction ID: ${result.transaction_id}</p>
                    </div>
                </div>
                ${reasons.length > 0 ? `
                    <div class="mb-4">
                        <h4 class="font-semibold mb-2">🔍 Detection Reasons:</h4>
                        <ul class="list-disc list-inside space-y-1">
                            ${reasons.map(reason => `<li class="text-sm">${reason}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                <div class="text-sm opacity-75">
                    ⏰ Analysis completed at ${new Date().toLocaleString()}
                </div>
            </div>
        `;
        
        fraudResult.innerHTML = resultHTML;
        checkAnomalousBtn.disabled = false;
    }

    // Form submission handler
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        // Show loading state
        fraudResult.innerHTML = `
            <div class="text-center py-8">
                <div class="animate-spin text-4xl mb-4">🔄</div>
                <p class="text-gray-300">Analyzing transaction for fraud patterns...</p>
            </div>
        `;

        const data = new FormData(form);
        const payload = Object.fromEntries(data.entries());
        
        // Convert amount to number
        payload.amount = parseFloat(payload.amount);

        try {
            const response = await fetch(API_BASE + '/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            displayResult(result);
            
        } catch (error) {
            console.error('Error:', error);
            fraudResult.innerHTML = `
                <div class="fraud-alert-danger p-6 rounded-lg">
                    <div class="flex items-center mb-4">
                        <div class="text-3xl mr-3">❌</div>
                        <div>
                            <h3 class="text-xl font-bold">Connection Error</h3>
                            <p class="text-sm opacity-90">Unable to connect to fraud detection API</p>
                        </div>
                    </div>
                    <p class="text-sm">
                        Please ensure the backend API is running on ${API_BASE}<br>
                        Error: ${error.message}
                    </p>
                </div>
            `;
        }
    });

    // Check anomalous button handler
    checkAnomalousBtn.addEventListener('click', async function() {
        try {
            const response = await fetch(API_BASE + '/anomalous');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            
            const isAnomalous = await response.json();
            fraudResult.innerHTML = `
                <div class="${isAnomalous ? 'fraud-alert-danger' : 'fraud-alert-safe'} p-6 rounded-lg">
                    <div class="flex items-center">
                        <div class="text-3xl mr-3">${isAnomalous ? '⚠️' : '✅'}</div>
                        <div>
                            <h3 class="text-xl font-bold">
                                Last Transaction: ${isAnomalous ? 'ANOMALOUS' : 'NORMAL'}
                            </h3>
                            <p class="text-sm opacity-90">
                                ${isAnomalous ? 'The last transaction was flagged as potentially fraudulent' : 'The last transaction appears to be legitimate'}
                            </p>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error checking anomalous status:', error);
            fraudResult.innerHTML = `
                <div class="fraud-alert-danger p-6 rounded-lg">
                    <p>❌ Unable to check anomalous status: ${error.message}</p>
                </div>
            `;
        }
    });

    // Load all transactions handler
    async function loadTransactionHistory() {
        try {
            const response = await fetch(API_BASE + '/data');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            
            const transactions = await response.json();
            
            if (transactions.length === 0) {
                transactionHistory.innerHTML = `
                    <div class="text-center py-8">
                        <div class="text-4xl mb-4">📭</div>
                        <p class="text-gray-400">No transactions found</p>
                    </div>
                `;
                return;
            }
            
            const historyHTML = transactions.map((txn, index) => `
                <div class="transaction-item p-4 rounded-lg mb-3">
                    <div class="flex justify-between items-start mb-2">
                        <div class="flex items-center">
                            <span class="text-2xl mr-3">${txn.anomalous ? '🚨' : '✅'}</span>
                            <div>
                                <h4 class="font-semibold">Transaction #${index + 1}</h4>
                                <p class="text-sm text-gray-400">ID: ${txn.transaction_id}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="font-bold text-lg">${txn.currency} ${txn.amount.toLocaleString()}</p>
                            <p class="text-sm text-gray-400">${txn.location}</p>
                        </div>
                    </div>
                    <div class="text-sm text-gray-300">
                        <p>📅 ${new Date(txn.timestamp).toLocaleString()}</p>
                        <p>💳 ${txn.card_type} | 👤 ${txn.sender_account_number} → ${txn.recipient_account_number}</p>
                        ${txn.anomalous && txn.fraud_reasons.length > 0 ? `
                            <div class="mt-2 p-2 bg-red-900 bg-opacity-50 rounded">
                                <p class="text-red-300 font-semibold">🔍 Fraud Indicators:</p>
                                <ul class="list-disc list-inside text-red-200 text-xs mt-1">
                                    ${txn.fraud_reasons.map(reason => `<li>${reason}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('');
            
            transactionHistory.innerHTML = `
                <div class="mb-4">
                    <h3 class="text-lg font-semibold mb-2">📊 Total Transactions: ${transactions.length}</h3>
                    <div class="flex space-x-4 text-sm">
                        <span class="text-green-400">✅ Safe: ${transactions.filter(t => !t.anomalous).length}</span>
                        <span class="text-red-400">🚨 Fraud: ${transactions.filter(t => t.anomalous).length}</span>
                    </div>
                </div>
                <div class="max-h-96 overflow-y-auto">
                    ${historyHTML}
                </div>
            `;
            
        } catch (error) {
            console.error('Error loading transactions:', error);
            transactionHistory.innerHTML = `
                <div class="text-center py-8">
                    <div class="text-4xl mb-4">❌</div>
                    <p class="text-red-400">Error loading transactions: ${error.message}</p>
                </div>
            `;
        }
    }

    loadAllTransactionsBtn.addEventListener('click', loadTransactionHistory);
    refreshHistoryBtn.addEventListener('click', loadTransactionHistory);

    // API Testing functions
    function logApiTest(endpoint, result, error = null) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = error 
            ? `[${timestamp}] ❌ ${endpoint} - ERROR: ${error}`
            : `[${timestamp}] ✅ ${endpoint} - SUCCESS: ${JSON.stringify(result, null, 2)}`;
        
        apiTestResults.innerHTML += `<pre class="${error ? 'text-red-400' : 'text-green-400'} mb-2">${logEntry}</pre>`;
        apiTestResults.scrollTop = apiTestResults.scrollHeight;
    }

    testSubmitApi.addEventListener('click', async function() {
        const testData = {
            amount: 50000,
            location: "Mumbai",
            card_type: "Visa",
            currency: "INR",
            sender_account_number: "1234567890",
            recipient_account_number: "9876543210",
            transaction_id: `TEST_${Date.now()}`
        };
        
        try {
            const response = await fetch(API_BASE + '/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testData)
            });
            const result = await response.json();
            logApiTest('POST /submit', result);
        } catch (error) {
            logApiTest('POST /submit', null, error.message);
        }
    });

    testAnomalousApi.addEventListener('click', async function() {
        try {
            const response = await fetch(API_BASE + '/anomalous');
            const result = await response.json();
            logApiTest('GET /anomalous', result);
        } catch (error) {
            logApiTest('GET /anomalous', null, error.message);
        }
    });

    testDataApi.addEventListener('click', async function() {
        try {
            const response = await fetch(API_BASE + '/data');
            const result = await response.json();
            logApiTest('GET /data', { count: result.length, sample: result.slice(0, 2) });
        } catch (error) {
            logApiTest('GET /data', null, error.message);
        }
    });

    // Auto-load transaction history on page load
    loadTransactionHistory();
});
