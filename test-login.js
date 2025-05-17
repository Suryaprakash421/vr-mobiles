// Script to test login functionality
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function testLogin() {
  console.log("Testing login functionality...");

  const username = "admin";
  const password = "admin123"; // Default password from DebugInfo component

  try {
    // First test the debug login endpoint
    console.log(
      `Attempting to login with username: ${username} and password: ${password}`
    );

    const debugResponse = await fetch("http://localhost:3001/api/debug/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const debugResult = await debugResponse.json();
    console.log("Debug login result:", debugResult);

    if (debugResult.success) {
      console.log("Debug login successful!");
      console.log("User details:", debugResult.user);
    } else {
      console.error("Debug login failed:", debugResult.error);
    }
  } catch (error) {
    console.error("Error testing login:");
    console.error(error);
  }
}

testLogin();
