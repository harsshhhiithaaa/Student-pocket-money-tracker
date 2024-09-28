let pocketMoney = 0;
let plannedSpending = 0;
let plannedSaving = 0;
let totalExpenses = 0;
let savingDescription = '';


const pocketMoneyForm = document.getElementById('pocket-money-form');
const expenseForm = document.getElementById('expense-form');
const savingMessage = document.getElementById('saving-message');
const spendingTotal = document.getElementById('spending-total');
const expensesTotal = document.getElementById('expenses-total');
const remainingTotal = document.getElementById('remaining-total');
const savingTotal = document.getElementById('saving-total');
const resetButton = document.getElementById('reset-plan');
// const reportbutton=document.getElementById('generate-report');

window.onload = function () {
    loadSavedData();
};

function loadSavedData() {
    if (localStorage.getItem('pocketMoney')) {
        pocketMoney = parseFloat(localStorage.getItem('pocketMoney'));
        plannedSpending = parseFloat(localStorage.getItem('plannedSpending'));
        plannedSaving = parseFloat(localStorage.getItem('plannedSaving'));
        savingDescription = localStorage.getItem('savingDescription');
        totalExpenses = parseFloat(localStorage.getItem('totalExpenses'));
        spendingTotal.innerText = plannedSpending.toFixed(2);
        savingTotal.innerText = plannedSaving.toFixed(2);
        expensesTotal.innerText = totalExpenses.toFixed(2);
        updateRemainingSpending();
        updateSavingMessage(false);

        // Hide the pocket money form if plan exists
        pocketMoneyForm.style.display = 'none';
    } else {
        // Show the pocket money form if no plan exists
        pocketMoneyForm.style.display = 'block';
    }
}
pocketMoneyForm.addEventListener('submit', (e) => {
    e.preventDefault();

    pocketMoney = parseFloat(document.getElementById('pocket-money').value);
    plannedSpending = parseFloat(document.getElementById('spending').value);
    plannedSaving = parseFloat(document.getElementById('saving').value);
    savingDescription = document.getElementById('saving-description').value;

    if (plannedSpending + plannedSaving > pocketMoney) {
        alert('Planned spending and saving exceed the total pocket money!');
        return;
    }

    // Update displayed values
    spendingTotal.innerText = plannedSpending.toFixed(2);
    savingTotal.innerText = plannedSaving.toFixed(2);
    updateRemainingSpending();

    // Save the values to localStorage
    saveDataToLocalStorage();
    updateSavingMessage(false);
    // Hide the form after setting the plan
    pocketMoneyForm.style.display = 'none';
});
expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if(totalExpenses<pocketMoney){
    const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
    totalExpenses += expenseAmount;
    expensesTotal.innerText = totalExpenses.toFixed(2);

    // Update remaining spending and handle chart update
    updateRemainingSpending();

    // Save updated expenses to localStorage
    saveDataToLocalStorage();
    }
    else{
        alert('you expense exceeds pocket money');
    }
    });
    function updateSavingMessage(isOverspend) {
        if (isOverspend) {
                alert('You have spend from your '+savingDescription+' savings');
            }
           
    }
    function saveDataToLocalStorage() {
        localStorage.setItem('pocketMoney', pocketMoney);
        localStorage.setItem('plannedSpending', plannedSpending);
        localStorage.setItem('plannedSaving', plannedSaving);
        localStorage.setItem('savingDescription', savingDescription);
        localStorage.setItem('totalExpenses', totalExpenses);
    }
    function updateRemainingSpending() {
        let remainingSpending = (plannedSpending + plannedSaving) - totalExpenses;
        remainingTotal.innerText = remainingSpending.toFixed(2);
        if (totalExpenses > plannedSpending) {
            updateSavingMessage(true); // Show the warning message
        }

        // Update chart
        updateChart();
    }
    const ctx = document.getElementById('expense-chart').getContext('2d');
    let expenseChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['savings', 'plannedSpending', 'Expenses'],
            datasets: [{
                data: [plannedSaving, plannedSpending, totalExpenses],
                backgroundColor: ['green', 'red', 'blue']
            }]
        },
        options: {
            responsive: true
        }
    });
    function updateChart() {
        const remainingSaving = plannedSaving;
        const remainingSpending = Math.max(0, (plannedSpending + plannedSaving) - totalExpenses);



        // Check if total expenses exceed planned spending and savings
        if (totalExpenses >= (plannedSpending + plannedSaving)) {
            expenseChart.data.datasets[0].data = [0, 0, totalExpenses]; // All in blue (Exceeded)
            expenseChart.data.labels = ['Expenses'];
            expenseChart.data.datasets[0].backgroundColor = ['blue'];
            alert('You are out of pocket money! reset your new tracker');
            

        } else {
            // Update chart data for normal cases
            expenseChart.data.datasets[0].data = [
                remainingSaving, // Remaining savings (green)
                remainingSpending, // Remaining spending (red)
                totalExpenses // Expenses (blue)
            ];

            // Update colors based on remaining amounts
            expenseChart.data.datasets[0].backgroundColor = [
                remainingSaving > 0 ? 'green' : 'blue',
                remainingSpending > 0 ? 'red' : 'blue',
                'blue'
            ];

            // Change colors incrementally as expenses are added
            let spentFromSpending = Math.min(plannedSpending, totalExpenses);
            let spentFromSavings = Math.max(0, totalExpenses - plannedSpending);
            expenseChart.data.datasets[0].data = [
                Math.max(0, plannedSaving - spentFromSavings), // Update remaining savings
                Math.max(0, plannedSpending - spentFromSpending), // Update remaining spending
                spentFromSpending + spentFromSavings // Total expenses (always blue)
            ];

            // Update colors
            expenseChart.data.datasets[0].backgroundColor = [
                plannedSaving > spentFromSavings ? 'green' : 'blue',
                plannedSpending > spentFromSpending ? 'red' : 'blue',
                'blue'
            ];
        }

        // Refresh the chart
        expenseChart.update();
    }
    // reportbutton.addEventListener('click', function() {
    //     // Clear previous report
    //     expenseReport.innerHTML = '';
    
    //     if (expenses.length === 0) {
    //         expenseReport.innerHTML = '<p>No expenses recorded yet.</p>';
    //     } else {
    //         let reportHTML = '<h3>Expense Report</h3><ul>';
    //         expenses.forEach((expense, index) => {
    //             reportHTML += `<li>Expense ${index + 1}: ${expense.description} - $${expense.amount.toFixed(2)}</li>`;
    //         });
    //         reportHTML += '</ul>';
    //         expenseReport.innerHTML = reportHTML;
    //     }
    // });
    resetButton.addEventListener('click', function () {
        if (confirm('Are you sure you want to reset the plan? All data will be lost.')) {
            localStorage.clear();
            pocketMoney = 0;
            plannedSpending = 0;
            plannedSaving = 0;
            totalExpenses = 0;

            // Reset UI elements
            spendingTotal.innerText = '0';
            savingTotal.innerText = '0';
            expensesTotal.innerText = '0';
            remainingTotal.innerText = '0';

            // Show the form again for new plan
            pocketMoneyForm.style.display = 'block';

            // Reset the chart
            expenseChart.data.datasets[0].data = [0, 0, 0];
            expenseChart.update();
        }
    });
