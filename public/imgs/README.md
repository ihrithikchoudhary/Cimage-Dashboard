# Gallery Images

Put your image files in this folder, then add them to `imgages.json`.

Example:

```json
[
  {
    "title": "National Technology Day",
    "description": "Students during the event",
    "uploadDate": "13 May 2026",
    "file": "my-photo.jpg"
  }
]
```

Supported fields for the image source:

- `file`: best for images in this folder, like `"my-photo.jpg"`
- `path`: also works for images in this folder
- `image`, `url`, or `src`: works for base64, full URLs, or `/imgs/my-photo.jpg`

