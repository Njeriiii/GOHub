// In your edit profile page
import VolunteerForm from "./VolunteerForm";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../contexts/ApiProvider";
import { useAuth } from "../contexts/AuthProvider";

/**
 * This component represents the edit volunteer profile page.
 * It allows volunteers to edit their technical and non-technical skills.
 * @returns EditVolunteerProfilePage
 */
const EditVolunteerProfilePage = () => {
    const [currentSkills, setCurrentSkills] = useState(null);
    const navigate = useNavigate();
    const apiClient = useApi();
    const { getUserId } = useAuth();
    const userId = getUserId();

    useEffect(() => {
        // Fetch current skills
        const fetchSkills = async () => {
            const response = await apiClient.get(`/profile/volunteer?user_id=${userId}`)
            if (response.ok) {
                setCurrentSkills(response.body.volunteer.skills);
            }
        };
        fetchSkills();
    }, []);

    const handleSuccess = () => {
        navigate('/volunteer');  // or wherever you want to redirect
    };

    const handleCancel = () => {
        navigate(-1);  // go back
    };

    if (!currentSkills) {
        return <div>Loading...</div>;
    }

    const techSkills = Array.isArray(currentSkills) ? currentSkills.filter(skill => skill.status === 'tech').map(skill => skill.skill) : [];
    const nonTechSkills = Array.isArray(currentSkills) ? currentSkills.filter(skill => skill.status === 'non-tech').map(skill => skill.skill) : [];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <VolunteerForm 
                isEditing={true}
                initialTechSkills={techSkills}
                initialNonTechSkills={nonTechSkills}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
            />
        </div>
    );
}

export default EditVolunteerProfilePage;