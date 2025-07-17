// --- FUNCIONES PARA CREAR VISTAS DEL DASHBOARD ---
const DashTitle = document.getElementById("dash-title");

// Recuperar el usuario desde localStorage
const user = JSON.parse(sessionStorage.getItem("currentUser"));

// Solo mostrar si el usuario existe
if (user) {
  DashTitle.textContent = `Bienvenido a Banco Acme ${user.firstName} ${user.lastName}`;
} else {
  DashTitle.textContent = "Bienvenido a Banco Acme";
}
function createSummaryCard(account) {
    return `
        <div class="account-summary-card">
            <h3>Resumen de la Cuenta</h3>
            <p><strong>Número de Cuenta:</strong> ${account.accountNumber}</p>
            <p><strong>Saldo Actual:</strong> $${account.balance.toLocaleString('es-CO')}</p>
            <p><strong>Fecha de Creación:</strong> ${account.creationDate}</p>
        </div>
    `;
}

function createTransactionList(transactions) {
    if (transactions.length === 0) {
        return '<h3>Resumen de Transacciones</h3><p>No hay transacciones para mostrar.</p>';
    }

    // Mostrar solo las últimas 10 transacciones
    const recentTransactions = transactions.slice(0, 10);

    let rows = recentTransactions.map(tx => `
        <tr>
            <td>${tx.date}</td>
            <td>${tx.reference}</td>
            <td>${tx.description}</td>
            <td class="${tx.amount > 0 ? 'positive' : 'negative'}">$${tx.amount.toLocaleString('es-CO')}</td>
        </tr>
    `).join('');

    return `

     <div class="print-area">
        <h3>Últimas 10 Transacciones</h3>
        <table class="transactions-table">
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Referencia</th>
                    <th>Descripción</th>
                    <th>Valor</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
        <button class="l" onclick="window.print()">Imprimir Resumen</button>
    </div>
    `;
}

//extracto bancario
 function createStatementView(user) {
    const currentYear = new Date().getFullYear();
    let yearOptions = '';
    for (let i = 0; i < 5; i++) { // esto hace que se genere esas opciones para los últimos 5 años
        const year = currentYear - i;
        yearOptions += `<option value="${year}">${year}</option>`;
    }

    return `
        <div class="statement-container">
            <h3>Extracto Bancario</h3>
            <p><strong>Titular:</strong> ${user.firstName} ${user.lastName}</p>
            <p><strong>Número de Cuenta:</strong> ${user.account.accountNumber}</p>
            <form id="statement-form" class="statement-form">
                <div class="form-group">
                    <label for="year-select">Año:</label>
                    <select id="year-select" name="year" class="opq">
                        ${yearOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label for="month-select">Mes:</label>
                    <select id="month-select" name="month" class="opq">
                        <option value="1">Enero</option>
                        <option value="2">Febrero</option>
                        <option value="3">Marzo</option>
                        <option value="4">Abril</option>
                        <option value="5">Mayo</option>
                        <option value="6">Junio</option>
                        <option value="7">Julio</option>
                        <option value="8">Agosto</option>
                        <option value="9">Septiembre</option>
                        <option value="10">Octubre</option>
                        <option value="11">Noviembre</option>
                        <option value="12">Diciembre</option>
                    </select>
                </div>
                <button type="submit">Generar Extracto</button>
            </form>
            <div id="statement-results" class="print-area">
                </div>
        </div>
    `;
}

function createDepositForm(user) {
    return `
        <div class="form-section">
            <h3>Consignación Electrónica</h3>
            <p>Consignar a la cuenta <strong>${user.account.accountNumber}</strong> (${user.firstName} ${user.lastName})</p>
            <form id="deposit-form">
                <input type="number" name="amount" placeholder="Valor a consignar" min="1" required>
                <button type="submit">Consignar</button>
            </form>
        </div>
    `;
}

function createWithdrawForm(user) {
    return `
        <div class="form-section">
            <h3>Retiro de Dinero</h3>
            <p>Retirar de la cuenta <strong>${user.account.accountNumber}</strong></p>
            <p>Saldo disponible: $${user.account.balance.toLocaleString('es-CO')}</p>
            <form id="withdraw-form">
                <input type="number" name="amount" placeholder="Valor a retirar" min="1" required>
                <button type="submit">Retirar</button>
            </form>
        </div>
    `;
}

function createPaymentForm(user) {
    return `
        <div class="form-section">
            <h3>Pago de Servicios Públicos</h3>
            <p>Pagar desde la cuenta <strong>${user.account.accountNumber}</strong></p>
            <p>Saldo disponible: $${user.account.balance.toLocaleString('es-CO')}</p>
            <form id="payment-form">
                <select class= "opq" name="service" required>
                    <option value="">Seleccione un servicio</option>
                    <option value="Energía">Energía</option>
                    <option value="Agua">Agua</option>
                    <option value="Gas Natural">Gas Natural</option>
                    <option value="Internet">Internet</option>
                </select>
                <input type="text" name="reference" placeholder="Referencia de pago" required>
                <input type="number" name="amount" placeholder="Valor a pagar" min="1" required>
                <button type="submit">Pagar Servicio</button>
            </form>
        </div>
    `;
}

function createCertificate(user) {
    return `
    <div class="print-certificate">
        <div class="certificate">
            <div class="certificate-header">
                <h2>Certificado Bancario</h2>
                <p>Banco Acme S.A.</p>
            </div>
            <div class="certificate-body">
                <p><strong>Fecha de Expedición:</strong> ${new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <br>
                <p>El Banco Acme certifica que:</p>
                <p class="user-name">${user.firstName.toUpperCase()} ${user.lastName.toUpperCase()}</p>
                <p>identificado(a) con ${user.idType} número <strong>${user.idNumber}</strong>, es titular de la cuenta de ahorros número <strong>${user.account.accountNumber}</strong>, la cual se encuentra activa desde el ${new Date(user.account.creationDate).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}.</p>
                <br>
                <p>Este certificado se expide a solicitud del interesado.</p>
            </div>
            <div class="certificate-footer">
                <p>Atentamente,</p>
                <p><strong>Banco Acme</strong></p>
            </div>
        </div>
    </div>
        <button id="print-certificate-btn">Imprimir Certificado</button>
    `;
}