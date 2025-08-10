{
  "version": 2,
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://trustlens-fraud-api.onrender.com/$1"
    },
    {
      "src": "/(.*)",
      "headers": {
        "Cache-Control": "public, max-age=86400",
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff"
      }
    }
  ],
  "cleanUrls": true,
  "trailingSlash": false
}
