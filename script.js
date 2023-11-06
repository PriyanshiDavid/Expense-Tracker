$(document).ready(function () {
    let expenses = [];
    const expenseForm = $("#expense-form");
    const expenseList = $("#expense-list");
    const totalExpenses = $("#total-expenses");
    const expenseChart = document.getElementById("expense-chart").getContext("2d");
    let myChart; // Store the chart object

    expenseForm.on("submit", function (e) {
        e.preventDefault();
        const name = $("#expense-name").val();
        const amount = parseFloat($("#expense-amount").val());
        const category = $("#expense-category").val();

        if (name === "" || isNaN(amount)) {
            alert("Please fill in all fields.");
            return;
        }

        const expense = {
            name: name,
            amount: amount,
            category: category,
        };

        expenses.push(expense);
        updateExpenseList();
        updateExpenseChart();
        expenseForm[0].reset();
    });

    function updateExpenseList() {
        expenseList.empty();
        let total = 0;

        expenses.forEach((expense, index) => {
            const { name, amount, category } = expense;
            const listItem = $(`<li class="list-group-item">${name} - Rs.${amount} (${category})</li>`);
            const deleteButton = $(`<button class="btn btn-danger btn-sm float-right">Delete</button>`);

            deleteButton.on("click", function () {
                deleteExpense(index);
            });

            listItem.append(deleteButton);
            expenseList.append(listItem);
            total += expense.amount;
        });

        totalExpenses.text(`Rs.${total}`);
    }

    function deleteExpense(index) {
        expenses.splice(index, 1);
        updateExpenseList();
        updateExpenseChart();
    }

    function updateExpenseChart() {
        const categories = {};
        expenses.forEach((expense) => {
            const category = expense.category;
            if (categories[category]) {
                categories[category] += expense.amount;
            } else {
                categories[category] = expense.amount;
            }
        });

        if (myChart) {
            myChart.destroy(); // Destroy the previous chart
        }

        const chartData = {
            labels: Object.keys(categories),
            datasets: [
                {
                    data: Object.values(categories),
                    backgroundColor: [
                        "red",
                        "blue",
                        "green",
                        "orange",
                    ],
                },
            ],
        };

        myChart = new Chart(expenseChart, {
            type: "pie",
            data: chartData,
        });
    }
});
