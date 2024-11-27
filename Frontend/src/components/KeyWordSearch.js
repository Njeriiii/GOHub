import React, { useState, useCallback } from 'react';
import Select from 'react-select';
import { Search, X, ChevronDown } from 'lucide-react';


/**
 * KeyWordSearch Component
 * 
 * A search interface for filtering organizations based on:
 * - Organization name (text search)
 * - Focus areas (select from predefined list)
 * - Skills needed (select from technical and non-technical skills)
 * 
 * @param {Object} props
 * @param {Array<Object>} props.orgData - Array of organization objects
 * @param {Function} props.onSearchResults - Callback function that receives filtered results
 */
export default function KeyWordSearch({ orgData = [], onSearchResults }) {
    // Predefined options for focus areas and skills
    const focusAreaOptions = [
        { value: 'Education', label: 'Education' },
        { value: 'Health', label: 'Health' },
        { value: 'Environment', label: 'Environment' },
        { value: 'Human Rights', label: 'Human Rights' },
        { value: 'Poverty Alleviation', label: 'Poverty Alleviation' },
        { value: 'Gender Equality', label: 'Gender Equality' },
        { value: 'Children & Youth', label: 'Children & Youth' },
        { value: 'Disaster Relief', label: 'Disaster Relief' },
        { value: 'Community Development', label: 'Community Development' },
        { value: 'Arts & Culture', label: 'Arts & Culture' }
    ];

    const techSkillOptions = [
        { value: 'webdevelopment', label: 'Web Development' },
        { value: 'photography', label: 'Photography' },
        { value: 'graphicdesign', label: 'Graphic Design' },
        { value: 'dataanalysis', label: 'Data Analysis' },
        { value: 'videoproduction', label: 'Video Production' },
        { value: 'digitalmarketing', label: 'Digital Marketing' },
        { value: 'cybersecurity', label: 'Cybersecurity' },
        { value: '3dmodeling', label: '3D Modeling' },
        { value: 'soundengineering', label: 'Sound Engineering' },
        { value: 'uxuidesign', label: 'UX/UI Design' }
    ];

    const nonTechSkillOptions = [
        { value: 'communication', label: 'Communication' },
        { value: 'leadership', label: 'Leadership' },
        { value: 'projectmanagement', label: 'Project Management' },
        { value: 'publicspeaking', label: 'Public Speaking' },
        { value: 'writing', label: 'Writing' },
        { value: 'teamwork', label: 'Teamwork' },
        { value: 'problemsolving', label: 'Problem Solving' },
        { value: 'timemanagement', label: 'Time Management' },
        { value: 'creativity', label: 'Creativity' },
        { value: 'customerservice', label: 'Customer Service' },
        { value: 'eventplanning', label: 'Event Planning' },
        { value: 'fundraising', label: 'Fundraising' },
        { value: 'mentoring', label: 'Mentoring' },
        { value: 'conflictresolution', label: 'Conflict Resolution' }
    ];

    // Group all skills together for the select input
    const skillOptions = [
        {
            label: "Technical Skills",
            options: techSkillOptions
        },
        {
            label: "Non-Technical Skills",
            options: nonTechSkillOptions
        }
    ];

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedFocusArea, setSelectedFocusArea] = useState(null);
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);

    /**
     * Debounce helper function to limit the rate of search execution
     */
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    /**
     * Main search function that filters organizations based on search term and filters
     */
    const performSearch = useCallback(
        debounce((term, focusArea, skill) => {
            if (!term && !focusArea && !skill) {
                setSearchResults([]);
                onSearchResults(null);
                return;
            }

            const filteredOrgs = orgData.filter((org) => {
                // Name search
                const nameMatch = !term || 
                    (org?.org_name || '').toLowerCase().includes(term.toLowerCase());

                // Focus area filter
                const focusAreaMatch = !focusArea || 
                    (org?.focus_areas || []).some(area =>
                        area?.name === focusArea.value
                    );

                // Skills filter - matches against the database value
                const skillMatch = !skill ||
                    (org?.skills_needed || []).some(s =>
                        s?.skill === skill.value
                    );

                return nameMatch && focusAreaMatch && skillMatch;
            });

            setSearchResults(filteredOrgs);
            onSearchResults(filteredOrgs);
        }, 300),
        [orgData, onSearchResults]
    );

    // Event handlers
    const handleSearchChange = (event) => {
        const newTerm = event.target.value;
        setSearchTerm(newTerm);
        performSearch(newTerm, selectedFocusArea, selectedSkill);
    };

    const handleFocusAreaChange = (option) => {
        setSelectedFocusArea(option);
        performSearch(searchTerm, option, selectedSkill);
    };

    const handleSkillChange = (option) => {
        setSelectedSkill(option);
        performSearch(searchTerm, selectedFocusArea, option);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setSelectedFocusArea(null);
        setSelectedSkill(null);
        setSearchResults([]);
        onSearchResults(null);
    };

    // Custom styles for react-select
    const selectStyles = {
        container: (provided) => ({
            ...provided,
            position: 'relative',
        }),
        control: (base, state) => ({
            ...base,
            minHeight: '42px',
            backgroundColor: 'white',
            borderColor: state.isFocused ? '#0d9488' : '#e5e7eb',
            boxShadow: state.isFocused ? '0 0 0 2px rgba(13, 148, 136, 0.15)' : 'none',
            borderRadius: '0.75rem',
            '&:hover': {
                borderColor: state.isFocused ? '#0d9488' : '#d1d5db'
            }
        }),
        menu: (base) => ({
            ...base,
            position: 'static',
            marginTop: '4px',
            marginBottom: '4px',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
        }),
        menuList: (base) => ({
            ...base,
            maxHeight: '200px',
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected 
                ? '#0d9488'
                : state.isFocused 
                    ? '#f0fdfa'
                    : 'white',
            color: state.isSelected ? 'white' : '#374151',
            '&:active': {
                backgroundColor: state.isSelected ? '#0f766e' : '#ccfbf1'
            }
        })
    };

    return (
        <div className="bg-teal-600 rounded-xl">
            <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                        Find Organizations
                    </h2>
                    {searchResults.length > 0 && (
                        <span className="px-3 py-1 text-sm font-medium text-teal-800 bg-teal-50 rounded-full">
                            {searchResults.length} result{searchResults.length === 1 ? '' : 's'}
                        </span>
                    )}
                </div>

                {/* Search Input */}
                <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-teal-600" />
                    </div>
                    <input
                        type="text"
                        className="w-full pl-11 pr-11 py-3 text-gray-900 placeholder-gray-500 
                                    bg-white/95 border-0 rounded-xl
                                    focus:outline-none focus:ring-2 focus:ring-teal-400
                                    hover:bg-white transition-colors shadow-sm"
                        placeholder="Search organizations by name..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    {(searchTerm || selectedFocusArea || selectedSkill) && (
                        <button
                            onClick={handleClearSearch}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        >
                            <X className="h-5 w-5 text-gray-400 hover:text-teal-600 transition-colors" />
                        </button>
                    )}
                </div>

                {/* Filters Section */}
                <div className="space-y-4">
                    <button
                        onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                        className="flex items-center gap-2 text-sm text-teal-50 hover:text-white transition-colors"
                    >
                        <ChevronDown 
                            className={`h-4 w-4 transition-transform duration-200 
                                ${isFiltersVisible ? 'rotate-180' : ''}`}
                        />
                        <span className="font-bold text-xl">Advanced Filters</span>
                    </button>

                    {/* Filter Content */}
                    <div
                        className={`transition-all duration-200 ease-in-out overflow-hidden
                            ${isFiltersVisible ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <div>
                                <label className="block text-l font-bold text-teal-50 mb-2">
                                    Focus Area
                                </label>
                                <div className="relative backdrop-blur-sm">
                                    <Select
                                        isClearable
                                        value={selectedFocusArea}
                                        onChange={handleFocusAreaChange}
                                        options={focusAreaOptions}
                                        placeholder="Select focus area..."
                                        styles={selectStyles}
                                        theme={(theme) => ({
                                            ...theme,
                                            colors: {
                                                ...theme.colors,
                                                primary: '#0d9488',
                                                primary75: '#14b8a6',
                                                primary50: '#99f6e4',
                                                primary25: '#f0fdfa',
                                            },
                                        })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-l font-bold text-teal-50 mb-2">
                                    Skills Needed
                                </label>
                                <div className="relative backdrop-blur-sm">
                                    <Select
                                        isClearable
                                        value={selectedSkill}
                                        onChange={handleSkillChange}
                                        options={skillOptions}
                                        placeholder="Select skill..."
                                        styles={selectStyles}
                                        theme={(theme) => ({
                                            ...theme,
                                            colors: {
                                                ...theme.colors,
                                                primary: '#0d9488',
                                                primary75: '#14b8a6',
                                                primary50: '#99f6e4',
                                                primary25: '#f0fdfa',
                                            },
                                        })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}