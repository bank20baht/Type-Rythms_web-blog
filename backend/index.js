const express = require('express');
const app = express();
const cors = require('cors')
app.use(cors())
// Example data
const data = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
    { id: 4, name: 'Item 4' },
    { id: 5, name: 'Item 5' },
    { id: 6, name: 'Item 6' },
    { id: 7, name: 'Item 7' },
    { id: 8, name: 'Item 8' },
    { id: 9, name: 'Item 9' },
    { id: 10, name: 'Item 10' },
    { id: 11, name: 'Item 11' },
    { id: 12, name: 'Item 12' },
    { id: 13, name: 'Item 13' },
    { id: 14, name: 'Item 14' },
    { id: 15, name: 'Item 15' },
    { id: 16, name: 'Item 16' },
    { id: 17, name: 'Item 17' },
    { id: 18, name: 'Item 18' },
    { id: 19, name: 'Item 19' },
    { id: 20, name: 'Item 20' },
    { id: 21, name: 'Item 21' },
    { id: 22, name: 'Item 22' },
    { id: 23, name: 'Item 23' },
    { id: 24, name: 'Item 24' },
    { id: 25, name: 'Item 25' },
    { id: 26, name: 'Item 26' },
    { id: 27, name: 'Item 27' },
    { id: 28, name: 'Item 28' },
    { id: 29, name: 'Item 29' },
    { id: 30, name: 'Item 30' },
  ];

// Route to get paginated data
app.get('/api/data', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
  
    const results = {};
  
    if (endIndex < data.length) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }
  
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }
  
    results.count = data.length;
    results.results = data.slice(startIndex, endIndex);
  
    res.json(results);
  });

// Start the server
app.listen(5000, () => console.log('Server started on port 5000'));