{
  "version": 2,
  "builds": [{ "src": "fraud-api.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "fraud-api.js" }]
}
