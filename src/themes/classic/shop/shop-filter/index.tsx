"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

export type Filters = {
  search: string
  category?: string
  priceRange: [number, number]
  sortBy: string
}

type ShopFiltersProps = {
  categories?: string[] // optional, default categories if not passed
  onChange: (filters: Filters) => void
}

export function ShopFilters({
  categories = ["Clothing", "Electronics", "Bakery", "Beauty"],
  onChange,
}: ShopFiltersProps) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string | undefined>()
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [sortBy, setSortBy] = useState("latest")

  const handleApply = () => {
    onChange({ search, category, priceRange, sortBy })
  }

  return (
    <section className="w-full bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 flex flex-col md:flex-row gap-6 md:items-end md:justify-between">
          
          {/* Search */}
          <div className="w-full md:flex-1">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Category */}
          <div className="w-full md:w-[200px]">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="w-full md:w-[260px]">
            <label className="text-sm font-medium mb-2 block text-gray-700">
              Price Range
            </label>
            <Slider
              value={priceRange}
              onValueChange={(val: [number, number]) => setPriceRange(val)}
              min={0}
              max={1000}
              step={10}
            />
            <span className="text-xs mt-2 block text-gray-500">
              ${priceRange[0]} – ${priceRange[1]}
            </span>
          </div>

          {/* Sort By */}
          <div className="w-full md:w-[180px]">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="bestseller">Best Sellers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Apply Button */}
          <div className="w-full md:w-auto">
            <Button
              onClick={handleApply}
              className="w-full md:w-auto bg-black text-white hover:bg-gray-800 cursor-pointer px-6 py-2 rounded-lg"
            >
              Apply
            </Button>
          </div>

        </div>
      </div>
    </section>
  )
}