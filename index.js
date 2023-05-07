const getDataBtn = document.getElementById('getDataBtn');
getDataBtn.addEventListener('click', populateTransactionsTable);

const form = document.getElementById('object-form');
//Form listener to save data to json file
form.addEventListener('submit', event => {
  event.preventDefault(); // prevent the form from submitting via its default behavior
  addTransaction();
  form.reset();
});

//Function to add transactions
async function addTransaction(){
    let transaction = {
      category: document.getElementById('category').value,
      expense: document.getElementById('expense-input').value,
      amount: Number(document.getElementById('amount-input').value)
    }

    const response = await fetch('/add-object', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction)
    });
    const jsonData = await response.json();
    console.log(jsonData);
}

//Function to populate table
async function populateTransactionsTable() {
  // Wait for data from json file
  let data = await fetch('/getdata');
  // Save JSON to array
  const transactions = await data.json();
  console.log(transactions);

  const tableBody = document.querySelector('#transactionsTable tbody');

  // Clear existing rows from the table body
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }

  let totalAmount = 0;
  // loop through the transactions array and create a row for each transaction
  transactions.forEach((transaction, index) => {
    totalAmount += transaction.amount;
    // create a new table row
    const newRow = document.createElement('tr');

    // create table cells for the transaction data
    const categoryCell = document.createElement('td');
    categoryCell.textContent = transaction.category;

    const expenseCell = document.createElement('td');
    expenseCell.textContent = transaction.expense;

    const amountCell = document.createElement('td');
    amountCell.textContent = transaction.amount;

    // create a cell for the delete button
    const deleteCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.setAttribute("id", "deleteBtn");
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', async () => {
      // remove the transaction from the array
      transactions.splice(index, 1);
      // update the transactions.json file
      // Ask confirmation before deleting
      if(confirm("Are you sure you want to delete this transaction?")){
        const response = await fetch('/update-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(transactions)
        });
      }
      // re-populate the table
      populateTransactionsTable();
    });
    deleteCell.appendChild(deleteButton);

    // add the cells to the row
    newRow.appendChild(categoryCell);
    newRow.appendChild(expenseCell);
    newRow.appendChild(amountCell);
    newRow.appendChild(deleteCell);

    // add the row to the table body
    tableBody.appendChild(newRow);
  });
  // create a new row to display the total amount
  const totalRow = document.createElement('tr');

  // create a cell to display the "Total" label
  const totalLabelCell = document.createElement('td');
  totalLabelCell.textContent = 'Total';

  // create a cell to display an empty space
  const emptyCell = document.createElement('td');
  emptyCell.textContent = '';

  // create a cell to display the total amount
  const totalAmountCell = document.createElement('td');
  totalAmountCell.textContent = totalAmount;

  // add the cells to the row
  totalRow.appendChild(totalLabelCell);
  totalRow.appendChild(emptyCell);
  totalRow.appendChild(totalAmountCell);

  // add the total row to the table body
  tableBody.appendChild(totalRow);
}
