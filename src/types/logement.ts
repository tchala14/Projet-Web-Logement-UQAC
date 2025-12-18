export interface Logement {
  id: string;
  title: string;
  type: string;
  price: number;
  distance: number;
  address: string;
  image: string;
  images: string[];
  description: string;
  bedrooms: number;
  bathrooms: number;
  surface: number;
  available: string;
  services: string[];
  furnished: boolean;
  utilities: string;
  owner_id?: string; // ID du propriétaire pour les messages
}

export const mockLogements: Logement[] = [
  {
    id: '1',
    title: 'Studio moderne près de l\'UQAC',
    type: 'Studio',
    price: 850,
    distance: 0.5,
    address: '123 Rue des Étudiants, Chicoutimi',
    image: 'https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwc3R1ZGVudCUyMGJlZHJvb20lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjQwNjE1NDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwc3R1ZGVudCUyMGJlZHJvb20lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjQwNjE1NDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1663756915301-2ba688e078cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc2Mzk3NTM4MXww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    description: 'Studio lumineux et moderne, parfait pour un étudiant. Entièrement rénové avec cuisine équipée et salle de bain moderne. À quelques minutes à pied de l\'UQAC.',
    bedrooms: 0,
    bathrooms: 1,
    surface: 35,
    available: 'Disponible maintenant',
    services: ['Wi-Fi inclus', 'Meublé', 'Chauffage inclus', 'Stationnement'],
    furnished: true,
    utilities: 'Inclus',
  },
  {
    id: '2',
    title: 'Appartement 3½ lumineux',
    type: '3½',
    price: 1100,
    distance: 0.8,
    address: '456 Avenue du Campus, Chicoutimi',
    image: 'https://images.unsplash.com/photo-1663756915301-2ba688e078cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc2Mzk3NTM4MXww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1663756915301-2ba688e078cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc2Mzk3NTM4MXww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwc3R1ZGVudCUyMGJlZHJvb20lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjQwNjE1NDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    description: 'Grand appartement 3½ avec une chambre spacieuse, salon lumineux et cuisine moderne. Idéal pour colocation ou couple étudiant.',
    bedrooms: 1,
    bathrooms: 1,
    surface: 65,
    available: '1er janvier 2026',
    services: ['Wi-Fi inclus', 'Stationnement', 'Balcon', 'Animaux acceptés'],
    furnished: false,
    utilities: 'Non inclus',
  },
  {
    id: '3',
    title: '4½ parfait pour colocation',
    type: '4½',
    price: 1400,
    distance: 1.2,
    address: '789 Boulevard Université, Chicoutimi',
    image: 'https://images.unsplash.com/photo-1580063665747-ab495581c9c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzdHVkZW50JTIwYXBhcnRtZW50JTIwYnVpbGRpbmd8ZW58MXx8fHwxNzY0MDYxNTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1580063665747-ab495581c9c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzdHVkZW50JTIwYXBhcnRtZW50JTIwYnVpbGRpbmd8ZW58MXx8fHwxNzY0MDYxNTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1663756915301-2ba688e078cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc2Mzk3NTM4MXww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    description: 'Appartement spacieux avec 2 chambres fermées, parfait pour partager le loyer. Grandes fenêtres, beaucoup de rangement.',
    bedrooms: 2,
    bathrooms: 1,
    surface: 85,
    available: 'Disponible maintenant',
    services: ['Wi-Fi inclus', 'Laveuse/Sécheuse', 'Stationnement (2 places)', 'Chauffage inclus'],
    furnished: false,
    utilities: 'Inclus',
  },
  {
    id: '4',
    title: 'Studio luxe tout inclus',
    type: 'Studio',
    price: 950,
    distance: 0.3,
    address: '321 Rue Principale, Chicoutimi',
    image: 'https://images.unsplash.com/photo-1758612898114-4b1504db79a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBhcGFydG1lbnR8ZW58MXx8fHwxNzY0MDYxNTQ3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1758612898114-4b1504db79a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBhcGFydG1lbnR8ZW58MXx8fHwxNzY0MDYxNTQ3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwc3R1ZGVudCUyMGJlZHJvb20lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjQwNjE1NDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    description: 'Studio haut de gamme avec finitions modernes, meublé avec goût. Internet haute vitesse, tous les services inclus.',
    bedrooms: 0,
    bathrooms: 1,
    surface: 40,
    available: '15 décembre 2025',
    services: ['Wi-Fi inclus', 'Meublé', 'Tout inclus', 'Gym', 'Stationnement'],
    furnished: true,
    utilities: 'Inclus',
  },
  {
    id: '5',
    title: '5½ spacieux pour groupe',
    type: '5½',
    price: 1650,
    distance: 1.5,
    address: '555 Chemin Université, Chicoutimi',
    image: 'https://images.unsplash.com/photo-1651752523215-9bf678c29355?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBidWlsZGluZyUyMGV4dGVyaW9yfGVufDF8fHx8MTc2NDA1NDQxNXww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1651752523215-9bf678c29355?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBidWlsZGluZyUyMGV4dGVyaW9yfGVufDF8fHx8MTc2NDA1NDQxNXww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1663756915301-2ba688e078cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc2Mzk3NTM4MXww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    description: 'Grand appartement avec 3 chambres fermées, parfait pour 3-4 colocataires. Deux salles de bain, grand salon et cuisine spacieuse.',
    bedrooms: 3,
    bathrooms: 2,
    surface: 110,
    available: '1er juillet 2026',
    services: ['Stationnement (3 places)', 'Laveuse/Sécheuse', 'Cour arrière', 'Déneigement inclus'],
    furnished: false,
    utilities: 'Non inclus',
  },
  {
    id: '6',
    title: '3½ meublé disponible immédiatement',
    type: '3½',
    price: 1250,
    distance: 0.6,
    address: '234 Avenue des Pins, Chicoutimi',
    image: 'https://images.unsplash.com/photo-1663756915301-2ba688e078cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc2Mzk3NTM4MXww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1663756915301-2ba688e078cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc2Mzk3NTM4MXww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwc3R1ZGVudCUyMGJlZHJvb20lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjQwNjE1NDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    description: 'Appartement meublé avec tout le nécessaire pour emménager immédiatement. Idéal pour étudiants internationaux.',
    bedrooms: 1,
    bathrooms: 1,
    surface: 70,
    available: 'Disponible maintenant',
    services: ['Wi-Fi inclus', 'Meublé', 'Chauffage inclus', 'Stationnement', 'Laveuse/Sécheuse'],
    furnished: true,
    utilities: 'Inclus',
  },
];