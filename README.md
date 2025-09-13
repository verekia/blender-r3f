# Blender to React Three Fiber (R3F) Workflow

HMR workflow from Blender to R3F without Blender add-ons.

## Setup

This project requires Bun at the moment.

- `bun i`
- `bun dev` in one tab
- `bun watch` in another tab

## How it works

The `watcher.ts` server:

- Watches for `.blend` file changes, and triggers a Python script that exports GLB files. All Blender objects become independent GLB files.
- Watches for `.glb` file changes and broadcasts via WebSockets the file names that got updated.
- The browser subscribes to the WebSocket server and triggers reloads of the components, which are loaded via `useGLTF`, a suspense boundary (important), and a version hash in the URL.

## Customizing it

This is just a proof of concept to serve as a base, you will want to customize a few things. For example you might not want all objects to end up as GLB files, so you'll need to tweak the export script to have some rules about which objects should be exported (you could use the renderable property of objects, or anything else).

You'll probably want to add Draco compression in the export script or `gltf-transform` processing after the Blender export.
