import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'
import { COUNTRIES, getCountryFlag } from './countries'

export function CountrySelect({
  value = '',
  onChange,
  placeholder = 'Select country…',
  disabled = false,
  required = false,
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef(null)
  const searchInputRef = useRef(null)

  // Find country object by name or code
  const selectedCountry = COUNTRIES.find(
    (c) => c.name.toLowerCase() === (value || '').toLowerCase() || c.code === (value || '').toUpperCase()
  )

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50)
    } else {
      setSearch('')
    }
  }, [isOpen])

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (country) => {
    onChange?.(country.name)
    setIsOpen(false)
  }

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-black/15 bg-white text-sm text-rocket-dark shadow-2xs hover:border-black/30 focus:outline-none focus:ring-2 focus:ring-rocket-lime focus:border-transparent transition-all select-none cursor-pointer disabled:opacity-50"
      >
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          {selectedCountry ? (
            <>
              <span className="text-lg leading-none">{getCountryFlag(selectedCountry.code)}</span>
              <span className="truncate font-medium text-rocket-dark">{selectedCountry.name}</span>
            </>
          ) : (
            <span className="text-gray-400 font-normal">{value || placeholder}</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Hidden input for HTML form validation if required */}
      {required && (
        <input
          type="text"
          value={value}
          onChange={() => {}}
          required
          tabIndex={-1}
          className="opacity-0 pointer-events-none absolute bottom-0 left-0 w-full h-0"
        />
      )}

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-full min-w-[280px] max-h-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
          {/* Search Bar */}
          <div className="p-2.5 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search all 240+ countries…"
              className="w-full bg-transparent text-xs text-rocket-dark placeholder:text-gray-400 focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="p-1 text-gray-400 hover:text-rocket-dark"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* List of Countries */}
          <div className="overflow-y-auto max-h-64 p-1.5 divide-y divide-gray-50">
            {filteredCountries.length === 0 ? (
              <p className="p-4 text-xs text-center text-gray-400">No country found</p>
            ) : (
              filteredCountries.map((c) => {
                const isSelected = selectedCountry?.code === c.code
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleSelect(c)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl transition-colors text-left ${
                      isSelected
                        ? 'bg-rocket-lime/20 font-bold text-black'
                        : 'hover:bg-gray-100 text-gray-800'
                    }`}
                  >
                    <span className="text-base leading-none">{getCountryFlag(c.code)}</span>
                    <span className="truncate">{c.name}</span>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CountrySelect
