# API Data Exporter

A web-based tool built with Flask, HTML, CSS, and JavaScript that fetches data from APIs, previews records in a table, and exports data into JSON and CSV formats.

## Features

- Fetch data from a user-provided API endpoint
- Preview API records in a readable table
- Handle nested API response structures
- Display useful error messages for failed requests
- Handle empty API responses
- Export the original API response as JSON
- Export records as CSV
- Responsive, user-friendly interface

## Tech Stack

- **Backend:** Python, Flask
- **Frontend:** HTML, CSS, JavaScript
- **Data formats:** JSON, CSV

## Getting Started

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd api-data-exporter
```

### 2. Create a virtual environment

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the application

```bash
python3 app.py
```

Open `http://127.0.0.1:5000` in your browser.

## How to Use

1. Enter an API endpoint that returns JSON.
2. Click **Fetch Data**.
3. Preview the returned records.
4. Export the response as JSON or CSV.

## Future Improvements

- Add pagination for large API responses
- Improve filtering and search
- Add automated tests
- Improve accessibility and mobile responsiveness

## Author
Charvi Bora
Github-https://github.com/Charvibora
