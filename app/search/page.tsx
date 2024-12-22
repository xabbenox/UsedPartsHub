'use client'

import { useState } from 'react'
import Layout from "@/components/layout"
import { VehicleSelector } from "@/components/vehicle-selector"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import Link from "next/link"

interface SearchResult {
  id: number;
  title: string;
  price: number;
  description: string;
  brand: string;
  model: string;
  year: number;
  condition: string;
  category: string;
  photos: string[];
  main_photo_index: number;
  shipping_options: string;
}

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('newest')

  const handleVehicleSelect = (brand: string, model: string, year: string) => {
    setSelectedBrand(brand)
    setSelectedModel(model)
    setSelectedYear(year)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const handleConditionChange = (condition: string) => {
    setSelectedConditions(prev => 
      prev.includes(condition) 
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    )
  }

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Here we would normally make an API call to fetch search results
    // For this example, we'll use mock data
    const mockResults: SearchResult[] = [
      { id: 1, title: "BMW Scheinwerfer", price: 150, description: "Gebrauchter Scheinwerfer für BMW 3er Serie", brand: "BMW", model: "3er", year: 2018, condition: "Gebraucht", category: "Beleuchtung", photos: ["/placeholder.svg"], main_photo_index: 0, shipping_options: "Versand möglich" },
      { id: 2, title: "Audi Bremssättel", price: 80, description: "Set von 4 Bremssätteln für Audi A4", brand: "Audi", model: "A4", year: 2019, condition: "Neu", category: "Bremsen", photos: ["/placeholder.svg"], main_photo_index: 0, shipping_options: "Nur Abholung" },
      { id: 3, title: "Mercedes Lenkrad", price: 200, description: "Gebrauchtes Lenkrad für Mercedes C-Klasse", brand: "Mercedes-Benz", model: "C-Klasse", year: 2020, condition: "Gebraucht", category: "Innenausstattung", photos: ["/placeholder.svg"], main_photo_index: 0, shipping_options: "Versand möglich" },
      { id: 4, title: "VW Stoßstange", price: 120, description: "Vordere Stoßstange für VW Golf", brand: "Volkswagen", model: "Golf", year: 2017, condition: "Gebraucht", category: "Karosserie", photos: ["/placeholder.svg"], main_photo_index: 0, shipping_options: "Versand möglich" },
      { id: 5, title: "Opel Rückspiegel", price: 50, description: "Linker Außenspiegel für Opel Astra", brand: "Opel", model: "Astra", year: 2016, condition: "Neu", category: "Spiegel", photos: ["/placeholder.svg"], main_photo_index: 0, shipping_options: "Versand möglich" },
    ]

    const filteredResults = mockResults.filter(result => {
      return (
        (!selectedBrand || result.brand === selectedBrand) &&
        (!selectedModel || result.model === selectedModel) &&
        (!selectedYear || result.year.toString() === selectedYear) &&
        (result.price >= priceRange[0] && result.price <= priceRange[1]) &&
        (selectedCategories.length === 0 || selectedCategories.includes(result.category)) &&
        (selectedConditions.length === 0 || selectedConditions.includes(result.condition)) &&
        (!searchTerm || result.title.toLowerCase().includes(searchTerm.toLowerCase()) || result.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    })

    const sortedResults = filteredResults.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price
        case 'price_desc':
          return b.price - a.price
        case 'newest':
        default:
          return b.year - a.year
      }
    })

    setSearchResults(sortedResults)
  }

  return (
    <Layout>
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Suchfilter</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="space-y-2">
                  <Label>Fahrzeug</Label>
                  <VehicleSelector onSelect={handleVehicleSelect} />
                </div>
                
                <div className="space-y-2">
                  <Label>Preisspanne</Label>
                  <Slider
                    min={0}
                    max={10000}
                    step={100}
                    value={priceRange}
                    onValueChange={setPriceRange}
                  />
                  <div className="flex justify-between text-sm">
                    <span>€{priceRange[0]}</span>
                    <span>€{priceRange[1]}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Kategorien</Label>
                  {['Motor', 'Karosserie', 'Innenausstattung', 'Elektronik', 'Fahrwerk', 'Beleuchtung', 'Bremsen'].map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryChange(category)}
                      />
                      <label htmlFor={`category-${category}`}>{category}</label>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <Label>Zustand</Label>
                  {['Neu', 'Gebraucht', 'Generalüberholt'].map(condition => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={`condition-${condition}`}
                        checked={selectedConditions.includes(condition)}
                        onCheckedChange={() => handleConditionChange(condition)}
                      />
                      <label htmlFor={`condition-${condition}`}>{condition}</label>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <Label>Sortieren nach</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Wählen Sie eine Option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Neueste zuerst</SelectItem>
                      <SelectItem value="price_asc">Preis aufsteigend</SelectItem>
                      <SelectItem value="price_desc">Preis absteigend</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button type="submit" className="w-full">Suchen</Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          <div className="mb-4">
            <Input 
              placeholder="Suchbegriff eingeben" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {searchResults.length > 0 ? (
              searchResults.map((result) => (
                <Card key={result.id}>
                  <CardHeader className="p-0">
                    {result.photos && result.photos.length > 0 && (
                      <div className="relative h-48">
                        <Image
                          src={result.photos[result.main_photo_index]}
                          alt={result.title}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="mb-2">{result.title}</CardTitle>
                    <div className="text-2xl font-bold mb-2">€{result.price}</div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{result.description}</p>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{result.brand} {result.model} ({result.year})</span>
                      <span>{result.condition}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted p-4">
                    <div className="w-full flex justify-between items-center">
                      <span className="text-sm">{result.shipping_options}</span>
                      <Link href={`/part/${result.id}`}>
                        <Button variant="secondary" size="sm">Details ansehen</Button>
                      </Link>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground">
                Keine Ergebnisse gefunden
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

