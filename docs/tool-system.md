# Tool System Architecture

This document captures the Phase 0 baseline for the OneTool tool system. It defines
contracts, boundaries, and the current execution path without changing runtime behavior.

## Goals
- Provide a single source of truth for tool metadata and routing.
- Keep UI/tool logic modular and discoverable.
- Preserve API behavior while preparing for future hardening.

## Core Contracts

The tool contracts are defined in `src/core/tool-system/tool-types.js`:

- `ToolMetadata`
  - Minimal metadata used by registry, routing, and UI surfaces.
  - Fields: `id`, `name`, `category`, `description`, `icon`, `comingSoon`, optional `version`, `keywords`.
- `ToolExecutionContext`
  - Execution context passed to tool runners (Phase 2+).
  - Fields: `toolId`, `requestId`, `userId`, `source`, `options`, `metadata`.

## Tool Registration (Phase 1)
- Tools export `metadata` from `src/tools/<tool>/tool.config.js`.
- Default export remains the full tool config to preserve compatibility.
- The registry normalizes metadata using `toolConfig.metadata ?? toolConfig`.

## Boundaries and Responsibilities

Core boundaries are enforced by convention (Phase 0 baseline):

- `src/core/tool-system/*`
  - Tool registry, loader, runner map, and execution engine.
  - May depend on tool configs and runners, but should not import UI modules.
- `src/tools/*`
  - Tool implementation + config (metadata, optional runner).
  - No direct access to app routes or UI modules.
- `src/modules/tools/*`
  - Tool UI composition and page-level logic.
  - Can read tool metadata via the registry.
- `src/app/*`
  - Route entries only (pages/layouts/route handlers).

## Current Runtime Flow (Baseline)

1. Tool metadata loaded from `src/tools/*/tool.config.js`.
2. Registry builds tool list and category list in `src/core/tool-system/tool-registry.js`.
3. UI reads from `src/lib/tools/toolRegistry.js` (re-export).
4. Execution:
   - Client: `executeTool()` calls `/api/tools/[toolId]/execute`.
   - Server: `executeTool()` resolves tool runner and executes locally.

## Known Constraints (Phase 0)
- Tool discovery is manual and requires imports in `tool-loader.js`.
- Runner registry is a fixed map in `tool-runner-registry.js`.
- Execution does not yet enforce schema validation or tracing.

## TODO Markers
- Phase 1: Validate tool configs against `ToolMetadata` at load time.
- Phase 2: Centralize validation, error taxonomy, tracing, and runner discovery.
- Phase 3: Enforce registry as the single source of truth for tool discovery.
