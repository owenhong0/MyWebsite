# Graph Report - .  (2026-06-25)

## Corpus Check
- 69 files · ~204,656 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 355 nodes · 463 edges · 30 communities (25 shown, 5 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.84)
- Token cost: 173,648 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Backend Domain Models|Backend Domain Models]]
- [[_COMMUNITY_Frontend Dependencies & Config|Frontend Dependencies & Config]]
- [[_COMMUNITY_Backend CRUD Layer|Backend CRUD Layer]]
- [[_COMMUNITY_3D Car Scene & R3F Components|3D Car Scene & R3F Components]]
- [[_COMMUNITY_Car Gallery Press Photos|Car Gallery Press Photos]]
- [[_COMMUNITY_Frontend Pages & Routing|Frontend Pages & Routing]]
- [[_COMMUNITY_TypeScript Compiler Config|TypeScript Compiler Config]]
- [[_COMMUNITY_Car Model & S3 Asset URLs|Car Model & S3 Asset URLs]]
- [[_COMMUNITY_Frontend API Client & User CRUD|Frontend API Client & User CRUD]]
- [[_COMMUNITY_MUI Card UI Components|MUI Card UI Components]]
- [[_COMMUNITY_Database Session & Test Fixtures|Database Session & Test Fixtures]]
- [[_COMMUNITY_Brand Selection UI|Brand Selection UI]]
- [[_COMMUNITY_Plates (Food) UI|Plates (Food) UI]]
- [[_COMMUNITY_PWA Manifest|PWA Manifest]]
- [[_COMMUNITY_Docker Compose Stack|Docker Compose Stack]]
- [[_COMMUNITY_Alembic Migration Env|Alembic Migration Env]]
- [[_COMMUNITY_3D Model Loaders|3D Model Loaders]]
- [[_COMMUNITY_Project Docs & HTML Template|Project Docs & HTML Template]]
- [[_COMMUNITY_S3 Key Generation|S3 Key Generation]]
- [[_COMMUNITY_Frontend Image Assets|Frontend Image Assets]]
- [[_COMMUNITY_React App Icons|React App Icons]]
- [[_COMMUNITY_Sequoia Landscape Photo|Sequoia Landscape Photo]]
- [[_COMMUNITY_Robots Crawler Policy|Robots Crawler Policy]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `Car` - 10 edges
3. `create_sample_bmw_m3()` - 10 edges
4. `create_sample_pad_thai()` - 9 edges
5. `scripts` - 7 edges
6. `Dish` - 6 edges
7. `Model` - 6 edges
8. `Variant` - 6 edges
9. `Car Gallery Press Shot` - 6 edges
10. `ViewState` - 5 edges

## Surprising Connections (you probably didn't know these)
- `MyWebsite Project README` --conceptually_related_to--> `Frontend Create React App README`  [INFERRED]
  README.md → frontend/README.md
- `McLaren F1` --semantically_similar_to--> `Honda NSX-R`  [INFERRED] [semantically similar]
  frontend/public/images/cars/mclaren-f1.jpg → frontend/public/images/cars/honda-nsx-r.jpg
- `Dramatic Dark Studio Lighting` --semantically_similar_to--> `Black Studio Backdrop with Gradient`  [INFERRED] [semantically similar]
  frontend/public/images/cars/koenigsegg-ccxr.jpg → frontend/public/images/cars/mclaren-f1.jpg
- `1990s JDM Sport Coupe Design` --semantically_similar_to--> `1990s JDM Sport Coupe Design`  [INFERRED] [semantically similar]
  frontend/public/images/cars/nissan-skyline-r33.jpg → frontend/public/images/cars/toyota-supra-rz.jpg
- `React Logo 512px (App Icon)` --semantically_similar_to--> `React Logo 192px (App Icon)`  [INFERRED] [semantically similar]
  frontend/public/logo512.png → frontend/public/logo192.png

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Dockerized FastAPI + Postgres Backend Stack** — docker_compose_api_service, docker_compose_db_service, docker_compose_postgres_data_volume [EXTRACTED 0.85]
- **Backend Python Dependency Set** — requirements_fastapi, requirements_sqlalchemy, requirements_alembic, requirements_psycopg2_binary [INFERRED 0.75]
- **** — cars_honda_nsx_r_car, cars_koenigsegg_ccxr_car, cars_mclaren_f1_car [INFERRED 0.85]

## Communities (30 total, 5 thin omitted)

### Community 0 - "Backend Domain Models"
Cohesion: 0.07
Nodes (32): Brand, Dish, Model, Forza-style: '2023 BMW M3 Competition, Compact: '23 M3 Competition, Full S3 URL for brand logo, Forza-style: 'BMW (Germany), Forza-style: 'M3 (BMW) (+24 more)

### Community 1 - "Frontend Dependencies & Config"
Cohesion: 0.05
Nodes (43): browserslist, development, production, dependencies, @emotion/react, @emotion/styled, google-map-react, @mui/icons-material (+35 more)

### Community 2 - "Backend CRUD Layer"
Cohesion: 0.10
Nodes (38): create_user(), get_user(), create_brand(), create_car(), create_dish(), create_model(), create_user(), create_variant() (+30 more)

### Community 3 - "3D Car Scene & R3F Components"
Cohesion: 0.08
Nodes (19): CameraControllerProps, navBtnSx, CarModel(), CarProps, ALL_MAKES, CameraPreset, CAR_CONFIGS, CarConfig (+11 more)

### Community 4 - "Car Gallery Press Photos"
Cohesion: 0.06
Nodes (38): Car Gallery Press Shot, Honda NSX-R, Honda NSX-R Press Photo, Pop-up Headlights and Wedge Profile, Red Bucket Seat Interior, Grey Studio Backdrop, Championship White Paint, Gloss Black Finish (+30 more)

### Community 5 - "Frontend Pages & Routing"
Cohesion: 0.11
Nodes (6): DropdownNavProps, NAV_ITEMS, App(), root, reportWebVitals(), SectionCardProps

### Community 6 - "TypeScript Compiler Config"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib (+9 more)

### Community 7 - "Car Model & S3 Asset URLs"
Cohesion: 0.17
Nodes (6): Car, Full S3 CDN URL for 3D model, Full S3 URL for car emblem, List of full S3 image URLs, Forza-style header: '2023 BMW M3 Competition, Brand logo from relationship

### Community 8 - "Frontend API Client & User CRUD"
Cohesion: 0.38
Nodes (5): createUser(), fetchUsers(), CreateUserInput, User, UserForm()

### Community 9 - "MUI Card UI Components"
Cohesion: 0.31
Nodes (4): MultiActionAreaCardProp, ScrollContainerProps, ActionCard, SelectActionCardsProps

### Community 10 - "Database Session & Test Fixtures"
Cohesion: 0.22
Nodes (7): get_db(), db_session(), engine(), fresh_db(), In-memory SQLite for tests - FASTEST option., Fresh DB session per test - auto rollback., Guaranteed fresh DB per test

### Community 11 - "Brand Selection UI"
Cohesion: 0.32
Nodes (4): BrandSelectionProps, imageCards, ViewState, MainMenuProps

### Community 12 - "Plates (Food) UI"
Cohesion: 0.46
Nodes (4): PlateDetail(), PlateDetailProps, PlatesTableProps, Plate

### Community 13 - "PWA Manifest"
Cohesion: 0.25
Nodes (7): background_color, display, icons, name, short_name, start_url, theme_color

### Community 14 - "Docker Compose Stack"
Cohesion: 0.29
Nodes (7): FastAPI api Service, PostgreSQL db Service, postgres_data Volume, Alembic Dependency, FastAPI Dependency, psycopg2-binary Driver, SQLAlchemy Dependency

### Community 15 - "Alembic Migration Env"
Cohesion: 0.40
Nodes (4): Run migrations in 'offline' mode.      This configures the context with just a U, Run migrations in 'online' mode.      In this scenario we need to create an Engi, run_migrations_offline(), run_migrations_online()

### Community 16 - "3D Model Loaders"
Cohesion: 0.50
Nodes (3): loadCarModel(), loader, onCarSelected()

### Community 17 - "Project Docs & HTML Template"
Cohesion: 0.50
Nodes (4): Frontend Create React App README, React App HTML Template, Google Maps React API, MyWebsite Project README

## Knowledge Gaps
- **108 isolated node(s):** `Config`, `name`, `version`, `private`, `homepage` (+103 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Car` connect `Car Model & S3 Asset URLs` to `Backend Domain Models`, `Backend CRUD Layer`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `create_sample_bmw_m3()` connect `Backend Domain Models` to `Backend CRUD Layer`, `Car Model & S3 Asset URLs`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `Run migrations in 'offline' mode.      This configures the context with just a U`, `Run migrations in 'online' mode.      In this scenario we need to create an Engi`, `Full S3 URL for brand logo` to the rest of the system?**
  _133 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Backend Domain Models` be split into smaller, more focused modules?**
  _Cohesion score 0.06765327695560254 - nodes in this community are weakly interconnected._
- **Should `Frontend Dependencies & Config` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._
- **Should `Backend CRUD Layer` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `3D Car Scene & R3F Components` be split into smaller, more focused modules?**
  _Cohesion score 0.07948717948717948 - nodes in this community are weakly interconnected._