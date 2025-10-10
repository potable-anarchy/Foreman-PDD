import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runBuild } from '../src/loop';
import * as pddTool from '../src/tools/pdd';
import * as voiceTool from '../src/tools/voice';
import * as kanbanTool from '../src/tools/kanban';

vi.mock('../src/tools/pdd');
vi.mock('../src/tools/voice');
vi.mock('../src/tools/kanban');
vi.mock('../src/tools/diagram');

describe('runBuild', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should complete successfully on first attempt when tests pass', async () => {
    vi.spyOn(pddTool, 'executePDD').mockResolvedValue({
      success: true,
      testsPass: true,
      cost: 2.5,
      output: 'Build successful',
    });

    const result = await runBuild({
      specName: 'test_spec',
      budget: 10,
      maxAttempts: 3,
      targetCoverage: 80,
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe('done');
    expect(result.attempts).toBe(1);
    expect(result.totalCost).toBe(2.5);
  });

  it('should retry when tests fail and eventually succeed', async () => {
    vi.spyOn(pddTool, 'executePDD')
      .mockResolvedValueOnce({
        success: true,
        testsPass: false,
        cost: 2.0,
        output: 'Tests failed',
      })
      .mockResolvedValueOnce({
        success: true,
        testsPass: true,
        cost: 1.5,
        output: 'Tests passed',
      });

    const result = await runBuild({
      specName: 'test_spec',
      budget: 10,
      maxAttempts: 3,
      targetCoverage: 80,
    });

    expect(result.success).toBe(true);
    expect(result.attempts).toBe(2);
    expect(result.totalCost).toBe(3.5);
  });

  it('should fail after max attempts exceeded', async () => {
    vi.spyOn(pddTool, 'executePDD').mockResolvedValue({
      success: true,
      testsPass: false,
      cost: 1.0,
      output: 'Tests failed',
    });

    const result = await runBuild({
      specName: 'test_spec',
      budget: 10,
      maxAttempts: 2,
      targetCoverage: 80,
    });

    expect(result.success).toBe(false);
    expect(result.status).toBe('error');
    expect(result.attempts).toBe(2);
  });

  it('should call voice and kanban integrations', async () => {
    const announceSpy = vi.spyOn(voiceTool, 'announceVoice').mockResolvedValue();
    const kanbanSpy = vi.spyOn(kanbanTool, 'updateKanban').mockResolvedValue();

    vi.spyOn(pddTool, 'executePDD').mockResolvedValue({
      success: true,
      testsPass: true,
      cost: 2.5,
      output: 'Success',
    });

    await runBuild({
      specName: 'test_spec',
      budget: 10,
      maxAttempts: 3,
      targetCoverage: 80,
    });

    expect(announceSpy).toHaveBeenCalled();
    expect(kanbanSpy).toHaveBeenCalled();
  });
});
