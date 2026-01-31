# LeetFocus API Server

A Node.js/Express server that provides LeetCode hints using Google's Gemini AI.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `api/` directory:

```bash
cp .env.example .env
```

Add your Gemini API key to `.env`:

```
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**How to get a Gemini API Key:**
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Get API Key"
3. Create a new API key
4. Copy and paste it into your `.env` file

### 3. Start the Server

```bash
npm start
# or for development with auto-reload:
npm run dev
```

The server will run at `http://localhost:3000`

## API Endpoints

### `POST /api/getHints`

Get hints for a LeetCode problem.

**Request Body:**
```json
{
  "problemStatement": "Two Sum: Given an array of integers...",
  "difficulty": "Easy",
}
```

**Response:**
```json
{
  "hints": "1. Use a hash map to store seen numbers...\n2. Iterate through the array...\n3. Return the indices..."
}
```

**Error Response:**
```json
{
  "error": "Failed to fetch hints from Gemini API",
  "details": "error message details"
}
```

## Testing

Run the test script to verify the API is working:

```bash
npm start
# In another terminal:
node test.js
```

## Troubleshooting

### "GEMINI_API_KEY is not set"
- Check that `.env` file exists in the `api/` directory
- Verify the API key is correct
- Restart the server after adding/changing the key

### "Network response was not ok"
- Ensure the Express server is running on port 3000
- Check that no other process is using port 3000
- Verify CORS is enabled for the Chrome extension origin

### "Invalid request body"
- Ensure all required fields are present: `problemStatement`, `difficulty`

## Model Used

- **Model:** `gemini-2.5-flash` (fast, efficient model)
- Alternative: `gemini-3.0-flash` (latest model if available)

## CORS Configuration

The API is configured to accept requests from any origin (`*`). For production, update the CORS configuration in `index.js`:

```javascript
app.use(cors({
  origin: ['https://leetcode.com', 'chrome-extension://your-extension-id']
}));
```

## Dependencies

- **express:** Web server framework
- **cors:** Enable cross-origin requests
- **dotenv:** Load environment variables
- **@google/generative-ai:** Google Gemini AI SDK
