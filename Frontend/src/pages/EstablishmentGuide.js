import React from 'react';
import { ScrollText, CheckCircle, AlertCircle, FileText, Users, Building, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import Header from '../components/Header';
import { DynamicTranslate } from '../contexts/TranslationProvider';

// If you want to make the code more maintainable, you can define your constants:
const REGISTRATION_STEPS = [
    {
        title: <DynamicTranslate>Formation of meeting minutes</DynamicTranslate>,
        icon: FileText
    },
    {
        title: <DynamicTranslate>Complete member list with details</DynamicTranslate>,
        icon: FileText
    },
    {
        title: <DynamicTranslate>CBO Constitution</DynamicTranslate>,
        icon: FileText
    },
    {
        title: <DynamicTranslate>ID copies of all members</DynamicTranslate>,
        icon: FileText
    },
    {
        title: <DynamicTranslate>MOU (if applicable)</DynamicTranslate>,
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
            <h1 className="text-3xl font-bold mb-2"><DynamicTranslate>CBO Registration Guide Kenya</DynamicTranslate></h1>
            <p className="text-teal-100 text-lg"><DynamicTranslate>Complete guide to registering a Community Based Organization</DynamicTranslate></p>
            </div>
        </header>

        {/* Registration Links Section */}
        <div className="max-w-4xl mx-auto px-4 mt-8">
            <Alert className="bg-teal-100 border-teal-600">
            <AlertDescription className="space-y-4">
                <h3 className="font-semibold text-xl text-teal-800 flex items-center">
                <ExternalLink className="mr-2" />
                <DynamicTranslate>Quick Links - Registration Portals</DynamicTranslate>
                </h3>
                <div className="space-y-2">
                <div>
                    <p className="font-medium text-lg text-teal-800">
                    <DynamicTranslate>
                        Step 1: Access eCitizen Portal's Registration of Community Based Organizations (CBOs)
                    </DynamicTranslate>
                    </p>
                    <a 
                    href="https://accounts.ecitizen.go.ke/en/services/national/promotion-portal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 text-lg hover:text-teal-800 underline flex items-center"
                    >
                    <DynamicTranslate>
                    eCitizen Portal 
                    </DynamicTranslate>
                    <ExternalLink className="ml-1" size={16} />
                    </a>
                </div>
                <div>
                    <p className="font-medium text-lg text-teal-800"><DynamicTranslate>Step 2: Community Group Registration Form</DynamicTranslate></p>
                    <a 
                    href="https://cdmis.socialprotection.go.ke:8002/selfregistration/communitygroupregistration"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 text-lg hover:text-teal-800 underline flex items-center"
                    ><DynamicTranslate>
                    Registration Portal </DynamicTranslate><ExternalLink className="ml-1" size={16} />
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
                <Building className="mr-2" /><DynamicTranslate>
                What is a CBO?
                </DynamicTranslate></CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-700 mb-4"><DynamicTranslate>
                A Community Based Organization (CBO) is a registered non-governmental, non-profit, and 
                non-political organization working at the local level to address community needs and interests.
                </DynamicTranslate></p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Formally registered', 'Independent from government', 'Non-profit focused', 'Community-driven'].map((item, index) => (
                    <div key={index} className="flex items-start">
                    <CheckCircle className="text-teal-600 mr-2 mt-1 flex-shrink-0" size={20} />
                    <span><DynamicTranslate>{item}</DynamicTranslate></span>
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
                <DynamicTranslate>
                Registration Process
                </DynamicTranslate>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                {/* Steps */}
                <div className="space-y-6">
                    <div className="border-l-4 border-teal-600 pl-4">
                    <h3 className="font-semibold text-lg mb-2"><DynamicTranslate>Step 1: eCitizen Account Setup</DynamicTranslate></h3>
                    <ol className="list-decimal ml-4 space-y-2">
                        <li><DynamicTranslate>Visit the eCitizen portal</DynamicTranslate></li>
                        <li><DynamicTranslate>Create an account if you don't have one</DynamicTranslate></li>
                        <li><DynamicTranslate>Click "Proceed to Service"</DynamicTranslate></li>
                        <li><DynamicTranslate>Navigate to Community Group Registration</DynamicTranslate></li>
                    </ol>
                    </div>

                    <div className="border-l-4 border-teal-600 pl-4">
                    <h3 className="font-semibold text-lg mb-2"><DynamicTranslate>Step 2: Document Preparation</DynamicTranslate></h3>
                    <ul className="space-y-2">
                        {REGISTRATION_STEPS.map((step, index) => (
                        <li key={index} className="flex items-center"><DynamicTranslate>
                            <step.icon className="text-teal-600 mr-2" size={16} />
                            {step.title}
                        </DynamicTranslate></li>
                        ))}
                    </ul>
                    </div>

                    <div className="border-l-4 border-teal-600 pl-4">
                    <h3 className="font-semibold text-lg mb-2"><DynamicTranslate>Step 3: Payment and Submission</DynamicTranslate></h3>
                    <ul className="space-y-2">
                        <li className="flex items-center">
                        <CheckCircle className="text-teal-600 mr-2" size={16} />
                        <DynamicTranslate>Pay registration fee (Ksh 5,000)</DynamicTranslate>
                        </li>
                        <li className="flex items-center">
                        <CheckCircle className="text-teal-600 mr-2" size={16} />
                        <DynamicTranslate>Submit all required documents</DynamicTranslate>
                        </li>
                        <li className="flex items-center">
                        <CheckCircle className="text-teal-600 mr-2" size={16} />
                        <DynamicTranslate>Attend mandatory training</DynamicTranslate>
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
                <DynamicTranslate>Post-Registration Requirements</DynamicTranslate>
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
                        <h4 className="font-semibold"><DynamicTranslate>{item.title}</DynamicTranslate></h4>
                        <p className="text-gray-600"><DynamicTranslate>{item.desc}</DynamicTranslate></p>
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
                <DynamicTranslate>
                Important Notes
                </DynamicTranslate>
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
                        <span><DynamicTranslate>{note}</DynamicTranslate></span>
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
                <DynamicTranslate>
                Detailed Document Requirements
                </DynamicTranslate>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                <div>
                    <h4 className="font-semibold text-teal-800 mb-2"><DynamicTranslate>Constitution Requirements</DynamicTranslate></h4>
                    <ul className="space-y-2 ml-6 list-disc">
                    <li><DynamicTranslate>Organization's name and physical address</DynamicTranslate></li>
                    <li><DynamicTranslate>Aims and objectives</DynamicTranslate></li>
                    <li><DynamicTranslate>Membership criteria and fees</DynamicTranslate></li>
                    <li><DynamicTranslate>Leadership structure and election procedures</DynamicTranslate></li>
                    <li><DynamicTranslate>Financial management procedures</DynamicTranslate></li>
                    <li><DynamicTranslate>Dispute resolution mechanisms</DynamicTranslate></li>
                    <li><DynamicTranslate>Asset management policies</DynamicTranslate></li>
                    <li><DynamicTranslate>Dissolution procedures</DynamicTranslate></li>
                    </ul>
                </div>
                
                <div>
                    <h4 className="font-semibold text-teal-800 mb-2"><DynamicTranslate>Meeting Minutes Requirements</DynamicTranslate></h4>
                    <ul className="space-y-2 ml-6 list-disc">
                    <li><DynamicTranslate>Date, time, and venue of the meeting</DynamicTranslate></li>
                    <li><DynamicTranslate>List of attendees with signatures</DynamicTranslate></li>
                    <li><DynamicTranslate>Agenda items discussed</DynamicTranslate></li>
                    <li><DynamicTranslate>Election results (if applicable)</DynamicTranslate></li>
                    <li><DynamicTranslate>Resolution to register as a CBO</DynamicTranslate></li>
                    <li><DynamicTranslate>Appointed signatories for bank accounts</DynamicTranslate></li>
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
                <DynamicTranslate>
                Financial Management
                </DynamicTranslate>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                <div className="bg-teal-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-teal-800 mb-2"><DynamicTranslate>Banking Requirements</DynamicTranslate></h4>
                    <ul className="space-y-2">
                    <li className="flex items-start">
                        <CheckCircle className="text-teal-600 mr-2 mt-1" size={16} />
                        <span><DynamicTranslate>Open a bank account in the CBO's name</DynamicTranslate></span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle className="text-teal-600 mr-2 mt-1" size={16} />
                        <span><DynamicTranslate>Minimum of three signatories required</DynamicTranslate></span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle className="text-teal-600 mr-2 mt-1" size={16} />
                        <span><DynamicTranslate>Annual financial reports must be maintained</DynamicTranslate></span>
                    </li>
                    </ul>
                </div>
                
                <div className="bg-teal-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-teal-800 mb-2"><DynamicTranslate>Required Financial Records</DynamicTranslate></h4>
                    <ul className="space-y-2">
                    <li className="flex items-start">
                        <CheckCircle className="text-teal-600 mr-2 mt-1" size={16} />
                        <span><DynamicTranslate>Cash book</DynamicTranslate></span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle className="text-teal-600 mr-2 mt-1" size={16} />
                        <span><DynamicTranslate>Receipt book</DynamicTranslate></span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle className="text-teal-600 mr-2 mt-1" size={16} />
                        <span><DynamicTranslate>Payment vouchers</DynamicTranslate></span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle className="text-teal-600 mr-2 mt-1" size={16} />
                        <span><DynamicTranslate>Bank statements</DynamicTranslate></span>
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
                <DynamicTranslate>
                Required Governance Structure
                </DynamicTranslate>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                <div>
                    <h4 className="font-semibold text-teal-800 mb-2"><DynamicTranslate>Mandatory Positions</DynamicTranslate></h4>
                    <ul className="space-y-2">
                    <li className="flex items-start">
                        <CheckCircle className="text-teal-600 mr-2 mt-1" size={16} />
                        <div>
                        <span className="font-medium"><DynamicTranslate>Chairperson</DynamicTranslate></span>
                        <p className="text-sm text-gray-600"><DynamicTranslate>Overall leadership and external representation</DynamicTranslate></p>
                        </div>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle className="text-teal-600 mr-2 mt-1" size={16} />
                        <div>
                        <span className="font-medium"><DynamicTranslate>Secretary</DynamicTranslate></span>
                        <p className="text-sm text-gray-600"><DynamicTranslate>Record keeping and communication</DynamicTranslate></p>
                        </div>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle className="text-teal-600 mr-2 mt-1" size={16} />
                        <div>
                        <span className="font-medium"><DynamicTranslate>Treasurer</DynamicTranslate></span>
                        <p className="text-sm text-gray-600"><DynamicTranslate>Financial management and reporting</DynamicTranslate></p>
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
                <DynamicTranslate>
                Compliance and Reporting
                </DynamicTranslate>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                <div>
                    <h4 className="font-semibold text-teal-800 mb-2"><DynamicTranslate>Quarterly Reports Must Include:</DynamicTranslate></h4>
                    <ul className="space-y-2 ml-6 list-disc">
                    <li><DynamicTranslate>Activities undertaken during the quarter</DynamicTranslate></li>
                    <li><DynamicTranslate>Financial statements</DynamicTranslate></li>
                    <li><DynamicTranslate>Challenges faced and solutions implemented</DynamicTranslate></li>
                    <li><DynamicTranslate>Planned activities for next quarter</DynamicTranslate></li>
                    <li><DynamicTranslate>Changes in leadership (if any)</DynamicTranslate></li>
                    <li><DynamicTranslate>Member participation records</DynamicTranslate></li>
                    </ul>
                </div>
                
                <div className="mt-4">
                    <h4 className="font-semibold text-teal-800 mb-2"><DynamicTranslate>Annual Compliance Requirements:</DynamicTranslate></h4>
                    <ul className="space-y-2 ml-6 list-disc">
                    <li><DynamicTranslate>Annual General Meeting (AGM) minutes</DynamicTranslate></li>
                    <li><DynamicTranslate>Updated member register</DynamicTranslate></li>
                    <li><DynamicTranslate>Annual financial statements</DynamicTranslate></li>
                    <li><DynamicTranslate>Activity reports</DynamicTranslate></li>
                    <li><DynamicTranslate>Leadership changes documentation</DynamicTranslate></li>
                    <li><DynamicTranslate>Asset register updates</DynamicTranslate></li>
                    </ul>
                </div>
                </div>
            </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center text-teal-600">
                    <Users className="mr-2" />
                    <DynamicTranslate>
                    Best Practices for Your Organization's Success
                    </DynamicTranslate>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                    <p className="text-gray-700"><DynamicTranslate>Here are some helpful practices that can contribute to the success and sustainability of your organization:</DynamicTranslate></p>

                    <div>
                        <h4 className="font-semibold text-teal-800 mb-2"><DynamicTranslate>1. Regular Meetings Keep Your Organization Active</DynamicTranslate></h4>
                        <p className="text-gray-600 mb-2"><DynamicTranslate>Consider maintaining this meeting schedule:</DynamicTranslate></p>
                        <ul className="space-y-2 ml-6 list-disc">
                        <li><DynamicTranslate>Annual General Meeting (AGM) - Once per year for major decisions and elections</DynamicTranslate></li>
                        <li><DynamicTranslate>Executive Committee - Quarterly to review progress and plan activities</DynamicTranslate></li>
                        <li><DynamicTranslate>Member Meetings - Monthly or bi-monthly to maintain engagement</DynamicTranslate></li>
                        <li><DynamicTranslate>Special Meetings - As needed for urgent matters</DynamicTranslate></li>
                        <li><DynamicTranslate>Document all meetings with signed minutes for good record-keeping</DynamicTranslate></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-teal-800 mb-2"><DynamicTranslate>2. Fair and Transparent Decision Making</DynamicTranslate></h4>
                        <p className="text-gray-600 mb-2"><DynamicTranslate>Establish clear voting procedures such as:</DynamicTranslate></p>
                        <ul className="space-y-2 ml-6 list-disc">
                        <li><DynamicTranslate>Each member gets one vote to ensure equality</DynamicTranslate></li>
                        <li><DynamicTranslate>Use secret ballots for sensitive decisions like leadership elections</DynamicTranslate></li>
                        <li><DynamicTranslate>Aim for consensus on major decisions when possible</DynamicTranslate></li>
                        <li><DynamicTranslate>Keep proper records of all decisions made</DynamicTranslate></li>
                        <li><DynamicTranslate>Allow members to vote by proxy when they cannot attend</DynamicTranslate></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-teal-800 mb-2"><DynamicTranslate>3. Leadership Rotation for Fresh Ideas</DynamicTranslate></h4>
                        <p className="text-gray-600 mb-2"><DynamicTranslate>Consider these leadership practices:</DynamicTranslate></p>
                        <ul className="space-y-2 ml-6 list-disc">
                        <li><DynamicTranslate>Set reasonable term lengths (2-3 years recommended)</DynamicTranslate></li>
                        <li><DynamicTranslate>Encourage new leaders to step up regularly</DynamicTranslate></li>
                        <li><DynamicTranslate>Plan for leadership transition and mentoring</DynamicTranslate></li>
                        <li><DynamicTranslate>Maintain some experienced leaders while bringing in new ones</DynamicTranslate></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-teal-800 mb-2"><DynamicTranslate>4. Managing Conflicts of Interest</DynamicTranslate></h4>
                        <p className="text-gray-600 mb-2"><DynamicTranslate>Protect your organization's integrity by:</DynamicTranslate></p>
                        <ul className="space-y-2 ml-6 list-disc">
                        <li><DynamicTranslate>Encouraging open discussion about potential conflicts</DynamicTranslate></li>
                        <li><DynamicTranslate>Having members declare any business interests related to the organization</DynamicTranslate></li>
                        <li><DynamicTranslate>Creating clear procedures for handling conflicts when they arise</DynamicTranslate></li>
                        <li><DynamicTranslate>Documenting how conflicts were resolved</DynamicTranslate></li>
                        <li><DynamicTranslate>Reviewing conflict of interest policies annually</DynamicTranslate></li>
                        </ul>
                    </div>

                    <div className="bg-teal-50 p-4 rounded-lg mt-4">
                        <p className="text-gray-700 italic"><DynamicTranslate>
                        Remember: These are suggestions based on best practices. Your organization can adapt them to better suit your specific needs and circumstances while staying within the legal requirements.
                        </DynamicTranslate></p>
                    </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center text-teal-600">
                    <FileText className="mr-2" />
                    <DynamicTranslate>
                    Sources
                    </DynamicTranslate>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                    <p className="text-gray-700"><DynamicTranslate>This guide has been compiled using information from official government sources and professional registrars:</DynamicTranslate></p>
                    
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
                            <DynamicTranslate>
                            Ministry of Labour and Social Protection - Group Registration Services
                            </DynamicTranslate>
                            </a>
                            <p className="text-gray-600 text-sm mt-1"><DynamicTranslate>Official government portal for CBO and group registration</DynamicTranslate></p>
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
                            <DynamicTranslate>
                            Company Secretaries Africa - CBO Registration Guide
                            </DynamicTranslate>
                            </a>
                            <p className="text-gray-600 text-sm mt-1"><DynamicTranslate>Professional guidance on CBO registration process</DynamicTranslate></p>
                        </div>
                        </li>
                    </ul>

                    <p className="text-sm text-gray-600 mt-4 italic"><DynamicTranslate>
                        Note: While we strive to keep this information up-to-date, requirements may change. Please verify current requirements with your local Social Development Office.
                    </DynamicTranslate></p>
                    </div>
                </CardContent>
            </Card>
        </main>
        </div>
    );
};

export default EstablishmentGuide;
