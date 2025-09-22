# Configurator Widget React Source

This directory contains the React source code for the Configurator widget.

## Structure

```
widget-src/
├── src/
│   ├── components/
│   │   └── KonfiguratorWidget.tsx    # Main widget component
│   ├── types.ts                      # TypeScript interfaces
│   └── main.tsx                      # Entry point and initialization
├── package.json                      # Dependencies
├── vite.config.ts                    # Build configuration
└── README.md                         # This file
```

## Development Workflow

1. **Install dependencies:**
   ```bash
   cd widget-src
   npm install
   ```

2. **Make changes to components:**
   - Edit files in `src/components/`
   - Add new components as needed
   - Update types in `src/types.ts`

3. **Build the widget:**
   ```bash
   npm run build
   ```
   This creates `configurator-widget.umd.js` in `extensions/configurator-widget/assets/`

4. **Test in Shopify:**
   - The built asset is automatically loaded by the Liquid template
   - Run `shopify app dev` to test changes

## Adding New Components

1. Create component files in `src/components/`
2. Import and use in `KonfiguratorWidget.tsx`
3. Export types from `src/types.ts` if needed
4. Build and test

## Build Output

The build process creates a UMD bundle that:
- Uses external React/ReactDOM from CDN
- Initializes widgets using `window.KonfiguratorConfig`
- Outputs to the extension's assets directory