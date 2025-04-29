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

    const [rating, setRating] = useState('');


    useEffect(() => {
        onInputChange({
            projectType,
            completionDate,
            language,
            genres,
            rating
        });
    }, [
        projectType, runtime, completionDate, countryOfOrigin,
        countryOfFilming, language, shootingFormat, aspectRatio,
        genres, budget, currency, selectedCountryOfOrigin, selectedCountryOfFilming, rating
    ]);




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
                        setCompletionDate(value); // Update completion date
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
                    case 'rating':
                        setRating(value);
                        break;

                }
        }

        // Log state changes
        console.log('State changes:', {
            projectType,
            completionDate,
            language,
            genres,
            rating
        });

        // Call the parent's onInputChange function with the updated data
      
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



    const getFormattedRuntime = () => {
        const { hours, minutes, seconds } = time;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };



    return (
        <div className="section-four text-left pt-16 pb-8">
            <div className="row submitter-row">
                <div className="submitter-container">
                    <h1 className="header-numbered">
                        <span>2</span>
                        Specifications
                    </h1>
                </div>

            </div>

            <div className="section-One text-left text-white">

                <div className="form-section">
                    <div className="form-label grid-3 span-12-phone">
                        Title Type
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

                    <div className="section-One text-left text-white">
                        <div className="form-section">
                            <div className="form-label grid-3 span-12-phone">
                                Completion Date
                            </div>

                            <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone" style={{ width: "10px" }}>
                                <div className="input optional form-field-input">
                                    <input
                                        type="date"
                                        value={completionDate}
                                        onChange={handleInputChange}
                                        id="completion-date"
                                        style={{ width: "220px" }}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="form-sectionThree">
                        <div className="form-section">
                            <div className="form-label grid-3 span-12-phone">
                                Rating
                            </div>
                            <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone text-black">
                                <div className="input optional form-field-input">
                                    <select
                                        name="rating"
                                        id="rating"
                                        value={rating}
                                        onChange={handleInputChange}

                                        style={{ width: "220px", padding: '10px', borderRadius: "10px" }}
                                    >
                                        <option value="">Select rating</option>
                                    
                                        <option value="G">G</option>
                                        <option value="PG">PG</option>
                                        <option value="PG-13">PG-13</option>
                                        <option value="R">R</option>
                                        <option value="NC-17">NC-17</option>
                                        <option value="Unrated / NR">Unrated / NR</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SpecificationsInfo;