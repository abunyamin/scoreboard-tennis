import { useState } from 'react'
import Score from "./Score"

function App() {
  const [count, setCount] = useState(0)

  return (
   <>

   <Score />
   </>
  )
}

export default App
