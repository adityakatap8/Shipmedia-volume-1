import React, { useState } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import './index.css';

function RightsInfo({ onRightsChange, errors, setRightsInfoErrors }) {
  const rightsOptions = [
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
    { name: 'SVOD (Subscription Video on Demand)', id: 20 },
    { name: 'AVOD (Advertising Video on Demand)', id: 21 },
    { name: 'TVOD (Transactional Video on Demand)', id: 22 },
    { name: 'Broadcast', id: 23 },
    { name: 'Cable', id: 24 },
  ];

  const territoryOptions = [
    { name: 'North America', id: 1 },
    { name: 'LATAM (Latin America)', id: 2 },
    { name: 'Worldwide', id: 3 },
    { name: 'Europe', id: 4 },
    { name: 'Asia', id: 5 },
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

  const [selectedRights, setSelectedRights] = useState([]);
  const [selectedTerritories, setSelectedTerritories] = useState([]);
  const [selectedLicenseTerm, setSelectedLicenseTerm] = useState([]);
  const [selectedUsageRights, setSelectedUsageRights] = useState([]);
  const [selectedPaymentTerms, setSelectedPaymentTerms] = useState([]);
  const [listPrice, setListPrice] = useState('');

  

  const handleSelectionChange = (updatedList, field) => {
    let updatedRights = selectedRights;
    let updatedTerritories = selectedTerritories;
    let updatedLicenseTerm = selectedLicenseTerm;
    let updatedUsageRights = selectedUsageRights;
    let updatedPaymentTerms = selectedPaymentTerms;

    // Update relevant field
    switch (field) {
      case 'rights':
        setSelectedRights(updatedList);
        updatedRights = updatedList;
        break;
      case 'territories':
        setSelectedTerritories(updatedList);
        updatedTerritories = updatedList;
        break;
      case 'licenseTerm':
        setSelectedLicenseTerm(updatedList);
        updatedLicenseTerm = updatedList;
        break;
      case 'usageRights':
        setSelectedUsageRights(updatedList);
        updatedUsageRights = updatedList;
        break;
      case 'paymentTerms':
        setSelectedPaymentTerms(updatedList);
        updatedPaymentTerms = updatedList;
        break;
      default:
        break;
    }

    // Validate rights
    if (field === 'rights' && updatedRights.length === 0) {
      setRightsInfoErrors('Please select at least one right.');
    } else {
      setRightsInfoErrors('');
    }

    // Send data to parent
    if (onRightsChange) {
      onRightsChange({
        rights: updatedRights,
        territories: updatedTerritories,
        licenseTerm: updatedLicenseTerm,
        usageRights: updatedUsageRights,
        paymentTerms: updatedPaymentTerms,
        platformType: updatedRights, // same as rights
        listPrice,
      });
    }
  };

  const handleListPriceChange = (e) => {
    const value = e.target.value;

    if (/^\d*\.?\d*$/.test(value)) {
      setListPrice(value);

      if (onRightsChange) {
        onRightsChange({
          rights: selectedRights,
          territories: selectedTerritories,
          licenseTerm: selectedLicenseTerm,
          usageRights: selectedUsageRights,
          paymentTerms: selectedPaymentTerms,
          platformType: selectedRights,  // Assuming selectedRights is correct for platformType
          listPrice: value,  // Pass the updated listPrice
        });
      }
    }
  };

  return (
    <div className="rights-info pt-10">
      <div className="row submitter-row">
        <div className="submitter-container">
          <h1 className="header-numbered">
            <span>3</span>
            Rights Management
          </h1>
        </div>
      </div>

      {errors && typeof errors === 'string' && (
        <div className="error-message">{errors}</div>
      )}

      {/* Dropdowns Row 1 */}
      <div className="dropdown-row">
        <div className="dropdown-container text-left">
          <h3>Platform Type</h3>
          <Multiselect
            options={rightsOptions}
            selectedValues={selectedRights}
            onSelect={(list) => handleSelectionChange(list, 'rights')}
            onRemove={(list) => handleSelectionChange(list, 'rights')}
            displayValue="name"
            showCheckbox
            closeIcon="cancel"
          />
        </div>

        <div className="dropdown-container text-left">
          <h3>Territories</h3>
          <Multiselect
            options={territoryOptions}
            selectedValues={selectedTerritories}
            onSelect={(list) => handleSelectionChange(list, 'territories')}
            onRemove={(list) => handleSelectionChange(list, 'territories')}
            displayValue="name"
            showCheckbox
            closeIcon="cancel"
          />
        </div>
      </div>

      {/* Dropdowns Row 2 */}
      <div className="dropdown-row">
        <div className="dropdown-container text-left">
          <h3>License Term</h3>
          <Multiselect
            options={licenseTermOptions}
            selectedValues={selectedLicenseTerm}
            onSelect={(list) => handleSelectionChange(list, 'licenseTerm')}
            onRemove={(list) => handleSelectionChange(list, 'licenseTerm')}
            displayValue="name"
            showCheckbox
            closeIcon="cancel"
          />
        </div>

        <div className="dropdown-container text-left">
          <h3>Usage Rights</h3>
          <Multiselect
            options={usageRightsOptions}
            selectedValues={selectedUsageRights}
            onSelect={(list) => handleSelectionChange(list, 'usageRights')}
            onRemove={(list) => handleSelectionChange(list, 'usageRights')}
            displayValue="name"
            showCheckbox
            closeIcon="cancel"
          />
        </div>
      </div>

      {/* Dropdowns Row 3 */}
      <div className="dropdown-row">
        <div className="dropdown-container text-left">
          <h3>Payment Terms</h3>
          <Multiselect
            options={paymentTermsOptions}
            selectedValues={selectedPaymentTerms}
            onSelect={(list) => handleSelectionChange(list, 'paymentTerms')}
            onRemove={(list) => handleSelectionChange(list, 'paymentTerms')}
            displayValue="name"
            showCheckbox
            closeIcon="cancel"
          />
        </div>

        <div className="dropdown-container text-left text-black">
          <h3 className='text-white'>List Price (USD)</h3>
          <input
  type="text"
  value={listPrice}   // Ensure this is linked to the listPrice state
  onChange={handleListPriceChange}
  placeholder="$ Enter USD price"
  className="price-input"
/>
        </div>
      </div>
    </div>
  );
}

export default RightsInfo;






// ////////////////////////////////////////////
