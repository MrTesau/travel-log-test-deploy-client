const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:1337' : 'https://travel-log-hazel.vercel.app'; // INSERT SERVER URL
// const { API_KEY } = process.env;

// request using fetch(not axios lib)
// returns all log entries saved in db
export async function listLogEntries() {
    const response = await fetch(`${API_URL}/api/logs`);
    return response.json();
}

// post new entry
export async function createLogEntry(entry) {
    const apiKey = entry.apiKey;
    delete entry.apiKey;
     // Attach key
     // Send 
    const response = await fetch(`${API_URL}/api/logs`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-API-KEY': apiKey, 
      },
      body: JSON.stringify(entry),
    });

    let json;

    if (response.headers.get('content-type').includes('text/html')) {
      const message = await response.text();
      json = {
        message,
      };

    } else {
      json = await response.json();
    }

    if (response.ok) {
      return json;
    }
    const error = new Error(json.message);
    error.response = json;
    throw error;
  }