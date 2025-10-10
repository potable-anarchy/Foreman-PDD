import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Convex schema for tracking build runs, tasks, and specs with efficient indexing and type safety.
 * 
 * This schema provides:
 * - Type safety with union types for status/state enums
 * - Efficient querying with strategic indexes
 * - Complete audit trail with timestamps and status tracking
 * - Dashboard support for filtering and sorting
 */
export default defineSchema({
  // Table for tracking build runs with their lifecycle and metadata
  runs: defineTable({
    specName: v.string(), // Name of the specification being built
    startedAt: v.number(), // Unix timestamp when the run started
    endedAt: v.optional(v.number()), // Unix timestamp when the run ended (optional for ongoing runs)
    status: v.union(
      v.literal("planning"),
      v.literal("building"),
      v.literal("testing"),
      v.literal("done"),
      v.literal("error")
    ), // Current status of the build run
    summary: v.string(), // Human-readable summary of the run
    totalCost: v.optional(v.number()), // Optional cost tracking for analytics
    attempts: v.optional(v.number()), // Number of attempts made for this run
  })
    .index("by_specName", ["specName"]) // Index for filtering runs by specification
    .index("by_status", ["status"]) // Index for dashboard filtering by status
    .index("by_startedAt", ["startedAt"]), // Index for chronological sorting

  // Table for tracking individual tasks within a build run
  tasks: defineTable({
    runId: v.id("runs"), // Foreign key reference to the parent run
    title: v.string(), // Descriptive title of the task
    state: v.union(
      v.literal("backlog"),
      v.literal("doing"),
      v.literal("done"),
      v.literal("error")
    ), // Current state of the task
    diffSummary: v.optional(v.string()), // Optional summary of code changes made
    createdAt: v.number(), // Unix timestamp when the task was created
  })
    .index("by_runId", ["runId"]) // Index for fetching all tasks in a specific run
    .index("by_state", ["state"]), // Index for filtering tasks by their current state

  // Table for storing build specifications
  specs: defineTable({
    name: v.string(), // Unique name identifier for the specification
    raw: v.string(), // Raw specification content as provided by user
    normalized: v.optional(v.string()), // Optional normalized/processed version of the spec
    createdAt: v.number(), // Unix timestamp when the spec was created
  })
    .index("by_name", ["name"]), // Index for quick lookups by specification name
});