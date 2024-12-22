import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AudiLogo, BMWLogo, MercedesLogo, VolkswagenLogo } from './brand-icons'

interface BrandSelectorProps {
  brands: string[];
  onSelect: (brand: string) => void;
}

export function BrandSelector({ brands, onSelect }: BrandSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredBrands = brands.filter(brand => 
    brand.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // This function will return a logo component based on the brand name
  // You may want to expand this with more brand logos
  const getBrandLogo = (brand: string) => {
    switch(brand.toLowerCase()) {
      case 'audi':
        return AudiLogo;
      case 'bmw':
        return BMWLogo;
      case 'mercedes-benz':
        return MercedesLogo;
      case 'volkswagen':
        return VolkswagenLogo;
      default:
        return VolkswagenLogo; // Default logo
    }
  }

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Marke suchen..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />
      <ScrollArea className="h-[400px] w-full rounded-md border">
        <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4">
          {filteredBrands.map((brand) => {
            const Logo = getBrandLogo(brand);
            return (
              <button
                key={brand}
                onClick={() => onSelect(brand)}
                className="flex flex-col items-center justify-center gap-2 rounded-lg p-4 transition-colors hover:bg-accent"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background p-2 shadow-sm">
                  <Logo />
                </div>
                <span className="text-center text-sm font-medium">{brand}</span>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

