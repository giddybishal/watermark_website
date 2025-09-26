import {BrowserRouter as BrowserRouter, Routes, Route} from "react-router-dom"
import Bookmark from "./pages/Bookmark"
import { BookmarkProvider } from "./contexts/BookmarkContext"

function App() {
  return (
    <BrowserRouter>
      <BookmarkProvider>
        <Routes>
          <Route path='/' element={<Bookmark/>} />
        </Routes>
      </BookmarkProvider>
    </BrowserRouter>
    
  )
}
export default App
