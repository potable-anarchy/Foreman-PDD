import { executePDD, PDDConfig, PDDResult } from './tools/pdd';
import { announceVoice } from './tools/voice';
import { updateKanban, TaskState } from './tools/kanban';
import { generateDiagram } from './tools/diagram';

export interface BuildConfig {
  specName: string;
  budget: number;
  maxAttempts: number;
  targetCoverage: number;
}

export interface BuildResult {
  success: boolean;
  status: 'done' | 'error' | 'building' | 'testing';
  totalCost: number;
  duration: number;
  error?: string;
  attempts: number;
}

/**
 * Executes a build process for a given specification with retry logic and integration hooks.
 * 
 * @param config - Build configuration containing spec name, budget, max attempts, and target coverage
 * @returns Promise resolving to BuildResult with success status, cost, duration, and attempt count
 */
export async function runBuild(config: BuildConfig): Promise<BuildResult> {
  const startTime = Date.now();
  let totalCost = 0;
  let attempts = 0;
  const maxExecutionTime = 15 * 60 * 1000; // 15 minutes

  console.log(`🚀 Starting build for spec: ${config.specName}`);
  console.log(`📊 Budget: $${config.budget}, Max attempts: ${config.maxAttempts}, Target coverage: ${config.targetCoverage}%`);

  try {
    // Step 1: Announce build started
    console.log('🔊 Announcing build start...');
    await safeCall(() => announceVoice(`Build started for ${config.specName}`));

    // Step 2: Update Kanban to planning
    console.log('📋 Updating Kanban status...');
    await safeCall(() => updateKanban(config.specName, 'planning' as TaskState, 'Initializing build'));

    // Main execution loop with retry logic
    while (attempts < config.maxAttempts) {
      attempts++;
      const attemptStartTime = Date.now();
      
      // Check timeout to prevent infinite execution
      if (Date.now() - startTime > maxExecutionTime) {
        console.log('⏰ Maximum execution time exceeded');
        return {
          success: false,
          status: 'error',
          totalCost,
          duration: Date.now() - startTime,
          error: 'Maximum execution time exceeded',
          attempts
        };
      }

      console.log(`\n🔄 Attempt ${attempts}/${config.maxAttempts}`);
      
      // Update Kanban to building status
      await safeCall(() => updateKanban(config.specName, 'building' as TaskState, `Build attempt ${attempts}`));

      // Determine command: 'sync' for first attempt, 'fix' for retries
      const command = attempts === 1 ? 'sync' : 'fix';
      
      console.log(`⚙️  Executing PDD with command: ${command}`);
      
      const pddConfig: PDDConfig = {
        command,
        specName: config.specName,
        budget: config.budget,
        targetCoverage: config.targetCoverage
      };

      const pddResult: PDDResult = await executePDD(pddConfig);
      totalCost += pddResult.cost;

      console.log(`💰 Attempt cost: $${pddResult.cost.toFixed(2)}, Total cost: $${totalCost.toFixed(2)}`);
      console.log(`⏱️  Attempt duration: ${((Date.now() - attemptStartTime) / 1000).toFixed(1)}s`);

      // Handle PDD execution failure
      if (!pddResult.success) {
        console.log(`❌ PDD execution failed: ${pddResult.error || 'Unknown error'}`);
        
        if (attempts >= config.maxAttempts) {
          await safeCall(() => updateKanban(config.specName, 'error' as TaskState, 'Build failed - all attempts exhausted'));
          await safeCall(() => announceVoice(`Build failed for ${config.specName} after ${attempts} attempts`));
          
          return {
            success: false,
            status: 'error',
            totalCost,
            duration: Date.now() - startTime,
            error: `PDD execution failed: ${pddResult.error || 'Unknown error'}`,
            attempts
          };
        }

        // Wait before retry with exponential backoff
        const delay = attempts * 5000; // 5s, 10s, 15s
        console.log(`⏳ Waiting ${delay / 1000}s before retry...`);
        await sleep(delay);
        continue;
      }

      // Update Kanban to testing status
      await safeCall(() => updateKanban(config.specName, 'testing' as TaskState, 'Running tests'));

      console.log('🧪 Checking test results...');
      
      // Handle successful test execution
      if (pddResult.testsPass) {
        console.log('✅ Tests passed! Build successful');
        
        // Update Kanban to done
        await safeCall(() => updateKanban(config.specName, 'done' as TaskState, 'Build completed successfully'));
        
        // Generate diagram
        console.log('📊 Generating diagram...');
        await safeCall(() => generateDiagram(config.specName));
        
        // Announce success
        await safeCall(() => announceVoice(`Build completed successfully for ${config.specName}`));
        
        const duration = Date.now() - startTime;
        console.log(`🎉 Build completed in ${(duration / 1000).toFixed(1)}s with ${attempts} attempts`);
        
        return {
          success: true,
          status: 'done',
          totalCost,
          duration,
          attempts
        };
      } else {
        console.log('❌ Tests failed');
        
        if (attempts >= config.maxAttempts) {
          console.log('🚫 All attempts exhausted');
          await safeCall(() => updateKanban(config.specName, 'error' as TaskState, 'Build failed - tests not passing'));
          await safeCall(() => announceVoice(`Build failed for ${config.specName} - tests not passing after ${attempts} attempts`));
          
          return {
            success: false,
            status: 'error',
            totalCost,
            duration: Date.now() - startTime,
            error: 'Tests failed after all attempts',
            attempts
          };
        }

        // Wait before retry with exponential backoff
        const delay = attempts * 5000; // 5s, 10s, 15s
        console.log(`⏳ Waiting ${delay / 1000}s before retry...`);
        await sleep(delay);
      }
    }

    // This should not be reached, but just in case
    return {
      success: false,
      status: 'error',
      totalCost,
      duration: Date.now() - startTime,
      error: 'Unexpected end of execution loop',
      attempts
    };

  } catch (error) {
    console.error('💥 Unexpected error during build:', error);
    
    await safeCall(() => updateKanban(config.specName, 'error' as TaskState, 'Build failed with unexpected error'));
    await safeCall(() => announceVoice(`Build failed for ${config.specName} due to unexpected error`));
    
    return {
      success: false,
      status: 'error',
      totalCost,
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
      attempts
    };
  }
}

/**
 * Helper function to safely call integration functions without blocking main flow.
 * Catches and logs errors from integration calls to prevent build process interruption.
 * 
 * @param fn - Function to execute safely
 */
async function safeCall(fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
  } catch (error) {
    console.warn('⚠️  Integration call failed (non-blocking):', error instanceof Error ? error.message : 'Unknown error');
  }
}

/**
 * Helper function for delays in retry logic.
 * 
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after the specified delay
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}