import { Button } from "@mui/material"
import { useState, useEffect } from "react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Breadcrumb from "../../components/breadcrumb/Breadcrumb"

// Simplified rights options
const rightsOptions = [
    "All Rights",
    "SVOD (Subscription Video on Demand)",
    "TVOD (Transactional Video on Demand)",
    "AVOD (Advertising Video on Demand)",
    "Broadcast Rights",
    "Cable Rights",
    "Television Broadcast Rights",
    "Theatrical Rights",
    "EST (Electronic Sell-Through) Rights",
    "DVD/Blu-ray Distribution Rights",
    "Home Video Rights",
    "Foreign Distribution Rights",
    "Airline/Ship Rights",
    "Merchandising Rights",
    "Music Rights",
    "Product Placement Rights",
    "Franchise/Sequel Rights",
    "Mobile Rights",
    "Interactive and Gaming Rights",
    "Script/Adaptation Rights",
    "Public Performance Rights",
    "Specialty and Festival Rights",
    "Digital Distribution",
    "Streaming Rights",
    "Video on Demand",
    "Free-to-Air Broadcast",
    "Pay Television",
    "Satellite Television",
    "IPTV Rights",
    "Mobile Distribution",
    "In-Flight Entertainment",
    "Hotel Distribution",
    "Educational Distribution",
    "Non-Theatrical Rights",
    "Digital Download",
    "Digital Rental",
    "Physical Rental",
    "Library Rights",
    "Archive Rights",
    "Festival Rights",
    "Awards Consideration",
    "Press Screening Rights",
    "Promotional Rights",
    "Marketing Rights",
    "Advertising Rights",
    "Soundtrack Rights",
    "Music Publishing",
    "Synchronization Rights",
    "Master Recording Rights",
    "Remake Rights",
    "Sequel Rights",
    "Prequel Rights",
    "Spin-off Rights",
    "Format Rights",
    "Adaptation Rights",
    "Translation Rights",
    "Dubbing Rights",
    "Subtitling Rights",
    "Closed Captioning Rights",
    "Audio Description Rights",
    "Social Media Rights",
    "YouTube Rights",
    "Facebook Rights",
    "Instagram Rights",
    "TikTok Rights",
    "Twitter Rights",
    "Podcast Rights",
    "Radio Rights",
    "Internet Radio Rights",
    "Gaming Rights",
    "Virtual Reality Rights",
    "Augmented Reality Rights",
    "NFT Rights",
    "Blockchain Rights",
    "Metaverse Rights",
]

const regionCountryMapping = {
    Worldwide: [],
    "North America": [
        "United States",
        "Canada",
        "Mexico",
        "Guatemala",
        "Belize",
        "El Salvador",
        "Honduras",
        "Nicaragua",
        "Costa Rica",
        "Panama",
    ],
    "South America": [
        "Brazil",
        "Argentina",
        "Chile",
        "Peru",
        "Colombia",
        "Venezuela",
        "Ecuador",
        "Bolivia",
        "Paraguay",
        "Uruguay",
        "Guyana",
        "Suriname",
        "French Guiana",
    ],
    Europe: [
        "United Kingdom",
        "Germany",
        "France",
        "Italy",
        "Spain",
        "Netherlands",
        "Belgium",
        "Switzerland",
        "Austria",
        "Sweden",
        "Norway",
        "Denmark",
        "Finland",
        "Poland",
        "Czech Republic",
        "Hungary",
        "Romania",
        "Bulgaria",
        "Greece",
        "Portugal",
        "Ireland",
        "Croatia",
        "Slovenia",
        "Slovakia",
        "Estonia",
        "Latvia",
        "Lithuania",
        "Luxembourg",
        "Malta",
        "Cyprus",
    ],
    "Asia Pacific": [
        "China",
        "Japan",
        "South Korea",
        "India",
        "Australia",
        "New Zealand",
        "Singapore",
        "Malaysia",
        "Thailand",
        "Indonesia",
        "Philippines",
        "Vietnam",
        "Taiwan",
        "Hong Kong",
        "Macau",
        "Cambodia",
        "Laos",
        "Myanmar",
        "Brunei",
        "Papua New Guinea",
        "Fiji",
        "Solomon Islands",
    ],
    "Middle East": [
        "Saudi Arabia",
        "United Arab Emirates",
        "Qatar",
        "Kuwait",
        "Bahrain",
        "Oman",
        "Israel",
        "Turkey",
        "Iran",
        "Iraq",
        "Jordan",
        "Lebanon",
        "Syria",
        "Yemen",
        "Egypt",
    ],
    Africa: [
        "South Africa",
        "Nigeria",
        "Kenya",
        "Ghana",
        "Morocco",
        "Egypt",
        "Algeria",
        "Tunisia",
        "Ethiopia",
        "Tanzania",
        "Uganda",
        "Zimbabwe",
        "Botswana",
        "Namibia",
        "Zambia",
        "Malawi",
        "Mozambique",
        "Madagascar",
        "Mauritius",
        "Seychelles",
    ],
    "Latin America": [
        "Mexico",
        "Brazil",
        "Argentina",
        "Chile",
        "Peru",
        "Colombia",
        "Venezuela",
        "Ecuador",
        "Bolivia",
        "Paraguay",
        "Uruguay",
        "Guatemala",
        "Honduras",
        "El Salvador",
        "Nicaragua",
        "Costa Rica",
        "Panama",
        "Dominican Republic",
        "Cuba",
        "Jamaica",
        "Haiti",
        "Trinidad and Tobago",
    ],
    "Eastern Europe": [
        "Russia",
        "Ukraine",
        "Belarus",
        "Moldova",
        "Georgia",
        "Armenia",
        "Azerbaijan",
        "Kazakhstan",
        "Uzbekistan",
        "Turkmenistan",
        "Kyrgyzstan",
        "Tajikistan",
    ],
    Scandinavia: ["Sweden", "Norway", "Denmark", "Finland", "Iceland"],
    Benelux: ["Netherlands", "Belgium", "Luxembourg"],
    DACH: ["Germany", "Austria", "Switzerland"],
    "UK & Ireland": ["United Kingdom", "Ireland"],
    Iberia: ["Spain", "Portugal"],
    Balkans: ["Serbia", "Montenegro", "Bosnia and Herzegovina", "North Macedonia", "Albania", "Kosovo"],
}

const allUsageRights = ["Exclusive", "Non-Exclusive", "Exclusive & Non-Exclusive"]

const allContentCategories = [
    { id: "feature_film", name: "Feature Film" },
    { id: "short_film", name: "Short Films" },
    { id: "documentary_feature", name: "Documentary Feature" },
    { id: "documentary_short", name: "Documentary Short" },
    { id: "tv_series", name: "TV Series" },
    { id: "limited_series", name: "Limited Series" },
    { id: "mini_series", name: "Mini Series" },
    { id: "tv_movie", name: "TV Movie" },
    { id: "tv_special", name: "TV Special" },
    { id: "reality_tv", name: "Reality TV" },
    { id: "talk_show", name: "Talk Show" },
    { id: "game_show", name: "Game Show" },
    { id: "news_program", name: "News Program" },
    { id: "sports_program", name: "Sports Program" },
    { id: "children_program", name: "Children's Program" },
    { id: "animation_feature", name: "Animation Feature" },
    { id: "animation_series", name: "Animation Series" },
    { id: "animation_short", name: "Animation Short" },
    { id: "music_video", name: "Music Video" },
    { id: "concert_film", name: "Concert Film" },
    { id: "stand_up_comedy", name: "Stand-up Comedy" },
    { id: "variety_show", name: "Variety Show" },
    { id: "award_show", name: "Award Show" },
    { id: "commercial", name: "Commercial" },
    { id: "corporate_video", name: "Corporate Video" },
    { id: "training_video", name: "Training Video" },
    { id: "instructional_video", name: "Instructional Video" },
    { id: "web_series", name: "Web Series" },
    { id: "podcast", name: "Podcast" },
    { id: "audio_drama", name: "Audio Drama" },
    { id: "radio_show", name: "Radio Show" },
    { id: "live_stream", name: "Live Stream" },
    { id: "virtual_event", name: "Virtual Event" },
    { id: "interactive_content", name: "Interactive Content" },
    { id: "360_video", name: "360° Video" },
    { id: "vr_content", name: "VR Content" },
    { id: "ar_content", name: "AR Content" },
    { id: "gaming_content", name: "Gaming Content" },
    { id: "ugc", name: "User Generated Content" },
    { id: "social_media_content", name: "Social Media Content" },
    { id: "branded_content", name: "Branded Content" },
    { id: "sponsored_content", name: "Sponsored Content" },
];

const allLanguages = [
    "Akan", "Amharic", "Assamese", "Azerbaijani", "Awadhi", "Balochi", "Belarusian", "Bengali", "Bhojpuri",
    "Burmese", "Cebuano", "Chewa", "Chhattisgarhi", "Chittagonian", "Czech", "Deccan", "Dhundhari", "Dutch",
    "Eastern Min", "Eastern Punjabi", "Eastern Yiddish", "Egyptian Arabic", "English", "French", "Fula", "Gan Chinese",
    "German", "Greek", "Gujarati", "Hakka Chinese", "Haryanvi", "Hausa", "Haitian Creole", "Hindi", "Hiligaynon",
    "Hmong", "Hungarian", "Igbo", "Ilocano", "Indonesian", "Iranian Persian", "Italian", "Japanese", "Javanese",
    "Jin Chinese", "Kannada", "Kazakh", "Khmer", "Kinyarwanda", "Konkani", "Korean", "Kurdish", "Magahi", "Magindanao",
    "Maithili", "Malayalam", "Malagasy", "Mandarin Chinese", "Marathi", "Marwari", "Min Chinese", "Min Nan Chinese",
    "Moroccan Arabic", "Mossi", "Nepali", "Northern Min", "Odia", "Oromo", "Portuguese", "Quechua", "Romanian",
    "Russian", "Saraiki", "Serbo-Croatian", "Shona", "Sindhi", "Sinhala", "Somali", "Spanish", "Standard Arabic",
    "Swahili", "Swedish", "Sylheti", "Tagalog", "Tamil", "Telugu", "Thai", "Turkish", "Turkmen", "Uyghur", "Urdu",
    "Uzbek", "Vietnamese", "Wu Chinese", "Xhosa", "Yue Chinese", "Zhuang", "Zulu"
]


const allGenres = [
    "Action",
    "Adventure",
    "Animation",
    "Biography",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "Film Noir",
    "History",
    "Horror",
    "Music",
    "Musical",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Short",
    "Sport",
    "Superhero",
    "Thriller",
    "War",
    "Western",
    "Adult",
    "Avant-garde",
    "Black Comedy",
    "Buddy",
    "Chick Flick",
    "Coming-of-Age",
    "Cult",
    "Dance",
    "Disaster",
    "Dystopian",
    "Epic",
    "Erotic",
    "Experimental",
    "Exploitation",
    "Fairy Tale",
    "Found Footage",
    "Gangster",
    "Gothic",
    "Heist",
    "Historical",
    "Holiday",
    "Independent",
    "Juvenile",
    "Legal",
    "Martial Arts",
    "Medical",
    "Mockumentary",
    "Monster",
    "Neo-Noir",
    "Parody",
    "Political",
    "Psychological",
    "Road Movie",
    "Romantic Comedy",
    "Satire",
    "Slasher",
    "Social Issues",
    "Spy",
    "Supernatural",
    "Surreal",
    "Survival",
    "Teen",
    "Time Travel",
    "Vampire",
    "Zombie",
    "Anthology",
    "Biographical",
    "Buddy Cop",
    "Caper",
    "Conspiracy",
    "Courtroom",
    "Cyberpunk",
    "Detective",
    "Ensemble",
    "Espionage",
    "Existential",
    "Feminist",
    "Giallo",
    "Gross-out",
    "Gun Fu",
    "Haunted House",
    "Historical Fiction",
    "Jungle",
    "Kitchen Sink",
    "Melodrama",
    "Mumblecore",
    "Naturalistic",
    "Noir",
    "Paranormal",
    "Period Piece",
    "Pirate",
    "Post-Apocalyptic",
    "Prison",
    "Procedural",
    "Propaganda",
    "Psychedelic",
    "Psychological Horror",
    "Revenge",
    "Screwball Comedy",
    "Serial Killer",
    "Space Opera",
    "Spaghetti Western",
    "Splatter",
    "Steampunk",
    "Stoner",
    "Sword and Sandal",
    "Techno-Thriller",
    "Torture Porn",
    "Urban Fantasy",
    "Vigilante",
    "Whodunit",
    "Workplace Comedy",
    "Zombie Comedy",
]

export default function Requirement() {
    const { user } = useSelector((state) => state.auth.user);
    const [activeTab, setActiveTab] = useState("create")
    const [viewMode, setViewMode] = useState("cards")
    const [savedRequirements, setSavedRequirements] = useState([])
    const [editingId, setEditingId] = useState(null)
    const [selectedRequirement, setSelectedRequirement] = useState(null)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")

    const [newContentCategory, setNewContentCategory] = useState("")
    const [newYear, setNewYear] = useState("")

    const [formData, setFormData] = useState({
        id: "",
        rights: "",
        includingRegions: [],
        excludingCountries: [],
        usageRights: "",
        contentCategory: [],
        languages: [],
        genres: [],
        yearOfRelease: [],
        createdAt: "",
    })

    const [availableCountries, setAvailableCountries] = useState([])
    const [newRegion, setNewRegion] = useState("")
    const [newCountry, setNewCountry] = useState("")
    const [newLanguage, setNewLanguage] = useState("")
    const [newGenre, setNewGenre] = useState("")



    const dispatch = useDispatch()
    const Navigate = useNavigate()

    const breadcrumbItems = [
        { label: "Deals", path: "/deals" },
        { label: "Create Requirement" },
    ];

    useEffect(() => {
        if (savedRequirements.length > 0 && activeTab === "create" && !editingId) {
            setActiveTab("view")
        }
    }, [savedRequirements.length])

    const handleGlobalRegionSelection = () => {
        const allRegions = Object.keys(regionCountryMapping).filter((region) => region !== "Worldwide")
        setFormData((prev) => ({
            ...prev,
            includingRegions: ["Worldwide", ...allRegions],
        }))
    }

    const addToArray = (array, value, setter) => {
        if (value && !array.includes(value)) {
            setter([...array, value])
        }
    }

    const removeFromArray = (array, value, setter) => {
        setter(array.filter((item) => item !== value))
    }

    const handleUsageRightChange = (event) => {
        setFormData((prev) => ({
            ...prev,
            usageRights: event.target.value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const requirement = {
            ...formData,
            id: editingId || Date.now().toString(),
            createdAt: editingId ? formData.createdAt : new Date().toISOString(),
        }

        let updatedRequirements
        if (editingId) {
            updatedRequirements = savedRequirements.map((req) => (req.id === editingId ? requirement : req))
            setEditingId(null)
        } else {
            updatedRequirements = [...savedRequirements, requirement]
        }

        setSavedRequirements(updatedRequirements)

        setSnackbarMessage(editingId ? "Requirement updated successfully!" : "Requirement saved successfully!")
        setSnackbarOpen(true)
        setActiveTab("view")

        // Prepare the payload for the API
        const payload = {
            senderId: user?._id,
            receiverId:
                user?.role === "Admin"
                    ? ""
                    : user?.createdBy,
            rights: formData.rights,
            usageRights: formData.usageRights,
            includingRegions: formData.includingRegions,
            excludingCountries: formData.excludingCountries,
            contentCategory: formData.contentCategory,
            languages: formData.languages,
            genre: formData.genres,
            yearOfRelease: formData.yearOfRelease,// Add remarks if applicable
            status: user.role === "Admin" ? "pending" : "submitted_by_buyer",
        }

        console.log("Payload to be sent:", payload)

        try {
            // Call the API
            const response = await axios.post("https://www.mediashippers.com/api/deal/create", payload)

            if (response.status === 201) {
                const remainingMovies = response.data.remainingMovies || []


                // Navigate to deals page
                Navigate("/deals")
            } else {
                console.error("Unexpected response status:", response.status)
            }
        } catch (error) {
            console.error("Error submitting form:", error)
        }
        setFormData({
            id: "",
            rights: "",
            includingRegions: [],
            excludingCountries: [],
            usageRights: "",
            contentCategory: [],
            languages: [],
            genres: [],
            yearOfRelease: [],
            createdAt: "",
        })
    }

    const handleEdit = (requirement) => {
        setFormData(requirement)
        setEditingId(requirement.id)
        setActiveTab("create")
    }

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this requirement?")) {
            const updatedRequirements = savedRequirements.filter((req) => req.id !== id)
            setSavedRequirements(updatedRequirements)
            setSnackbarMessage("Requirement deleted successfully!")
            setSnackbarOpen(true)
        }
    }

    const resetForm = () => {
        setFormData({
            id: "",
            rights: "",
            includingRegions: [],
            excludingCountries: [],
            usageRights: "",
            contentCategory: [],
            languages: [],
            genres: [],
            yearOfRelease: [],
            createdAt: "",
        })
        setEditingId(null)
    }

    const handleViewDetails = (requirement) => {
        setSelectedRequirement(requirement)
    }

    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
    }

    const formatArrayForTable = (arr, maxItems = 3) => {
        const arrayData = Array.isArray(arr) ? arr : arr ? [arr] : []
        if (arrayData.length === 0) return "None"
        if (arrayData.length <= maxItems) return arrayData.join(", ")
        return `${arrayData.slice(0, maxItems).join(", ")} +${arrayData.length - maxItems} more`
    }

    // Update available countries based on selected regions
    useEffect(() => {
        if (formData.includingRegions.includes("Worldwide") || formData.includingRegions.length === 0) {
            const allCountries = new Set()
            Object.values(regionCountryMapping).forEach((countries) => {
                countries.forEach((country) => allCountries.add(country))
            })
            setAvailableCountries(Array.from(allCountries).sort())
        } else if (formData.includingRegions.length > 0) {
            const countries = new Set()
            formData.includingRegions.forEach((region) => {
                if (regionCountryMapping[region]) {
                    regionCountryMapping[region].forEach((country) => {
                        countries.add(country)
                    })
                }
            })
            setAvailableCountries(Array.from(countries).sort())
        }
    }, [formData.includingRegions])

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
                padding: "16px",
            }}
        >
            <Breadcrumb items={breadcrumbItems} />
            {/* Header */}
            <div
                style={{
                    background: "rgba(30, 41, 59, 0.9)",
                    backdropFilter: "blur(10px)",
                    padding: "16px 24px",
                    marginBottom: "24px",
                    borderRadius: "12px",
                    border: "1px solid rgba(71, 85, 105, 0.3)",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div
                        style={{
                            padding: "12px",
                            background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                            borderRadius: "12px",
                        }}
                    >
                        <svg style={{ width: "32px", height: "32px", color: "white" }} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                        </svg>
                    </div>
                    <div>
                        <h1
                            style={{
                                fontSize: "1.5rem",
                                fontWeight: "bold",
                                background: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)",
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                color: "transparent",
                                margin: 0,
                            }}
                        >
                            Create Requirement
                        </h1>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    {editingId && (
                        <div
                            style={{
                                background: "rgba(251, 191, 36, 0.1)",
                                border: "1px solid rgba(251, 191, 36, 0.3)",
                                borderRadius: "8px",
                                padding: "16px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <span style={{ color: "#fbbf24", fontWeight: "500" }}>Editing Requirement</span>
                            <button
                                type="button"
                                onClick={resetForm}
                                style={{
                                    background: "transparent",
                                    border: "1px solid #6b7280",
                                    color: "#d1d5db",
                                    padding: "8px 16px",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                }}
                            >
                                Cancel Edit
                            </button>
                        </div>
                    )}

                    {/* Rights Section */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
                        <div
                            style={{
                                background: "rgba(30, 41, 59, 0.8)",
                                backdropFilter: "blur(10px)",
                                border: "1px solid rgba(71, 85, 105, 0.3)",
                                borderRadius: "12px",
                                padding: "24px",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                                <svg
                                    style={{ width: "20px", height: "20px", color: "#60a5fa" }}
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.1 16,12.7V16.2C16,16.8 15.4,17.3 14.8,17.3H9.2C8.6,17.3 8,16.8 8,16.2V12.7C8,12.1 8.6,11.5 9.2,11.5V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,10V11.5H13.5V10C13.5,8.7 12.8,8.2 12,8.2Z" />
                                </svg>
                                <h2 style={{ color: "white", fontSize: "1.5rem", fontWeight: "600", margin: 0, textAlign: "left" }}>Rights Management</h2>
                            </div>
                            <p style={{ color: "#9ca3af", marginBottom: "16px", textAlign: "left" }}>Define the type of rights being managed</p>
                            <div>
                                <label style={{ color: "#d1d5db", display: "block", marginBottom: "8px", textAlign: "left" }}>Rights</label>
                                <select
                                    value={formData.rights}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, rights: e.target.value }))}
                                    style={{
                                        width: "100%",
                                        background: "#374151",
                                        border: "1px solid #4b5563",
                                        color: "white",
                                        padding: "12px",
                                        borderRadius: "6px",
                                        fontSize: "1rem",
                                    }}
                                >
                                    <option value="">Select rights</option>
                                    {rightsOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {/* {user?.role === "Admin" && (
                            <div
                                style={{
                                    background: "rgba(30, 41, 59, 0.8)",
                                    backdropFilter: "blur(10px)",
                                    border: "1px solid rgba(71, 85, 105, 0.3)",
                                    borderRadius: "12px",
                                    padding: "24px",
                                    marginBottom: "24px"
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                                <svg
                                    style={{ width: "20px", height: "20px", color: "#f59e42" }}
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05C15.64 13.36 17 14.28 17 15.5V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                                </svg>
                                <label style={{ color: "#d1d5db", display: "block", marginBottom: "0", textAlign: "left", fontWeight: 600, fontSize: "1.25rem" }}>
                                    Buyers Management
                                </label>
                                </div>
                                <label style={{ color: "#d1d5db", display: "block", marginBottom: "8px", textAlign: "left" }}>
                                    Select Buyers
                                </label>
                                <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                                    <select
                                        value=""
                                        onChange={e => {
                                            const selectedId = e.target.value;
                                            if (selectedId && !selectedBuyers.includes(selectedId)) {
                                                setSelectedBuyers([...selectedBuyers, selectedId]);
                                            }
                                        }}
                                        style={{
                                            flex: 1,
                                            background: "#374151",
                                            border: "1px solid #4b5563",
                                            color: "white",
                                            padding: "12px",
                                            borderRadius: "6px",
                                        }}
                                    >
                                        <option value="">Select buyer</option>
                                        {buyers
                                            .filter(buyer => !selectedBuyers.includes(buyer._id))
                                            .map(buyer => (
                                                <option key={buyer._id} value={buyer._id}>
                                                    {buyer.orgName ? `${buyer.orgName} (${buyer.email})` : buyer.email}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                    {selectedBuyers.map(buyerId => {
                                        const buyer = buyers.find(b => b._id === buyerId);
                                        if (!buyer) return null;
                                        return (
                                            <span
                                                key={buyer._id}
                                                style={{
                                                    background: "rgba(59, 130, 246, 0.2)",
                                                    color: "#60a5fa",
                                                    border: "1px solid rgba(59, 130, 246, 0.3)",
                                                    padding: "4px 8px",
                                                    borderRadius: "6px",
                                                    fontSize: "0.875rem",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "4px",
                                                }}
                                            >
                                                {buyer.orgName ? `${buyer.orgName} (${buyer.email})` : buyer.email}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedBuyers(selectedBuyers.filter(id => id !== buyer._id))
                                                    }
                                                    style={{
                                                        background: "none",
                                                        border: "none",
                                                        color: "inherit",
                                                        cursor: "pointer",
                                                        padding: "0",
                                                        marginLeft: "4px",
                                                    }}
                                                >
                                                    <svg style={{ width: "12px", height: "12px" }} fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                                                    </svg>
                                                </button>
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )} */}
                    </div>

                    {/* Territories Section */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
                        {/* Including Regions */}
                        <div
                            style={{
                                background: "rgba(30, 41, 59, 0.8)",
                                backdropFilter: "blur(10px)",
                                border: "1px solid rgba(71, 85, 105, 0.3)",
                                borderRadius: "12px",
                                padding: "24px",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                                <svg
                                    style={{ width: "20px", height: "20px", color: "#10b981" }}
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M17.9,17.39C17.64,16.59 16.89,16 16,16H15V13A1,1 0 0,0 14,12H8V10H10A1,1 0 0,0 11,9V7H13A2,2 0 0,0 15,5V4.59C17.93,5.77 20,8.64 20,12C20,14.08 19.2,15.97 17.9,17.39M11,19.93C7.05,19.44 4,16.08 4,12C4,11.38 4.08,10.78 4.21,10.21L9,15V16A2,2 0 0,0 11,18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                                </svg>
                                <h3 style={{ color: "white", fontSize: "1.25rem", fontWeight: "600", margin: 0 }}>
                                    Including Regions
                                </h3>
                            </div>
                            <p style={{ color: "#9ca3af", marginBottom: "16px", textAlign: "left" }}>Regions where rights are applicable</p>
                            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                                <select
                                    value=""
                                    onChange={(e) => {
                                        const selectedRegion = e.target.value;
                                        if (selectedRegion === "Worldwide") {
                                            handleGlobalRegionSelection();
                                        } else {
                                            addToArray(formData.includingRegions, selectedRegion, (arr) =>
                                                setFormData((prev) => ({ ...prev, includingRegions: arr }))
                                            );
                                        }
                                    }}
                                    style={{
                                        flex: 1,
                                        background: "#374151",
                                        border: "1px solid #4b5563",
                                        color: "white",
                                        padding: "12px",
                                        borderRadius: "6px",
                                    }}
                                >
                                    <option value="">Select region</option>
                                    {Object.keys(regionCountryMapping).map((region) => (
                                        <option key={region} value={region}>
                                            {region}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                {formData.includingRegions.map((region) => (
                                    <span
                                        key={region}
                                        style={{
                                            background:
                                                region === "Worldwide"
                                                    ? "linear-gradient(to right, rgba(16, 185, 129, 0.3), rgba(59, 130, 246, 0.3))"
                                                    : "rgba(16, 185, 129, 0.2)",
                                            color: region === "Worldwide" ? "white" : "#10b981",
                                            border: `1px solid ${region === "Worldwide" ? "rgba(16, 185, 129, 0.5)" : "rgba(16, 185, 129, 0.3)"}`,
                                            padding: "4px 8px",
                                            borderRadius: "6px",
                                            fontSize: "0.875rem",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "4px",
                                            fontWeight: region === "Worldwide" ? "600" : "normal",
                                        }}
                                    >
                                        {region}
                                        {region === "Worldwide" && " 🌍"}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeFromArray(formData.includingRegions, region, (arr) =>
                                                    setFormData((prev) => ({ ...prev, includingRegions: arr })),
                                                )
                                            }
                                            style={{
                                                background: "none",
                                                border: "none",
                                                color: "inherit",
                                                cursor: "pointer",
                                                padding: "0",
                                                marginLeft: "4px",
                                            }}
                                        >
                                            <svg style={{ width: "12px", height: "12px" }} fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Excluding Countries */}
                        <div
                            style={{
                                background: "rgba(30, 41, 59, 0.8)",
                                backdropFilter: "blur(10px)",
                                border: "1px solid rgba(71, 85, 105, 0.3)",
                                borderRadius: "12px",
                                padding: "24px",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                                <svg
                                    style={{ width: "20px", height: "20px", color: "#ef4444" }}
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M17.9,17.39C17.64,16.59 16.89,16 16,16H15V13A1,1 0 0,0 14,12H8V10H10A1,1 0 0,0 11,9V7H13A2,2 0 0,0 15,5V4.59C17.93,5.77 20,8.64 20,12C20,14.08 19.2,15.97 17.9,17.39M11,19.93C7.05,19.44 4,16.08 4,12C4,11.38 4.08,10.78 4.21,10.21L9,15V16A2,2 0 0,0 11,18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                                </svg>
                                <h3 style={{ color: "white", fontSize: "1.25rem", fontWeight: "600", margin: 0 }}>
                                    Excluding Countries
                                </h3>
                            </div>
                            <p style={{ color: "#9ca3af", marginBottom: "16px", textAlign: "left" }}>Countries where rights are not applicable</p>
                            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                                <select
                                    value=""
                                    onChange={(e) => {
                                        const selectedCountry = e.target.value;
                                        addToArray(formData.excludingCountries, selectedCountry, (arr) =>
                                            setFormData((prev) => ({ ...prev, excludingCountries: arr }))
                                        );
                                    }}
                                    style={{
                                        flex: 1,
                                        background: "#374151",
                                        border: "1px solid #4b5563",
                                        color: "white",
                                        padding: "12px",
                                        borderRadius: "6px",
                                        maxHeight: "200px",
                                        overflowY: "auto",
                                    }}
                                >
                                    <option value="">Select country</option>
                                    {availableCountries.map((country) => (
                                        <option key={country} value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                {formData.excludingCountries.map((country) => (
                                    <span
                                        key={country}
                                        style={{
                                            background: "rgba(239, 68, 68, 0.2)",
                                            color: "#ef4444",
                                            border: "1px solid rgba(239, 68, 68, 0.3)",
                                            padding: "4px 8px",
                                            borderRadius: "6px",
                                            fontSize: "0.875rem",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "4px",
                                        }}
                                    >
                                        {country}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeFromArray(formData.excludingCountries, country, (arr) =>
                                                    setFormData((prev) => ({ ...prev, excludingCountries: arr })),
                                                )
                                            }
                                            style={{
                                                background: "none",
                                                border: "none",
                                                color: "inherit",
                                                cursor: "pointer",
                                                padding: "0",
                                                marginLeft: "4px",
                                            }}
                                        >
                                            <svg style={{ width: "12px", height: "12px" }} fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Usage Rights */}
                    <div
                        style={{
                            background: "rgba(30, 41, 59, 0.8)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(71, 85, 105, 0.3)",
                            borderRadius: "12px",
                            padding: "24px",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                            <svg
                                style={{ width: "20px", height: "20px", color: "#3b82f6" }}
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />
                            </svg>
                            <h3 style={{ color: "white", fontSize: "1.25rem", fontWeight: "600", margin: 0 }}>Usage Rights</h3>
                        </div>
                        <p style={{ color: "#9ca3af", marginBottom: "16px", textAlign: "left" }}>Select the exclusivity type for usage rights</p>
                        <div
                            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px" }}
                        >
                            {allUsageRights.map((right) => (
                                <div
                                    key={right}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px",
                                        padding: "16px",
                                        border: "1px solid #4b5563",
                                        borderRadius: "8px",
                                        background: formData.usageRights === right ? "rgba(59, 130, 246, 0.1)" : "transparent",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                    }}
                                    onClick={() => setFormData((prev) => ({ ...prev, usageRights: right }))}
                                >
                                    <input
                                        type="radio"
                                        id={right}
                                        name="usageRights"
                                        value={right}
                                        checked={formData.usageRights === right}
                                        onChange={handleUsageRightChange}
                                        style={{
                                            width: "20px",
                                            height: "20px",
                                            accentColor: "#3b82f6",
                                        }}
                                    />
                                    <label
                                        htmlFor={right}
                                        style={{
                                            color: "#d1d5db",
                                            cursor: "pointer",
                                            fontWeight: "500",
                                            fontSize: "1rem",
                                        }}
                                    >
                                        {right}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content Details */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
                        {/* Content Category */}
                        <div
                            style={{
                                background: "rgba(30, 41, 59, 0.8)",
                                backdropFilter: "blur(10px)",
                                border: "1px solid rgba(71, 85, 105, 0.3)",
                                borderRadius: "12px",
                                padding: "24px",
                            }}
                        >
                            <h3 style={{ color: "white", fontSize: "1.25rem", fontWeight: "600", margin: "0 0 8px 0", textAlign: "left" }}>
                                Content Category
                            </h3>
                            <p style={{ color: "#9ca3af", marginBottom: "16px", textAlign: "left" }}>Select multiple content categories</p>
                            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                                <select
                                    value=""
                                    onChange={(e) => {
                                        const selectedCategory = e.target.value;
                                        addToArray(formData.contentCategory, selectedCategory, (arr) =>
                                            setFormData((prev) => ({ ...prev, contentCategory: arr }))
                                        );
                                    }}
                                    style={{
                                        flex: 1,
                                        background: "#374151",
                                        border: "1px solid #4b5563",
                                        color: "white",
                                        padding: "12px",
                                        borderRadius: "6px",
                                    }}
                                >
                                    <option value="">Select category</option>
                                    {allContentCategories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "8px",
                                    maxHeight: "128px",
                                    overflowY: "auto",
                                }}
                            >
                                {formData.contentCategory.map((category) => (
                                    <span
                                        key={category}
                                        style={{
                                            background: "rgba(59, 130, 246, 0.2)",
                                            color: "#60a5fa",
                                            border: "1px solid rgba(59, 130, 246, 0.3)",
                                            padding: "4px 8px",
                                            borderRadius: "6px",
                                            fontSize: "0.875rem",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "4px",
                                        }}
                                    >
                                        {category}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeFromArray(formData.contentCategory, category, (arr) =>
                                                    setFormData((prev) => ({ ...prev, contentCategory: arr })),
                                                )
                                            }
                                            style={{
                                                background: "none",
                                                border: "none",
                                                color: "inherit",
                                                cursor: "pointer",
                                                padding: "0",
                                                marginLeft: "4px",
                                            }}
                                        >
                                            <svg style={{ width: "12px", height: "12px" }} fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Year of Release */}
                        <div
                            style={{
                                background: "rgba(30, 41, 59, 0.8)",
                                backdropFilter: "blur(10px)",
                                border: "1px solid rgba(71, 85, 105, 0.3)",
                                borderRadius: "12px",
                                padding: "24px",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                                <svg
                                    style={{ width: "20px", height: "20px", color: "#fbbf24" }}
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M19,3H18V1H16V3H8V1H6V3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19M5,6V5H19V6H5Z" />
                                </svg>
                                <h3 style={{ color: "white", fontSize: "1.25rem", fontWeight: "600", margin: 0, textAlign: "left" }}>
                                    Year of Release
                                </h3>
                            </div>
                            <p style={{ color: "#9ca3af", marginBottom: "16px", textAlign: "left" }}>Select multiple years of release</p>
                            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                                <select
                                    onChange={(e) => {
                                        const selectedYear = e.target.value;
                                        if (selectedYear && !formData.yearOfRelease.includes(selectedYear)) {
                                            setFormData((prev) => ({
                                                ...prev,
                                                yearOfRelease: [...prev.yearOfRelease, selectedYear],
                                            }));
                                        }
                                    }}
                                    defaultValue=""
                                    style={{
                                        flex: 1,
                                        background: "#374151",
                                        border: "1px solid #4b5563",
                                        color: "white",
                                        padding: "12px",
                                        borderRadius: "6px",
                                    }}
                                >
                                    <option value="" disabled>Select year</option>
                                    {Array.from({ length: 50 }, (_, i) => {
                                        const year = new Date().getFullYear() - i;
                                        return (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "8px",
                                    maxHeight: "128px",
                                    overflowY: "auto",
                                }}
                            >
                                {formData.yearOfRelease.map((year) => (
                                    <span
                                        key={year}
                                        style={{
                                            background: "rgba(251, 191, 36, 0.2)",
                                            color: "#fbbf24",
                                            border: "1px solid rgba(251, 191, 36, 0.3)",
                                            padding: "4px 8px",
                                            borderRadius: "6px",
                                            fontSize: "0.875rem",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "4px",
                                        }}
                                    >
                                        {year}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeFromArray(formData.yearOfRelease, year, (arr) =>
                                                    setFormData((prev) => ({ ...prev, yearOfRelease: arr }))
                                                )
                                            }
                                            style={{
                                                background: "none",
                                                border: "none",
                                                color: "inherit",
                                                cursor: "pointer",
                                                padding: "0",
                                                marginLeft: "4px",
                                            }}
                                        >
                                            <svg style={{ width: "12px", height: "12px" }} fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Languages and Genres */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
                        {/* Languages */}
                        <div
                            style={{
                                background: "rgba(30, 41, 59, 0.8)",
                                backdropFilter: "blur(10px)",
                                border: "1px solid rgba(71, 85, 105, 0.3)",
                                borderRadius: "12px",
                                padding: "24px",
                            }}
                        >
                            <h3 style={{ color: "white", fontSize: "1.25rem", fontWeight: "600", margin: "0 0 16px 0", textAlign: "left" }}>
                                Languages
                            </h3>
                            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                                <select
                                    value=""
                                    onChange={(e) => {
                                        const selectedLanguage = e.target.value;
                                        addToArray(formData.languages, selectedLanguage, (arr) =>
                                            setFormData((prev) => ({ ...prev, languages: arr }))
                                        );
                                    }}
                                    style={{
                                        flex: 1,
                                        background: "#374151",
                                        border: "1px solid #4b5563",
                                        color: "white",
                                        padding: "12px",
                                        borderRadius: "6px",
                                    }}
                                >
                                    <option value="">Select language</option>
                                    {allLanguages.map((lang) => (
                                        <option key={lang} value={lang}>
                                            {lang}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "8px",
                                    maxHeight: "128px",
                                    overflowY: "auto",
                                }}
                            >
                                {formData.languages.map((lang) => (
                                    <span
                                        key={lang}
                                        style={{
                                            background: "rgba(139, 92, 246, 0.2)",
                                            color: "#a78bfa",
                                            border: "1px solid rgba(139, 92, 246, 0.3)",
                                            padding: "4px 8px",
                                            borderRadius: "6px",
                                            fontSize: "0.875rem",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "4px",
                                        }}
                                    >
                                        {lang}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeFromArray(formData.languages, lang, (arr) =>
                                                    setFormData((prev) => ({ ...prev, languages: arr })),
                                                )
                                            }
                                            style={{
                                                background: "none",
                                                border: "none",
                                                color: "inherit",
                                                cursor: "pointer",
                                                padding: "0",
                                                marginLeft: "4px",
                                            }}
                                        >
                                            <svg style={{ width: "12px", height: "12px" }} fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Genres */}
                        <div
                            style={{
                                background: "rgba(30, 41, 59, 0.8)",
                                backdropFilter: "blur(10px)",
                                border: "1px solid rgba(71, 85, 105, 0.3)",
                                borderRadius: "12px",
                                padding: "24px",
                            }}
                        >
                            <h3 style={{ color: "white", fontSize: "1.25rem", fontWeight: "600", margin: "0 0 16px 0", textAlign: "left" }}>Genres</h3>
                            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                                <select
                                    value=""
                                    onChange={(e) => {
                                        const selectedGenre = e.target.value;
                                        addToArray(formData.genres, selectedGenre, (arr) =>
                                            setFormData((prev) => ({ ...prev, genres: arr }))
                                        );
                                    }}
                                    style={{
                                        flex: 1,
                                        background: "#374151",
                                        border: "1px solid #4b5563",
                                        color: "white",
                                        padding: "12px",
                                        borderRadius: "6px",
                                    }}
                                >
                                    <option value="">Select genre</option>
                                    {allGenres.map((genre) => (
                                        <option key={genre} value={genre}>
                                            {genre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "8px",
                                    maxHeight: "128px",
                                    overflowY: "auto",
                                }}
                            >
                                {formData.genres.map((genre) => (
                                    <span
                                        key={genre}
                                        style={{
                                            background: "rgba(249, 115, 22, 0.2)",
                                            color: "#fb923c",
                                            border: "1px solid rgba(249, 115, 22, 0.3)",
                                            padding: "4px 8px",
                                            borderRadius: "6px",
                                            fontSize: "0.875rem",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "4px",
                                        }}
                                    >
                                        {genre}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeFromArray(formData.genres, genre, (arr) => setFormData((prev) => ({ ...prev, genres: arr })))
                                            }
                                            style={{
                                                background: "none",
                                                border: "none",
                                                color: "inherit",
                                                cursor: "pointer",
                                                padding: "0",
                                                marginLeft: "4px",
                                            }}
                                        >
                                            <svg style={{ width: "12px", height: "12px" }} fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div style={{ display: "flex", justifyContent: "right" }}>
                        <Button
                            type="submit" variant="contained">Save Requirement</Button>
                        {/* <button
                            type="submit"
                            style={{
                                background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                                border: "none",
                                color: "white",
                                padding: "16px 32px",
                                fontSize: "1.125rem",
                                fontWeight: "600",
                                borderRadius: "8px",
                                cursor: "pointer",
                                boxShadow: "0 8px 32px rgba(59, 130, 246, 0.3)",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)"
                                e.currentTarget.style.boxShadow = "0 12px 40px rgba(59, 130, 246, 0.4)"
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)"
                                e.currentTarget.style.boxShadow = "0 8px 32px rgba(59, 130, 246, 0.3)"
                            }}
                        >
                            {editingId ? "Update Requirements" : "Save Requirements"}
                        </button> */}
                    </div>
                </form>
            </div>

            {/* Detailed View Modal */}
            {selectedRequirement && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "16px",
                        zIndex: 50,
                    }}
                >
                    <div
                        style={{
                            background: "#1e293b",
                            border: "1px solid #374151",
                            borderRadius: "12px",
                            maxWidth: "1024px",
                            width: "100%",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            padding: "24px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                marginBottom: "24px",
                            }}
                        >
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                                    <svg
                                        style={{ width: "20px", height: "20px", color: "#60a5fa" }}
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.1 16,12.7V16.2C16,16.8 15.4,17.3 14.8,17.3H9.2C8.6,17.3 8,16.8 8,16.2V12.7C8,12.1 8.6,11.5 9.2,11.5V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,10V11.5H13.5V10C13.5,8.7 12.8,8.2 12,8.2Z" />
                                    </svg>
                                    <h2 style={{ color: "white", fontSize: "1.5rem", fontWeight: "600", margin: 0 }}>
                                        {selectedRequirement.rights === "All Rights" ? (
                                            <span
                                                style={{
                                                    background: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)",
                                                    backgroundClip: "text",
                                                    WebkitBackgroundClip: "text",
                                                    color: "transparent",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                🌟 All Rights
                                            </span>
                                        ) : (
                                            selectedRequirement.rights || "Untitled Requirement"
                                        )}
                                    </h2>
                                </div>

                            </div>
                            <button
                                onClick={() => setSelectedRequirement(null)}
                                style={{
                                    background: "transparent",
                                    border: "1px solid #4b5563",
                                    color: "#d1d5db",
                                    padding: "8px",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                }}
                            >
                                <svg style={{ width: "16px", height: "16px" }} fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                                </svg>
                            </button>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                            <div
                                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}
                            >
                                <div>
                                    <h4 style={{ color: "#d1d5db", fontSize: "1.125rem", fontWeight: "600", marginBottom: "12px" }}>
                                        Content Information
                                    </h4>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.875rem" }}>
                                        <p style={{ color: "#9ca3af", margin: 0 }}>
                                            <span style={{ color: "#d1d5db", fontWeight: "500" }}>Category:</span>{" "}
                                            {Array.isArray(selectedRequirement.contentCategory)
                                                ? selectedRequirement.contentCategory.length > 0
                                                    ? selectedRequirement.contentCategory.join(", ")
                                                    : "Not specified"
                                                : selectedRequirement.contentCategory || "Not specified"}
                                        </p>
                                        <p style={{ color: "#9ca3af", margin: 0 }}>
                                            <span style={{ color: "#d1d5db", fontWeight: "500" }}>Year of Release:</span>{" "}
                                            {Array.isArray(selectedRequirement.yearOfRelease)
                                                ? selectedRequirement.yearOfRelease.length > 0
                                                    ? selectedRequirement.yearOfRelease.join(", ")
                                                    : "Not specified"
                                                : selectedRequirement.yearOfRelease || "Not specified"}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <h4 style={{ color: "#d1d5db", fontSize: "1.125rem", fontWeight: "600", marginBottom: "12px" }}>
                                        Territory Coverage
                                    </h4>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.875rem" }}>
                                        <p style={{ color: "#9ca3af", margin: 0 }}>
                                            <span style={{ color: "#d1d5db", fontWeight: "500" }}>Including Regions:</span>{" "}
                                            {selectedRequirement.includingRegions.length} selected
                                        </p>
                                        <p style={{ color: "#9ca3af", margin: 0 }}>
                                            <span style={{ color: "#d1d5db", fontWeight: "500" }}>Excluding Countries:</span>{" "}
                                            {selectedRequirement.excludingCountries.length} selected
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {selectedRequirement.includingRegions.length > 0 && (
                                <div>
                                    <h4 style={{ color: "#d1d5db", fontSize: "1.125rem", fontWeight: "600", marginBottom: "12px" }}>
                                        Including Regions
                                    </h4>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                        {selectedRequirement.includingRegions.map((region) => (
                                            <span
                                                key={region}
                                                style={{
                                                    background: "rgba(16, 185, 129, 0.2)",
                                                    color: "#10b981",
                                                    border: "1px solid rgba(16, 185, 129, 0.3)",
                                                    padding: "4px 8px",
                                                    borderRadius: "6px",
                                                    fontSize: "0.875rem",
                                                }}
                                            >
                                                {region}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedRequirement.excludingCountries.length > 0 && (
                                <div>
                                    <h4 style={{ color: "#d1d5db", fontSize: "1.125rem", fontWeight: "600", marginBottom: "12px" }}>
                                        Excluding Countries
                                    </h4>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                        {selectedRequirement.excludingCountries.map((country) => (
                                            <span
                                                key={country}
                                                style={{
                                                    background: "rgba(239, 68, 68, 0.2)",
                                                    color: "#ef4444",
                                                    border: "1px solid rgba(239, 68, 68, 0.3)",
                                                    padding: "4px 8px",
                                                    borderRadius: "6px",
                                                    fontSize: "0.875rem",
                                                }}
                                            >
                                                {country}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedRequirement.usageRights && (
                                <div>
                                    <h4 style={{ color: "#d1d5db", fontSize: "1.125rem", fontWeight: "600", marginBottom: "12px" }}>
                                        Usage Rights
                                    </h4>
                                    <span
                                        style={{
                                            background:
                                                selectedRequirement.usageRights === "Exclusive"
                                                    ? "rgba(59, 130, 246, 0.2)"
                                                    : selectedRequirement.usageRights === "Non-Exclusive"
                                                        ? "rgba(16, 185, 129, 0.2)"
                                                        : "rgba(139, 92, 246, 0.2)",
                                            color:
                                                selectedRequirement.usageRights === "Exclusive"
                                                    ? "#60a5fa"
                                                    : selectedRequirement.usageRights === "Non-Exclusive"
                                                        ? "#10b981"
                                                        : "#a78bfa",
                                            border: `1px solid ${selectedRequirement.usageRights === "Exclusive"
                                                ? "rgba(59, 130, 246, 0.3)"
                                                : selectedRequirement.usageRights === "Non-Exclusive"
                                                    ? "rgba(16, 185, 129, 0.3)"
                                                    : "rgba(139, 92, 246, 0.3)"
                                                }`,
                                            padding: "4px 8px",
                                            borderRadius: "6px",
                                            fontSize: "0.875rem",
                                        }}
                                    >
                                        {selectedRequirement.usageRights}
                                    </span>
                                </div>
                            )}

                            <div
                                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}
                            >
                                {selectedRequirement.languages.length > 0 && (
                                    <div>
                                        <h4 style={{ color: "#d1d5db", fontSize: "1.125rem", fontWeight: "600", marginBottom: "12px" }}>
                                            Languages ({selectedRequirement.languages.length})
                                        </h4>
                                        <div
                                            style={{
                                                display: "flex",
                                                flexWrap: "wrap",
                                                gap: "8px",
                                                maxHeight: "150px",
                                                overflowY: "auto",
                                            }}
                                        >
                                            {selectedRequirement.languages.map((lang) => (
                                                <span
                                                    key={lang}
                                                    style={{
                                                        background: "rgba(139, 92, 246, 0.2)",
                                                        color: "#a78bfa",
                                                        border: "1px solid rgba(139, 92, 246, 0.3)",
                                                        padding: "4px 8px",
                                                        borderRadius: "6px",
                                                        fontSize: "0.875rem",
                                                    }}
                                                >
                                                    {lang}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedRequirement.genres.length > 0 && (
                                    <div>
                                        <h4 style={{ color: "#d1d5db", fontSize: "1.125rem", fontWeight: "600", marginBottom: "12px" }}>
                                            Genres ({selectedRequirement.genres.length})
                                        </h4>
                                        <div
                                            style={{
                                                display: "flex",
                                                flexWrap: "wrap",
                                                gap: "8px",
                                                maxHeight: "150px",
                                                overflowY: "auto",
                                            }}
                                        >
                                            {selectedRequirement.genres.map((genre) => (
                                                <span
                                                    key={genre}
                                                    style={{
                                                        background: "rgba(249, 115, 22, 0.2)",
                                                        color: "#fb923c",
                                                        border: "1px solid rgba(249, 115, 22, 0.3)",
                                                        padding: "4px 8px",
                                                        borderRadius: "6px",
                                                        fontSize: "0.875rem",
                                                    }}
                                                >
                                                    {genre}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {(Array.isArray(selectedRequirement.contentCategory) ? selectedRequirement.contentCategory : []).length >
                                0 && (
                                    <div>
                                        <h4 style={{ color: "#d1d5db", fontSize: "1.125rem", fontWeight: "600", marginBottom: "12px" }}>
                                            Content Categories (
                                            {
                                                (Array.isArray(selectedRequirement.contentCategory) ? selectedRequirement.contentCategory : [])
                                                    .length
                                            }
                                            )
                                        </h4>
                                        <div
                                            style={{
                                                display: "flex",
                                                flexWrap: "wrap",
                                                gap: "8px",
                                                maxHeight: "150px",
                                                overflowY: "auto",
                                            }}
                                        >
                                            {(Array.isArray(selectedRequirement.contentCategory)
                                                ? selectedRequirement.contentCategory
                                                : []
                                            ).map((category) => (
                                                <span
                                                    key={category}
                                                    style={{
                                                        background: "rgba(59, 130, 246, 0.2)",
                                                        color: "#60a5fa",
                                                        border: "1px solid rgba(59, 130, 246, 0.3)",
                                                        padding: "4px 8px",
                                                        borderRadius: "6px",
                                                        fontSize: "0.875rem",
                                                    }}
                                                >
                                                    {category}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            {(Array.isArray(selectedRequirement.yearOfRelease) ? selectedRequirement.yearOfRelease : []).length >
                                0 && (
                                    <div>
                                        <h4 style={{ color: "#d1d5db", fontSize: "1.125rem", fontWeight: "600", marginBottom: "12px" }}>
                                            Years of Release (
                                            {(Array.isArray(selectedRequirement.yearOfRelease) ? selectedRequirement.yearOfRelease : []).length}
                                            )
                                        </h4>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                            {(Array.isArray(selectedRequirement.yearOfRelease) ? selectedRequirement.yearOfRelease : []).map(
                                                (year) => (
                                                    <span
                                                        key={year}
                                                        style={{
                                                            background: "rgba(251, 191, 36, 0.2)",
                                                            color: "#fbbf24",
                                                            border: "1px solid rgba(251, 191, 36, 0.3)",
                                                            padding: "4px 8px",
                                                            borderRadius: "6px",
                                                            fontSize: "0.875rem",
                                                        }}
                                                    >
                                                        {year}
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            )}

            {/* Snackbar for notifications */}
            {snackbarOpen && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "24px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "rgba(16, 185, 129, 0.9)",
                        color: "white",
                        padding: "12px 24px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                        zIndex: 1000,
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    <svg style={{ width: "20px", height: "20px" }} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                    </svg>
                    {snackbarMessage}
                    <button
                        onClick={() => setSnackbarOpen(false)}
                        style={{
                            background: "none",
                            border: "none",
                            color: "white",
                            cursor: "pointer",
                            padding: "0",
                            marginLeft: "8px",
                        }}
                    >
                        <svg style={{ width: "16px", height: "16px" }} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    )
}
