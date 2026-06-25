# Portfolio App — Progress & Gap Analysis
_Last updated: 2026-06-25_

## Current repo state

A full-stack car-gallery portfolio app.

- **Frontend** (`frontend/`): **Create React App** (`react-scripts` 5.0.1) — *not* Vite. React 19.1, TypeScript 4.9.5 (`strict: true`). React Three Fiber **v9.5**, `@react-three/drei` **v10.7**, `three` 0.182 + `@types/three` are all installed and in active use. MUI 7 + Emotion for UI, `react-router-dom` 7 for routing, `google-map-react` for the Travel page. Deployed to GitHub Pages via `gh-pages` (`homepage` + `deploy` script).
- **Backend** (`backend/`): FastAPI app (`app/main.py`) with SQLAlchemy models, Alembic migrations, Pydantic schemas, S3 URL helpers, and a `docker-compose.yml` (FastAPI `api` + PostgreSQL 17 `db`). CORS is configured. Tests under `backend/tests/` with SQLite fixtures.
- **3D gallery** is well advanced: `Car3DBackgroundPage.tsx` (Canvas + 3-point lighting + HDRI Environment + reflective ground + ContactShadows + OrbitControls + idle auto-rotate), `CarModel.tsx` (`useGLTF` + preload + auto-grounding), `cars.config.ts` (per-car presets), and routed pages for gallery → make selection → individual car.
- **Routing already matches the wireframe flow:** `/` (Homepage) → `/gallery` → `/gallery/:make` → `/gallery/:make/:slug`, plus `/travel` and legacy locale/plates/peaks routes.

> **⚠️ Biggest structural finding:** The researched target architecture assumes a **Vite** project (Vite gl props, `vite-plugin-pwa`, "static serving for the Vite dist", DRACO/KTX2 decoders in `/public`). The actual project is **Create React App**. Most "missing" Phase 1/2/7 items are really *stack-mismatch* items, not simple omissions. **This needs a decision before remediation** (see Open Questions).

## Gap analysis

| Phase | Task | Status | Notes |
|-------|------|--------|-------|
| 1.1 | Scaffold + React + TS | ✅ | React 19.1 + TS 4.9.5, but on **CRA**, not Vite |
| 1.1 | R3F/drei/three/@types/three/zustand installed | ⚠️ | R3F v9, drei v10, three, @types/three ✅ — **zustand ❌ missing** |
| 1.1 | TS strict + path aliases | ⚠️ | `strict: true` ✅; **no path aliases** in `tsconfig.json` |
| 1.1 | ESLint + Prettier | ⚠️ | CRA `react-app` ESLint preset only; **no Prettier**, no standalone config |
| 1.2 | Canvas gl props (antialias:false, powerPreference) | ❌ | `<Canvas shadows camera>` has **no `gl` prop** at all |
| 1.2 | shadows, dpr={[1,2]}, frameloop="demand" | ⚠️ | `shadows` ✅; **no `dpr`, no `frameloop`** (defaults to "always") |
| 1.3 | FastAPI + uvicorn + python-multipart | ⚠️ | FastAPI ✅, uvicorn ✅; **`python-multipart` ❌** not in requirements |
| 1.3 | Routes GET /cars, /cars/{id}, /health | ⚠️ | `GET /cars/` ✅; `GET /cars/{id}/info` ✅ (not bare `/{id}`); **`/health` ❌** |
| 1.3 | CORS middleware | ✅ | Configured for `localhost:3000` + `:5173` |
| 1.3 | Static serving for build | ❌ | No `StaticFiles` mount; frontend deploys separately to GH Pages |
| 2.1 | @gltf-transform/cli | ❌ | Not present, not documented |
| 2.3 | Draco decoder files / CDN | ❌ | None in `/public`, not documented |
| 2.3 | Basis/KTX2 decoder files / CDN | ❌ | None present |
| 2.4 | useGLTF.setDecoderPath (Draco) | ❌ | Not called; `useGLTF` loads raw GLB |
| 2.4 | KTX2Loader configured | ❌ | Not configured |
| 3.1 | `<Environment>` HDRI | ✅ | `<Environment preset background>` in Canvas |
| 3.2 | ToneMapping ACES_FILMIC last in EffectComposer | ❌ | No EffectComposer at all |
| 3.3 | ContactShadows / AccumulativeShadows | ✅ | `<ContactShadows>` present |
| 3.4 | `<CarModel>` w/ Suspense + fallback | ⚠️ | `CarModel` + `useGLTF` ✅; **no `<Suspense fallback>`** around it |
| 3.4 | `<Bounds>` auto-frame | ❌ | Manual camera presets instead; no `<Bounds>` |
| 4.x | @react-three/postprocessing + postprocessing | ❌ | Neither installed |
| 4.x | EffectComposer (N8AO,Bloom,DoF,Vignette,SMAA,ToneMapping) | ❌ | No post-processing pipeline |
| 4.x | n8ao installed | ❌ | Not installed |
| 5.1 | OrbitControls enableDamping/min/maxDistance | ⚠️ | min/maxDistance + azimuth/polar limits ✅; **`enableDamping`/`dampingFactor` not set** |
| 5.2 | Zustand store (lastInteraction + isIdle) | ❌ | Idle handled via local `useRef`/`useState`, no Zustand |
| 5.2 | Inactivity setTimeout (5s) | ⚠️ | Implemented, but **4000ms** not 5s |
| 5.3 | GSAP installed | ❌ | Not installed |
| 5.3 | Idle cinematic GSAP tween → autoRotate | ⚠️ | Auto-rotate on idle ✅; **no GSAP camera tween** |
| 5.3 | Cancel cinematic on interaction | ✅ | `mousemove` cancels auto-rotate ✅ |
| 6.1 | r3f-perf `<Perf>` in dev | ❌ | Not installed |
| 6.3 | React.lazy per-car route | ❌ | All routes statically imported in `App.tsx` |
| 6.4 | frameloop demand/always toggle | ❌ | No `frameloop` control |
| 7.1 | vite-plugin-pwa | ❌ | CRA project; has `manifest.json` but no PWA build config |
| 7.2 | Dockerfile / deploy config | ⚠️ | `docker-compose.yml` (backend) ✅ + GH Pages deploy ✅; **no `Dockerfile`** |

### Gallery UX (wireframes)

| View | Status | Notes |
|------|--------|-------|
| Home Screen (nav tabs + featured 3D + hover arrow) | ✅ | `Homepage.tsx` + `DropdownNav` (Gallery/Travel/…) |
| Gallery Main (dropdown, emblem strip, central 3D) | ✅ | `Car3DBackgroundPage` + `MakeStrip` emblem strip + nav |
| Brand/Manufacturer Select (emblem strip + brand panel) | ✅ | `MakeSelectionPage` (`/gallery/:make`) |
| Individual Car (3D + emblem + class badge, scroll) | ✅ | `IndividualCarPage` (`/gallery/:make/:slug`) |
| Car Detail scroll (two-column profile cards) | ⚠️ | Page exists; verify two-column spec layout against wireframe |
| Forza art direction (dark bg, red accent, tight labels) | ⚠️ | Dark `#000`/`#111` ✅, uppercase letter-spaced labels ✅; **confirm red accent `#e8002d`** is applied |

## Remediation plan

### Immediate (Phase 1 blockers / decisions)
1. **DECISION: Vite migration vs. stay on CRA.** Resolve the stack mismatch first — it determines whether Phase 2/7 items (`vite.config`, `vite-plugin-pwa`, Vite gl props) even apply. CRA (`react-scripts`) is in maintenance; the target architecture is Vite-shaped. (See Open Questions.)
2. **Fix `backend/app/main.py` bug:** `json.loads(...)` is used at line 56 but `json` is never imported → `/cars/{id}/info` will raise `NameError`. Add `import json`.
3. **Add `GET /health`** route to `app/main.py` returning `{"status": "ok"}`.
4. **Add `python-multipart`** to `backend/requirements.txt` (+ pin versions while there).
5. **Install missing frontend deps:** `zustand`, `gsap` (Phase 5), and decide on the postprocessing set (Phase 4).
6. **Add path aliases** to `tsconfig.json` (`baseUrl` + `paths`, e.g. `@/* → src/*`); add Prettier + a shared config.
7. **Set Canvas `gl` props:** `gl={{ antialias: false, powerPreference: 'high-performance' }}`, add `dpr={[1, 2]}` and `frameloop="demand"`.

### Phase 2–3 (asset pipeline + scene)
8. Add `@gltf-transform/cli` as a dev dependency; document a Draco + KTX2/Basis optimization step in the README.
9. Place Draco + KTX2 decoder WASM in `frontend/public/draco/` and `frontend/public/basis/` (or document a CDN path).
10. Wire `useGLTF.setDecoderPath('/draco/')` and a configured `KTX2Loader` so optimized GLBs load.
11. Wrap `<CarModel>` in `<Suspense fallback={…}>` inside the Canvas; add a loading fallback.
12. Evaluate `<Bounds>` for auto-framing (or document why manual camera presets are preferred over `<Bounds>`).

### Phase 4–6 (post-processing, interaction, perf)
13. Install `@react-three/postprocessing` + `postprocessing` (+ `n8ao`); add `<EffectComposer>` with N8AO → Bloom → DepthOfField → Vignette → SMAA → **ToneMapping (ACES_FILMIC) last**.
14. Create a Zustand store (`lastInteraction`, `isIdle`); move idle/auto-rotate state out of component refs; change the inactivity timeout from 4000ms → **5000ms**.
15. Add a GSAP camera-position tween for the idle cinematic before auto-rotate; cancel on interaction (logic already exists).
16. Add `enableDamping` + `dampingFactor` to `OrbitControls`.
17. Install `r3f-perf`; render `<Perf>` only in dev.
18. Convert route imports in `App.tsx` to `React.lazy` + `<Suspense>` for per-route code-splitting.
19. Toggle `frameloop` between `demand` and `always` on interaction/idle.

### Phase 7 (distribution)
20. If staying on CRA: configure CRA's built-in PWA (service worker) or migrate to Vite + `vite-plugin-pwa`.
21. Add a frontend `Dockerfile` (or document GH Pages as the canonical deploy and serve the backend separately).
22. Optionally add backend static serving (`StaticFiles`) if you want a single-origin deploy instead of GH Pages + separate API.

## Design direction

The app targets a **Forza Motorsport-style automotive showroom** aesthetic: a near-black studio backdrop (`#000`/`#111`), an HDRI-lit reflective ground plane, and a 3-point lighting rig that renders each car as a press shot. Labels are uppercase, thin-weight, and widely letter-spaced (e.g. the nameplate `YEAR  MODEL — STUDIO`), echoing the wireframe's "CAR / LOCATION / ENVIRONMENT" tight-tracked sans-serif. The UX flow is a guided drill-down — **Home → Gallery (all cars + horizontal make-emblem strip) → Make selection → Individual car (3D viewer + scroll-down spec sheet)** — with hover-revealed nav arrows, an idle auto-rotate cinematic, and a drag-to-hide UI so the model stays the hero. The red accent (`#e8002d`) and two-column metadata cards from the wireframe should be confirmed/applied to complete the Forza identity.

## Open questions
- **Vite vs CRA:** The researched architecture is Vite-based, but the project runs on Create React App. Migrate to Vite (unlocks `vite-plugin-pwa`, faster HMR, the documented gl/dist setup) or adapt the target plan to CRA? This gates ~6 checklist items.
- **Post-processing scope:** The full N8AO+Bloom+DoF+Vignette+SMAA stack is heavy for a portfolio. Confirm whether all six effects are wanted, or a lighter subset (e.g. SMAA + ToneMapping + subtle Bloom).
- **Asset optimization need:** Are current GLBs large enough to justify the Draco/KTX2 pipeline, or is it premature for the current model count?
- **Deploy topology:** Frontend is on GitHub Pages and backend is Dockerized separately. Is single-origin serving (FastAPI serving the build) a goal, or keep them split?
- **`CarModels.ts`** uses a raw `GLTFLoader` against a global `scene` that is never initialized — appears to be dead/legacy code superseded by `CarModel.tsx` (`useGLTF`). Confirm it can be removed.
