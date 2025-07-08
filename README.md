# Konfigurátor porezu - Cutting Configurator E-shop

A sophisticated cutting configurator e-shop application built with **Vite**, **React**, and **TypeScript**. This application helps users configure material cutting orders with automatic price calculation, advanced shape handling, and PDF generation capabilities.

## 🚀 Features

### Core Functionality

- **Advanced Customer Form**: Complete customer information collection with validation
- **Material Selection**: Support for various materials (DTD Laminovaná, MDF, Plywood) with different thicknesses
- **Smart Edge Processing**: Individual edge selection for each side (top, right, bottom, left) with visual indicators
- **Shape Support**: Rectangle, L-shape, Circle, and custom shapes with corner radius options
- **Real-time Price Calculation**: Automatic price calculation based on material, dimensions, and edge processing
- **Parts Management**: Add, edit, duplicate, and remove parts with comprehensive overview

### Advanced Features

- **Material Optimization**: Smart calculation of material waste and cutting efficiency
- **Visual Representation**: Interactive part visualization with dimensions and specifications
- **Export Functionality**: Ready for supplier integration and PDF generation
- **Responsive Design**: Optimized for desktop and mobile devices
- **Form Validation**: Comprehensive input validation with user-friendly error messages

### Technical Features

- **TypeScript**: Full type safety with comprehensive interfaces
- **Styled Components**: Modern CSS-in-JS styling approach
- **React Hook Form**: Efficient form handling and validation
- **Custom Hooks**: Reusable business logic with `useEnhancedConfigurator`
- **Performance Optimized**: Efficient calculations and rendering

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.1.0
- **Build Tool**: Vite 6.3.5
- **Language**: TypeScript 5.8.3
- **Styling**: Styled Components
- **Form Handling**: React Hook Form
- **PDF Generation**: jsPDF + html2canvas
- **Development**: ESLint with TypeScript support

## 📋 Project Structure

```
src/
├── components/
│   ├── LayeredCuttingApp.tsx         # Main application component
│   ├── LoadingIndicator.tsx          # Loading state indicators
│   ├── three-layer/                  # Three-layer architecture components
│   │   ├── dimensional/              # Layer 1: Core cutting dimensions
│   │   │   └── DimensionalPartForm.tsx
│   │   ├── layout/                   # Layer 2: Optimized cutting layout
│   │   │   └── OptimizedLayoutVisualization.tsx
│   │   ├── visual/                   # Layer 3: Visual enhancements
│   │   │   ├── VisualEnhancementEditor.tsx
│   │   │   ├── PartVisualEditor.tsx
│   │   │   ├── LShapeVisualEditor.tsx
│   │   │   ├── CornerVisualConfigurator.tsx
│   │   │   ├── EdgeVisualSelector.tsx
│   │   │   └── PartVisualPreview.tsx
│   │   └── EnhancedPartsList.tsx     # Enhanced parts management
│   └── optimization/                 # Performance optimization HOCs
│       └── withThreeLayerOptimization.tsx
├── hooks/
│   └── three-layer/                  # Three-layer state management
│       ├── useLayeredCuttingState.ts # Main business logic hook
│       ├── useDebounceValue.ts       # Value debouncing utility
│       └── index.ts                  # Hook exports
├── types/
│   └── simple.ts                     # Type definitions
├── utils/
│   ├── cuttingOptimizer.ts           # Cutting layout optimization
│   ├── svgRendering.ts               # SVG shape rendering
│   ├── cornerCalculations.ts         # Corner logic utilities
│   ├── partUpdates.ts                # Part update handlers
│   ├── partConfigurationStatus.ts    # Configuration status tracking
│   ├── partFormatting.ts             # Part formatting utilities
│   ├── lShapeHelpers.ts              # L-shape calculation helpers
│   ├── edgeConstants.ts              # Edge treatment constants
│   ├── appConstants.ts               # Application constants
│   └── sheetVisualizationHelpers.ts  # Sheet visualization utilities
└── App.tsx                           # Application entry point
```

## 🏗️ Architecture Overview

The application uses a **three-layer state architecture** for optimal performance and maintainability:

### Layer 1: Dimensional State

- **Purpose**: Core cutting dimensions only
- **Data**: Width, height, quantity, orientation, label
- **Triggers**: Layout optimization when changed
- **Component**: `DimensionalPartForm`

### Layer 2: Layout Optimization

- **Purpose**: Auto-calculated cutting layouts
- **Features**: Debounced calculations, loading states, caching
- **Data**: Optimized sheet layouts and cutting configurations
- **Component**: `OptimizedLayoutVisualization`

### Layer 3: Visual Enhancements

- **Purpose**: UI-only visual properties
- **Data**: Corners, edges, L-shapes, styling
- **Independence**: Does not affect cutting calculations
- **Components**: `VisualEnhancementEditor` and related visual components

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. **Clone and navigate to the project**:

   ```bash
   cd /path/to/iw-trend-konfigurator
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start development server**:

   ```bash
   npm run dev
   ```

4. **Build for production**:

   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

## 💼 Usage

### Customer Information

1. Fill in customer details (name, address, contact information)
2. All required fields must be completed before proceeding

### Adding Parts

1. Navigate through tabs: Basic Info → Shape → Edge Processing
2. **Basic Info**: Specify dimensions, quantity, material, and part name
3. **Shape**: Choose from rectangle, L-shape, or circle with optional corner radius
4. **Edge Processing**: Select individual edge treatments for each side

### Managing Parts

- **Edit**: Click on any field in the parts table to modify
- **Duplicate**: Use the duplicate button to copy existing parts
- **Remove**: Delete unwanted parts from the configuration
- **Pricing**: View real-time price calculations for each part

### Price Calculation

- **Material Cost**: Based on area and material price per m²
- **Edge Processing**: Calculated per linear meter of each edge
- **Labor Cost**: 15% of material cost for cutting and preparation
- **Efficiency**: Visual indicator of material utilization

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Key Components Architecture

#### `useEnhancedConfigurator` Hook

Central state management for:

- Parts collection and manipulation
- Customer information
- Price calculations
- Material and edge options

#### Enhanced Form Components

- **CustomerForm**: Validates and collects customer data
- **EnhancedPartForm**: Multi-tab part creation with shape and edge selection
- **EnhancedPartsList**: Editable table with inline editing capabilities

## 📋 Configuration

### Material Types

The application supports various materials with configurable:

- Price per m²
- Thickness options
- Categories (DTD, MDF, Plywood)

### Edge Processing Options

Multiple edge treatments available:

- ABS edges (various thicknesses)
- Melamine edges
- Wood edges
- Custom pricing per linear meter

## 📋 GAP 010 Compliance

This application implements **GAP 010 - Evidence parametrů porezu** (Cutting Parameters Evidence) specification for professional cutting service integration.

### GAP 010 Features

- **1:N Relationship Support**: One order can contain multiple cutting pieces
- **Complete Parameter Evidence**:
  - Piece dimensions (width, height, base area)
  - Piece type for material catalog reference
  - Independent edge processing per edge (top, right, bottom, left)
  - Additional processing options (corners, L-shapes, frames)
- **Supplier Integration Ready**: Export format optimized for cutting service providers
- **Process Flow Compliance**:
  - Configuration import from external sources
  - Standardized export format
  - Print-ready output with order confirmation
  - Shopify integration support

### Export Format

The application exports cutting configurations in **complete GAP 010 compliant JSON format** including:

#### Complete Cutting Data Structure:

1. **Order Metadata**: Order ID, timestamp, and material specifications
2. **Sheet-by-Sheet Layout**:
   - Exact positioning (x, y coordinates) for each piece
   - Rotation information (0° or 90°)
   - Cut dimensions after rotation
   - Sheet efficiency calculations
3. **Piece Specifications**: Detailed requirements for each part type
4. **Processing Instructions**: Edge treatments, corners, L-shapes, frames
5. **Quality Metrics**: Material usage, waste calculations, placement efficiency

#### Example Enhanced Export:

```json
{
  "order": "order-1751899061013",
  "timestamp": "2025-07-07T14:37:41.013Z",
  "material": {
    "type": "DTD Laminovaná",
    "thickness": 18,
    "sheetSize": { "width": 2800, "height": 2070 }
  },
  "sheets": [
    {
      "sheetNumber": 1,
      "dimensions": { "width": 2800, "height": 2070 },
      "cuts": [
        {
          "pieceId": "part-123",
          "position": { "x": 0, "y": 0 },
          "dimensions": { "width": 300, "height": 500 },
          "rotation": 0,
          "pieceType": "Polička"
        }
      ],
      "efficiency": "78%",
      "wastedArea": 425600
    }
  ],
  "pieces": [
    /* detailed specifications */
  ],
  "summary": {
    "totalPieces": 7,
    "placedPieces": 7,
    "sheets": 1,
    "overallEfficiency": "78%",
    "totalMaterialUsed": 5.816,
    "totalWastedArea": 1.278
  }
}
```

This format provides **all necessary data** for automated cutting machines and manual cutting operations.

## 🔮 Future Enhancements

- **PDF Generation**: Complete implementation with part layouts
- **Supplier Integration**: API connections for order processing
- **Advanced Shapes**: Support for complex custom shapes
- **Material Optimization**: Advanced cutting layout algorithms
- **Multi-language Support**: Localization for multiple languages
- **User Accounts**: Customer account management and order history

## 📄 License

This project is part of the IW Trend cutting service platform.

---

For technical support or feature requests, please contact the development team.
