const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 8080;
app.use(express.static(path.join(__dirname + '/public')));
app.use(express.json());

// Serve the website.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'website.html'));
});

app.get('/index.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.js'), {
      headers: {
        'Content-Type': 'text/javascript'
      }
    });
  });

app.get('/getdata', (req, res) => {
  // Read the transactions.json file
    const data = fs.readFileSync('transactions.json', 'utf8');
    res.end(data);
});

//Post to add object
app.post('/add-object', (req, res,) => {
  console.log('Request incoming!')
  const category = req.body.category;
  const expense = req.body.expense;
  const amount = req.body.amount;

//Read data from json file  
fs.readFile('transactions.json', (err, data) => {
  if (err) throw err;
  //Save data to variable
  const transactions = JSON.parse(data);

  // add new data to the transactions array
  const newTransaction = {
    category: category,
    expense: expense,
    amount: amount
  };
  transactions.push(newTransaction);

  // write the updated data back to the file
  fs.writeFile('transactions.json', JSON.stringify(transactions), (err) => {
    if (err) throw err;
    console.log('Data written to file');
  });
});
});

// Handle updating the transactions.json file
app.post('/update-data', (req, res) => {
  const data = JSON.stringify(req.body);
  fs.writeFile('transactions.json', data, (err) => {
    if (err) throw err;
    console.log('Data written to file');
    res.send('Data updated');
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
