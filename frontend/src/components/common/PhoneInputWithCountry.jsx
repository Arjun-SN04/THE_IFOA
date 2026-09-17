import React, { useState, useRef, useEffect } from 'react'
import { RiArrowDownSLine, RiSearchLine, RiCloseLine } from 'react-icons/ri'
import { COUNTRIES, getCountryFlag } from './countries'

export function PhoneInputWithCountry({
  value = '',
  onChange,
  placeholder = '98765 43210',
  disabled = false,
  required = false,
  className = '',
  defaultCountry = 'IN'
}) {
  // Find initial country from value or defaultCountry
  const [selectedCountry, setSelectedCountry] = useState(() => {
    if (value && value.startsWith('+')) {
      const match = COUNTRIES.find((c) => value.startsWith(c.dial_code))
      if (match) return match
    }
    return COUNTRIES.find((c) => c.code === defaultCountry) || COUNTRIES[0]
  })

  // Extract phone number digits without dial code if present
  const [phoneDigits, setPhoneDigits] = useState(() => {
    if (value && selectedCountry && value.startsWith(selectedCountry.dial_code)) {
      return value.slice(selectedCountry.dial_code.length).trim()
    }
    return value || ''
  })

  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef(null)
  const searchInputRef = useRef(null)

  // Sync external value changes
  useEffect(() => {
    if (value) {
      if (value.startsWith('+')) {
        const match = COUNTRIES.find((c) => value.startsWith(c.dial_code))
        if (match && match.code !== selectedCountry.code) {
          setSelectedCountry(match)
          setPhoneDigits(value.slice(match.dial_code.length).trim())
          return
        }
      }
    }
  }, [value])

  // Focus search input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50)
    } else {
      setSearch('')
    }
  }, [isOpen])

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleDigitsChange = (e) => {
    const raw = e.target.value
    setPhoneDigits(raw)
    const formatted = raw.trim() ? `${selectedCountry.dial_code} ${raw.trim()}` : ''
    onChange?.(formatted)
  }

  const handleCountrySelect = (country) => {
    setSelectedCountry(country)
    setIsOpen(false)
    const formatted = phoneDigits.trim() ? `${country.dial_code} ${phoneDigits.trim()}` : country.dial_code
    onChange?.(formatted)
  }

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial_code.includes(search) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <div className="flex rounded-xl border border-black/15 bg-white shadow-2xs overflow-hidden focus-within:ring-2 focus-within:ring-rocket-lime focus-within:border-transparent transition-all">
        {/* Country Code Picker Trigger */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-2.5 bg-gray-50/80 hover:bg-gray-100 border-r border-black/10 text-xs font-semibold text-rocket-dark transition-colors shrink-0 select-none cursor-pointer"
        >
          <span className="text-base leading-none">{getCountryFlag(selectedCountry.code)}</span>
          <span className="font-mono text-gray-700">{selectedCountry.dial_code}</span>
          <RiArrowDownSLine className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Phone Digits Input */}
        <input
          type="tel"
          disabled={disabled}
          required={required}
          value={phoneDigits}
          onChange={handleDigitsChange}
          placeholder={placeholder}
          className="w-full bg-transparent px-3 py-2.5 text-sm text-rocket-dark placeholder:text-gray-400 focus:outline-none"
        />
      </div>

      {/* Country Dropdown Popup */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-72 sm:w-80 max-h-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
          {/* Search Box */}
          <div className="p-2.5 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <RiSearchLine className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country or code…"
              className="w-full bg-transparent text-xs text-rocket-dark placeholder:text-gray-400 focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="p-1 text-gray-400 hover:text-rocket-dark"
              >
                <RiCloseLine className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Countries List */}
          <div className="overflow-y-auto max-h-64 p-1.5 divide-y divide-gray-50">
            {filteredCountries.length === 0 ? (
              <p className="p-4 text-xs text-center text-gray-400">No country found</p>
            ) : (
              filteredCountries.map((c) => {
                const isSelected = selectedCountry.code === c.code
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleCountrySelect(c)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors text-left ${
                      isSelected
                        ? 'bg-rocket-lime/20 font-bold text-black'
                        : 'hover:bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <span className="text-base leading-none">{getCountryFlag(c.code)}</span>
                      <span className="truncate">{c.name}</span>
                    </div>
                    <span className="font-mono text-gray-500 shrink-0 font-medium">{c.dial_code}</span>
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

export default PhoneInputWithCountry
