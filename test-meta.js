const url = process.argv[2];
fetch(`http://localhost:3000/api/metadata?url=${encodeURIComponent(url)}`)
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
