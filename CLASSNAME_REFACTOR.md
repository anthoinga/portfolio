# ClassName Refactoring Plan

## Problem
Current classNames are overly contextual and redundant:
- Prefix every class with component name (`footerRoot`, `headerNamePill`, `projectTileImageArea`)
- Redundant since classes are already scoped within their component
- Makes code verbose and harder to read
- Not semantic - describes implementation rather than purpose

## Proposed Naming Scheme

### Principles
1. **Simple** - Short, clear names
2. **Semantic** - Describe purpose, not implementation
3. **Component-scoped** - No need to prefix with component name
4. **Reusable** - Common patterns use common names

### Standard Patterns
- **Root element**: No class (rely on element selector) or simple descriptor
- **Containers**: `wrapper`, `container`, `content`
- **UI elements**: `badge`, `pill`, `card`, `tile`
- **Areas**: `header`, `footer`, `body`, `sidebar`
- **Content**: `title`, `subtitle`, `text`, `image`, `icon`
- **State**: `active`, `disabled`, `hidden`, `visible`

## Refactoring Changes

### Layout Components

#### Header.tsx
```diff
-headerRoot → header (or remove)
-headerNamePill → name-badge
-headerTitle → title
-headerLocationPill → location
```

#### Footer.tsx
```diff
-footerRoot → footer (or remove)
-footerLeft → info
-footerNamePill → name-badge
-footerTaglinePill → tagline
```

#### Spacer.tsx
✅ No changes needed (uses simple className already)

### Portfolio Components

#### ProjectGrid.tsx
```diff
-projectGrid → grid
```

#### ProjectColumn.tsx
```diff
-projectColumn → column
```

#### ProjectTile.tsx
```diff
-projectTile → tile
-projectTileContent → content
-projectTileHeader → tile-header
-projectTileImageArea → image-container
-projectTileImageWrapper → image-wrapper
```

### Widget Components

#### MusicPlayer.tsx, SpotifyWidget.tsx, TrackList.tsx
✅ These components use generic classNames already (no refactoring needed)

## Implementation Order
1. Layout components (Header, Footer)
2. Portfolio components (Grid, Column, Tile)
3. Widget components (if needed)
4. Page components
5. Test all visual regressions

## Benefits
- **30-50% less characters** in className attributes
- **Easier to read** and understand component structure
- **Consistent** naming across codebase
- **Maintainable** - clear semantic meaning
