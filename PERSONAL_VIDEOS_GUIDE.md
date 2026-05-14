# Personal Videos - Setup Guide

## Overview

Your Student Dashboard now supports displaying personal YouTube videos organized by semester! You can add your own YouTube videos and switch between "Semester Lectures" (official videos) and "Personal Videos" (your custom collection).

## How to Add Your Own YouTube Videos

### Step 1: Get Your YouTube Video ID

For any YouTube video you want to add:
1. Open the video on YouTube
2. Look at the URL: `https://www.youtube.com/watch?v=**VIDEO_ID_HERE**`
3. Copy the video ID (the part after `v=`)

Example: For `https://www.youtube.com/watch?v=dQw4w9WgXcQ`, the ID is `dQw4w9WgXcQ`

### Step 2: Edit the JSON File

Open `src/data/portalData.json` and find the `"personalVideosBySemester"` section.

### Step 3: Add Your Videos

Use this structure for each video:

```json
{
  "title": "Your Video Title",
  "duration": "15 min",
  "youtubeId": "VIDEO_ID_HERE"
}
```

## Example Structure

```json
"personalVideosBySemester": {
  "1": [
    {
      "subject": "Computer Fundamentals",
      "videos": [
        {
          "title": "Learning C Programming Basics",
          "duration": "25 min",
          "youtubeId": "dQw4w9WgXcQ"
        },
        {
          "title": "Variables and Data Types",
          "duration": "18 min",
          "youtubeId": "abc123def456"
        }
      ]
    }
  ],
  "2": [
    {
      "subject": "Object Oriented Programming",
      "videos": [
        {
          "title": "Classes and Objects Explained",
          "duration": "22 min",
          "youtubeId": "xyz789uvw012"
        }
      ]
    }
  ]
}
```

## Key-Value Mapping

The JSON uses a **key-value mapping** for easy semester-wise access:

- **Key**: Semester number (1, 2, 3, 4, 5, 6)
- **Value**: Array of subject objects containing videos

```
Semester 1 → [
  Subject: Computer Fundamentals → [Video 1, Video 2, Video 3],
  Subject: Programming in C → [Video 1, Video 2]
]

Semester 2 → [
  Subject: Object Oriented Programming → [Video 1, Video 2],
  Subject: Data Structures → [Video 1, Video 2]
]
```

## How to Use in the Dashboard

1. Navigate to the **Lectures** section in your Student Dashboard
2. Click the **"Personal Videos"** button (toggle) to switch from semester lectures
3. Select your desired semester from the dropdown
4. Choose a subject to view its videos
5. Click any video to play it

## Tips for Adding Videos

- **Keep titles descriptive**: Use titles that clearly indicate the content
- **Use consistent durations**: Estimate video length accurately (e.g., "12 min", "25 min")
- **Organize by subject**: Group related videos under the same subject name
- **Use real YouTube IDs**: Make sure the video IDs are correct and public

## Common YouTube Video ID Sources

- **Online courses**: Udemy, Coursera, YouTube channels
- **Tutorial channels**: LinkedIn Learning, edX, freeCodeCamp
- **Your own videos**: If you upload to YouTube
- **Playlist videos**: Any public YouTube video

## Switching Between Lecture Sources

- **Semester Lectures**: Official college lectures (read-only)
- **Personal Videos**: Your custom videos (editable in JSON)

Both are organized by semester for easy navigation and comparison.

## Troubleshooting

### Videos not showing?
- Check that the YouTube IDs are correct
- Ensure the videos are public (not private or restricted)
- Verify the JSON syntax is valid (no missing commas or brackets)

### Want to edit more videos?
- Simply edit the `src/data/portalData.json` file
- Add or remove video entries following the same structure
- The dashboard will reflect changes after saving and refreshing the page

## Example: Adding Your First Video

1. Find a YouTube video you want to add
2. Get its ID (e.g., `abc123xyz789`)
3. Edit the JSON:
   ```json
   {
     "title": "My First Custom Video",
     "duration": "20 min",
     "youtubeId": "abc123xyz789"
   }
   ```
4. Save the file
5. Refresh your dashboard
6. Go to Lectures → Personal Videos to see it!

---

**Happy learning! Enjoy your personalized video collection!**
