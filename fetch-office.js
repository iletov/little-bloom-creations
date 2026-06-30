const http = require('http');

http.get('http://localhost:3001/shipping/offices?courier=ekont-office&cityId=32', (resp) => {
  let data = '';
  resp.on('data', (chunk) => {
    data += chunk;
  });
  resp.on('end', () => {
    const offices = JSON.parse(data);
    console.log(offices.filter(o => o.name.includes('Стефано')));
  });
});
