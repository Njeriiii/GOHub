import React from 'react';
import { ScrollText, CheckCircle, AlertCircle, FileText, Users, Building, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import Header from '../components/Header';

// If you want to make the code more maintainable, you can define your constants:
const REGISTRATION_STEPS = [
    {
        title: "Formation meeting minutes",
        icon: FileText
    },
    {
        title: "Complete member list with details",
        icon: FileText
    },
    {
        title: "CBO Constitution",
        icon: FileText
    },
    {
        title: "ID copies of all members",
        icon: FileText
    },
    {
        title: "MOU (if applicable)",
        icon: FileText
    }
    ];

    const EstablishmentGuide = () => {
    return (
        <div className="min-h-screen bg-teal-50">
        <Header />
        {/* Header */}
        <header className="bg-teal-600 text-white py-8 px-4 shadow-lg">
            <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">CBO Registration Guide Kenya</h1>
            <p className="text-teal-100 text-lg">Complete guide to registering a Community Based Organization</p>
            </div>
        </header>

        {/* Registration Links Section */}
        <div className="max-w-4xl mx-auto px-4 mt-8">
            <Alert className="bg-teal-100 border-teal-600">
            <AlertDescription className="space-y-4">
                <h3 className="font-semibold text-xl text-teal-800 flex items-center">
                <ExternalLink className="mr-2" />
                Quick Links - Registration Portals
                </h3>
                <div className="space-y-2">
                <div>
                    <p className="font-medium text-lg text-teal-800">Step 1: Access eCitizen Portal's Registration of Community Based Organizations (CBOs)
                    </p>
                    <a 
                    href="https://accounts.ecitizen.go.ke/en/services/national/promotion-portal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 text-lg hover:text-teal-800 underline flex items-center"
                    >
                    eCitizen Portal <ExternalLink className="ml-1" size={16} />
                    </a>
                </div>
                <div>
                    <p className="font-medium text-lg text-teal-800">Step 2: Community Group Registration Form</p>
                    <a 
                    href="https://cdmis.socialprotection.go.ke:8002/selfregistration/communitygroupregistration"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 text-lg hover:text-teal-800 underline flex items-center"
                    >
                    Registration Portal <ExternalLink className="ml-1" size={16} />
                    </a>
                </div>
                </div>
            </AlertDescription>
            </Alert>
        </div>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
            {/* Definition Card */}
            <Card>
            <CardHeader>
                <CardTitle className="flex items-center text-teal-600">
                <Building className="mr-2" />
                What is a CBO?
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-700 mb-4">
                A Community Based Organization (CBO) is a registered non-governmental, non-profit, and 
                non-political organization working at the local level to address community needs and interests.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Formally registered', 'Independent from government', 'Non-profit focused', 'Community-driven'].map((item, index) => (
                    <div key={index} className="flex items-start">
                    <CheckCircle className="text-teal-600 mr-2 mt-1 flex-shrink-0" size={20} />
                    <span>{item}</span>
                    </div>
                ))}
                </div>
            </CardContent>
            </Card>

            {/* Registration Process */}
            <Card>
            <CardHeader>
                <CardTitle className="flex items-center text-teal-600">
                <ScrollText className="mr-2" />
                Registration Process
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                {/* Steps */}
                <div className="space-y-6">
                    <div className="border-l-4 border-teal-600 pl-4">
                    <h3 className="font-semibold text-lg mb-2">Step 1: eCitizen Account Setup</h3>
                    <ol className="list-decimal ml-4 space-y-2">
                        <li>Visit the eCitizen portal</li>
                        <li>Create an account if you don't have one</li>
                        <li>Click "Proceed to Service"</li>
                        <li>Navigate to Community Group Registration</li>
                    </ol>
                    </div>

                    <div className="border-l-4 border-teal-600 pl-4">
                    <h3 className="font-semibold text-lg mb-2">Step 2: Document Preparation</h3>
                    <ul className="space-y-2">
                        {REGISTRATION_STEPS.map((step, index) => (
                        <li key={index} className="flex items-center">
                            <step.icon className="text-teal-600 mr-2" size={16} />
                            {step.title}
                        </li>
                        ))}
                    </ul>
                    </div>

                    <div className="border-l-4 border-teal-600 pl-4">
                    <h3 className="font-semibold text-lg mb-2">Step 3: Payment and Submission</h3>
                    <ul className="space-y-2">
                        <li className="flex items-center">
                        <CheckCircle className="text-teal-600 mr-2" size={16} />
                        Pay registration fee (Ksh 5,000)
                        </li>
                        <li className="flex items-center">
                        <CheckCircle className="text-teal-600 mr-2" size={16} />
                        Submit all required documents
                        </li>
                        <li className="flex items-center">
                        <CheckCircle className="text-teal-600 mr-2" size={16} />
                        Attend mandatory training
                        </li>
                    </ul>
                    </div>
                </div>
                </div>
            </CardContent>
            </Card>

            {/* Post Registration Requirements */}
            <Card>
            <CardHeader>
                <CardTitle className="flex items-center text-teal-600">
                <AlertCircle className="mr-2" />
                Post-Registration Requirements
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                {[
                    { title: 'Annual Renewal', desc: 'Certificate must be renewed yearly' },
                    { title: 'Quarterly Reports', desc: 'Submit progress reports every quarter' },
                    { title: 'Record Access', desc: 'Maintain accessible records for authority review' }
                ].map((item, index) => (
                    <div key={index} className="flex items-start">
                    <CheckCircle className="text-teal-600 mr-2 mt-1" size={20} />
                    <div>
                        <h4 className="font-semibold">{item.title}</h4>
                        <p className="text-gray-600">{item.desc}</p>
                    </div>
                    </div>
                ))}
                </div>
            </CardContent>
            </Card>

            {/* Important Notes */}
            <Card>
            <CardHeader>
                <CardTitle className="flex items-center text-teal-600">
                <Users className="mr-2" />
                Important Notes
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="bg-teal-50 p-4 rounded-lg">
                <ul className="space-y-2">
                    {[
                    'Registration is handled at Sub-county level',
                    'Process typically takes several weeks',
                    'Available at all Sub-counties and 53 Huduma centers'
                    ].map((note, index) => (
                    <li key={index} className="flex items-start">
                        <AlertCircle className="text-teal-600 mr-2 mt-1" size={16} />
                        <span>{note}</span>
                    </li>
                    ))}
                </ul>
                </div>
            </CardContent>
            </Card>

            {/* New Required Documents Detail Card */}
            <Card>
            <CardHeader>
                <CardTitle className="flex items-center text-teal-600">
                <FileText className="mr-2" />
                Detailed Document Requirements
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                <div>
                    <h4 className="font-semibold text-teal-800 mb-2">Constitution Requirements</h4>
                    <ul className="space-y-2 ml-6 list-disc">
                    <li>Organization's name and physical address</li>
                    <li>Aims and objectives</li>
                    <li>Membership criteria and fees</li>
                    <li>Leadership structure and election procedures</li>
                    <li>Financial management procedures</li>
                    <li>Dispute resolution mechanisms</li>
                    <li>Asset management policies</li>
                    <li>Dissolution procedures</li>
                    </ul>
                </div>
                
                <div>
                    <h4 className="font-semibold text-teal-800 mb-2">Meeting Minutes Requirements</h4>
                    <ul className="space-y-2 ml-6 list-disc">
                    <li>Date, time, and venue of the meeting</li>
                    <li>List of attendees with signatures</li>
                    <li>Agenda items discussed</li>
                    <li>Election results (if applicable)</li>
                    <li>Resolution to register as a CBO</li>
                    <li>Appointed signatories for bank accounts</li>
                    </ul>
                </div>
                </div>
            </CardContent>
            </Card>

            {/* Financial Requirements Card */}
            <Card>
            <CardHeader>
                <CardTitle className="flex items-center text-teal-600">
                <AlertCircle className="mr-2" />
                Financial Management
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                <div className="bg-teal-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-teal-800 mb-2">Banking Requirements</h4>
                    <ul className="space-y-2">
                    <li className="flex items-start">
                        <CheckCircle className="text-teal-600 mr-2 mt-1" size={16} />
                        <span>Open a bank account in the CBO's name</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle className="text-teal-600 mr-2 mt-1" size={16} />
                        <span>Minimum of three signatories required</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle className="text-teal-600 mr-2 mt-1" size={16} />
                        <span>Annual financial reports must be maintained</span>
                    </li>
                    </ul>
                </div>
                
                <div className="bg-teal-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-teal-800 mb-2">Required Financial Records</h4>
                    <ul className="space-y-2">
                    <li className="flex items-start">
                        <CheckCircle className="text-teal-600 mr-2 mt-1" size={16} />
                        <span>Cash book</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle className="text-teal-600 mr-2 mt-1" size={16} />
                        <span>Receipt book</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle className="text-teal-600 mr-2 mt-1" size={16} />
                        <span>Payment vouchers</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle className="text-teal-600 mr-2 mt-1" size={16} />
                        <span>Bank statements</span>
                    </li>
                    </ul>
                </div>
                </div>
            </CardContent>
            </Card>

            {/* Governance Structure Card */}
            <Card>
            <CardHeader>
                <CardTitle className="flex items-center text-teal-600">
                <Users className="mr-2" />
                Required Governance Structure
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                <div>
                    <h4 className="font-semibold text-teal-800 mb-2">Mandatory Positions</h4>
                    <ul className="space-y-2">
                    <li className="flex items-start">
                        <CheckCircle className="text-teal-600 mr-2 mt-1" size={16} />
                        <div>
                        <span className="font-medium">Chairperson</span>
                        <p className="text-sm text-gray-600">Overall leadership and external representation</p>
                        </div>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle className="text-teal-600 mr-2 mt-1" size={16} />
                        <div>
                        <span className="font-medium">Secretary</span>
                        <p className="text-sm text-gray-600">Record keeping and communication</p>
                        </div>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle className="text-teal-600 mr-2 mt-1" size={16} />
                        <div>
                        <span className="font-medium">Treasurer</span>
                        <p className="text-sm text-gray-600">Financial management and reporting</p>
                        </div>
                    </li>
                    </ul>
                </div>
                </div>
            </CardContent>
            </Card>

            {/* Compliance and Reporting Card */}
            <Card>
            <CardHeader>
                <CardTitle className="flex items-center text-teal-600">
                <FileText className="mr-2" />
                Compliance and Reporting
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                <div>
                    <h4 className="font-semibold text-teal-800 mb-2">Quarterly Reports Must Include:</h4>
                    <ul className="space-y-2 ml-6 list-disc">
                    <li>Activities undertaken during the quarter</li>
                    <li>Financial statements</li>
                    <li>Challenges faced and solutions implemented</li>
                    <li>Planned activities for next quarter</li>
                    <li>Changes in leadership (if any)</li>
                    <li>Member participation records</li>
                    </ul>
                </div>
                
                <div className="mt-4">
                    <h4 className="font-semibold text-teal-800 mb-2">Annual Compliance Requirements:</h4>
                    <ul className="space-y-2 ml-6 list-disc">
                    <li>Annual General Meeting (AGM) minutes</li>
                    <li>Updated member register</li>
                    <li>Annual financial statements</li>
                    <li>Activity reports</li>
                    <li>Leadership changes documentation</li>
                    <li>Asset register updates</li>
                    </ul>
                </div>
                </div>
            </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center text-teal-600">
                    <Users className="mr-2" />
                    Best Practices for Your Organization's Success
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                    <p className="text-gray-700">Here are some helpful practices that can contribute to the success and sustainability of your organization:</p>

                    <div>
                        <h4 className="font-semibold text-teal-800 mb-2">1. Regular Meetings Keep Your Organization Active</h4>
                        <p className="text-gray-600 mb-2">Consider maintaining this meeting schedule:</p>
                        <ul className="space-y-2 ml-6 list-disc">
                        <li>Annual General Meeting (AGM) - Once per year for major decisions and elections</li>
                        <li>Executive Committee - Quarterly to review progress and plan activities</li>
                        <li>Member Meetings - Monthly or bi-monthly to maintain engagement</li>
                        <li>Special Meetings - As needed for urgent matters</li>
                        <li>Document all meetings with signed minutes for good record-keeping</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-teal-800 mb-2">2. Fair and Transparent Decision Making</h4>
                        <p className="text-gray-600 mb-2">Establish clear voting procedures such as:</p>
                        <ul className="space-y-2 ml-6 list-disc">
                        <li>Each member gets one vote to ensure equality</li>
                        <li>Use secret ballots for sensitive decisions like leadership elections</li>
                        <li>Aim for consensus on major decisions when possible</li>
                        <li>Keep proper records of all decisions made</li>
                        <li>Allow members to vote by proxy when they cannot attend</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-teal-800 mb-2">3. Leadership Rotation for Fresh Ideas</h4>
                        <p className="text-gray-600 mb-2">Consider these leadership practices:</p>
                        <ul className="space-y-2 ml-6 list-disc">
                        <li>Set reasonable term lengths (2-3 years recommended)</li>
                        <li>Encourage new leaders to step up regularly</li>
                        <li>Plan for leadership transition and mentoring</li>
                        <li>Maintain some experienced leaders while bringing in new ones</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-teal-800 mb-2">4. Managing Conflicts of Interest</h4>
                        <p className="text-gray-600 mb-2">Protect your organization's integrity by:</p>
                        <ul className="space-y-2 ml-6 list-disc">
                        <li>Encouraging open discussion about potential conflicts</li>
                        <li>Having members declare any business interests related to the organization</li>
                        <li>Creating clear procedures for handling conflicts when they arise</li>
                        <li>Documenting how conflicts were resolved</li>
                        <li>Reviewing conflict of interest policies annually</li>
                        </ul>
                    </div>

                    <div className="bg-teal-50 p-4 rounded-lg mt-4">
                        <p className="text-gray-700 italic">
                        Remember: These are suggestions based on best practices. Your organization can adapt them to better suit your specific needs and circumstances while staying within the legal requirements.
                        </p>
                    </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center text-teal-600">
                    <FileText className="mr-2" />
                    Sources
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                    <p className="text-gray-700">This guide has been compiled using information from official government sources and professional registrars:</p>
                    
                    <ul className="space-y-2">
                        <li className="flex items-start">
                        <ExternalLink className="text-teal-600 mr-2 mt-1" size={16} />
                        <div>
                            <a 
                            href="https://www.socialprotection.go.ke/services-group-registration"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-600 hover:text-teal-800 underline"
                            >
                            Ministry of Labour and Social Protection - Group Registration Services
                            </a>
                            <p className="text-gray-600 text-sm mt-1">Official government portal for CBO and group registration</p>
                        </div>
                        </li>
                        
                        <li className="flex items-start">
                        <ExternalLink className="text-teal-600 mr-2 mt-1" size={16} />
                        <div>
                            <a 
                            href="https://companysecretariesafrica.com/registering-community-based-organization/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-600 hover:text-teal-800 underline"
                            >
                            Company Secretaries Africa - CBO Registration Guide
                            </a>
                            <p className="text-gray-600 text-sm mt-1">Professional guidance on CBO registration process</p>
                        </div>
                        </li>
                    </ul>

                    <p className="text-sm text-gray-600 mt-4 italic">
                        Note: While we strive to keep this information up-to-date, requirements may change. Please verify current requirements with your local Social Development Office.
                    </p>
                    </div>
                </CardContent>
            </Card>
        </main>
        </div>
    );
};

export default EstablishmentGuide;