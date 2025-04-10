import React from 'react'
import Showcase from './Showcase'
import Search from './Search'
import Categories from './Categories'
import { Menu } from '../components/Menu'

function ProjectShowcase() {
  return (
    <div>
      <h1>Hello</h1>
      <Menu />
        <Showcase />
        <Search />
        <Categories />
    </div>
  )
}

export default ProjectShowcase