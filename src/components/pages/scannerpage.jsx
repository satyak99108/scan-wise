import { useState } from "react"

export default function ScannerPage({ onResult }) {
  const [productName, setProductName] = useState("")
  const [ingredients, setIngredients] = useState("")
  const [category, setCategory] = useState("human food")
  const [loading, setLoading] = useState(false)

  const handleScan = async () => {
    if (!productName || !ingredients) return
    setLoading(true)
    try {
      const res = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, ingredients, category })
      })
      const data = await res.json()
      onResult(data)
    } catch (err) {
      alert("Something went wrong. Check if the server is running.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">ScanWise</h1>
        <p className="text-gray-400 text-sm mb-6">Know what's in your products</p>

        <label className="text-sm font-medium text-gray-600">Product Name</label>
        <input
          className="w-full border border-gray-200 rounded-lg p-3 mt-1 mb-4 text-sm"
          placeholder="e.g. Lay's Classic Chips"
          value={productName}
          onChange={e => setProductName(e.target.value)}
        />

        <label className="text-sm font-medium text-gray-600">Ingredients</label>
        <textarea
          className="w-full border border-gray-200 rounded-lg p-3 mt-1 mb-4 text-sm h-28 resize-none"
          placeholder="Paste ingredients from the packet..."
          value={ingredients}
          onChange={e => setIngredients(e.target.value)}
        />

        <label className="text-sm font-medium text-gray-600">Category</label>
        <select
          className="w-full border border-gray-200 rounded-lg p-3 mt-1 mb-6 text-sm"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="human food">Human Food</option>
          <option value="pet food">Pet Food</option>
          <option value="cosmetic">Cosmetic / Beauty</option>
        </select>

        <button
          onClick={handleScan}
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze Product"}
        </button>
      </div>
    </div>
  )
}