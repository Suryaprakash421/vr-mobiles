// Custom build script to disable static generation
const { execSync } = require("child_process");

console.log("Building with static generation disabled...");

// Set environment variables to disable static generation with a longer timeout
process.env.NEXT_DISABLE_STATIC_GENERATION = "true";
process.env.NEXT_STATIC_GENERATION_TIMEOUT = "120";

try {
  // Run the Next.js build command with the environment variables
  execSync("npx next build", {
    stdio: "inherit",
    env: {
      ...process.env,
      NEXT_DISABLE_STATIC_GENERATION: "true",
      NEXT_STATIC_GENERATION_TIMEOUT: "120",
    },
  });
  console.log("Build completed successfully!");
} catch (error) {
  console.error("Build failed:", error.message);
  process.exit(1);
}
