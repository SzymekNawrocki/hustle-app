"use client"
import { useEffect, useState } from 'react'

interface HustleItem {
  id: number;
  title: string;
  category: string;
  value: number;
}

export default function HustlePage() {
  const [items, setItems] = useState<HustleItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        if (!apiUrl) {
            console.error("Brak API URL!")
            return
        }

        const res = await fetch(`${apiUrl}/items`)
        if (!res.ok) throw new Error('Błąd pobierania')
        
        const data = await res.json()
        setItems(data)
      } catch (error) {
        console.error("Nie udało się pobrać celów:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, []) 

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-blue-900 tracking-tight">
          Hustle Dashboard 🚀
        </h1>
        
        {loading ? (
          <p className="text-gray-500 animate-pulse">Ładowanie Twoich celów...</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {items.map((item) => (
              <div key={item.id} className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-500 bg-blue-50 px-2 py-1 rounded">
                    {item.category}
                  </span>
                  <span className="font-mono text-green-600 font-bold">
                    {item.value > 0 ? `+${item.value}` : item.value}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{item.title}</h2>
              </div>
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300 mt-6">
            <p className="text-gray-500">Baza pusta. Czas dodać pierwsze cele!</p>
          </div>
        )}
      </div>
    </div>
  )
}