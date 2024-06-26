import React from 'react'
import { Routes, Route } from 'react-router-dom';
import NotFound from '../../Pages/NotFound/NotFound';
import News from '../../Pages/News/News';
import Favourite from '../../Pages/News/Favourite';

export default function NewsRoutes() {
  return (
    <Routes>
      <Route path="/" element={<News />} />
      <Route path="/Favourite" element={<Favourite />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
