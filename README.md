# IKEA × Minecraft — Build Your Dream Room

A fictional, fan-made concept site: furnish a Minecraft-style 3D bedroom with IKEA-inspired furniture and see the demo price in INR.
Not affiliated with IKEA or Mojang. All prices are demo prices. No backend, API keys or paid services needed.

## Run locally
Requires Node.js 18+.

```bash
npm install
npm run dev
```
Open the URL Vite prints (usually http://localhost:5173). Production build: `npm run build` then `npm run preview`.

## Controls
- Drag furniture to place it; drag empty space to orbit; scroll to zoom
- WASD walks the camera; arrow keys nudge the selected piece; R rotates; Delete removes
- Toolbar on a selected piece: MOVE, ROTATE, CHANGE COLOUR, DELETE

## Stack
React, Vite, Three.js (procedural voxel furniture, no external assets), Tailwind CSS, Framer Motion, Lucide React.
Files: `src/Room.js` (3D scene), `src/App.js` (UI), `src/data.js` (catalogue, themes).
Note: the UI uses `htm` (JSX-like tagged templates), so no JSX build step is needed.
