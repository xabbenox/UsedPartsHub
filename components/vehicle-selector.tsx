import { useState, useEffect } from 'react'
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { BrandSelector } from "./brand-selector"

interface CarBrand {
  brand: string;
  models: string[];
}

interface VehicleSelectorProps {
  onSelect: (brand: string, model: string, year: string) => void;
}

export function VehicleSelector({ onSelect }: VehicleSelectorProps) {
  const [carBrands, setCarBrands] = useState<CarBrand[]>([])
  const [selectedBrand, setSelectedBrand] = useState<string>('')
  const [selectedModel, setSelectedModel] = useState<string>('')
  const [year, setYear] = useState<string>('')

  useEffect(() => {
    async function fetchCarBrands() {
      const response = await fetch('/api/car-brands')
      const data = await response.json()
      if (data.brandsWithModels) {
        setCarBrands(data.brandsWithModels)
      }
    }
    fetchCarBrands()
  }, [])

  useEffect(() => {
    if (selectedBrand && selectedModel && year) {
      onSelect(selectedBrand, selectedModel, year)
    }
  }, [selectedBrand, selectedModel, year, onSelect])

  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand)
    setSelectedModel('')
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Automarke</Label>
        <BrandSelector brands={carBrands.map(b => b.brand)} onSelect={handleBrandSelect} />
      </div>
      {selectedBrand && (
        <div>
          <Label htmlFor="model">Modell</Label>
          <Select onValueChange={setSelectedModel}>
            <SelectTrigger id="model">
              <SelectValue placeholder="Wählen Sie ein Modell" />
            </SelectTrigger>
            <SelectContent>
              {carBrands.find(b => b.brand === selectedBrand)?.models.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div>
        <Label htmlFor="year">Baujahr</Label>
        <Input
          id="year"
          type="number"
          min="1900"
          max={new Date().getFullYear()}
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="z.B. 2015"
        />
      </div>
    </div>
  )
}

