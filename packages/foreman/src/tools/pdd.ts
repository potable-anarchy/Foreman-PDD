import { spawn } from 'child_process';
import * as path from 'path';

/**
 * Configuration interface for PDD (Prompt-Driven Development) execution
 */
export interface PDDConfig {
  command: 'sync' | 'fix' | 'generate';
  specName: string;
  budget: number;
  targetCoverage: number;
}

/**
 * Result interface for PDD execution containing success status, test results, cost, and output
 */
export interface PDDResult {
  success: boolean;
  testsPass: boolean;
  cost: number;
  output: string;
  error?: string;
}

/**
 * Executes a PDD (Prompt-Driven Development) command with the specified configuration
 * @param config - Configuration object containing command type, spec name, budget, and target coverage
 * @returns Promise resolving to PDDResult with execution details
 */
export async function executePDD(config: PDDConfig): Promise<PDDResult> {
  const { command, specName, budget, targetCoverage } = config;
  
  // Build command arguments based on command type
  const args: string[] = [];
  
  if (command === 'sync') {
    args.push('--local', '--force', 'sync', specName, '--target-coverage', targetCoverage.toString());
  } else if (command === 'generate') {
    args.push('--local', '--force', 'generate', `prompts/${specName}_typescript.prompt`);
  } else if (command === 'fix') {
    args.push(
      'fix',
      `prompts/${specName}_typescript.prompt`,
      `${specName}.ts`,
      `test_${specName}.ts`,
      'error.log',
      '--budget',
      budget.toString(),
      '--max-attempts',
      '3'
    );
  }

  const workingDir = process.env.PDD_PATH || process.cwd();
  
  console.log(`Executing: pdd ${args.join(' ')}`);
  console.log(`Working directory: ${workingDir}`);

  return new Promise((resolve) => {
    let output = '';
    let errorOutput = '';
    
    const child = spawn('pdd', args, {
      cwd: workingDir,
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        FORCE_COLOR: '1', // Preserve colored output
      }
    });

    // Set up timeout (10 minutes) to prevent hanging processes
    const timeout = setTimeout(() => {
      child.kill('SIGTERM');
      resolve({
        success: false,
        testsPass: false,
        cost: 0,
        output: output,
        error: 'Command timed out after 10 minutes'
      });
    }, 10 * 60 * 1000);

    // Handle stdout - stream to console and capture for analysis
    child.stdout?.on('data', (data: Buffer) => {
      const text = data.toString();
      process.stdout.write(text);
      output += text;
    });

    // Handle stderr - stream to console and capture for error reporting
    child.stderr?.on('data', (data: Buffer) => {
      const text = data.toString();
      process.stderr.write(text);
      errorOutput += text;
      output += text; // Include stderr in overall output for complete logging
    });

    // Handle process exit and parse results
    child.on('close', (code: number | null) => {
      clearTimeout(timeout);
      
      const success = code === 0;
      const testsPass = parseTestsPass(output);
      const cost = parseCost(output);
      
      resolve({
        success,
        testsPass,
        cost,
        output,
        error: success ? undefined : (errorOutput || `Process exited with code ${code}`)
      });
    });

    // Handle spawn errors (e.g., PDD not found in PATH)
    child.on('error', (err: Error) => {
      clearTimeout(timeout);
      
      let errorMessage = err.message;
      if (err.message.includes('ENOENT')) {
        errorMessage = 'PDD command not found. Please ensure PDD is installed and available in PATH.';
      }
      
      resolve({
        success: false,
        testsPass: false,
        cost: 0,
        output,
        error: errorMessage
      });
    });
  });
}

/**
 * Parses the output to determine if tests passed by looking for success indicators
 * @param output - The complete output string from PDD execution
 * @returns boolean indicating whether tests passed
 */
function parseTestsPass(output: string): boolean {
  // Look for success indicators in the output
  return output.includes('Overall status: Success') || 
         output.includes('✅') ||
         output.includes('All tests passed') ||
         output.includes('Tests: PASS');
}

/**
 * Parses the output to extract cost information from various cost reporting formats
 * @param output - The complete output string from PDD execution
 * @returns number representing the parsed cost, or 0 if no cost found
 */
function parseCost(output: string): number {
  // Look for cost patterns like "Total cost: $X.XX" or "Cost: $X.XX"
  const costPatterns = [
    /Total cost:\s*\$?(\d+\.?\d*)/i,
    /Cost:\s*\$?(\d+\.?\d*)/i,
    /\$(\d+\.?\d*)\s*total/i
  ];
  
  for (const pattern of costPatterns) {
    const match = output.match(pattern);
    if (match && match[1]) {
      const cost = parseFloat(match[1]);
      if (!isNaN(cost)) {
        return cost;
      }
    }
  }
  
  return 0;
}