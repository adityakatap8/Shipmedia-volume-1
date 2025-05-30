import React, { useState, useEffect } from 'react';
import "./index.css";
import { currencies } from './countries';
import { countries } from './countries';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { Autocomplete, TextField } from '@mui/material';

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
    const [selectedCountry, setSelectedCountry] = useState('');
    const [value, setValue] = React.useState(null);
    const [isStudentProject, setIsStudentProject] = useState(false);
    const [filmColor, setFilmColor] = useState(formData?.specificationsInfo?.filmColor || '');
    const [studentProjectValue, setStudentProjectValue] = useState(formData?.specificationsInfo?.studentProject || '');
    const [isFirstTimeFilmmaker, setIsFirstTimeFilmmaker] = useState(formData?.specificationsInfo?.isFirstTimeFilmmaker || false);
    const [rating, setRating] = useState('');
    const [numberOfEpisodes, setNumberOfEpisodes] = useState('');
    const [numberOfSeasons, setNumberOfSeasons] = useState('');



    const genresOptions = [
        { name: 'Action', id: 1 },
        { name: 'Adventure', id: 2 },
        { name: 'Animation', id: 3 },
        { name: 'Comedy', id: 4 },
        { name: 'Drama', id: 5 },
        { name: 'Fantasy', id: 6 },
        { name: 'Historical', id: 7 },
        { name: 'Horror', id: 8 },
        { name: 'Musical', id: 9 },
        { name: 'Mystery', id: 10 },
        { name: 'Romance', id: 11 },
        { name: 'Sci-Fi', id: 12 },
        { name: 'Thriller', id: 13 },
        { name: 'War', id: 14 },
        { name: 'Western', id: 15 },
        { name: 'Crime', id: 16 },
        { name: 'Documentary', id: 17 },
        { name: 'Family', id: 18 },
        { name: 'Film-Noir', id: 19 },
        { name: 'Reality', id: 20 },
        { name: 'Animation/Cartoon', id: 21 },
        { name: 'Biography', id: 22 },
        { name: 'Sports', id: 23 },
        { name: 'Experimental', id: 24 },
        { name: 'Short Film', id: 25 },
        { name: 'Indie', id: 26 },
        { name: 'LGBTQ+', id: 27 },
        { name: 'Cult', id: 28 },
        { name: 'Noir', id: 29 },
        { name: 'Psychological', id: 30 },
    ];

    const languageList = [
        "Afrikaans", "Albanian", "Amharic", "Arabic", "Armenian", "Azerbaijani", "Basque", "Belarusian",
        "Bengali", "Bosnian", "Bulgarian", "Burmese", "Catalan", "Cebuano", "Chinese", "Corsican",
        "Croatian", "Czech", "Danish", "Dutch", "English", "Esperanto", "Estonian", "Finnish",
        "French", "Frisian", "Galician", "Georgian", "German", "Greek", "Gujarati", "Haitian Creole",
        "Hausa", "Hawaiian", "Hebrew", "Hindi", "Hmong", "Hungarian", "Icelandic", "Igbo", "Indonesian",
        "Irish", "Italian", "Japanese", "Javanese", "Kannada", "Kazakh", "Khmer", "Kinyarwanda",
        "Korean", "Kurdish", "Kyrgyz", "Lao", "Latin", "Latvian", "Lithuanian", "Luxembourgish",
        "Macedonian", "Malagasy", "Malay", "Malayalam", "Maltese", "Maori", "Marathi", "Mongolian",
        "Nepali", "Norwegian", "Nyanja", "Odia", "Pashto", "Persian", "Polish", "Portuguese", "Punjabi",
        "Romanian", "Russian", "Samoan", "Scots Gaelic", "Serbian", "Sesotho", "Shona", "Sindhi",
        "Sinhala", "Slovak", "Slovenian", "Somali", "Spanish", "Sundanese", "Swahili", "Swedish",
        "Tagalog", "Tajik", "Tamil", "Tatar", "Telugu", "Thai", "Turkish", "Turkmen", "Ukrainian",
        "Urdu", "Uyghur", "Uzbek", "Vietnamese", "Welsh", "Xhosa", "Yiddish", "Yoruba", "Zulu"
    ];

    const [selectedGenres, setSelectedGenres] = useState([]);

    const handleSelectionChange = (selectedList, field) => {
        if (field === 'genres') {
            setSelectedGenres(selectedList);
        }
    };



    useEffect(() => {
        onInputChange({
            projectType,
            completionDate,
            language,
            genres: selectedGenres,
            rating,
            numberOfEpisodes,
            numberOfSeasons,
            runtime: getFormattedRuntime(),
        });
    }, [
        projectType, runtime, completionDate, countryOfOrigin,
        countryOfFilming, language, shootingFormat, aspectRatio,
        genres, budget, currency, selectedCountryOfOrigin, selectedCountryOfFilming, numberOfEpisodes,
        rating, numberOfSeasons
    ]);

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const targetId = target.id;

        switch (target.type) {
            case 'radio':
                if (value !== projectType) {
                    setProjectType(value);
                }
                break;

            case 'number':
                switch (targetId) {
                    case 'runtime_hours':
                        setTime(prevTime => ({ ...prevTime, hours: parseInt(value) || 0 }));
                        break;
                    case 'runtime_minutes':
                        setTime(prevTime => ({ ...prevTime, minutes: parseInt(value) || 0 }));
                        break;
                    case 'runtime_seconds':
                        setTime(prevTime => ({ ...prevTime, seconds: parseInt(value) || 0 }));
                        break;
                    case 'number_of_episodes':
                        setNumberOfEpisodes(value);
                        break;
                    case 'number_of_seasons':
                        setNumberOfSeasons(value);
                        break;

                    default:
                        console.warn('Unknown number input field:', targetId);
                }
                break;

            default:
                switch (targetId) {
                    case 'completion-date':
                        setCompletionDate(value);
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
                    default:
                        console.warn('Unknown text input field:', targetId);
                }
        }
    };


    const handleBudgetChange = (e) => {
        const value = e.target.value;
        const numericValue = value.replace(/[^0-9]/g, '');
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
                        <span>3</span>
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
                                value="feature_film"
                                checked={projectType === "feature_film"}
                                id="project_type_feature_film"
                                onChange={(e) => handleInputChange(e, "feature_film")}
                            />
                            <label htmlFor="project_type_feature_film">Feature Film</label>
                        </div>

                        <div className="input optional radio">
                            <input
                                type="radio"
                                name="project_type"
                                value="tv_show"
                                checked={projectType === "tv_show"}
                                id="project_type_tv_show"
                                onChange={(e) => handleInputChange(e, "tv_show")}
                            />
                            <label htmlFor="project_type_tv_show">TV Show</label>
                        </div>

                        <div className="input optional radio">
                            <input
                                type="radio"
                                name="project_type"
                                value="docu_series"
                                checked={projectType === "docu_series"}
                                id="project_type_docu_series"
                                onChange={(e) => handleInputChange(e, "docu_series")}
                            />
                            <label htmlFor="project_type_docu_series">Docu Series</label>
                        </div>

                        <div className="input optional radio">
                            <input
                                type="radio"
                                name="project_type"
                                value="web_series"
                                checked={projectType === "web_series"}
                                id="project_type_web_series"
                                onChange={(e) => handleInputChange(e, "web_series")}
                            />
                            <label htmlFor="project_type_web_series">Web Series</label>
                        </div>

                        <div className="input optional radio">
                            <input
                                type="radio"
                                name="project_type"
                                value="kids_content"
                                checked={projectType === "kids_content"}
                                id="project_type_kids_content"
                                onChange={(e) => handleInputChange(e, "kids_content")}
                            />
                            <label htmlFor="project_type_kids_content">Kids Content</label>
                        </div>
                    </div>

                    <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
                        <div className="input optional radio">
                            <input
                                type="radio"
                                name="project_type"
                                value="vertical_drama"
                                checked={projectType === "vertical_drama"}
                                id="project_type_vertical_drama"
                                onChange={(e) => handleInputChange(e, "vertical_drama")}
                            />
                            <label htmlFor="project_type_vertical_drama">Vertical Drama</label>
                        </div>

                        <div className="input optional radio">
                            <input
                                type="radio"
                                name="project_type"
                                value="micro_drama"
                                checked={projectType === "micro_drama"}
                                id="project_type_micro_drama"
                                onChange={(e) => handleInputChange(e, "micro_drama")}
                            />
                            <label htmlFor="project_type_micro_drama">Micro Drama</label>
                        </div>

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
                                value="short_film"
                                checked={projectType === "short_film"}
                                id="project_type_short_film"
                                onChange={(e) => handleInputChange(e, "short_film")}
                            />
                            <label htmlFor="project_type_short_film">Short Film</label>
                        </div>

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
                    </div>

                </div>
                <div className="form-sectionTwo">

                    <div className="form-section">
                        <div className="form-label grid-3 span-12-phone">
                            Genres

                        </div>
                        <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
                            <div className="input optional form-field-input">
                                <Autocomplete
                                    multiple
                                    options={genresOptions}
                                    value={selectedGenres}
                                    onChange={(event, newValue) => handleSelectionChange(newValue, 'genres')}
                                    getOptionLabel={(option) => option.name}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}

                                            placeholder="Genres"
                                            variant="outlined"
                                            fullWidth
                                            sx={{ backgroundColor: 'white', borderRadius: '4px' }}
                                        />
                                    )}
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
                                <select
                                    id="language"
                                    value={language}
                                    onChange={handleInputChange}
                                    className="language-dropdown text-black"
                                >
                                    <option value="">Select a language</option>
                                    {languageList.map((lang) => (
                                        <option key={lang} value={lang}>
                                            {lang}
                                        </option>
                                    ))}
                                </select>

                            </div>
                        </div>
                    </div>

                    <div className="section-One text-left text-white">
                        <div className="form-section">
                            <div className="form-label grid-3 span-12-phone">
                                Year of Release
                            </div>

                            <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone" style={{ width: "10px" }}>
                                <div className="input optional form-field-input">
                                    <select
                                        id="completion-date"
                                        value={completionDate}
                                        onChange={handleInputChange}
                                        style={{ width: "220px", padding: '10px', borderRadius: "10px", color: 'black', backgroundColor: 'white' }}
                                    >
                                        <option value="">Select Year</option>
                                        {Array.from({ length: 100 }, (_, i) => {
                                            const year = new Date().getFullYear() - i;
                                            return (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="form-sectionThree">
                        <div className="form-section">
                            <div className="form-label grid-3 span-12-phone">Rating</div>
                            <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone text-black">
                                <div className="input optional form-field-input">
                                    <select
                                        name="rating"
                                        id="rating"
                                        value={rating}
                                        onChange={handleInputChange}
                                        style={{ width: "340px", padding: '10px', borderRadius: "10px" }}
                                    >
                                        <option value="">Select rating</option>

                                        <optgroup label="🇺🇸 United States (MPA)">
                                            <option value="United States - G">G – General audiences – All ages admitted (United States)</option>
                                            <option value="United States - PG">PG – Parental guidance suggested (United States)</option>
                                            <option value="United States - PG-13">PG-13 – Some material may be inappropriate under 13 (United States)</option>
                                            <option value="United States - R">R – Under 17 requires adult (United States)</option>
                                            <option value="United States - NC-17">NC-17 – Adults only (United States)</option>
                                        </optgroup>

                                        <optgroup label="🇬🇧 United Kingdom (BBFC)">
                                            <option value="United Kingdom - U">U – Suitable for all (United Kingdom)</option>
                                            <option value="United Kingdom - PG">PG – Parental guidance (United Kingdom)</option>
                                            <option value="United Kingdom - 12A">12A – Under 12 must be accompanied (United Kingdom)</option>
                                            <option value="United Kingdom - 15">15 – 15 and over (United Kingdom)</option>
                                            <option value="United Kingdom - 18">18 – Adults only (United Kingdom)</option>
                                            <option value="United Kingdom - R18">R18 – Explicit content (United Kingdom)</option>
                                        </optgroup>

                                        <optgroup label="🇮🇳 India (CBFC)">
                                            <option value="India - U">U – Universal, all ages (India)</option>
                                            <option value="India - UA">UA – Parental guidance under 12 (India)</option>
                                            <option value="India - A">A – Adults only (India)</option>
                                            <option value="India - S">S – Specialized audience only (India)</option>
                                        </optgroup>

                                        <optgroup label="🇨🇦 Canada (CHVRS)">
                                            <option value="Canada - G">G – General (Canada)</option>
                                            <option value="Canada - PG">PG – Parental guidance (Canada)</option>
                                            <option value="Canada - 14A">14A – 14 and over, under 14 with adult (Canada)</option>
                                            <option value="Canada - 18A">18A – 18 and over, under 18 with adult (Canada)</option>
                                            <option value="Canada - R">R – 18+ only (Canada)</option>
                                            <option value="Canada - A">A – No minors admitted (Canada)</option>
                                        </optgroup>

                                        <optgroup label="🇦🇺 Australia (Classification Board)">
                                            <option value="Australia - G">G – General (Australia)</option>
                                            <option value="Australia - PG">PG – Parental guidance (Australia)</option>
                                            <option value="Australia - M">M – Mature (recommended 15+) (Australia)</option>
                                            <option value="Australia - MA15+">MA15+ – Under 15 must be accompanied (Australia)</option>
                                            <option value="Australia - R18+">R18+ – Restricted to 18+ (Australia)</option>
                                            <option value="Australia - X18+">X18+ – Explicit content (Australia)</option>
                                        </optgroup>

                                        <optgroup label="🇪🇺 European Union (PEGI)">
                                            <option value="PEGI - 3">PEGI 3 – Suitable for all (EU)</option>
                                            <option value="PEGI - 7">PEGI 7 – Mild content (EU)</option>
                                            <option value="PEGI - 12">PEGI 12 – Moderate content (EU)</option>
                                            <option value="PEGI - 16">PEGI 16 – Strong content (EU)</option>
                                            <option value="PEGI - 18">PEGI 18 – Explicit content (EU)</option>
                                        </optgroup>

                                        <optgroup label="🇩🇪 Germany (FSK)">
                                            <option value="Germany - 0">0 – All ages (Germany)</option>
                                            <option value="Germany - 6">6 – Ages 6 and over (Germany)</option>
                                            <option value="Germany - 12">12 – Ages 12 and over (Germany)</option>
                                            <option value="Germany - 16">16 – Ages 16 and over (Germany)</option>
                                            <option value="Germany - 18">18 – Adults only (Germany)</option>
                                        </optgroup>

                                        <optgroup label="🇫🇷 France (CNC)">
                                            <option value="France - U">U – Suitable for all (France)</option>
                                            <option value="France - 10">10 – Ages 10 and over (France)</option>
                                            <option value="France - 12">12 – Ages 12 and over (France)</option>
                                            <option value="France - 16">16 – Ages 16 and over (France)</option>
                                            <option value="France - 18">18 – Adults only (France)</option>
                                        </optgroup>
                                    </select>

                                </div>
                            </div>
                        </div>
                    </div>


                    {!["feature_film", "short_film", "documentary"].includes(projectType) && (
                        <>

  {/* Number of Seasons */}
                            <div className="form-section">
                                <div className="form-label grid-3 span-12-phone">Season Number</div>
                                <div className="form-field radio-buttons span-6 span-12-phone">
                                    <input
                                        type="number"
                                        id="number_of_seasons"
                                        value={numberOfSeasons}
                                        onChange={handleInputChange}
                                        placeholder="Enter number of seasons"
                                        style={{
                                            width: '220px',
                                            padding: '10px',
                                            borderRadius: '10px',
                                            color: 'black',
                                            backgroundColor: 'white',
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Number of Episodes */}
                            <div className="form-section">
                                <div className="form-label grid-3 span-12-phone">Number of Episodes</div>
                                <div className="form-field radio-buttons span-6 span-12-phone">
                                    <input
                                        type="number"
                                        id="number_of_episodes"
                                        value={numberOfEpisodes}
                                        onChange={handleInputChange}
                                        placeholder="Enter number of episodes"
                                        style={{
                                            width: '220px',
                                            padding: '10px',
                                            borderRadius: '10px',
                                            color: 'black',
                                            backgroundColor: 'white',
                                        }}
                                    />
                                </div>
                            </div>

                          
                        </>
                    )}



                    {/* Runtime */}
                    <div className="form-section">
                        <div className="form-label grid-3 span-12-phone">Duration (HH:MM:SS)</div>
                        <div className="form-field radio-buttons span-6 span-12-phone" style={{ display: 'inline', gap: '10px' }}>
                            <input
                                type="number"
                                id="runtime_hours"
                                value={time.hours}
                                onChange={handleInputChange}
                                placeholder="HH"
                                style={{
                                    width: '60px',
                                    padding: '10px',
                                    borderRadius: '10px',
                                    color: 'black',
                                    backgroundColor: 'white',
                                    textAlign: 'center',
                                    margin: '10px'// Optional: centers the text inside the input
                                }}
                                min={0}
                            />
                            <input
                                type="number"
                                id="runtime_minutes"
                                value={time.minutes}
                                onChange={handleInputChange}
                                placeholder="MM"
                                style={{
                                    width: '60px',
                                    padding: '10px',
                                    borderRadius: '10px',
                                    color: 'black',
                                    backgroundColor: 'white',
                                    textAlign: 'center', // Optional: centers the text inside the input
                                    margin: '10px'
                                }}
                                min={0}
                                max={59}
                            />
                            <input
                                type="number"
                                id="runtime_seconds"
                                value={time.seconds}
                                onChange={handleInputChange}
                                placeholder="SS"
                                style={{
                                    width: '60px',
                                    padding: '10px',
                                    borderRadius: '10px',
                                    color: 'black',
                                    backgroundColor: 'white',
                                    textAlign: 'center', // Optional: centers the text inside the input
                                    margin: '10px'
                                }}
                                min={0}
                                max={59}
                            />
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}

export default SpecificationsInfo;