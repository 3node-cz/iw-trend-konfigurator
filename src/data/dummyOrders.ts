import type { SavedOrder } from '../types/savedOrder'
import type { OrderFormData } from '../schemas/orderSchema'

// 5 example saved orders with minimal ID-based structure
export const dummySavedOrders: SavedOrder[] = [
  {
    id: 'order_001',
    orderNumber: '251064269',
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T14:45:00'),
    status: 'saved',
    version: '2.0',
    orderInfo: {
      orderName: 'Kuchynské linky Aricoma',
      deliveryDate: new Date('2024-02-01'),
      transferLocation: 'BTS - IW TREND, s.r.o., Rybničná, Bratislava',
      costCenter: 'Bratislava',
      cuttingCenter: 'Bratislava',
      deliveryMethod: 'Náš odvoz',
      processingType: 'Formátovať',
      notes: 'Priority zákazka - potrebné do konca januára',
      discountPercentage: 5,
      company: 'IW TREND, s.r.o',
    } as OrderFormData,
    specifications: [
      {
        materialId: 'gid://shopify/Product/15514382139774', // H1180 Dub Halifax
        edgeMaterialId: 'gid://shopify/Product/15514939490686', // ABS hrana
        glueType: 'PUR transparentná/bílá',
        pieces: [
          {
            id: 'piece_1',
            partName: 'Vrchná doska',
            length: 2400,
            width: 600,
            quantity: 4,
            allowRotation: false,
            withoutEdge: false,
            duplicate: false,
            edgeAllAround: 2, // All edges same - should auto-set edgeAllAround
            edgeTop: 2,
            edgeBottom: 2,
            edgeLeft: 2,
            edgeRight: 2,
            notes: '',
          },
          {
            id: 'piece_2',
            partName: 'Bočnice',
            length: 720,
            width: 560,
            quantity: 8,
            allowRotation: true,
            withoutEdge: false,
            duplicate: false,
            edgeAllAround: null, // Only some edges - should not set edgeAllAround
            edgeTop: 2,
            edgeBottom: null,
            edgeLeft: 2,
            edgeRight: 2,
            notes: 'Pravá a ľavá strana',
          },
        ],
      },
    ],
    summary: {
      totalMaterials: 1,
      totalPieces: 12,
      totalBoards: 2,
      estimatedCost: 1285.68,
      currency: 'EUR',
      materialNames: ['EGG 18 LDTD H1180 ST37 Dub Halifax prírodný'],
    },
  },

  {
    id: 'order_002',
    orderNumber: '251015834',
    createdAt: new Date('2024-01-12T09:15:00'),
    updatedAt: new Date('2024-01-12T16:20:00'),
    status: 'saved',
    version: '2.0',
    orderInfo: {
      orderName: 'Skrinka SA2 - obývačka',
      deliveryDate: new Date('2024-01-25'),
      transferLocation: 'ZIL - IW TREND, s.r.o., K cintorínu, Žilina',
      costCenter: 'Žilina',
      cuttingCenter: 'Žilina',
      deliveryMethod: 'Osobný odber',
      processingType: 'Uskladniť',
      notes: '',
      discountPercentage: 0,
      company: 'IW TREND, s.r.o',
    } as OrderFormData,
    specifications: [
      {
        materialId: 'gid://shopify/Product/15514382139774', // H1180 Dub Halifax (using same for simplicity)
        edgeMaterialId: 'gid://shopify/Product/15514939490686', // ABS hrana
        glueType: 'PUR transparentná/bílá',
        pieces: [
          {
            id: 'piece_3',
            partName: 'Zadná stena',
            length: 1200,
            width: 800,
            quantity: 2,
            allowRotation: false,
            withoutEdge: false,
            duplicate: false,
            edgeAllAround: null, // Only top and bottom edges - should not set edgeAllAround
            edgeTop: 2,
            edgeBottom: 2,
            edgeLeft: null,
            edgeRight: null,
            notes: '',
          },
        ],
      },
    ],
    summary: {
      totalMaterials: 1,
      totalPieces: 2,
      totalBoards: 1,
      estimatedCost: 230.4,
      currency: 'EUR',
      materialNames: ['EGG 18 LDTD H3311 TM28 Dub Cuneo bielený'],
    },
  },

  {
    id: 'order_003',
    orderNumber: '251001287',
    createdAt: new Date('2024-01-10T14:20:00'),
    updatedAt: new Date('2024-01-11T10:30:00'),
    status: 'draft',
    version: '2.0',
    orderInfo: {
      orderName: 'Kompletná kuchyňa - moderný dizajn',
      deliveryDate: new Date('2024-01-30'),
      transferLocation: 'BTS - IW TREND, s.r.o., Rybničná, Bratislava',
      costCenter: 'Bratislava',
      cuttingCenter: 'Bratislava',
      deliveryMethod: 'Náš odvoz',
      processingType: 'Formátovať',
      notes: 'Rôzne materiály - pozor na správne priradenie',
      discountPercentage: 10,
      company: 'IW TREND, s.r.o',
    } as OrderFormData,
    specifications: [
      // Material 1: Real Shopify material
      {
        materialId: 'gid://shopify/Product/15514941194622',
        edgeMaterialId: 'gid://shopify/Product/15514939490686', // ABS hrana
        glueType: 'PUR transparentná/bílá',
        pieces: [
          {
            id: 'piece_1_1',
            partName: 'Vrchné dvierka',
            length: 720,
            width: 400,
            quantity: 6,
            allowRotation: false,
            withoutEdge: false,
            duplicate: false,
            edgeAllAround: 2, // All edges with 2mm
            edgeTop: 2,
            edgeBottom: 2,
            edgeLeft: 2,
            edgeRight: 2,
            notes: 'Svetlý dub pre horné skrinky',
          },
          {
            id: 'piece_1_2',
            partName: 'Bočnice skriniek',
            length: 720,
            width: 320,
            quantity: 8,
            allowRotation: false,
            withoutEdge: false,
            duplicate: false,
            edgeAllAround: null, // Different edges
            edgeTop: 2,
            edgeBottom: null, // No bottom edge
            edgeLeft: 0.8,
            edgeRight: 0.8,
            notes: 'Bočnice pre horné skrinky - bez spodnej hrany',
          },
        ],
      },
      // Material 2: Real Shopify material
      {
        materialId: 'gid://shopify/Product/15514941129086',
        edgeMaterialId: 'gid://shopify/Product/15514939359614', // Different edge material
        glueType: 'PUR transparentná/bílá',
        pieces: [
          {
            id: 'piece_2_1',
            partName: 'Spodné dvierka',
            length: 720,
            width: 600,
            quantity: 4,
            allowRotation: false,
            withoutEdge: false,
            duplicate: false,
            edgeAllAround: 0.8, // All edges with 0.8mm
            edgeTop: 0.8,
            edgeBottom: 0.8,
            edgeLeft: 0.8,
            edgeRight: 0.8,
            notes: 'Bielený dub pre spodné skrinky',
          },
          {
            id: 'piece_2_2',
            partName: 'Zásuvky',
            length: 680,
            width: 480,
            quantity: 3,
            allowRotation: true,
            withoutEdge: false,
            duplicate: false,
            edgeAllAround: null, // Only front edge
            edgeTop: 2,
            edgeBottom: null,
            edgeLeft: null,
            edgeRight: null,
            notes: 'Čela zásuviek - len predná hrana',
          },
        ],
      },
      // Material 3: Real Shopify material - some pieces without edges
      {
        materialId: 'gid://shopify/Product/15514940834174',
        edgeMaterialId: null, // No edge material for some pieces
        glueType: 'PUR transparentná/bílá',
        pieces: [
          {
            id: 'piece_3_1',
            partName: 'Pracovná doska',
            length: 2400,
            width: 600,
            quantity: 2,
            allowRotation: false,
            withoutEdge: true, // No edges at all
            duplicate: false,
            edgeAllAround: null,
            edgeTop: null,
            edgeBottom: null,
            edgeLeft: null,
            edgeRight: null,
            notes: 'Tmavý dub pre pracovnú plochu - bez hrán',
          },
          {
            id: 'piece_3_2',
            partName: 'Police',
            length: 800,
            width: 400,
            quantity: 8,
            allowRotation: true,
            withoutEdge: true, // No edges
            duplicate: false,
            edgeAllAround: null,
            edgeTop: null,
            edgeBottom: null,
            edgeLeft: null,
            edgeRight: null,
            notes: 'Nastaviteľné police - bez hrán',
          },
          {
            id: 'piece_3_3',
            partName: 'Zadné steny',
            length: 720,
            width: 300,
            quantity: 6,
            allowRotation: false,
            withoutEdge: true, // No edges needed for back panels
            duplicate: false,
            edgeAllAround: null,
            edgeTop: null,
            edgeBottom: null,
            edgeLeft: null,
            edgeRight: null,
            notes: 'Zadné steny skriniek - bez hrán',
          },
        ],
      },
    ],
    summary: {
      totalMaterials: 3,
      totalPieces: 37, // Updated count: 6+8+4+3+2+8+6 = 37
      totalBoards: 8, // Estimated boards needed
      estimatedCost: 2150.0, // Updated cost
      currency: 'EUR',
      materialNames: [
        'EGG 18 LDTD H1180 ST37 Dub Halifax prírodný', // Light oak with edges
        'EGG 18 LDTD H3311 TM28 Dub Cuneo bielený', // White oak with edges
        'EGG 18 LDTD H1303 ST12 Dub Belmont hnedý', // Dark oak without edges
      ],
    },
  },

  {
    id: 'order_004',
    orderNumber: '241080221',
    createdAt: new Date('2024-01-08T11:45:00'),
    updatedAt: new Date('2024-01-09T08:15:00'),
    status: 'saved',
    version: '2.0',
    orderInfo: {
      orderName: 'Kancelársky nábytok',
      deliveryDate: new Date('2024-02-15'),
      transferLocation: 'BTS - IW TREND, s.r.o., Rybničná, Bratislava',
      costCenter: 'Bratislava',
      cuttingCenter: 'Bratislava',
      deliveryMethod: 'Náš odvoz',
      processingType: 'Zlikvidovať',
      notes: 'Bez hranovania - len rezy',
      discountPercentage: 0,
      company: 'IW TREND, s.r.o',
    } as OrderFormData,
    specifications: [
      {
        materialId: 'gid://shopify/Product/15514382139774', // H1180 Dub Halifax
        edgeMaterialId: null, // No edge material
        glueType: '',
        pieces: [
          {
            id: 'piece_6',
            partName: 'Stolová doska',
            length: 1600,
            width: 800,
            quantity: 3,
            allowRotation: false,
            withoutEdge: true,
            duplicate: false,
            edgeAllAround: null,
            edgeTop: null,
            edgeBottom: null,
            edgeLeft: null,
            edgeRight: null,
            notes: 'Bez hranovania',
          },
        ],
      },
    ],
    summary: {
      totalMaterials: 1,
      totalPieces: 3,
      totalBoards: 1,
      estimatedCost: 321.42,
      currency: 'EUR',
      materialNames: ['EGG 18 LDTD H1180 ST37 Dub Halifax prírodný'],
    },
  },

  {
    id: 'order_005',
    orderNumber: '241088929',
    createdAt: new Date('2024-01-05T16:00:00'),
    updatedAt: new Date('2024-01-06T12:30:00'),
    status: 'completed',
    version: '2.0',
    orderInfo: {
      orderName: 'Detská izba - kompletná sada',
      deliveryDate: new Date('2024-01-20'),
      transferLocation: 'HRI - IW TREND, s.r.o., Dolný Hričov',
      costCenter: 'Dolný Hričov',
      cuttingCenter: 'Žilina',
      deliveryMethod: 'Osobný odber',
      processingType: 'Formátovať',
      notes: 'Dokončené - pripravené na odber',
      discountPercentage: 15,
      company: 'IW TREND, s.r.o',
    } as OrderFormData,
    specifications: [
      {
        materialId: 'gid://shopify/Product/15514382139774', // H1180 Dub Halifax (using same for simplicity)
        edgeMaterialId: 'gid://shopify/Product/15514939490686', // ABS hrana
        glueType: 'PUR transparentná/bílá',
        pieces: [
          {
            id: 'piece_7',
            partName: 'Postieľka - strany',
            length: 1400,
            width: 700,
            quantity: 2,
            allowRotation: false,
            withoutEdge: false,
            duplicate: true,
            edgeAllAround: 2, // All edges same - should auto-set edgeAllAround
            edgeTop: 2,
            edgeBottom: 2,
            edgeLeft: 2,
            edgeRight: 2,
            notes: 'Bezpečnostné hrany - všetky rovnaké',
          },
          {
            id: 'piece_8',
            partName: 'Úložný priestor',
            length: 900,
            width: 450,
            quantity: 4,
            allowRotation: true,
            withoutEdge: false,
            duplicate: false,
            edgeAllAround: null, // Mixed edges - should not set edgeAllAround
            edgeTop: 0.8,
            edgeBottom: null,
            edgeLeft: 2,
            edgeRight: 0.8,
            notes: 'Rôzne hrúbky hrán podľa potreby',
          },
        ],
      },
    ],
    summary: {
      totalMaterials: 1,
      totalPieces: 6,
      totalBoards: 2,
      estimatedCost: 691.2,
      currency: 'EUR',
      materialNames: ['EGG 18 LDTD H3311 TM28 Dub Cuneo bielený'],
    },
  },
]

export default dummySavedOrders
