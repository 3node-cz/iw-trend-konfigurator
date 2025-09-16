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
      company: 'IW TREND, s.r.o'
    } as OrderFormData,
    specifications: [
      {
        materialId: 'gid://shopify/Product/15514382139774', // H1180 Dub Halifax
        edgeMaterialId: 'gid://shopify/Product/15514434371966', // ABS hrana
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
            notes: ''
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
            notes: 'Pravá a ľavá strana'
          }
        ]
      }
    ],
    summary: {
      totalMaterials: 1,
      totalPieces: 12,
      totalBoards: 2,
      estimatedCost: 1285.68,
      currency: 'EUR',
      materialNames: ['EGG 18 LDTD H1180 ST37 Dub Halifax prírodný']
    }
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
      company: 'IW TREND, s.r.o'
    } as OrderFormData,
    specifications: [
      {
        materialId: 'gid://shopify/Product/15514382139774', // H1180 Dub Halifax (using same for simplicity)
        edgeMaterialId: 'gid://shopify/Product/15514434371966', // ABS hrana
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
            notes: ''
          }
        ]
      }
    ],
    summary: {
      totalMaterials: 1,
      totalPieces: 2,
      totalBoards: 1,
      estimatedCost: 230.40,
      currency: 'EUR',
      materialNames: ['EGG 18 LDTD H3311 TM28 Dub Cuneo bielený']
    }
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
      company: 'IW TREND, s.r.o'
    } as OrderFormData,
    specifications: [
      {
        materialId: 'gid://shopify/Product/15514382139774', // H1180 Dub Halifax
        edgeMaterialId: 'gid://shopify/Product/15514434371966', // ABS hrana
        glueType: 'PUR transparentná/bílá',
        pieces: [
          {
            id: 'piece_4a',
            partName: 'Vrchné dvierka',
            length: 720,
            width: 400,
            quantity: 8,
            allowRotation: false,
            withoutEdge: false,
            duplicate: false,
            edgeAllAround: null, // Each edge different - should not set edgeAllAround
            edgeTop: 0.8,
            edgeBottom: 2,
            edgeLeft: 0.8,
            edgeRight: 2,
            notes: 'Svetlý dub pre horné skrinky - rôzne hrúbky hrán'
          }
        ]
      },
      {
        materialId: 'gid://shopify/Product/15514382139774', // H1180 Dub Halifax (using same for simplicity)
        edgeMaterialId: 'gid://shopify/Product/15514434371966', // ABS hrana
        glueType: 'PUR transparentná/bílá',
        pieces: [
          {
            id: 'piece_4b',
            partName: 'Spodné dvierka',
            length: 720,
            width: 600,
            quantity: 6,
            allowRotation: false,
            withoutEdge: false,
            duplicate: false,
            edgeAllAround: 0.8, // All edges same (0.8) - should auto-set edgeAllAround
            edgeTop: 0.8,
            edgeBottom: 0.8,
            edgeLeft: 0.8,
            edgeRight: 0.8,
            notes: 'Bielený dub pre spodné skrinky - tenké hrany'
          }
        ]
      },
      {
        materialId: 'gid://shopify/Product/15514382139774', // H1180 Dub Halifax (using same for simplicity)
        edgeMaterialId: 'gid://shopify/Product/15514434371966', // ABS hrana
        glueType: 'PUR transparentná/bílá',
        pieces: [
          {
            id: 'piece_4c',
            partName: 'Pracovná doska',
            length: 2400,
            width: 600,
            quantity: 2,
            allowRotation: false,
            withoutEdge: false,
            duplicate: false,
            edgeAllAround: null, // Only some edges - should not set edgeAllAround
            edgeTop: 2,
            edgeBottom: null,
            edgeLeft: 2,
            edgeRight: 2,
            notes: 'Tmavý dub pre pracovnú plochu - hrana iba z troch strán'
          },
          {
            id: 'piece_4d',
            partName: 'Police',
            length: 800,
            width: 400,
            quantity: 10,
            allowRotation: true,
            withoutEdge: false,
            duplicate: false,
            edgeAllAround: null, // No edges - should not set edgeAllAround
            edgeTop: null,
            edgeBottom: null,
            edgeLeft: null,
            edgeRight: null,
            notes: 'Nastaviteľné police - bez hrán'
          }
        ]
      }
    ],
    summary: {
      totalMaterials: 3,
      totalPieces: 26,
      totalBoards: 5,
      estimatedCost: 1847.50,
      currency: 'EUR',
      materialNames: [
        'EGG 18 LDTD H1180 ST37 Dub Halifax prírodný',
        'EGG 18 LDTD H3311 TM28 Dub Cuneo bielený',
        'EGG 18 LDTD H1303 ST12 Dub Belmont hnedý'
      ]
    }
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
      company: 'IW TREND, s.r.o'
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
            notes: 'Bez hranovania'
          }
        ]
      }
    ],
    summary: {
      totalMaterials: 1,
      totalPieces: 3,
      totalBoards: 1,
      estimatedCost: 321.42,
      currency: 'EUR',
      materialNames: ['EGG 18 LDTD H1180 ST37 Dub Halifax prírodný']
    }
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
      company: 'IW TREND, s.r.o'
    } as OrderFormData,
    specifications: [
      {
        materialId: 'gid://shopify/Product/15514382139774', // H1180 Dub Halifax (using same for simplicity)
        edgeMaterialId: 'gid://shopify/Product/15514434371966', // ABS hrana
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
            notes: 'Bezpečnostné hrany - všetky rovnaké'
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
            notes: 'Rôzne hrúbky hrán podľa potreby'
          }
        ]
      }
    ],
    summary: {
      totalMaterials: 1,
      totalPieces: 6,
      totalBoards: 2,
      estimatedCost: 691.20,
      currency: 'EUR',
      materialNames: ['EGG 18 LDTD H3311 TM28 Dub Cuneo bielený']
    }
  }
]

export default dummySavedOrders