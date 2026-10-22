import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';
const PREDICT_SCRIPT_PATH = path.join(__dirname, '..', 'ml', 'predict.py');

/**
 * Checks health of Python FastAPI microservice
 */
export async function checkMLServiceHealth() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`${ML_SERVICE_URL}/health`, { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      return { status: 'online', service: 'FastAPI', details: data };
    }
  } catch (err) {
    // Service not running directly, fallback to CLI
  }
  return { status: 'fallback', service: 'Direct Python CLI' };
}

/**
 * Executes ML prediction using either FastAPI endpoint or direct Python CLI execution
 */
export async function getMLPredictions(studentProfile) {
  // Strategy 1: Call FastAPI microservice if reachable
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`${ML_SERVICE_URL}/api/career-recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentProfile),
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    // FastAPI service not answering, fall through to Strategy 2
  }

  // Strategy 2: Direct Python script invocation via child_process
  return new Promise((resolve, reject) => {
    try {
      const pyProcess = spawn('py', [PREDICT_SCRIPT_PATH, '--stdin']);
      let stdout = '';
      let stderr = '';

      pyProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      pyProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      pyProcess.on('close', (code) => {
        if (code === 0) {
          try {
            const parsed = JSON.parse(stdout.trim());
            resolve(parsed);
          } catch (e) {
            reject(new Error(`Failed to parse ML output: ${stdout}`));
          }
        } else {
          reject(new Error(`Python process exited with code ${code}: ${stderr}`));
        }
      });

      // Pass profile JSON via stdin
      pyProcess.stdin.write(JSON.stringify(studentProfile));
      pyProcess.stdin.end();
    } catch (e) {
      reject(e);
    }
  });
}
