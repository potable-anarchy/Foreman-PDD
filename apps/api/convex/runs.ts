import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Mutations

/**
 * Creates a new build run with initial status and metadata
 * @param specName - Name of the specification being built
 * @param summary - Brief description of the run
 * @returns The ID of the created run
 */
export const createRun = mutation({
  args: {
    specName: v.string(),
    summary: v.string(),
  },
  handler: async (ctx, args) => {
    const runId = await ctx.db.insert("runs", {
      specName: args.specName,
      summary: args.summary,
      status: "running",
      startedAt: Date.now(),
      totalCost: 0,
      attempts: 1,
    });
    return runId;
  },
});

/**
 * Updates an existing run with new status, cost, or metadata
 * @param runId - ID of the run to update
 * @param status - Optional new status (running, completed, failed)
 * @param summary - Optional updated summary
 * @param totalCost - Optional updated total cost
 * @param attempts - Optional updated attempt count
 * @param endedAt - Optional end timestamp
 * @returns The ID of the updated run
 */
export const updateRun = mutation({
  args: {
    runId: v.id("runs"),
    status: v.optional(v.union(v.literal("running"), v.literal("completed"), v.literal("failed"))),
    summary: v.optional(v.string()),
    totalCost: v.optional(v.number()),
    attempts: v.optional(v.number()),
    endedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { runId, ...updates } = args;
    
    // Filter out undefined values to avoid overwriting with undefined
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    await ctx.db.patch(runId, filteredUpdates);
    return runId;
  },
});

/**
 * Creates a new task within a build run
 * @param runId - ID of the parent run
 * @param title - Title/description of the task
 * @param state - Current state of the task
 * @param diffSummary - Optional summary of changes made
 * @returns The ID of the created task
 */
export const createTask = mutation({
  args: {
    runId: v.id("runs"),
    title: v.string(),
    state: v.union(
      v.literal("pending"),
      v.literal("running"), 
      v.literal("completed"),
      v.literal("failed")
    ),
    diffSummary: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("tasks", {
      runId: args.runId,
      title: args.title,
      state: args.state,
      diffSummary: args.diffSummary,
      createdAt: Date.now(),
    });
    return taskId;
  },
});

/**
 * Updates an existing task's state and metadata
 * @param taskId - ID of the task to update
 * @param state - New state of the task
 * @param diffSummary - Optional updated diff summary
 * @returns The ID of the updated task
 */
export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    state: v.union(
      v.literal("pending"),
      v.literal("running"),
      v.literal("completed"), 
      v.literal("failed")
    ),
    diffSummary: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { taskId, ...updates } = args;
    
    // Filter out undefined values to avoid overwriting with undefined
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    await ctx.db.patch(taskId, {
      ...filteredUpdates,
      updatedAt: Date.now(),
    });
    return taskId;
  },
});

// Queries

/**
 * Retrieves a paginated list of runs ordered by most recent
 * @param limit - Optional limit for number of runs to return (default: 50)
 * @returns Array of run objects
 */
export const listRuns = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    
    const runs = await ctx.db
      .query("runs")
      .withIndex("by_startedAt")
      .order("desc")
      .take(limit);
    
    return runs;
  },
});

/**
 * Retrieves a specific run by its ID
 * @param runId - ID of the run to retrieve
 * @returns The run object or null if not found
 */
export const getRun = query({
  args: {
    runId: v.id("runs"),
  },
  handler: async (ctx, args) => {
    const run = await ctx.db.get(args.runId);
    return run;
  },
});

/**
 * Retrieves all runs for a specific specification
 * @param specName - Name of the specification
 * @returns Array of run objects for the given spec
 */
export const getRunsBySpec = query({
  args: {
    specName: v.string(),
  },
  handler: async (ctx, args) => {
    const runs = await ctx.db
      .query("runs")
      .withIndex("by_specName", (q) => q.eq("specName", args.specName))
      .order("desc")
      .collect();
    
    return runs;
  },
});

/**
 * Retrieves all tasks for a specific run
 * @param runId - ID of the parent run
 * @returns Array of task objects for the given run
 */
export const getTasksByRun = query({
  args: {
    runId: v.id("runs"),
  },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_runId", (q) => q.eq("runId", args.runId))
      .order("asc")
      .collect();
    
    return tasks;
  },
});