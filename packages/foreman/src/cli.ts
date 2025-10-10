#!/usr/bin/env node

import { Command } from 'commander';
import { config } from 'dotenv';
import { runBuild } from './loop';

// Load environment variables
config();

interface BuildOptions {
  budget: string;
  attempts: string;
  coverage: string;
}

async function handleBuild(spec: string, options: BuildOptions): Promise<void> {
  try {
    console.log(`🚀 Starting build for spec: ${spec}`);
    
    const buildConfig = {
      specName: spec,
      budget: parseFloat(options.budget),
      maxAttempts: parseInt(options.attempts, 10),
      targetCoverage: parseInt(options.coverage, 10)
    };

    const result = await runBuild(buildConfig);

    if (result.success) {
      console.log(`✅ Build completed successfully!`);
      process.exit(0);
    } else {
      console.error(`❌ Build failed: ${result.error || 'Unknown error'}`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`💥 Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
}

const program = new Command();

program
  .name('foreman')
  .description('Foreman Agent - AI-powered development orchestrator')
  .version('1.0.0');

program
  .command('build')
  .description('Build a project from specification')
  .argument('<spec>', 'Specification file or name to build')
  .option('--budget <amount>', 'Budget for PDD in USD', '10.00')
  .option('--attempts <number>', 'Maximum retry attempts', '3')
  .option('--coverage <percentage>', 'Target test coverage percentage', '80')
  .action(handleBuild);

// Parse command line arguments
program.parse();