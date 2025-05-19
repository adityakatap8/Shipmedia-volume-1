import React, { useState } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import './index.css';

function RightsInfo({ onRightsChange, errors }) {
const rightsOptions = [

  { name: 'SVOD (Subscription Video on Demand)', id: 1 },
  { name: 'TVOD (Transactional Video on Demand)', id: 2 },
  { name: 'AVOD (Advertising Video on Demand)', id: 3 },

 
  { name: 'Broadcast', id: 4 },
  { name: 'Cable', id: 5 },
  { name: 'Television Broadcast Rights', id: 6 },


  { name: 'Theatrical Rights', id: 7 },
  { name: 'EST (Electronic Sell-Through) Rights', id: 8 },
  { name: 'DVD/Blu-ray Distribution Rights', id: 9 },
  { name: 'Home Video Rights', id: 10 },
  { name: 'Foreign Distribution Rights', id: 11 },
  { name: 'Airline/Ship Rights', id: 12 },
  { name: 'Merchandising Rights', id: 13 },
  { name: 'Music Rights', id: 14 },
  { name: 'Product Placement Rights', id: 15 },
  { name: 'Franchise/Sequel Rights', id: 16 },
  { name: 'Mobile Rights', id: 17 },
  { name: 'Interactive and Gaming Rights', id: 18 },
  { name: 'Script/Adaptation Rights', id: 19 },
  { name: 'Public Performance Rights', id: 20 },
  { name: 'Specialty and Festival Rights', id: 21 },
  { name: 'Censorship Rights', id: 22 },
  { name: 'Outright Sale', id: 23 }
];


 const territoryGroupedOptions = [
  {
    name: 'Select All',
    id: 'select_all',
    country: 'All Territories',
    region: 'global'
  },
  { name: 'India', id: 'india', country: 'India', region: 'Asia' },
  { name: 'China', id: 'china', country: 'China', region: 'Asia' },
  { name: 'Japan', id: 'japan', country: 'Japan', region: 'Asia' },
  { name: 'South Korea', id: 'south_korea', country: 'South Korea', region: 'Asia' },

  { name: 'Germany', id: 'germany', country: 'Germany', region: 'Europe' },
  { name: 'France', id: 'france', country: 'France', region: 'Europe' },
  { name: 'Italy', id: 'italy', country: 'Italy', region: 'Europe' },

  { name: 'United States', id: 'united_states', country: 'United States', region: 'North America' },
  { name: 'Canada', id: 'canada', country: 'Canada', region: 'North America' },
  { name: 'Mexico', id: 'mexico', country: 'Mexico', region: 'North America' },

  { name: 'Brazil', id: 'brazil', country: 'Brazil', region: 'LATAM (Latin America)' },
  { name: 'Argentina', id: 'argentina', country: 'Argentina', region: 'LATAM (Latin America)' },
  { name: 'Colombia', id: 'colombia', country: 'Colombia', region: 'LATAM (Latin America)' }
];


  const licenseTermOptions = [
    { name: '1 year', id: 1 },
    { name: '2 years', id: 2 },
    { name: '3 years', id: 3 },
    { name: '5 years', id: 4 },
    { name: 'Indefinite', id: 5 },
  ];

  const usageRightsOptions = [
    { name: 'Exclusive', id: 1 },
    { name: 'Non-Exclusive', id: 2 },
    { name: 'Sub-licensable', id: 3 },
  ];

  const paymentTermsOptions = [
    { name: 'Revenue Share', id: 1 },
    { name: 'Minimum Guarantee', id: 2 },
    { name: 'Min Guarantee + Revenue Share', id: 3 },
  ];

const getFlatTerritoryOptions = () => {
  return territoryGroupedOptions.map(item => ({
    name: item.name,
    value: item.id,
    region: item.region
  }));
};


  const flatTerritoryOptions = getFlatTerritoryOptions();

  const defaultPlatform = {
    rights: [],
    territories: [],
    licenseTerm: [],
    usageRights: [],
    paymentTerms: [],
    listPrice: ''
  };

  const [platforms, setPlatforms] = useState([{ ...defaultPlatform }]);

  const handleChange = (index, field, value) => {
    const updated = [...platforms];
    updated[index][field] = value;
    setPlatforms(updated);
    onRightsChange?.(updated);
  };

  const handleAddPlatform = () => {
    setPlatforms(prev => [...prev, { ...defaultPlatform }]);
  };

  const handleRemovePlatform = (index) => {
    const updated = platforms.filter((_, i) => i !== index);
    setPlatforms(updated);
    onRightsChange?.(updated);
  };

const handleTerritoryChange = (selectedList, index) => {
  const isSelectAllSelected = selectedList.some(item => item.id === 'select_all');

  let updatedList;

  if (isSelectAllSelected) {
    // If Select All is chosen, select all countries (excluding 'Select All')
    updatedList = territoryGroupedOptions.filter(item => item.id !== 'select_all');
  } else {
    // If any other item is deselected after selecting all, just use what's selected (excluding Select All)
    updatedList = selectedList.filter(item => item.id !== 'select_all');
  }

  handleChange(index, 'territories', updatedList);
};


  return (
    <div className="rights-info pt-10">
      <div className="row submitter-row">
        <div className="submitter-container">
          <h1 className="header-numbered">
            <span>4</span> Rights Management
          </h1>
        </div>
      </div>

      {typeof errors === 'string' && <div className="error-message">{errors}</div>}

      {platforms.map((platform, index) => (
        <div key={index} className="platform-section">
          <hr className="my-4" />

          <div className="dropdown-row">
            <div className="dropdown-container text-left">
              <h3>Available Rights for Syndication</h3>
              <Multiselect
                options={rightsOptions}
                selectedValues={platform.rights}
                onSelect={(list, selectedItem) => {
                  handleChange(index, 'rights', [selectedItem]);
                }}
                onRemove={() => {
                  handleChange(index, 'rights', []);
                }}
                displayValue="name"
                showCheckbox
                closeIcon="cancel"
              />
            </div>
          </div>

          {platform.rights.length > 0 && (
            <>
              <div className="dropdown-row">
                <div className="dropdown-container text-left">
                  <h3>Territories</h3>
                  <Multiselect
  options={territoryGroupedOptions}
  selectedValues={platform.territories}
  onSelect={(list) => handleTerritoryChange(list, index)}
  onRemove={(list) => handleTerritoryChange(list, index)}
  displayValue="name"
  showCheckbox
  closeIcon="cancel"
/>

                </div>

                <div className="dropdown-container text-left">
                  <h3>License Term</h3>
                  <Multiselect
                    options={licenseTermOptions}
                    selectedValues={platform.licenseTerm}
                    onSelect={(list, selectedItem) => {
                      handleChange(index, 'licenseTerm', [selectedItem]);
                    }}
                    onRemove={() => {
                      handleChange(index, 'licenseTerm', []);
                    }}
                    displayValue="name"
                    showCheckbox
                    closeIcon="cancel"
                  />
                </div>
              </div>

              <div className="dropdown-row">
                <div className="dropdown-container text-left">
                  <h3>Usage Rights</h3>
                  <Multiselect
                    options={usageRightsOptions}
                    selectedValues={platform.usageRights}
                    onSelect={(list, selectedItem) => {
                      handleChange(index, 'usageRights', [selectedItem]);
                    }}
                    onRemove={() => {
                      handleChange(index, 'usageRights', []);
                    }}
                    displayValue="name"
                    showCheckbox
                    closeIcon="cancel"
                  />
                </div>

                <div className="dropdown-container text-left">
                  <h3>Payment Terms</h3>
                  <Multiselect
                    options={paymentTermsOptions}
                    selectedValues={platform.paymentTerms}
                    onSelect={(list) => handleChange(index, 'paymentTerms', list)}
                    onRemove={(list) => handleChange(index, 'paymentTerms', list)}
                    displayValue="name"
                    showCheckbox
                    closeIcon="cancel"
                  />
                </div>
              </div>

              <div className="dropdown-row">
                <div className="dropdown-container text-left">
                  <h3>List Price (USD)</h3>
                  <input
                    type="text"
                    value={platform.listPrice}
                    onChange={(e) =>
                      handleChange(index, 'listPrice', e.target.value)
                    }
                    placeholder="$ Enter USD price"
                    className="price-input text-black"
                  />
                </div>
              </div>

              {platforms.length > 1 && (
                <div className="dropdown-row">
                  <button
                    className="remove-platform-btn"
                    onClick={() => handleRemovePlatform(index)}
                  >
                    Remove Platform
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ))}

      <div className="dropdown-row mt-4">
        <button type="button" className="add-platform-btn" onClick={handleAddPlatform}>
          + Add Platform Type
        </button>
      </div>
    </div>
  );
}

export default RightsInfo;
