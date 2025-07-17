import { Button } from "@mui/material"
import { useState, useEffect } from "react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

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
    Global: [],
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
    "Feature Film",
    "Short Film",
    "Documentary Feature",
    "Documentary Short",
    "TV Series",
    "Limited Series",
    "Mini Series",
    "TV Movie",
    "TV Special",
    "Reality TV",
    "Talk Show",
    "Game Show",
    "News Program",
    "Sports Program",
    "Children's Program",
    "Educational Content",
    "Animation Feature",
    "Animation Series",
    "Animation Short",
    "Music Video",
    "Concert Film",
    "Stand-up Comedy",
    "Variety Show",
    "Award Show",
    "Commercial",
    "Corporate Video",
    "Training Video",
    "Instructional Video",
    "Web Series",
    "Podcast",
    "Audio Drama",
    "Radio Show",
    "Live Stream",
    "Virtual Event",
    "Interactive Content",
    "360° Video",
    "VR Content",
    "AR Content",
    "Gaming Content",
    "User Generated Content",
    "Social Media Content",
    "Branded Content",
    "Sponsored Content",
    "Infomercial",
    "Public Service Announcement",
    "Government Content",
    "Religious Content",
    "Cultural Content",
    "Historical Content",
    "Scientific Content",
    "Medical Content",
    "Legal Content",
    "Financial Content",
    "Real Estate Content",
    "Travel Content",
    "Food Content",
    "Fashion Content",
    "Beauty Content",
    "Fitness Content",
    "Health Content",
    "Lifestyle Content",
    "Technology Content",
    "Automotive Content",
    "Sports Content",
    "Esports Content",
]

const allLanguages = [
    "English",
    "Mandarin Chinese",
    "Hindi",
    "Spanish",
    "French",
    "Standard Arabic",
    "Bengali",
    "Russian",
    "Portuguese",
    "Indonesian",
    "Urdu",
    "German",
    "Japanese",
    "Swahili",
    "Marathi",
    "Telugu",
    "Turkish",
    "Tamil",
    "Yue Chinese",
    "Vietnamese",
    "Tagalog",
    "Wu Chinese",
    "Korean",
    "Iranian Persian",
    "Hausa",
    "Egyptian Arabic",
    "Thai",
    "Gujarati",
    "Jin Chinese",
    "Min Nan Chinese",
    "Kannada",
    "Italian",
    "Eastern Punjabi",
    "Bhojpuri",
    "Min Chinese",
    "Hakka Chinese",
    "Javanese",
    "Malayalam",
    "Moroccan Arabic",
    "Odia",
    "Maithili",
    "Burmese",
    "Eastern Yiddish",
    "Magahi",
    "Uzbek",
    "Sindhi",
    "Amharic",
    "Fula",
    "Romanian",
    "Oromo",
    "Igbo",
    "Azerbaijani",
    "Awadhi",
    "Gan Chinese",
    "Cebuano",
    "Dutch",
    "Kurdish",
    "Serbo-Croatian",
    "Malagasy",
    "Saraiki",
    "Nepali",
    "Sinhala",
    "Chittagonian",
    "Zhuang",
    "Khmer",
    "Turkmen",
    "Assamese",
    "Madurese",
    "Somali",
    "Marwari",
    "Magindanao",
    "Haryanvi",
    "Hungarian",
    "Chhattisgarhi",
    "Greek",
    "Chewa",
    "Deccan",
    "Akan",
    "Kazakh",
    "Northern Min",
    "Sylheti",
    "Zulu",
    "Czech",
    "Kinyarwanda",
    "Dhundhari",
    "Haitian Creole",
    "Eastern Min",
    "Ilocano",
    "Quechua",
    "Kirundi",
    "Swedish",
    "Hmong",
    "Shona",
    "Uyghur",
    "Hiligaynon",
    "Mossi",
    "Xhosa",
    "Belarusian",
    "Balochi",
    "Konkani",
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
    const { user } = useSelector((state) => state.auth);
    console.log("User from Redux:", user)
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

    useEffect(() => {
        if (savedRequirements.length > 0 && activeTab === "create" && !editingId) {
            setActiveTab("view")
        }
    }, [savedRequirements.length])

    const handleGlobalRegionSelection = () => {
        const allRegions = Object.keys(regionCountryMapping).filter((region) => region !== "Global")
        setFormData((prev) => ({
            ...prev,
            includingRegions: ["Global", ...allRegions],
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
            senderId: user?.user?._id,
            receiverId:
                user?.role === "Admin"
                    ? selectedBuyer._id
                    : user?.user?.createdBy,
            rights: formData.rights,
            usageRights: formData.usageRights,
            includingRegions: formData.includingRegions,
            excludingCountries: formData.excludingCountries,
            contentCategory: formData.contentCategory,
            languages: formData.languages,
            genre: formData.genres,
            yearOfRelease: formData.yearOfRelease,// Add remarks if applicable
            status: "submitted_by_buyer",
        }

        console.log("Payload to be sent:", payload)

        try {
            // Call the API
            const response = await axios.post("https://media-shippers-backend.vercel.app/api/deal/create", payload)

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
        if (formData.includingRegions.includes("Global") || formData.includingRegions.length === 0) {
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
                                    value={newRegion}
                                    onChange={(e) => setNewRegion(e.target.value)}
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
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (newRegion === "Global") {
                                            handleGlobalRegionSelection()
                                        } else {
                                            addToArray(formData.includingRegions, newRegion, (arr) =>
                                                setFormData((prev) => ({ ...prev, includingRegions: arr })),
                                            )
                                        }
                                        setNewRegion("")
                                    }}
                                    style={{
                                        background: "#10b981",
                                        border: "none",
                                        color: "white",
                                        padding: "12px",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                    }}
                                >
                                    <svg style={{ width: "16px", height: "16px" }} fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                                    </svg>
                                </button>
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                {formData.includingRegions.map((region) => (
                                    <span
                                        key={region}
                                        style={{
                                            background:
                                                region === "Global"
                                                    ? "linear-gradient(to right, rgba(16, 185, 129, 0.3), rgba(59, 130, 246, 0.3))"
                                                    : "rgba(16, 185, 129, 0.2)",
                                            color: region === "Global" ? "white" : "#10b981",
                                            border: `1px solid ${region === "Global" ? "rgba(16, 185, 129, 0.5)" : "rgba(16, 185, 129, 0.3)"}`,
                                            padding: "4px 8px",
                                            borderRadius: "6px",
                                            fontSize: "0.875rem",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "4px",
                                            fontWeight: region === "Global" ? "600" : "normal",
                                        }}
                                    >
                                        {region}
                                        {region === "Global" && " 🌍"}
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
                                    value={newCountry}
                                    onChange={(e) => setNewCountry(e.target.value)}
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
                                <button
                                    type="button"
                                    onClick={() => {
                                        addToArray(formData.excludingCountries, newCountry, (arr) =>
                                            setFormData((prev) => ({ ...prev, excludingCountries: arr })),
                                        )
                                        setNewCountry("")
                                    }}
                                    style={{
                                        background: "#ef4444",
                                        border: "none",
                                        color: "white",
                                        padding: "12px",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                    }}
                                >
                                    <svg style={{ width: "16px", height: "16px" }} fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                                    </svg>
                                </button>
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
                                    value={newContentCategory}
                                    onChange={(e) => setNewContentCategory(e.target.value)}
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
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => {
                                        addToArray(formData.contentCategory, newContentCategory, (arr) =>
                                            setFormData((prev) => ({ ...prev, contentCategory: arr })),
                                        )
                                        setNewContentCategory("")
                                    }}
                                    style={{
                                        background: "#3b82f6",
                                        border: "none",
                                        color: "white",
                                        padding: "12px",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                    }}
                                >
                                    <svg style={{ width: "16px", height: "16px" }} fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                                    </svg>
                                </button>
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
                                <h3 style={{ color: "white", fontSize: "1.25rem", fontWeight: "600", margin: 0, textAlign: "left" }}>Year of Release</h3>
                            </div>
                            <p style={{ color: "#9ca3af", marginBottom: "16px", textAlign: "left" }}>Select multiple years of release</p>
                            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                                <input
                                    type="number"
                                    min="1900"
                                    max="2030"
                                    value={newYear}
                                    onChange={(e) => setNewYear(e.target.value)}
                                    placeholder="Enter year"
                                    style={{
                                        flex: 1,
                                        background: "#374151",
                                        border: "1px solid #4b5563",
                                        color: "white",
                                        padding: "12px",
                                        borderRadius: "6px",
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (newYear && !formData.yearOfRelease.includes(newYear)) {
                                            setFormData((prev) => ({
                                                ...prev,
                                                yearOfRelease: [...prev.yearOfRelease, newYear],
                                            }))
                                            setNewYear("")
                                        }
                                    }}
                                    style={{
                                        background: "#fbbf24",
                                        border: "none",
                                        color: "white",
                                        padding: "12px",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                    }}
                                >
                                    <svg style={{ width: "16px", height: "16px" }} fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                                    </svg>
                                </button>
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
                                                    setFormData((prev) => ({ ...prev, yearOfRelease: arr })),
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
                                    value={newLanguage}
                                    onChange={(e) => setNewLanguage(e.target.value)}
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
                                <button
                                    type="button"
                                    onClick={() => {
                                        addToArray(formData.languages, newLanguage, (arr) =>
                                            setFormData((prev) => ({ ...prev, languages: arr })),
                                        )
                                        setNewLanguage("")
                                    }}
                                    style={{
                                        background: "#8b5cf6",
                                        border: "none",
                                        color: "white",
                                        padding: "12px",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                    }}
                                >
                                    <svg style={{ width: "16px", height: "16px" }} fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                                    </svg>
                                </button>
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
                                    value={newGenre}
                                    onChange={(e) => setNewGenre(e.target.value)}
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
                                <button
                                    type="button"
                                    onClick={() => {
                                        addToArray(formData.genres, newGenre, (arr) => setFormData((prev) => ({ ...prev, genres: arr })))
                                        setNewGenre("")
                                    }}
                                    style={{
                                        background: "#f97316",
                                        border: "none",
                                        color: "white",
                                        padding: "12px",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                    }}
                                >
                                    <svg style={{ width: "16px", height: "16px" }} fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                                    </svg>
                                </button>
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
                                <p style={{ color: "#9ca3af", margin: 0 }}>
                                    Created: {new Date(selectedRequirement.createdAt).toLocaleDateString()}
                                </p>
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
