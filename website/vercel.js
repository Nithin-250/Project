{
  "version": 2,
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://trustlens-fraud-api.onrender.com/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=86400" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ],
  "cleanUrls": true,
  "trailingSlash": false
}
