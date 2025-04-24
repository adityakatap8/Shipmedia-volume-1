import React, { useState } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import './index.css'; // Import your custom styles (optional)

function RightsInfo({ onRightsChange, errors, setRightsInfoErrors }) {
  const options = [
    { name: 'Theatrical Rights', id: 1 },
    { name: 'Television Broadcast Rights', id: 2 },
    { name: 'Digital/SVOD (Subscription Video on Demand) Rights', id: 3 },
    { name: 'EST (Electronic Sell-Through) Rights', id: 4 },
    { name: 'DVD/Blu-ray Distribution Rights', id: 5 },
    { name: 'Home Video Rights', id: 6 },
    { name: 'Foreign Distribution Rights', id: 7 },
    { name: 'Video-On-Demand (VOD) Rights', id: 8 },
    { name: 'Airline/Ship Rights', id: 9 },
    { name: 'Merchandising Rights', id: 10 },
    { name: 'Music Rights', id: 11 },
    { name: 'Product Placement Rights', id: 12 },
    { name: 'Franchise/Sequel Rights', id: 13 },
    { name: 'Mobile Rights', id: 14 },
    { name: 'Interactive and Gaming Rights', id: 15 },
    { name: 'Script/Adaptation Rights', id: 16 },
    { name: 'Public Performance Rights', id: 17 },
    { name: 'Specialty and Festival Rights', id: 18 },
    { name: 'Censorship Rights', id: 19 },
  ];

  const [selectedValue, setSelectedValue] = useState([]);

  // Handle select event
  const onSelect = (selectedList) => {
    console.log('Selected Items:', selectedList);
    setSelectedValue(selectedList);

    // Notify parent component about the selected rights
    if (onRightsChange) {
      onRightsChange(selectedList);  // Pass selected rights back to parent
    }

    // Validation: check if rights are selected
    if (selectedList.length === 0) {
      setRightsInfoErrors('Please select at least one right.');
    } else {
      setRightsInfoErrors('');  // Reset error
    }
  };

  // Handle remove event
  const onRemove = (selectedList) => {
    console.log('Removed Item:', selectedList);
    setSelectedValue(selectedList);

    // Notify parent component about the updated selected rights
    if (onRightsChange) {
      onRightsChange(selectedList);  // Pass updated rights back to parent
    }

    // Validation: check if rights are selected
    if (selectedList.length === 0) {
      setRightsInfoErrors('Please select at least one right.');
    } else {
      setRightsInfoErrors('');  // Reset error
    }
  };

  return (
    <div className="rights-info pt-10">
      <div className="row submitter-row">
        <div className="submitter-container">
          <h1 className="header-numbered">
            <span>3</span>
            Rights Information
          </h1>
        </div>
      </div>

      {/* Render error message if exists and ensure it's a string */}
      {errors && typeof errors === 'string' && <div className="error-message">{errors}</div>}

      <Multiselect
        options={options}  // Options to display in the dropdown
        selectedValues={selectedValue}  // Preselected value to persist in dropdown
        onSelect={onSelect}  // Function triggered on select
        onRemove={onRemove}  // Function triggered on remove
        displayValue="name"  // Display value property
        showCheckbox
        closeIcon="cancel"
      />
    </div>
  );
}

export default RightsInfo;
