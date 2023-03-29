import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Home, Login, Register, Create, BlogDetail, UpdateBlog } from './pages'


function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={ <Login /> } />
        <Route path='/register' element={<Register />} />
        <Route path='/create' element={<Create />} />
        <Route path='/blogDetails/:id' element={<BlogDetail />} />
        <Route path='/updateBlog/:id' element={<UpdateBlog />} />
      </Routes>
    </div>
  )
}

export default App