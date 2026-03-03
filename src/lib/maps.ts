// Serviço de integração com Google Maps API
// Fallback para simulação quando não há API key

// Configuração - Substitua pela sua chave da Google Maps API no .env
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const google: any;

export interface AddressSuggestion {
  id: string;
  description: string;
  placeId: string;
  mainText: string;
  secondaryText: string;
}

export interface GeocodedAddress {
  formattedAddress: string;
  lat: number;
  lng: number;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface RouteInfo {
  distanceKm: number;
  durationMinutes: number;
  polyline?: string;
}

// Verificar se tem API key
export const hasGoogleMapsKey = (): boolean => {
  return GOOGLE_MAPS_API_KEY.length > 0;
};

// Simular sugestões de endereços (fallback)
const simulateAddressSuggestions = (query: string): AddressSuggestion[] => {
  const mockAddresses: AddressSuggestion[] = [
    {
      id: '1',
      placeId: 'ChIJrTLR4bNWzpQRfEYFOXaGJ1o',
      description: 'Carrefour Hipermercado - Av. Paulista, São Paulo',
      mainText: 'Carrefour Hipermercado',
      secondaryText: 'Av. Paulista, São Paulo, SP',
    },
    {
      id: '2',
      placeId: 'ChIJrTLR4bNWzpQRfEYFOXaGJ1p',
      description: 'Extra Hipermercados - Rua Augusta, São Paulo',
      mainText: 'Extra Hipermercados',
      secondaryText: 'Rua Augusta, São Paulo, SP',
    },
    {
      id: '3',
      placeId: 'ChIJrTLR4bNWzpQRfEYFOXaGJ1q',
      description: 'Pão de Açúcar - Rua Oscar Freire, São Paulo',
      mainText: 'Pão de Açúcar',
      secondaryText: 'Rua Oscar Freire, São Paulo, SP',
    },
    {
      id: '4',
      placeId: 'ChIJrTLR4bNWzpQRfEYFOXaGJ1r',
      description: 'Assaí Atacadista - Av. Brasil, São Paulo',
      mainText: 'Assaí Atacadista',
      secondaryText: 'Av. Brasil, São Paulo, SP',
    },
    {
      id: '5',
      placeId: 'ChIJrTLR4bNWzpQRfEYFOXaGJ1s',
      description: 'Mercado Municipal de São Paulo - Rua da Cantareira',
      mainText: 'Mercado Municipal',
      secondaryText: 'Rua da Cantareira, São Paulo, SP',
    },
    {
      id: '6',
      placeId: 'ChIJrTLR4bNWzpQRfEYFOXaGJ1t',
      description: 'Farmácia Drogasil - Av. Brigadeiro Faria Lima, São Paulo',
      mainText: 'Farmácia Drogasil',
      secondaryText: 'Av. Brigadeiro Faria Lima, São Paulo, SP',
    },
    {
      id: '7',
      placeId: 'ChIJrTLR4bNWzpQRfEYFOXaGJ1u',
      description: 'Padaria Mundo do Pão - Rua Haddock Lobo, São Paulo',
      mainText: 'Padaria Mundo do Pão',
      secondaryText: 'Rua Haddock Lobo, São Paulo, SP',
    },
    {
      id: '8',
      placeId: 'ChIJrTLR4bNWzpQRfEYFOXaGJ1v',
      description: 'Feira Livre - Praça da República, São Paulo',
      mainText: 'Feira Livre da República',
      secondaryText: 'Praça da República, São Paulo, SP',
    },
    {
      id: '9',
      placeId: 'ChIJrTLR4bNWzpQRfEYFOXaGJ1w',
      description: 'Rua dos Pinheiros, 500 - Pinheiros, São Paulo',
      mainText: 'Rua dos Pinheiros, 500',
      secondaryText: 'Pinheiros, São Paulo, SP',
    },
    {
      id: '10',
      placeId: 'ChIJrTLR4bNWzpQRfEYFOXaGJ1x',
      description: 'Av. Ibirapuera, 3103 - Moema, São Paulo',
      mainText: 'Av. Ibirapuera, 3103',
      secondaryText: 'Moema, São Paulo, SP',
    },
    {
      id: '11',
      placeId: 'ChIJrTLR4bNWzpQRfEYFOXaGJ1y',
      description: 'Açougue Central - Rua 25 de Março, São Paulo',
      mainText: 'Açougue Central',
      secondaryText: 'Rua 25 de Março, São Paulo, SP',
    },
    {
      id: '12',
      placeId: 'ChIJrTLR4bNWzpQRfEYFOXaGJ1z',
      description: 'Hortifruti Natural da Terra - Rua Vergueiro, São Paulo',
      mainText: 'Hortifruti Natural da Terra',
      secondaryText: 'Rua Vergueiro, São Paulo, SP',
    },
  ];

  if (!query || query.length < 3) return [];
  
  const lowerQuery = query.toLowerCase();
  return mockAddresses.filter(addr => 
    addr.description.toLowerCase().includes(lowerQuery) ||
    addr.mainText.toLowerCase().includes(lowerQuery)
  );
};

// Buscar sugestões de endereços (Autocomplete)
export const searchAddressSuggestions = async (
  query: string,
  _type: 'establishment' | 'address' = 'establishment'
): Promise<AddressSuggestion[]> => {
  if (!hasGoogleMapsKey()) {
    // Fallback: simular busca
    return new Promise(resolve => {
      setTimeout(() => resolve(simulateAddressSuggestions(query)), 300);
    });
  }

  // Implementação real com Google Places API
  try {
    const service = new google.maps.places.AutocompleteService();
    const predictions = await new Promise<unknown[]>((resolve, reject) => {
      service.getPlacePredictions(
        {
          input: query,
          types: ['establishment', 'geocode'],
          componentRestrictions: { country: 'br' },
          language: 'pt-BR',
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (results: any[] | null, status: string) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            resolve(results);
          } else {
            reject(status);
          }
        }
      );
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return predictions.map((p: any) => ({
      id: p.place_id,
      placeId: p.place_id,
      description: p.description,
      mainText: p.structured_formatting.main_text,
      secondaryText: p.structured_formatting.secondary_text,
    }));
  } catch (error) {
    console.error('Error fetching address suggestions:', error);
    return simulateAddressSuggestions(query);
  }
};

// Geocodificar endereço (converter endereço em coordenadas)
export const geocodeAddress = async (placeId: string): Promise<GeocodedAddress | null> => {
  if (!hasGoogleMapsKey()) {
    // Fallback: simular geocoding
    const mockCoords: Record<string, GeocodedAddress> = {
      'ChIJrTLR4bNWzpQRfEYFOXaGJ1o': {
        formattedAddress: 'Av. Paulista, 2000 - Bela Vista, São Paulo - SP',
        lat: -23.561684,
        lng: -46.656139,
        street: 'Av. Paulista',
        number: '2000',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-000',
      },
      'ChIJrTLR4bNWzpQRfEYFOXaGJ1p': {
        formattedAddress: 'Rua Augusta, 1500 - Consolação, São Paulo - SP',
        lat: -23.555771,
        lng: -46.662458,
        street: 'Rua Augusta',
        number: '1500',
        neighborhood: 'Consolação',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01305-100',
      },
      'ChIJrTLR4bNWzpQRfEYFOXaGJ1q': {
        formattedAddress: 'Rua Oscar Freire, 800 - Jardins, São Paulo - SP',
        lat: -23.564840,
        lng: -46.672264,
        street: 'Rua Oscar Freire',
        number: '800',
        neighborhood: 'Jardins',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01426-001',
      },
      'ChIJrTLR4bNWzpQRfEYFOXaGJ1r': {
        formattedAddress: 'Av. Brasil, 1500 - Jardim Paulista, São Paulo - SP',
        lat: -23.570719,
        lng: -46.647895,
        street: 'Av. Brasil',
        number: '1500',
        neighborhood: 'Jardim Paulista',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01431-000',
      },
      'ChIJrTLR4bNWzpQRfEYFOXaGJ1s': {
        formattedAddress: 'Rua da Cantareira, 306 - Centro, São Paulo - SP',
        lat: -23.541833,
        lng: -46.629444,
        street: 'Rua da Cantareira',
        number: '306',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01024-900',
      },
      'ChIJrTLR4bNWzpQRfEYFOXaGJ1t': {
        formattedAddress: 'Av. Brigadeiro Faria Lima, 3100 - Itaim Bibi, São Paulo - SP',
        lat: -23.577720,
        lng: -46.689530,
        street: 'Av. Brigadeiro Faria Lima',
        number: '3100',
        neighborhood: 'Itaim Bibi',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '04538-132',
      },
      'ChIJrTLR4bNWzpQRfEYFOXaGJ1u': {
        formattedAddress: 'Rua Haddock Lobo, 1500 - Jardins, São Paulo - SP',
        lat: -23.559160,
        lng: -46.667340,
        street: 'Rua Haddock Lobo',
        number: '1500',
        neighborhood: 'Jardins',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01414-003',
      },
      'ChIJrTLR4bNWzpQRfEYFOXaGJ1v': {
        formattedAddress: 'Praça da República, 1 - Centro, São Paulo - SP',
        lat: -23.543790,
        lng: -46.641520,
        street: 'Praça da República',
        number: '1',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01045-001',
      },
      'ChIJrTLR4bNWzpQRfEYFOXaGJ1w': {
        formattedAddress: 'Rua dos Pinheiros, 500 - Pinheiros, São Paulo - SP',
        lat: -23.567810,
        lng: -46.685640,
        street: 'Rua dos Pinheiros',
        number: '500',
        neighborhood: 'Pinheiros',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '05422-001',
      },
      'ChIJrTLR4bNWzpQRfEYFOXaGJ1x': {
        formattedAddress: 'Av. Ibirapuera, 3103 - Moema, São Paulo - SP',
        lat: -23.604870,
        lng: -46.665230,
        street: 'Av. Ibirapuera',
        number: '3103',
        neighborhood: 'Moema',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '04029-200',
      },
      'ChIJrTLR4bNWzpQRfEYFOXaGJ1y': {
        formattedAddress: 'Rua 25 de Março, 100 - Centro, São Paulo - SP',
        lat: -23.545660,
        lng: -46.632980,
        street: 'Rua 25 de Março',
        number: '100',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01021-100',
      },
      'ChIJrTLR4bNWzpQRfEYFOXaGJ1z': {
        formattedAddress: 'Rua Vergueiro, 2000 - Vila Mariana, São Paulo - SP',
        lat: -23.588940,
        lng: -46.638260,
        street: 'Rua Vergueiro',
        number: '2000',
        neighborhood: 'Vila Mariana',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '04101-000',
      },
    };

    return new Promise(resolve => {
      setTimeout(() => resolve(mockCoords[placeId] || null), 300);
    });
  }

  // Implementação real com Google Geocoding API
  try {
    const geocoder = new google.maps.Geocoder();
    const result = await new Promise<unknown[]>((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      geocoder.geocode({ placeId }, (results: any[] | null, status: string) => {
        if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
          resolve(results);
        } else {
          reject(status);
        }
      });
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const address: any = result[0];
    const components: { types: string[]; long_name: string }[] = address.address_components;
    
    const getComponent = (type: string): string | undefined => 
      components.find(c => c.types.includes(type))?.long_name;

    return {
      formattedAddress: address.formatted_address,
      lat: address.geometry.location.lat(),
      lng: address.geometry.location.lng(),
      street: getComponent('route'),
      number: getComponent('street_number'),
      neighborhood: getComponent('sublocality') || getComponent('neighborhood'),
      city: getComponent('administrative_area_level_2'),
      state: getComponent('administrative_area_level_1'),
      zipCode: getComponent('postal_code'),
    };
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};

// Calcular rota entre dois pontos
export const calculateRoute = async (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<RouteInfo | null> => {
  if (!hasGoogleMapsKey()) {
    // Fallback: calcular distância aproximada usando fórmula de Haversine
    const R = 6371; // Raio da Terra em km
    const dLat = (destination.lat - origin.lat) * Math.PI / 180;
    const dLon = (destination.lng - origin.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(origin.lat * Math.PI / 180) * Math.cos(destination.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distanceKm = R * c;

    // Estimar tempo (média de 30km/h em cidade)
    const durationMinutes = Math.round((distanceKm / 30) * 60);

    return new Promise(resolve => {
      setTimeout(() => resolve({
        distanceKm: Math.round(distanceKm * 10) / 10,
        durationMinutes: Math.max(5, durationMinutes),
      }), 300);
    });
  }

  // Implementação real com Google Directions API
  try {
    const directionsService = new google.maps.DirectionsService();
    const result = await new Promise<unknown>((resolve, reject) => {
      directionsService.route(
        {
          origin: new google.maps.LatLng(origin.lat, origin.lng),
          destination: new google.maps.LatLng(destination.lat, destination.lng),
          travelMode: google.maps.TravelMode.DRIVING,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (response: any, status: string) => {
          if (status === google.maps.DirectionsStatus.OK && response) {
            resolve(response);
          } else {
            reject(status);
          }
        }
      );
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = (result as any).routes[0];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const leg: any = route.legs[0];

    return {
      distanceKm: Math.round(((leg.distance?.value || 0) / 1000) * 10) / 10,
      durationMinutes: Math.round((leg.duration?.value || 0) / 60),
      polyline: route.overview_polyline,
    };
  } catch (error) {
    console.error('Error calculating route:', error);
    return null;
  }
};

// Carregar script do Google Maps
export const loadGoogleMapsScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!hasGoogleMapsKey()) {
      resolve();
      return;
    }

    if (document.getElementById('google-maps-script')) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&language=pt-BR`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps script'));
    document.head.appendChild(script);
  });
};
