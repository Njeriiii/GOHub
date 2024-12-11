import React, { useState, useCallback } from 'react';
import Select from 'react-select';
import { Search, X, ChevronDown } from 'lucide-react';
import { Translate, DynamicTranslate, useTranslation } from '../contexts/TranslationProvider';
import { STATIC_PHRASES } from './utils/translationConstants';

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
        { value: 'Education', label: <DynamicTranslate>Education</DynamicTranslate> },
        { value: 'Health', label: <DynamicTranslate>Health</DynamicTranslate> },
        { value: 'Environment', label: <DynamicTranslate>Environment</DynamicTranslate> },
        { value: 'Human Rights', label: <DynamicTranslate>Human Rights</DynamicTranslate> },
        { value: 'Poverty Alleviation', label: <DynamicTranslate>Poverty Alleviation</DynamicTranslate> },
        { value: 'Gender Equality', label: <DynamicTranslate>Gender Equality</DynamicTranslate> },
        { value: 'Children & Youth', label: <DynamicTranslate>Children & Youth</DynamicTranslate> },
        { value: 'Disaster Relief', label: <DynamicTranslate>Disaster Relief</DynamicTranslate> },
        { value: 'Community Development', label: <DynamicTranslate>Community Development</DynamicTranslate> },
        { value: 'Arts & Culture', label: <DynamicTranslate>Arts & Culture</DynamicTranslate> }
    ];

    const techSkillOptions = [
        { value: 'webdevelopment', label: <DynamicTranslate>Web Development</DynamicTranslate> },
        { value: 'photography', label: <DynamicTranslate>Photography</DynamicTranslate> },
        { value: 'graphicdesign', label: <DynamicTranslate>Graphic Design</DynamicTranslate> },
        { value: 'dataanalysis', label: <DynamicTranslate>Data Analysis</DynamicTranslate> },
        { value: 'videoproduction', label: <DynamicTranslate>Video Production</DynamicTranslate> },
        { value: 'digitalmarketing', label: <DynamicTranslate>Digital Marketing</DynamicTranslate> },
        { value: 'cybersecurity', label: <DynamicTranslate>Cybersecurity</DynamicTranslate> },
        { value: '3dmodeling', label: <DynamicTranslate>3D Modeling</DynamicTranslate> },
        { value: 'soundengineering', label: <DynamicTranslate>Sound Engineering</DynamicTranslate> },
        { value: 'uxuidesign', label: <DynamicTranslate>UX/UI Design</DynamicTranslate> }
    ];

    const nonTechSkillOptions = [
        { value: 'communication', label: <DynamicTranslate>Communication</DynamicTranslate> },
        { value: 'leadership', label: <DynamicTranslate>Leadership</DynamicTranslate> },
        { value: 'projectmanagement', label: <DynamicTranslate>Project Management</DynamicTranslate> },
        { value: 'publicspeaking', label: <DynamicTranslate>Public Speaking</DynamicTranslate> },
        { value: 'writing', label: <DynamicTranslate>Writing</DynamicTranslate> },
        { value: 'teamwork', label: <DynamicTranslate>Teamwork</DynamicTranslate> },
        { value: 'problemsolving', label: <DynamicTranslate>Problem Solving</DynamicTranslate> },
        { value: 'timemanagement', label: <DynamicTranslate>Time Management</DynamicTranslate> },
        { value: 'creativity', label: <DynamicTranslate>Creativity</DynamicTranslate> },
        { value: 'customerservice', label: <DynamicTranslate>Customer Service</DynamicTranslate> },
        { value: 'eventplanning', label: <DynamicTranslate>Event Planning</DynamicTranslate> },
        { value: 'fundraising', label: <DynamicTranslate>Fundraising</DynamicTranslate> },
        { value: 'mentoring', label: <DynamicTranslate>Mentoring</DynamicTranslate> },
        { value: 'conflictresolution', label: <DynamicTranslate>Conflict Resolution</DynamicTranslate> }
    ];

    // Group all skills together for the select input
    const skillOptions = [
        {
            label: <Translate>Technical Skills</Translate>,
            options: techSkillOptions
        },
        {
            label: <Translate>Non-Technical Skills</Translate>,
            options: nonTechSkillOptions
        }
    ];

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedFocusArea, setSelectedFocusArea] = useState(null);
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    const { currentLanguage } = useTranslation();

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
                        <Translate>Find Organizations</Translate>
                    </h2>
                    {searchResults.length > 0 && (
                        <span className="px-3 py-1 text-sm font-medium text-teal-800 bg-teal-50 rounded-full">
                            {searchResults.length} <Translate>{searchResults.length === 1 ? 'result' : 'results'}</Translate>
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
                                    placeholder={STATIC_PHRASES[currentLanguage]['Search organizations by name...']}
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
                        <span className="font-bold text-xl">
                            <Translate>Advanced Filters</Translate>
                        </span>
                    </button>

                    {/* Filter Content */}
                    <div
                        className={`transition-all duration-200 ease-in-out overflow-hidden
                            ${isFiltersVisible ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <div>
                                <label className="block text-l font-bold text-teal-50 mb-2">
                                    <Translate>Focus Area</Translate>
                                </label>
                                <div className="relative backdrop-blur-sm">
                                    <Select
                                        isClearable
                                        value={selectedFocusArea}
                                        onChange={handleFocusAreaChange}
                                        options={focusAreaOptions}
                                        placeholder={<Translate>Select focus area...</Translate>}
                                        formatOptionLabel={(option) => option.label}
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
                                    <Translate>Skills Needed</Translate>
                                </label>
                                <div className="relative backdrop-blur-sm">
                                    <Select
                                        isClearable
                                        value={selectedSkill}
                                        onChange={handleSkillChange}
                                        options={skillOptions}
                                        placeholder={<Translate>Select skill...</Translate>}
                                        formatGroupLabel={(group) => group.label}
                                        formatOptionLabel={(option) => option.label}
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