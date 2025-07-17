
document.addEventListener('DOMContentLoaded', () => {
    // hace que se Verifique la sesión activa
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    //  Cargar la vista por defecto (Resumen de cuenta)
    loadView('summary', currentUser);

    //  Manejar navegación del menú
    document.getElementById('menu-options').addEventListener('click', (e) => {
        e.preventDefault();
        const view = e.target.getAttribute('data-view');
        if (view) {
            // Recargamos los datos del usuario por si han cambiado
            currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            loadView(view, currentUser);
        }
    });

    //  Manejar cierre de sesión
    document.getElementById('logout-btn').addEventListener('click', () => {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
});

// creacion de la vista sobre  el dashboard y activa sus eventos según el tipo (resumen, transacción, formulario)

function loadView(view, user) {
    const contentArea = document.getElementById('dashboard-content');

    switch (view) {
        case 'summary':
            contentArea.innerHTML = createSummaryCard(user.account);
            break;
        case 'transactions':
            contentArea.innerHTML = createTransactionList(user.account.transactions);
            break;
        case 'deposit':
            contentArea.innerHTML = createDepositForm(user);
            document.getElementById('deposit-form').addEventListener('submit', (e) => handleTransaction(e, 'deposit'));
            break;
        case 'withdraw':
            contentArea.innerHTML = createWithdrawForm(user);
            document.getElementById('withdraw-form').addEventListener('submit', (e) => handleTransaction(e, 'withdraw'));
            break;
        case 'payment':
            contentArea.innerHTML = createPaymentForm(user);
            document.getElementById('payment-form').addEventListener('submit', (e) => handleTransaction(e, 'payment'));
            break;
        
        case 'statement':
            contentArea.innerHTML = createStatementView(user);
            document.getElementById('statement-form').addEventListener('submit', (e) => {
                handleGenerateStatement(e, user);
            });
            break;
        case 'certificate':
            contentArea.innerHTML = createCertificate(user);
            document.getElementById('print-certificate-btn').addEventListener('click', () => window.print());
            break;
    }
}


/** 
 * Filtra las transacciones por año y mes y las muestra en la vista.
 * @param {Event} e - El evento del formulario.
 * @param {object} user - El objeto del usuario actual.
 */
function handleGenerateStatement(e, user) {
    e.preventDefault();
    const form = e.target;
    const year = parseInt(form.year.value);
    const month = parseInt(form.month.value);
    const resultsContainer = document.getElementById('statement-results');

    const filteredTxs = user.account.transactions.filter(tx => {
        const dateParts = tx.date.split(',')[0].split('/'); 
        const txYear = parseInt(dateParts[2]);
        const txMonth = parseInt(dateParts[1]);
        return txYear === year && txMonth === month;
    });

    if (filteredTxs.length === 0) {
        resultsContainer.innerHTML = '<p>No se encontraron movimientos para el período seleccionado.</p>';
        return;
    }

    const rows = filteredTxs.map(tx => `
        <tr>
            <td>${tx.date}</td>
            <td>${tx.reference}</td>
            <td>${tx.type}</td>
            <td>${tx.description}</td>
            <td class="${tx.amount > 0 ? 'positive' : 'negative'}">$${tx.amount.toLocaleString('es-CO')}</td>
        </tr>
    `).join('');

    resultsContainer.innerHTML = `
        <h4>Movimientos para ${form.month.options[form.month.selectedIndex].text} de ${year}</h4>
        <table class="transactions-table">
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Referencia</th>
                    <th>Tipo</th>
                    <th>Concepto</th>
                    <th>Valor</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
        <button class="l" onclick="window.print()">Imprimir Extracto</button>
    `;
}


function handleTransaction(e, type) {
    e.preventDefault();
    const form = e.target;
    const amount = parseFloat(form.amount.value);
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    if (isNaN(amount) || amount <= 0) {
        alert('Por favor, ingrese un valor válido.');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(u => u.idNumber === currentUser.idNumber);

    if (userIndex === -1) {
        alert('Error: No se pudo encontrar al usuario.');
        return;
    }

    const userToUpdate = users[userIndex];
    let transactionDescription = '';

    if (type === 'deposit') {
        userToUpdate.account.balance += amount;
        transactionDescription = 'Consignación por canal electrónico';
    } else {
        if (userToUpdate.account.balance < amount) {
            Swal.fire({
                text: `Saldo insuficiente`,
                icon: "warning",
                timer: 1500,
                showConfirmButton: false,
            })
            return;
        }
        userToUpdate.account.balance -= amount;

        if (type === 'withdraw') {
            transactionDescription = 'Retiro de dinero';
        } else if (type === 'payment') {
            const service = form.service.value;
            transactionDescription = `Pago de servicio público: ${service}`;
        }
    }

    const newTransaction = {
        date: new Date().toLocaleString('es-CO', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false}),
        reference: `REF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        type: type.charAt(0).toUpperCase() + type.slice(1),
        description: transactionDescription,
        amount: type === 'deposit' ? amount : -amount
    };

    userToUpdate.account.transactions.unshift(newTransaction);
    localStorage.setItem('users', JSON.stringify(users));
    sessionStorage.setItem('currentUser', JSON.stringify(userToUpdate));

    Swal.fire({
        title: "✅ Operación realizada con éxito",
        text: `Nuevo saldo: $${userToUpdate.account.balance.toLocaleString('es-CO')}`,
        icon: "success",
        iconColor: "#FFD700"
    });
    loadView('summary', userToUpdate);
}