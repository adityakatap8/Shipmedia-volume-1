import React, { useState, useEffect } from 'react';
import './index.css';
// import { countries } from './Countries.js'
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { currencies } from './Formcomponents/countries.js';


function ProjectsForm() {

    const [selectedCountryOfOrigin, setSelectedCountryOfOrigin] = useState('');
    const [selectedCountryOfFilming, setSelectedCountryOfFilming] = useState('');

    const countriesData = [
        { code: "AF", name: "Afghanistan" },
        { code: "AX", name: "Åland Islands" },
        { code: "AL", name: "Albania" },
        { code: "DZ", name: "Algeria" },
        { code: "AS", name: "American Samoa" },
        { code: "AD", name: "Andorra" },
        { code: "AO", name: "Angola" },
        { code: "AI", name: "Anguilla" },
        { code: "AQ", name: "Antarctica" },
        { code: "AG", name: "Antigua and Barbuda" },
        { code: "AR", name: "Argentina" },
        { code: "AM", name: "Armenia" },
        { code: "AW", name: "Aruba" },
        { code: "AU", name: "Australia" },
        { code: "AT", name: "Austria" },
        { code: "AZ", name: "Azerbaijan" },
        { code: "BS", name: "Bahamas (the)" },
        { code: "BH", name: "Bahrain" },
        { code: "BD", name: "Bangladesh" },
        { code: "BB", name: "Barbados" },
        { code: "BY", name: "Belarus" },
        { code: "BE", name: "Belgium" },
        { code: "BZ", name: "Belize" },
        { code: "BJ", name: "Benin" },
        { code: "BM", name: "Bermuda" },
        { code: "BT", name: "Bhutan" },
        { code: "BO", name: "Bolivia (Plurinational State of)" },
        { code: "BQ", name: "Bonaire, Sint Eustatius and Saba" },
        { code: "BA", name: "Bosnia and Herzegovina" },
        { code: "BW", name: "Botswana" },
        { code: "BV", name: "Bouvet Island" },
        { code: "BR", name: "Brazil" },
        { code: "IO", name: "British Indian Ocean Territory (the)" },
        { code: "BN", name: "Brunei Darussalam" },
        { code: "BG", name: "Bulgaria" },
        { code: "BF", name: "Burkina Faso" },
        { code: "BI", name: "Burundi" },
        { code: "CV", name: "Cabo Verde" },
        { code: "KH", name: "Cambodia" },
        { code: "CM", name: "Cameroon" },
        { code: "CA", name: "Canada" },
        { code: "KY", name: "Cayman Islands (the)" },
        { code: "CF", name: "Central African Republic (the)" },
        { code: "TD", name: "Chad" },
        { code: "CL", name: "Chile" },
        { code: "CN", name: "China" },
        { code: "CX", name: "Christmas Island" },
        { code: "CC", name: "Cocos (Keeling) Islands (the)" },
        { code: "CO", name: "Colombia" },
        { code: "KM", name: "Comoros (the)" },
        { code: "CD", name: "Congo (the Democratic Republic of the)" },
        { code: "CG", name: "Congo (the)" },
        { code: "CK", name: "Cook Islands (the)" },
        { code: "CR", name: "Costa Rica" },
        { code: "CI", name: "Côte d'Ivoire" },
        { code: "HR", name: "Croatia" },
        { code: "CU", name: "Cuba" },
        { code: "CW", name: "Curaçao" },
        { code: "CY", name: "Cyprus" },
        { code: "CZ", name: "Czechia" },
        { code: "DK", name: "Denmark" },
        { code: "DJ", name: "Djibouti" },
        { code: "DM", name: "Dominica" },
        { code: "DO", name: "Dominican Republic (the)" },
        { code: "EC", name: "Ecuador" },
        { code: "EG", name: "Egypt" },
        { code: "SV", name: "El Salvador" },
        { code: "GQ", name: "Equatorial Guinea" },
        { code: "ER", name: "Eritrea" },
        { code: "EE", name: "Estonia" },
        { code: "SZ", name: "Eswatini" },
        { code: "ET", name: "Ethiopia" },
        { code: "FK", name: "Falkland Islands (the) [Malvinas]" },
        { code: "FO", name: "Faroe Islands (the)" },
        { code: "FJ", name: "Fiji" },
        { code: "FI", name: "Finland" },
        { code: "FR", name: "France" },
        { code: "GF", name: "French Guiana" },
        { code: "PF", name: "French Polynesia" },
        { code: "TF", name: "French Southern Territories (the)" },
        { code: "GA", name: "Gabon" },
        { code: "GM", name: "Gambia (the)" },
        { code: "GE", name: "Georgia" },
        { code: "DE", name: "Germany" },
        { code: "GH", name: "Ghana" },
        { code: "GI", name: "Gibraltar" },
        { code: "GR", name: "Greece" },
        { code: "GL", name: "Greenland" },
        { code: "GD", name: "Grenada" },
        { code: "GP", name: "Guadeloupe" },
        { code: "GU", name: "Guam" },
        { code: "GT", name: "Guatemala" },
        { code: "GG", name: "Guernsey" },
        { code: "GN", name: "Guinea" },
        { code: "GW", name: "Guinea-Bissau" },
        { code: "GY", name: "Guyana" },
        { code: "HT", name: "Haiti" },
        { code: "HM", name: "Heard Island and McDonald Islands" },
        { code: "VA", name: "Holy See (the)" },
        { code: "HN", name: "Honduras" },
        { code: "HK", name: "Hong Kong" },
        { code: "HU", name: "Hungary" },
        { code: "IS", name: "Iceland" },
        { code: "IN", name: "India" },
        { code: "ID", name: "Indonesia" },
        { code: "IR", name: "Iran (Islamic Republic of)" },
        { code: "IQ", name: "Iraq" },
        { code: "IE", name: "Ireland" },
        { code: "IM", name: "Isle of Man" },
        { code: "IL", name: "Israel" },
        { code: "IT", name: "Italy" },
        { code: "JM", name: "Jamaica" },
        { code: "JP", name: "Japan" },
        { code: "JE", name: "Jersey" },
        { code: "JO", name: "Jordan" },
        { code: "KZ", name: "Kazakhstan" },
        { code: "KE", name: "Kenya" },
        { code: "KI", name: "Kiribati" },
        { code: "KP", name: "Korea (the Democratic People's Republic of)" },
        { code: "KR", name: "Korea (the Republic of)" },
        { code: "KW", name: "Kuwait" },
        { code: "KG", name: "Kyrgyzstan" },
        { code: "LA", name: "Lao People's Democratic Republic (the)" },
        { code: "LV", name: "Latvia" },
        { code: "LB", name: "Lebanon" },
        { code: "LS", name: "Lesotho" },
        { code: "LR", name: "Liberia" }
    ];

    // State to track the visibility of the additional section
    const [isOtherLanguageVisible, setIsOtherLanguageVisible] = useState(false);
    const [isSubmitterInfoVisible, setIsSubmitterInfoVisible] = useState(false);

    const [selectedCountry, setSelectedCountry] = useState("");

    const [value, setValue] = React.useState(null);
    const [startDate, setStartDate] = useState(new Date());

    const [selectedDate, setSelectedDate] = useState(null);
    const [inputValue, setInputValue] = useState('');

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  


    // Toggle function to handle submitter information visibility
    const handleToggleSubmitterInfo = () => {
        setIsSubmitterInfoVisible(!isSubmitterInfoVisible);
    };

    const [countries, setCountries] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/countries.js');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data); // Check if the data is correctly fetched
                setCountries(data);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };

        fetchData();
    }, []);



    const [credits, setCredits] = useState([
        { firstName: '', middleName: '', lastName: '', priorCredits: '' },
    ]);

    const addPerson = () => {
        setCredits([...credits, { firstName: '', middleName: '', lastName: '', priorCredits: '' }]);
    };

    const removePerson = (index) => {
        setCredits(credits.filter((_, i) => i !== index));
    };


    const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

    // Combined adjustTime function
    const adjustTime = (unit, action) => {
        setTime(prevTime => {
            let newValue;

            // Handle the logic for each unit
            if (unit === 'hours') {
                newValue = action === 'increase' ? Math.min(23, prevTime.hours + 1) : Math.max(0, prevTime.hours - 1);
            } else if (unit === 'minutes') {
                if (prevTime.seconds === 59 && action === 'increase') {
                    newValue = Math.min(59, prevTime.minutes + 1);
                } else if (prevTime.seconds === 0 && action === 'decrease') {
                    newValue = Math.max(0, prevTime.minutes - 1);
                } else {
                    newValue = prevTime.minutes;
                }
            } else if (unit === 'seconds') {
                newValue = action === 'increase' ? Math.min(59, prevTime.seconds + 1) : Math.max(0, prevTime.seconds - 1);
            }

            return {
                ...prevTime,
                [unit]: newValue,
            };
        });
    };


    // Handle the input change
    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);

        // If the input is empty, reset selected date
        if (value === '') {
            setSelectedDate(null);
        }
    };

    // Handle the date selection from the calendar
    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setInputValue(format(date, 'MMMM dd, yyyy')); // Format date as 'December 09, 2024'
        setIsCalendarOpen(false); // Close the calendar after selection
    };

    // Toggle the visibility of the calendar
    const toggleCalendar = () => {
        setIsCalendarOpen((prev) => !prev);
    };


    const [budget, setBudget] = useState('');
    const [currency, setCurrency] = useState('');

    const handleBudgetChange = (e) => {
        const value = e.target.value;
        // Only set the value if it's a positive number or an empty string
        if (value >= 0 || value === '') {
            setBudget(value);
        }
    };



    const [screenings, setScreenings] = useState([
        { filmFestival: '' }
    ]);

    const addScreening = () => {
        setScreenings([...screenings, { filmFestival: '' }]);
    };

    const removeScreening = (index) => {
        setScreenings(screenings.filter((_, i) => i !== index));
    };

    const handleScreeningInput = (index, value) => {
        setScreenings(screenings.map((screening, i) =>
            i === index ? { ...screening, filmFestival: value } : screening
        ));
    };

    // Drag-and-Drop functionality
    const handleDragStart = (e, index) => {
        e.dataTransfer.setData('draggedIndex', index);
    };

    const handleDrop = (e, index) => {
        const draggedIndex = e.dataTransfer.getData('draggedIndex');
        const newScreenings = [...screenings];
        const [draggedItem] = newScreenings.splice(draggedIndex, 1);
        newScreenings.splice(index, 0, draggedItem);
        setScreenings(newScreenings);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const [projectData, setProjectData] = useState({
        projectType: 'video', // default value
        projectTitle: '',
        briefSynopsis: '',
        isOtherLanguageVisible: false,
        otherLanguageTitle: '',
        otherLanguageSynopsis: '',
        website: '',
        twitter: '',
        facebook: '',
        instagram: ''
      });


       // Error messages state
  const [errors, setErrors] = useState({});

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData({
      ...projectData,
      [name]: value
    });
  };

  // Handle checkbox toggle
//   const handleToggleClick = () => {
//     setProjectData({
//       ...projectData,
//       isOtherLanguageVisible: !projectData.isOtherLanguageVisible
//     });
//   };

    // Toggle function to handle click event (show or hide)
    const handeOtherLanguage = () => {
        setIsOtherLanguageVisible(!isOtherLanguageVisible);
    };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate fields
    let validationErrors = {};

    // Validate Project Information
    validationErrors = { ...validationErrors, ...validateProjectInformation(projectData) };

    // Validate Other Language Details if visible
    validationErrors = { ...validationErrors, ...validateOtherLanguageDetails(projectData) };

    // Validate Social Media Links
    validationErrors = { ...validationErrors, ...validateSocialMediaLinks(projectData) };

    // If there are errors, do not submit the form
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      // No errors, submit the form (handle save logic here)
      console.log('Form data is valid:', projectData);
    }
  };


    const handleSaveProject = (e) => {

    };

    return (
        <div className="container-fluid projects-form-container">
            <form action="" method="POST" enctype="multipart/form-data" onSubmit={handleSaveProject}>
                <div>
                    {/* project information */}
                    <div className="section-One text-left">
                        <h1 className="header-numbered">
                            <span>1</span> Project Information
                        </h1>
                        <div className="form-section">
                            <div className="form-label grid-3 span-12-phone">Project Type</div>
                            <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
                                <div className="input optional radio">
                                    <input
                                        type="radio"
                                        value="video"
                                        name="projectType"
                                        id="project_type_video"
                                        checked={projectData.projectType === 'video'}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="project_type_video">Film / Video</label>
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <div className="form-label grid-3 span-12-phone">
                                Project Title
                                <span className="spanClass">(English)</span>
                            </div>
                            <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
                                <div className="input optional form-field-input">
                                    <input
                                        type="text"
                                        value={projectData.projectTitle}
                                        name="projectTitle"
                                        id="project_title"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            {errors.projectTitle && <p>{errors.projectTitle}</p>}
                        </div>

                        <div className="form-section">
                            <div className="form-label grid-3 span-12-phone">
                                Brief Synopsis
                                <span className="spanClass">(English)</span>
                            </div>
                            <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
                                <div className="input optional form-field-input">
                                    <textarea
                                        name="briefSynopsis"
                                        id="brief_synopsis"
                                        value={projectData.briefSynopsis}
                                        onChange={handleChange}
                                        rows="4"
                                    />
                                </div>
                            </div>
                            {errors.briefSynopsis && <p>{errors.briefSynopsis}</p>}
                        </div>

                        <div className="other-language-section text-center pl-12 pt-8">
                            <div className="other-language-section span-6 span-8-tablet span-12-phone">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={projectData.isOtherLanguageVisible}
                                        onChange={handeOtherLanguage}
                                    />
                                    Add project details in another language
                                </label>
                            </div>

                            {projectData.isOtherLanguageVisible && (
                                <>
                                    <div className="form-section">
                                        <div className="form-label grid-3 span-12-phone">
                                            Project Title (Other Language)
                                        </div>
                                        <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
                                            <div className="input optional form-field-input">
                                                <input
                                                    type="text"
                                                    value={projectData.otherLanguageTitle}
                                                    name="otherLanguageTitle"
                                                    id="other_language_title"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        {errors.otherLanguageTitle && <p>{errors.otherLanguageTitle}</p>}
                                    </div>

                                    <div className="form-section">
                                        <div className="form-label grid-3 span-12-phone">
                                            Brief Synopsis (Other Language)
                                        </div>
                                        <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
                                            <div className="input optional form-field-input">
                                                <textarea
                                                    name="otherLanguageSynopsis"
                                                    id="other_language_synopsis"
                                                    value={projectData.otherLanguageSynopsis}
                                                    onChange={handleChange}
                                                    rows="4"
                                                />
                                            </div>
                                        </div>
                                        {errors.otherLanguageSynopsis && <p>{errors.otherLanguageSynopsis}</p>}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    {/* submitter infor section */}
                    <div className="section-two text-left pt-16 pb-8">
                        <div className="row submitter-row">
                            <div className="submitter-container">
                                <h1 className="header-numbered">
                                    <span>2</span>
                                    Submitter Information
                                </h1>
                                <div className="toggle-container">
                                    <button onClick={handleToggleSubmitterInfo} className="edit-submitter-button flex-end">
                                        {isSubmitterInfoVisible ? 'Hide Submitter Information' : 'Edit Submitter Information'}
                                    </button>
                                </div>
                            </div>
                        </div>


                        {/* Submitter Information Section */}
                        {isSubmitterInfoVisible && (
                            <div className="submitter-info-section">
                                <div className="form-section">
                                    <div className="form-label grid-3 span-12-phone">
                                        Email Address
                                    </div>
                                    <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
                                        <div className="input optional form-field-input">
                                            <input type="email" name="email" id="email" />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-section">
                                    <div className="form-label grid-3 span-12-phone">
                                        Phone
                                    </div>
                                    <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
                                        <div className="input optional form-field-input">
                                            <input type="text" name="contact_number" id="contact_number" />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-section">
                                    <div className="form-label grid-3 span-12-phone">
                                        Address
                                    </div>
                                    <div className="form-field radio-buttons span-2 span-8-tablet span-12-phone">
                                        <div className="input optional form-field-input">
                                            <input type="text" name="address" id="address" />
                                        </div>
                                    </div>
                                </div>
                                {/* postal code country */}
                                <div className="form-section postal-custom-form">
                                    <div className="form-label grid-3 span-12-phone custom-form-label">
                                        City
                                    </div>
                                    <div className="form-field radio-buttons span-2 span-8-tablet span-12-phone custom-form-field">
                                        <div className="input optional form-field-input custom-input">
                                            <input type="text" name="city" id="city" className="custom-input-field" />
                                        </div>
                                    </div>
                                    <div className="form-label grid-3 span-12-phone custom-form-label">
                                        State / Province
                                    </div>
                                    <div className="form-field radio-buttons span-2 span-8-tablet span-12-phone custom-form-field">
                                        <div className="input optional form-field-input custom-input ">
                                            <input type="text" name="state" id="state" className="custom-input-field" />
                                        </div>
                                    </div>
                                </div>
                                {/* city country */}
                                <div className="form-section custom-form-section">
                                    <div className="form-label grid-3 span-12-phone custom-form-label">
                                        Postal Code
                                    </div>
                                    <div className="form-field radio-buttons span-2 span-8-tablet span-12-phone custom-form-field">
                                        <div className="input optional form-field-input custom-input">
                                            <input type="text" name="city" id="city" className="custom-input-field" />
                                        </div>
                                    </div>
                                    <div className="form-label grid-3 span-12-phone custom-form-label">
                                        Country
                                    </div>
                                    <div className="form-field radio-buttons span-2 span-8-tablet span-12-phone custom-form-field">
                                        <select className="custom-input border-gray" name="country" id="country">
                                            <option value="">Select Country</option>
                                            {countriesData.map(({ code, name }) => (
                                                <option key={code} value={code}>
                                                    {name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                {/* birthdate */}
                                <div className="form-section custom-form-section pt-8 pl-8">
                                    <div className="form-label grid-3 span-12-phone custom-form-label">
                                        Date
                                    </div>
                                    <div className="form-field radio-buttons span-2 span-8-tablet span-12-phone custom-form-field">
                                        <select className="custom-input border-gray" name="date" id="date">
                                            <option value="">Select Date</option>
                                            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                                <option key={day} value={day}>
                                                    {day}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-label grid-3 span-12-phone custom-form-label">
                                        Month
                                    </div>
                                    <div className="form-field radio-buttons span-2 span-8-tablet span-12-phone custom-form-field">
                                        <select className="custom-input border-gray" name="month" id="month">
                                            <option value="">Select Month</option>
                                            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                                <option key={month} value={month}>
                                                    {month}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-label grid-6 span-12-phone custom-form-label">
                                        Year
                                    </div>
                                    <div className="form-field radio-buttons span-2 span-8-tablet span-12-phone custom-form-field">
                                        <select className="custom-input border-gray" name="year" id="year">
                                            <option value="">Select Year</option>
                                            {Array.from({ length: 100 }, (_, i) => 1900 + i).map((year) => (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Gender */}
                                <div className="form-section gender-custom-form pt-8">
                                    <div className="form-label grid-3 span-12-phone custom-form-label">
                                        Gender
                                    </div>
                                    <div className="form-field radio-buttons span-2 span-8-tablet span-12-phone custom-form-field">
                                        <select className="custom-input border-gray" name="gender" id="gender">
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Credits  section */}
                    <div className="section-two text-left pt-16 pb-8">
                        <div className="row submitter-row">
                            <div className="submitter-container">
                                <h1 className="header-numbered">
                                    <span>3</span>
                                    Credits
                                </h1>
                            </div>
                        </div>
                        {/* director */}
                        {credits.map((credit, index) => (
                            <div key={index} className="credit-box">
                                <div className="title-bar">
                                    <span>Director</span>
                                    <button onClick={() => removePerson(index)}>&times;</button>
                                </div>
                                <div className="input-fields">
                                    <input
                                        type="text"
                                        placeholder="First Name"
                                        value={credit.firstName}
                                        onChange={(e) =>
                                            setCredits(
                                                credits.map((c, i) => i === index ? { ...c, firstName: e.target.value } : c)
                                            )
                                        }
                                    />
                                    <input
                                        type="text"
                                        placeholder="Middle Name"
                                        value={credit.middleName}
                                        onChange={(e) =>
                                            setCredits(
                                                credits.map((c, i) => i === index ? { ...c, middleName: e.target.value } : c)
                                            )
                                        }
                                    />
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        value={credit.lastName}
                                        onChange={(e) =>
                                            setCredits(
                                                credits.map((c, i) => i === index ? { ...c, lastName: e.target.value } : c)
                                            )
                                        }
                                    />
                                    <input
                                        type="text"
                                        placeholder="Prior Credits (Optional)"
                                        value={credit.priorCredits}
                                        onChange={(e) =>
                                            setCredits(
                                                credits.map((c, i) => i === index ? { ...c, priorCredits: e.target.value } : c)
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        ))}
                        <button onClick={addPerson} className="add-person-button mb-4">
                            + Add Person
                        </button>
                        {/* writers */}

                        {credits.map((credit, index) => (
                            <div key={index} className="credit-box">
                                <div className="title-bar">
                                    <span>Writers</span>
                                    <button onClick={() => removePerson(index)}>&times;</button>
                                </div>
                                <div className="input-fields">
                                    <input
                                        type="text"
                                        placeholder="First Name"
                                        value={credit.firstName}
                                        onChange={(e) =>
                                            setCredits(
                                                credits.map((c, i) => i === index ? { ...c, firstName: e.target.value } : c)
                                            )
                                        }
                                    />
                                    <input
                                        type="text"
                                        placeholder="Middle Name"
                                        value={credit.middleName}
                                        onChange={(e) =>
                                            setCredits(
                                                credits.map((c, i) => i === index ? { ...c, middleName: e.target.value } : c)
                                            )
                                        }
                                    />
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        value={credit.lastName}
                                        onChange={(e) =>
                                            setCredits(
                                                credits.map((c, i) => i === index ? { ...c, lastName: e.target.value } : c)
                                            )
                                        }
                                    />
                                    <input
                                        type="text"
                                        placeholder="Prior Credits (Optional)"
                                        value={credit.priorCredits}
                                        onChange={(e) =>
                                            setCredits(
                                                credits.map((c, i) => i === index ? { ...c, priorCredits: e.target.value } : c)
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        ))}
                        <button onClick={addPerson} className="add-person-button mb-4">
                            + Add Person
                        </button>

                        {/* producers */}

                        {credits.map((credit, index) => (
                            <div key={index} className="credit-box">
                                <div className="title-bar">
                                    <span>Producers</span>
                                    <button onClick={() => removePerson(index)}>&times;</button>
                                </div>
                                <div className="input-fields">
                                    <input
                                        type="text"
                                        placeholder="First Name"
                                        value={credit.firstName}
                                        onChange={(e) =>
                                            setCredits(
                                                credits.map((c, i) => i === index ? { ...c, firstName: e.target.value } : c)
                                            )
                                        }
                                    />
                                    <input
                                        type="text"
                                        placeholder="Middle Name"
                                        value={credit.middleName}
                                        onChange={(e) =>
                                            setCredits(
                                                credits.map((c, i) => i === index ? { ...c, middleName: e.target.value } : c)
                                            )
                                        }
                                    />
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        value={credit.lastName}
                                        onChange={(e) =>
                                            setCredits(
                                                credits.map((c, i) => i === index ? { ...c, lastName: e.target.value } : c)
                                            )
                                        }
                                    />
                                    <input
                                        type="text"
                                        placeholder="Prior Credits (Optional)"
                                        value={credit.priorCredits}
                                        onChange={(e) =>
                                            setCredits(
                                                credits.map((c, i) => i === index ? { ...c, priorCredits: e.target.value } : c)
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        ))}

                        <button onClick={addPerson} className="add-person-button">
                            + Add Person
                        </button>
                    </div>

                    {/* Specifications  section */}
                    <div className="section-two text-left pt-16 pb-8">
                        <div className="row submitter-row">
                            <div className="submitter-container">
                                <h1 className="header-numbered">
                                    <span>4</span>
                                    Specifications
                                </h1>
                            </div>

                        </div>


                        <div className="section-One text-left">

                            <div className="form-section">
                                <div className="form-label grid-3 span-12-phone">
                                    Project Type
                                </div>

                                <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
                                    <div className="input optional radio">
                                        <input
                                            type="radio"
                                            value="video"
                                            name="project_type"
                                            id="project_type_video"
                                        />
                                        <label htmlFor="project_type_video">Animation</label>
                                    </div>

                                    <div className="input optional radio">
                                        <input
                                            type="radio"
                                            value="script"
                                            name="project_type"
                                            id="project_type_script"
                                        />
                                        <label htmlFor="project_type_script">Experimental</label>
                                    </div>

                                    <div className="input optional radio">
                                        <input
                                            type="radio"
                                            value="audio"
                                            name="project_type"
                                            id="project_type_audio"
                                        />
                                        <label htmlFor="project_type_audio">Music Video</label>
                                    </div>

                                    <div className="input optional radio">
                                        <input
                                            type="radio"
                                            value="photo"
                                            name="project_type"
                                            id="project_type_photo"
                                        />
                                        <label htmlFor="project_type_photo">Student</label>
                                    </div>

                                    <div className="input optional radio">
                                        <input
                                            type="radio"
                                            value="immersive"
                                            name="project_type"
                                            id="project_type_immersive"
                                        />
                                        <label htmlFor="project_type_immersive">
                                            Web / New Media
                                        </label>
                                    </div>
                                </div>
                                <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
                                    <div className="input optional radio">
                                        <input
                                            type="radio"
                                            value="video"
                                            name="project_type"
                                            id="project_type_video"
                                        />
                                        <label htmlFor="project_type_video">Documentary</label>
                                    </div>

                                    <div className="input optional radio">
                                        <input
                                            type="radio"
                                            value="script"
                                            name="project_type"
                                            id="project_type_script"
                                        />
                                        <label htmlFor="project_type_script">Feature</label>
                                    </div>

                                    <div className="input optional radio">
                                        <input
                                            type="radio"
                                            value="audio"
                                            name="project_type"
                                            id="project_type_audio"
                                        />
                                        <label htmlFor="project_type_audio">Short</label>
                                    </div>

                                    <div className="input optional radio">
                                        <input
                                            type="radio"
                                            value="photo"
                                            name="project_type"
                                            id="project_type_photo"
                                        />
                                        <label htmlFor="project_type_photo">Television</label>
                                    </div>

                                    <div className="input optional radio">
                                        <input
                                            type="radio"
                                            value="immersive"
                                            name="project_type"
                                            id="project_type_immersive"
                                        />
                                        <label htmlFor="project_type_immersive">
                                            Other
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="form-sectionTwo">

                                <div className="form-section">
                                    <div className="form-label grid-3 span-12-phone">
                                        Genres

                                    </div>
                                    <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
                                        <div className="input optional form-field-input">
                                            <input
                                                type="text"
                                                value=""
                                                name="project_type"
                                                id="project_type_video"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-section">
                                    <div className="form-label grid-3 span-12-phone">
                                        Run Time

                                    </div>
                                    <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
                                        <div className="time-picker">
                                            <div className="input-container">

                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="23"
                                                    value={time.hours}
                                                    onChange={(e) => setTime({ ...time, hours: parseInt(e.target.value) })}
                                                />

                                            </div>

                                            <div className="input-container">

                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="59"
                                                    value={time.minutes}
                                                    onChange={(e) => setTime({ ...time, minutes: parseInt(e.target.value) })}
                                                />

                                            </div>

                                            <div className="input-container">

                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="59"
                                                    value={time.seconds}
                                                    onChange={(e) => setTime({ ...time, seconds: parseInt(e.target.value) })}
                                                />

                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="form-section">
                                    <div className="form-label grid-3 span-12-phone">
                                        Completion Date
                                    </div>
                                    <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
                                        <div className="calendar-field form-field span-6 span-8-tablet span-12-phone">
                                            {/* Input field */}
                                            <input
                                                type="text"
                                                value={inputValue}
                                                onChange={handleInputChange}
                                                placeholder="Select a date"
                                                onClick={() => {
                                                    setIsCalendarOpen(true);
                                                }}
                                            />

                                            {/* Conditionally render the DayPicker calendar */}
                                            {isCalendarOpen && (
                                                <div className="calendar-container">
                                                    <DayPicker
                                                        selected={selectedDate}
                                                        onDayClick={handleDateSelect}
                                                        showWeekNumbers={true}
                                                        disabledDates={[new Date(1900, 0, 1)]}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="form-section">
                                    <div className="form-label grid-3 span-12-phone">
                                        Production Budget
                                    </div>

                                    <div className="currency-form radio-buttons span-6 span-8-tablet span-12-phone">
                                        {/* Input for budget */}
                                        <div className="currency-form-field-input">
                                            <input
                                                type="number"
                                                value={budget}
                                                onChange={handleBudgetChange} // Prevent negative values
                                                name="production_budget"
                                                id="production_budget"
                                                placeholder="Enter Budget"
                                                min="0" // Prevent negative values in the input
                                            />
                                        </div>

                                        {/* Currency Dropdown */}
                                        <div className="currency-form-field-input currency-dropdown">
                                            <select
                                                value={currency}
                                                onChange={(e) => setCurrency(e.target.value)}
                                                name="currency"
                                                id="currency"
                                            >
                                                <option value="">Select Currency</option>
                                                {currencies.map((currencyItem) => (
                                                    <option key={currencyItem.code} value={currencyItem.code}>
                                                        {currencyItem.name} ({currencyItem.symbol})
                                                    </option>
                                                ))}
                                            </select>


                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="form-sectionThree">
                                <div className="form-section">
                                    <div className="form-label grid-3 span-12-phone">
                                        Country Of Origin
                                    </div>
                                    <div className="country-origin-field form-field radio-buttons span-6 span-8-tablet span-12-phone">
                                        <select
                                            style={{
                                                border: 'none',
                                                outline: 'none',
                                                background: 'transparent',
                                            }}
                                            className="input optional form-field-input"
                                            name="country_of_origin"
                                            id="country_of_origin"
                                            value={selectedCountryOfOrigin}
                                            onChange={(e) => setSelectedCountryOfOrigin(e.target.value)}
                                        >
                                            <option value="">Select a country</option>
                                            {countriesData.map((country) => (
                                                <option key={country.code} value={country.code}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>


                                <div className="form-section">
                                    <div className="form-label grid-3 span-12-phone">
                                        Country Of Filming
                                    </div>
                                    <div className="country-filming-field form-field radio-buttons span-6 span-8-tablet span-12-phone">
                                        <select style={{
                                            border: 'none',
                                            outline: 'none',
                                            background: 'transparent',
                                        }}
                                            className="input optional form-field-input"
                                            name="country_of_filming"
                                            id="country_of_filming"
                                            value={selectedCountryOfFilming}
                                            onChange={(e) => setSelectedCountryOfFilming(e.target.value)}
                                        >
                                            <option className='option' value="">Select a country</option>
                                            {countriesData.map((country) => (
                                                <option key={country.code} value={country.code}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>


                                <div className="form-section">
                                    <div className="form-label grid-3 span-12-phone">
                                        Language
                                    </div>
                                    <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
                                        <div className="input optional form-field-input">
                                            <input
                                                type="text"
                                                value=""
                                                name="project_type"
                                                id="project_type_video"
                                            />
                                        </div>
                                    </div>
                                </div>


                                <div className="form-section">
                                    <div className="form-label grid-3 span-12-phone">
                                        Shooting Format
                                    </div>
                                    <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
                                        <div className="input optional form-field-input">
                                            <input
                                                type="text"
                                                value=""
                                                name="project_type"
                                                id="project_type_video"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-section">
                                    <div className="form-label grid-3 span-12-phone">
                                        Aspect Ratio
                                    </div>
                                    <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
                                        <div className="input optional form-field-input">
                                            <input
                                                type="text"
                                                value=""
                                                name="project_type"
                                                id="project_type_video"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-section">
                                    <div className="form-label grid-3 span-12-phone">
                                        Film Color
                                    </div>
                                    <div className="film-field form-field radio-buttons span-3 span-8-tablet span-12-phone">
                                        <div className="input optional form-field-input">
                                            <select name="project_type" id="project_type_video">
                                                <option value="">Select Film Color</option>
                                                <option value="color">Color</option>
                                                <option value="black_and_white">Black & White</option>
                                                <option value="color_and_black_and_white">Color, Black & White</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-section">
                                    <div className="form-label grid-3 span-12-phone">
                                        Student Project
                                    </div>
                                    <div className="film-field form-field radio-buttons span-6 span-8-tablet span-12-phone">
                                        <div className="input optional form-field-input">
                                            <select
                                                name="project_type"
                                                id="project_type_video"
                                                defaultValue="" // Optional, if you want to set an initial value
                                            >
                                                <option value="">Select Yes or No</option>
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-section">
                                    <div className="form-label grid-3 span-12-phone">
                                        First Time Film-maker
                                    </div>
                                    <div className="film-field form-field radio-buttons span-6 span-8-tablet span-12-phone">
                                        <div className="input optional form-field-input">
                                            <select
                                                name="project_type"
                                                id="project_type_video"
                                                defaultValue="" // Optional, if you want to set an initial value
                                            >
                                                <option value="">Select Yes or No</option>
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>



                            </div>


                        </div>


                    </div>

                    {/* screenings and distribution section */}
                    <div className="section-two text-left pt-16 pb-8">
                        <div className="row submitter-row">
                            <div className="submitter-container">
                                <h1 className="header-numbered">
                                    <span>5</span>
                                    Screenings / Distribution
                                </h1>
                            </div>
                        </div>
                        <div className="form-section section-One text-left">
                            <label className="form-label grid-3 span-12-phone custom-form-label">Screenings & Awards
                            </label>
                            <div className='form-field radio-buttons span-4 span-8-tablet span-12-phone'>
                                {screenings.map((screening, index) => (
                                    <div
                                        key={index}
                                        className="screening-box"
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, index)}
                                        onDrop={(e) => handleDrop(e, index)}
                                        onDragOver={handleDragOver}
                                    >
                                        <div className="title-bar">
                                            <span>Event</span>
                                            <span>Actions</span>
                                        </div>
                                        <div className='d-flex screening-field'>
                                            <div className="input-fields">
                                                <input
                                                    type="text"
                                                    placeholder="Film Festival"
                                                    value={screening.filmFestival}
                                                    onChange={(e) => handleScreeningInput(index, e.target.value)}
                                                />
                                            </div>
                                            <div className="actions">
                                                <div onClick={() => { /* Implement your edit logic here */ }} className="action-item">
                                                    <span className=''>Edit</span>
                                                </div>
                                                <div onClick={() => removeScreening(index)} className="action-item">
                                                    <i className="fas fa-trash-alt"></i>
                                                </div>

                                                <div className="action-item">
                                                    <i className="fas fa-arrows-alt"></i>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                ))}

                                <div onClick={addScreening} className="add-screening-button mb-4">
                                    + Add a Screening
                                </div>
                            </div>

                        </div>

                        <div className="form-section section-One text-left">
                            <label className="form-label grid-3 span-12-phone custom-form-label">Distribution Information

                            </label>
                            <div className='form-field radio-buttons span-4 span-8-tablet span-12-phone'>
                                {screenings.map((screening, index) => (
                                    <div
                                        key={index}
                                        className="screening-box"
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, index)}
                                        onDrop={(e) => handleDrop(e, index)}
                                        onDragOver={handleDragOver}
                                    >
                                        <div className="title-bar">
                                            <span>Distributor / Sales Agent</span>
                                            <span>Actions</span>
                                        </div>
                                        <div className='d-flex screening-field'>
                                            <div className="input-fields">
                                                <input
                                                    type="text"
                                                    placeholder="Film Festival"
                                                    value={screening.filmFestival}
                                                    onChange={(e) => handleScreeningInput(index, e.target.value)}
                                                />
                                            </div>
                                            <div className="actions">
                                                <div onClick={() => { /* Implement your edit logic here */ }} className="action-item">
                                                    <span className=''>Edit</span>
                                                </div>
                                                <div onClick={() => removeScreening(index)} className="action-item">
                                                    <i className="fas fa-trash-alt"></i>
                                                </div>

                                                <div className="action-item">
                                                    <i className="fas fa-arrows-alt"></i>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                ))}

                                <div onClick={addScreening} className="add-screening-button mb-4">
                                    + Add Distributor / Sales Agent
                                </div>
                            </div>

                        </div>


                    </div>
                </div>
        
            </form >
        </div >
    );
}

export default ProjectsForm;
