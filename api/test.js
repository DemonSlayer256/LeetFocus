/**
 * Test script for the Gemini hints API
 * Run with: node test.js
 */

import dotenv from "dotenv";

dotenv.config();

const API_URL = "http://localhost:3000/api/getHints";

async function testAPI() {
  const testPayload = {
    problemStatement: "Two Sum: Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.",
    difficulty: "Easy"
  };

  console.log("🧪 Testing Gemini Hints API...\n");
  console.log("📨 Sending request to:", API_URL);
  console.log("📦 Payload:", JSON.stringify(testPayload, null, 2));

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(testPayload)
    });

    console.log("\n📊 Response Status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Error Response:", errorData);
      return;
    }

    const data = await response.json();
    console.log("\n✅ Success! Received hints:\n");
    console.log(data.hints);
    console.log("\n✨ API is working correctly!");

  } catch (error) {
    console.error("❌ Network or Connection Error:", error.message);
    console.log("\n💡 Troubleshooting tips:");
    console.log("   1. Make sure the server is running: npm start (in api/ directory)");
    console.log("   2. Check that GEMINI_API_KEY is set in .env");
    console.log("   3. Ensure you have internet connectivity");
  }
}

testAPI();
