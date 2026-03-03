import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { searchAddressSuggestions, geocodeAddress, type AddressSuggestion, type GeocodedAddress } from '@/lib/maps';
import { Input } from '@/components/ui/input';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string, address?: GeocodedAddress) => void;
  placeholder?: string;
  type?: 'establishment' | 'address';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: unknown[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  placeholder = 'Buscar endereço...',
  type = 'establishment',
}) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<GeocodedAddress | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 3) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchAddressSuggestions(searchQuery, type);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [type]
  );

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    fetchSuggestions(newValue);
  };

  const handleSelectSuggestion = async (suggestion: AddressSuggestion) => {
    setQuery(suggestion.description);
    setShowSuggestions(false);
    setIsLoading(true);

    try {
      const geocoded = await geocodeAddress(suggestion.placeId);
      if (geocoded) {
        setSelectedAddress(geocoded);
        onChange(suggestion.description, geocoded);
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length >= 3 && suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {isLoading ? (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
        ) : (
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-64 overflow-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSelectSuggestion(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
            >
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#FF6B00] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-[#1A1A1A]">{suggestion.mainText}</p>
                  <p className="text-sm text-gray-500">{suggestion.secondaryText}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Info quando não há API key */}
      {!suggestions.length && query.length >= 3 && !isLoading && (
        <p className="text-xs text-gray-400 mt-1">
          💡 Digite pelo menos 3 caracteres para buscar
        </p>
      )}

      {/* Endereço selecionado */}
      {selectedAddress && (
        <div className="mt-2 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            <span className="font-medium">✓ Endereço confirmado:</span><br />
            {selectedAddress.street}, {selectedAddress.number} - {selectedAddress.neighborhood}
          </p>
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
