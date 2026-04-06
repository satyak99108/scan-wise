import { useState } from "react"
import ScannerPage from "./components/pages/scannerpage"

function App() {
  const [result, setResult] = useState(null)

  return (
    <div>
      {!result
        ? <ScannerPage onResult={setResult} />
        : <div className="p-8">
            <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
            <button onClick={() => setResult(null)} className="mt-4 text-blue-600">
              ← Scan another
            </button>
          </div>
      }
    </div>
  )
}
export default App
