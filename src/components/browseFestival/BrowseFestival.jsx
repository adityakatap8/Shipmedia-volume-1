import React from 'react'
import './index.css'
import SearchFestivals from './components/searchFestivals/SearchFestivals'
import FiltersFestivals from './components/filtersFestivals/FiltersFestivals'
import CatalogueFestivals from './components/catalogueFestivals/CatalogueFestivals'

function BrowseFestival() {
  return (
    <div className='browse-festival'>BrowseFestival page
    <SearchFestivals />
    <FiltersFestivals />
    <CatalogueFestivals />
    </div>
  )
}

export default BrowseFestival
