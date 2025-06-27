import React, { useState } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import './index.css';
import territoryGroupedOptions from './territoryGroupedOptions.js'

function RightsInfo({ onRightsChange, errors }) {
  const rightsOptions = [
    { name: 'All Rights', id: 0 }, // 👈 Represents every right

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

  const cleanPlatforms = (platforms) => {
    return platforms.map(({ includeRegions, excludeCountries, ...rest }) => rest);
  };

  const getFlatTerritoryOptions = () => {
    return territoryGroupedOptions.flatMap(group =>
      (group?.countries || []).map(country => ({
        name: country.name,
        value: country.id,
        region: group.groupName
      }))
    );
  };

  // Region-level options for "Including"
  const getRegionOptions = () => [
    { name: 'Worldwide', id: 'worldwide' },
    ...territoryGroupedOptions.map(group => ({
      name: group.groupName,
      id: group.groupId,
    })),
  ];





  // All countries across regions for "Excluding"
  const getAllCountryOptions = () =>
    territoryGroupedOptions.flatMap(group =>
      group.countries.map(country => ({
        ...country,
        region: group.groupName,
      }))
    );


  // Derive territories from selected regions & excluded countries
  const formatTerritories = (includeRegions, excludeCountries) => {
    const hasWorldwide = includeRegions.some(r => r.id === 'worldwide');

    const includedRegions = hasWorldwide
      ? [{ name: 'Worldwide', id: 'worldwide' }]
      : [...includeRegions];

    return {
      includedRegions,
      excludeCountries: [...excludeCountries]
    };
  };








  const handleRegionChange = (includeRegions, index) => {
    let filteredRegions = [...includeRegions];
    const hasWorldwide = filteredRegions.some(r => r.id === 'worldwide');

    filteredRegions = hasWorldwide
      ? [{ name: 'Worldwide', id: 'worldwide' }]
      : filteredRegions.filter(r => r.id !== 'worldwide');

    const updated = [...platforms];
    const excludeCountries = updated[index].excludeCountries || [];

    updated[index] = {
      ...updated[index],
      includeRegions: filteredRegions,
      excludeCountries,
      territories: formatTerritories(filteredRegions, excludeCountries)
    };

    setPlatforms(updated);
    onRightsChange?.(cleanPlatforms(updated));
  };




  const getFilteredRegionOptions = (index) => {
    const selected = platforms[index]?.includeRegions || [];
    const hasWorldwide = selected.some(r => r.id === 'worldwide');

    if (hasWorldwide) {
      return [{ name: 'Worldwide', id: 'worldwide' }];
    }
    return getRegionOptions();
  };




  const handleExcludeCountriesChange = (excludeCountries, index) => {
    const updated = [...platforms];
    const includeRegions = updated[index].includeRegions || [];

    updated[index] = {
      ...updated[index],
      excludeCountries,
      territories: formatTerritories(includeRegions, excludeCountries)
    };

    setPlatforms(updated);
    onRightsChange?.(cleanPlatforms(updated));
  };






  const flatTerritoryOptions = getFlatTerritoryOptions();

  const defaultPlatform = {
    rights: [],
    includeRegions: [],
    // excludeCountries: [],
    // licenseTerm: [],
    usageRights: [],
    paymentTerms: [],
    listPrice: '',
    territories: []
  };

  const [platforms, setPlatforms] = useState([{ ...defaultPlatform }]);

  const handleChange = (index, field, value) => {
    const updated = [...platforms];
    updated[index][field] = value;
    setPlatforms(updated);
    onRightsChange?.(cleanPlatforms(updated));
  };


  const handleAddPlatform = () => {
    const updated = [...platforms, { ...defaultPlatform }];
    setPlatforms(updated);
    onRightsChange?.(cleanPlatforms(updated));
  };


  const handleRemovePlatform = (index) => {
    const updated = platforms.filter((_, i) => i !== index);
    setPlatforms(updated);
    onRightsChange?.(cleanPlatforms(updated));
  };


  const handleTerritoryChange = (selectedList, index) => {
    const filteredList = selectedList.filter(item => item.id !== 'worldwide');
    handleChange(index, 'territories', filteredList);
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

                  {/* Side-by-side container */}
                  <div className="flex gap-4 flex-wrap">

                    {/* Included Regions */}
                    <div className="flex-1 min-w-[300px]">
                      <h4>Territories (Including Regions)</h4>
                      <Multiselect
                        options={getFilteredRegionOptions(index)}
                        selectedValues={platform.includeRegions}
                        onSelect={(selectedList, selectedItem) => {
                          if (selectedItem.id === 'worldwide') {
                            handleRegionChange([{ name: 'Worldwide', id: 'worldwide' }], index);
                          } else {
                            const newList = selectedList.filter(r => r.id !== 'worldwide');
                            handleRegionChange(newList, index);
                          }
                        }}
                        onRemove={(selectedList) => {
                          handleRegionChange(selectedList, index);
                        }}
                        displayValue="name"
                        showCheckbox
                        closeIcon="cancel"
                      />

                      {platform.includeRegions.some(r => r.id === 'worldwide') && (
                        <p className="text-sm text-gray-600 mt-1">
                          Other regions are hidden when "Worldwide" is selected.
                        </p>
                      )}
                    </div>

                    {/* Excluded Countries */}
                    <div className="flex-1 min-w-[300px]">
                      <h4>Territories (Excluding Countries)</h4>
                      <Multiselect
                        options={getAllCountryOptions()}
                        selectedValues={platform.excludeCountries}
                        onSelect={(list) => handleExcludeCountriesChange(list, index)}
                        onRemove={(list) => handleExcludeCountriesChange(list, index)}
                        displayValue="name"
                        showCheckbox
                        closeIcon="cancel"
                      />
                    </div>

                  </div>
                </div>

                {/* License Term Dropdown */}
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
