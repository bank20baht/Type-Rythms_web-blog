const express = require('express');
const app = express();
const cors = require('cors')
app.use(cors())
// Example data
const data = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
  { id: 3, name: 'Bob' },
  { id: 4, name: 'Alice' },
  { id: 5, name: 'Mike' },
  { id: 6, name: 'Kate' },
  { id: 7, name: 'Tom' },
  { id: 8, name: 'Sara' },
  { id: 9, name: 'Alex' },
  { id: 10, name: 'Emily' }
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
      limit: limit
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit
    };
  }

  results.results = data.slice(startIndex, endIndex);

  res.json(results);
});

// Start the server
app.listen(5000, () => console.log('Server started on port 5000'));