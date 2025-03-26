import React, { useState } from 'react';
import './FiltersFestivals.css';

function FiltersFestivals() {
  const [entryFees, setEntryFees] = useState(0);
  const [yearsRunning, setYearsRunning] = useState(1);
  const [projectRuntime, setProjectRuntime] = useState(0);

  return (
    <div className="filters-festivals-container">
      {/* Call for Entries Filter */}
      <div className="filter-group">
        <label className="filter-label">Call for Entries</label>
        <select className="filter-dropdown">
          <option>Open & Closed</option>
          <option>Open Only</option>
        </select>
      </div>


      {/* Categories Filter */}
      <div className="filter-group">
        <label className="filter-label">Categories</label>
        <select className="filter-dropdown">
          <option>Animation</option>
          <option>Documentary</option>
          <option>Experimental</option>
          <option>Feature</option>
          <option>Music Video</option>
          <option>Short</option>
          <option>Student</option>
          <option>Television</option>
          <option>Virtual Reality</option>
          <option>Web / New Media</option>
          <option>Screenplay</option>
          <option>Short Script</option>
          <option>Stage Play</option>
          <option>Television Script</option>
        </select>
      </div>

      {/* Entry Fees Filter */}
      <div className="filter-group">
        <label className="filter-label">
          Entry Fees: ${entryFees}
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={entryFees}
          onChange={(e) => setEntryFees(Number(e.target.value))}
          className="slider"
        />
      </div>

      {/* Years Running Filter */}
      <div className="filter-group">
        <label className="filter-label">
          Years Running: {yearsRunning} Years
        </label>
        <input
          type="range"
          min="1"
          max="20"
          step="1"
          value={yearsRunning}
          onChange={(e) => setYearsRunning(Number(e.target.value))}
          className="slider"
        />
      </div>

      {/* Project Runtime Filter */}
      <div className="filter-group">
        <label className="filter-label">
          Project Runtime: {projectRuntime} mins
        </label>
        <input
          type="range"
          min="0"
          max="240"
          step="5"
          value={projectRuntime}
          onChange={(e) => setProjectRuntime(Number(e.target.value))}
          className="slider"
        />
      </div>

      {/* Festival Focus Filter */}
      <div className="filter-group">
        <label className="filter-label">Genre</label>
        <select className="filter-dropdown">
          <option>Action / Adventure</option>
          <option>Asian</option>
          <option>Black / African</option>
          <option>Children</option>
          <option>Comedy</option>
          <option>Dance</option>
          <option>Environmental / Outdoor</option>
          <option>Horror</option>
          <option>Human Rights</option>
          <option>Indigenous / Native Peoples</option>
          <option>Latino / Hispanic</option>
          <option>LGBTQ</option>
          <option>Religious</option>
          <option>Sci-fi / Fantasy / Thriller</option>
          <option>Underground</option>
          <option>Women</option>
        </select>
      </div>

      {/* Region / Country Filter */}
      <div className="filter-group">
        <label className="filter-label">Region / Country</label>
        <select className="filter-dropdown">
          <option>North America</option>
          <option>Europe</option>
          <option>Asia</option>
          <option>South America</option>
          <option>Australia</option>
          <option>Africa</option>
          <option>Global</option>
        </select>
      </div>

      {/* Completion Date Filter */}
      <div className="filter-group">
        <label className="filter-label">Completion Date</label>
        <input type="date" className="filter-input-date" />
      </div>

      {/* Entry Deadline Filter */}
      <div className="filter-group">
        <label className="filter-label">Entry Deadline</label>
        <input type="date" className="filter-input-date" />
      </div>

      {/* Event Date Filter */}
      <div className="filter-group">
        <label className="filter-label">Event Date</label>
        <input type="date" className="filter-input-date" />
      </div>
    </div>
  );
}

export default FiltersFestivals;
