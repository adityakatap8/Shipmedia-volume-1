import React, { useState, useEffect } from 'react';
import "./index.css"
import { currencies } from './countries';
import { countries } from './countries';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
const SpecificationsInfo = ({
    onInputChange,
    formData,
    projectInfo,
    errors,
    setSpecsErrors
}) => {



    const [projectType, setProjectType] = useState('');
    const [runtime, setRuntime] = useState('');
    const [countryOfOrigin, setCountryOfOrigin] = useState('');
    const [countryOfFilming, setCountryOfFilming] = useState('');
    const [language, setLanguage] = useState('');
    const [shootingFormat, setShootingFormat] = useState('');
    const [aspectRatio, setAspectRatio] = useState('');
    const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [budget, setBudget] = useState('');
    const [currency, setCurrency] = useState('');
    const [selectedCountryOfOrigin, setSelectedCountryOfOrigin] = useState('');
    const [selectedCountryOfFilming, setSelectedCountryOfFilming] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [genres, setGenres] = useState('');
    const [completionDate, setCompletionDate] = useState('');


    const [selectedCountry, setSelectedCountry] = useState("");

    const [value, setValue] = React.useState(null);

    const [isStudentProject, setIsStudentProject] = useState(false);


    const [filmColor, setFilmColor] = useState(formData?.specificationsInfo?.filmColor || '');
    const [studentProjectValue, setStudentProjectValue] = useState(formData?.specificationsInfo?.studentProject || '');
    const [isFirstTimeFilmmaker, setIsFirstTimeFilmmaker] = useState(formData?.specificationsInfo?.isFirstTimeFilmmaker || false);

    useEffect(() => {
        console.log('Project Type changed:', projectType);
    }, [projectType]);

    useEffect(() => {
        console.log('Runtime changed:', runtime);
    }, [runtime]);

    useEffect(() => {
        console.log('Completion Date changed:', inputValue);
    }, [inputValue]);

    useEffect(() => {
        console.log('Country of Origin changed:', selectedCountryOfOrigin);
    }, [selectedCountryOfOrigin]);

    useEffect(() => {
        console.log('Country of Filming changed:', selectedCountryOfFilming);
    }, [selectedCountryOfFilming]);


    useEffect(() => {
        console.log('Form data:', {
            projectType,
            runtime,
            completionDate,
            countryOfOrigin,
            countryOfFilming,
            language,
            shootingFormat,
            aspectRatio,
            genres,
            budget,
            currency,
            selectedCountryOfOrigin,
            selectedCountryOfFilming
        });
    }, [
        projectType, runtime, completionDate, countryOfOrigin,
        countryOfFilming, language, shootingFormat, aspectRatio,
        genres, budget, currency, selectedCountryOfOrigin, selectedCountryOfFilming
    ]);

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

    const handleRadioChange = (event) => {
        const value = event.target.value;
        setProjectType(value);

        // Call the parent's onInputChange function with the updated data
        const [filmColor, setFilmColor] = useState(formData?.specificationsInfo?.filmColor || '');

        // ... (other state declarations)

        useEffect(() => {
            onInputChange({
                projectType,
                runtime: getFormattedRuntime(),
                completionDate: inputValue,
                countryOfOrigin: selectedCountryOfOrigin,
                countryOfFilming: selectedCountryOfFilming,
                language,
                shootingFormat,
                aspectRatio,
                filmColor,
                studentProject: studentProjectValue === 'yes',
                isFirstTimeFilmmaker: isFirstTimeFilmmaker
            });
        }, [formData, projectType, runtime, inputValue, selectedCountryOfOrigin, selectedCountryOfFilming, language, shootingFormat, aspectRatio, filmColor, studentProjectValue, isFirstTimeFilmmaker]);
    };

    // Handle the input change
    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const targetId = target.id;

        switch (target.type) {
            case 'radio':
                if (value !== projectType) {
                    setProjectType(value);
                    console.log('Project type selected:', value);
                }
                break;
            case 'number':
                switch (targetId) {
                    case 'runtime_hours':
                        setRuntime(value);
                        break;
                    case 'runtime_minutes':
                        setTime(prevTime => ({ ...prevTime, minutes: parseInt(value) }));
                        break;
                    case 'runtime_seconds':
                        setTime(prevTime => ({ ...prevTime, seconds: parseInt(value) }));
                        break;
                    default:
                        console.warn('Unknown number input field');
                }
                break;
            default:
                switch (targetId) {
                    case 'completion-date':
                        setInputValue(format(new Date(), 'MMMM dd, yyyy'));
                        break;
                    case 'production_budget':
                        setBudget(value.replace(/[^0-9]/g, ''));
                        break;
                    case 'country_of_origin':
                        setSelectedCountryOfOrigin(target.value);
                        break;
                    case 'country_of_filming':
                        setSelectedCountryOfFilming(target.value);
                        break;
                    case 'language':
                        setLanguage(value);
                        break;
                    case 'shooting-format':
                        setShootingFormat(value);
                        break;
                    case 'aspect-ratio':
                        setAspectRatio(value);
                        break;
                    case 'genres':
                        setGenres(value);
                        break;
                    case 'runtime':
                        setRuntime(value);
                        break;
                    case 'film_color':
                        setFilmColor(event.target.value);
                        break;
                    case 'student_project':
                        setStudentProjectValue(event.target.value === 'yes');
                        break;
                    case 'first_time_filmmaker':
                        setIsFirstTimeFilmmaker(event.target.value === 'yes');
                        break;
                }
        }

        // Log state changes
        console.log('State changes:', {
            projectType,
            runtime,
            completionDate: inputValue,
            countryOfOrigin: selectedCountryOfOrigin,
            countryOfFilming: selectedCountryOfFilming,
            language,
            shootingFormat,
            aspectRatio,
            genres,
            budget,
            currency
        });

        // Call the parent's onInputChange function with the updated data
        onInputChange({
            projectType,
            runtime: getFormattedRuntime(),
            completionDate: inputValue,
            countryOfOrigin: selectedCountryOfOrigin,
            countryOfFilming: selectedCountryOfFilming,
            language,
            shootingFormat,
            aspectRatio,
            genres,
            budget,
            currency,
            filmColor,
            studentProject: isStudentProject,
            isFirstTimeFilmmaker: isFirstTimeFilmmaker
        });
    };

    const inputHandlers = {
        'completion-date': setInputValue,
        'production_budget': setBudget,
        'country_of_origin': setSelectedCountryOfOrigin,
        'country_of_filming': setSelectedCountryOfFilming,
        'language': setLanguage,
        'shooting-format': setShootingFormat,
        'aspect-ratio': setAspectRatio,
        'genres': setGenres,
        'runtime': setTime,
        'film_color': setFilmColor,
        'student_project': setStudentProjectValue,
        'first_time_filmmaker': setIsFirstTimeFilmmaker
    };


    // Handle the date selection from the calendar
    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setInputValue(format(date, 'MMMM dd, yyyy'));
        setIsCalendarOpen(false);
    };



    const handleBudgetChange = (e) => {
        const value = e.target.value;

        // Remove any non-digit characters
        const numericValue = value.replace(/[^0-9]/g, '');

        // Only set the value if it's a positive number or an empty string
        if (numericValue >= 0 || numericValue === '') {
            setBudget(numericValue);
        }
    };

    // Toggle the visibility of the calendar
    const toggleCalendar = () => {
        setIsCalendarOpen((prev) => !prev);
    };

    useEffect(() => {
        // This effect will run whenever the component mounts or when formData changes
        onInputChange(formData);
    }, [formData, onInputChange]);

    const getFormattedRuntime = () => {
        const { hours, minutes, seconds } = time;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleFormDataUpdate = (updatedData) => {
        setFilmColor(updatedData.filmColor || '');
        setStudentProjectValue(updatedData.studentProject || '');
        setIsFirstTimeFilmmaker(updatedData.isFirstTimeFilmmaker || false);
    };


    return (
        <div className="section-four text-left pt-16 pb-8">
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
                                name="project_type"
                                value="animation"
                                checked={projectType === "animation"}
                                id="project_type_animation"
                                onChange={(e) => handleInputChange(e, "animation")}
                            />
                            <label htmlFor="project_type_animation">Animation</label>
                        </div>

                        <div className="input optional radio">
                            <input
                                type="radio"
                                name="project_type"
                                value="experimental"
                                checked={projectType === "experimental"}
                                id="project_type_experimental"
                                onChange={(e) => handleInputChange(e, "experimental")}
                            />
                            <label htmlFor="project_type_experimental">Experimental</label>
                        </div>

                        <div className="input optional radio">
                            <input
                                type="radio"
                                name="project_type"
                                value="music_video"
                                checked={projectType === "music_video"}
                                id="project_type_music_video"
                                onChange={(e) => handleInputChange(e, "music_video")}
                            />
                            <label htmlFor="project_type_music_video">Music Video</label>
                        </div>

                        <div className="input optional radio">
                            <input
                                type="radio"
                                name="project_type"
                                value="student"
                                checked={projectType === "student"}
                                id="project_type_student"
                                onChange={(e) => handleInputChange(e, "student")}
                            />
                            <label htmlFor="project_type_student">Student</label>
                        </div>

                        <div className="input optional radio">
                            <input
                                type="radio"
                                name="project_type"
                                value="web_new_media"
                                checked={projectType === "web_new_media"}
                                id="project_type_web_new_media"
                                onChange={(e) => handleInputChange(e, "web_new_media")}
                            />
                            <label htmlFor="project_type_web_new_media">
                                Web / New Media
                            </label>
                        </div>
                    </div>
                    <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
                        <div className="input optional radio">
                            <input
                                type="radio"
                                name="project_type"
                                value="documentary"
                                checked={projectType === "documentary"}
                                id="project_type_documentary"
                                onChange={(e) => handleInputChange(e, "documentary")}
                            />
                            <label htmlFor="project_type_documentary">Documentary</label>
                        </div>

                        <div className="input optional radio">
                            <input
                                type="radio"
                                name="project_type"
                                value="feature"
                                checked={projectType === "feature"}
                                id="project_type_feature"
                                onChange={(e) => handleInputChange(e, "feature")}
                            />
                            <label htmlFor="project_type_feature">Feature</label>
                        </div>

                        <div className="input optional radio">
                            <input
                                type="radio"
                                name="project_type"
                                value="short"
                                checked={projectType === "short"}
                                id="project_type_short"
                                onChange={(e) => handleInputChange(e, "short")}
                            />
                            <label htmlFor="project_type_short">Short</label>
                        </div>

                        <div className="input optional radio">
                            <input
                                type="radio"
                                name="project_type"
                                value="television"
                                checked={projectType === "television"}
                                id="project_type_television"
                                onChange={(e) => handleInputChange(e, "television")}
                            />
                            <label htmlFor="project_type_television">Television</label>
                        </div>

                        <div className="input optional radio">
                            <input
                                type="radio"
                                name="project_type"
                                value="other"
                                checked={projectType === "other"}
                                id="project_type_other"
                                onChange={(e) => handleInputChange(e, "other")}
                            />
                            <label htmlFor="project_type_other">
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
                                    value={genres}
                                    onChange={handleInputChange}
                                    placeholder="Enter genres"
                                    id="genres"
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
                                    <label>Hours</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="23"
                                        value={time.hours}
                                        onChange={(e) => setTime({ ...time, hours: parseInt(e.target.value) })}
                                    />
                                </div>

                                <div className="input-container">
                                    <label>Minutes</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="59"
                                        value={time.minutes}
                                        onChange={(e) => setTime({ ...time, minutes: parseInt(e.target.value) })}
                                    />
                                </div>

                                <div className="input-container">
                                    <label>Seconds</label>
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
                                    id="completion-date"
                                    onClick={() => setIsCalendarOpen(true)}
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
                                    onChange={(e) => handleBudgetChange(e)}
                                    name="production_budget"
                                    id="production_budget"
                                    placeholder="Enter Budget"
                                    min="0"
                                    max="9999999999" // Set a high max value to allow large budgets
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
                                {countries.map((country) => (
                                    <option key={country.name} value={country.name}>
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
                                {countries.map((country) => (
                                    <option key={country.name} value={country.name}>
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
                                    value={language}
                                    onChange={handleInputChange}
                                    placeholder="Enter language"
                                    id="language"
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
                                    value={shootingFormat}
                                    onChange={handleInputChange}
                                    placeholder="Enter shooting format"
                                    id="shooting-format"
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
                                    value={aspectRatio}
                                    onChange={handleInputChange}
                                    placeholder="Enter aspect ratio"
                                    id="aspect-ratio"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="form-label grid-3 span-12-phone">
                            Film Color
                        </div>
                        <div className="film-field form-field radio-buttons span-3 span-8-tablet span-12-phone">
                            <select
                                value={formData?.specificationsInfo?.filmColor || filmColor}
                                onChange={(e) => handleFormDataUpdate({ ...formData.specificationsInfo, filmColor: e.target.value })}
                            >
                                <option value="">Select Film Color</option>
                                <option value="color">Color</option>
                                <option value="black_and_white">Black & White</option>
                                <option value="color_and_black_and_white">Color, Black & White</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="form-label grid-3 span-12-phone">
                            Student Project
                        </div>
                        <div className="film-field form-field radio-buttons span-6 span-8-tablet span-12-phone">
                            <select
                                value={formData?.specificationsInfo?.studentProject || studentProjectValue}
                                onChange={(e) => handleFormDataUpdate({ ...formData.specificationsInfo, studentProject: e.target.value })}
                            >
                                <option value="">Select Yes or No</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="form-label grid-3 span-12-phone">
                            First Time Film-maker
                        </div>
                        <div className="film-field form-field radio-buttons span-6 span-8-tablet span-12-phone">
                            <select
                                value={formData?.specificationsInfo?.isFirstTimeFilmmaker || isFirstTimeFilmmaker}
                                onChange={(e) => handleFormDataUpdate({ ...formData.specificationsInfo, isFirstTimeFilmmaker: e.target.value })}
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
    );
}

export default SpecificationsInfo;