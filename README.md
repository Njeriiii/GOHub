# GOHubSpec

## **Project Title: GOHub - Empowering Kenyan GOs Online**

### **Project Description:**

**I. Introduction:**

GOHub is a comprehensive web builder designed specifically for small Kenyan community-based charity Grassroot Organisations (GO), providing them with a centralised platform to establish and manage their online presence. The primary goal is to address the challenge of perceived legitimacy that hinders these community-led organisations from obtaining necessary funding and support. 

**II. Main Features:**

1. **Customisable GO Profiles:**
    - GOs can create personalised profiles with detailed information about their mission, activities, achievements, and impact.
    - Customisation options include adding logos, images, and videos to enhance their online identity.
2. **Contact Information:**
    - Dedicated sections for contact details to facilitate easy communication for inquiries, collaborations, and donations.
3. **Project Showcase:**
    - Space for GOs to showcase ongoing projects, highlight past successes, and outline future initiatives.
    - A visual representation of their work to help potential donors understand the tangible impact of their contributions.
4. **Social Media Integration:**
    - Allow GOs to link their social media accounts, facilitating easy sharing and increasing visibility on other platforms.
5. **Recommendation System:**
    - Implement a recommendation system suggesting GOs users can donate to and interact with based on user-specified filters and preferences during their current session.
6. **Donation Integration:**
    - Secure donation platform integration to enable one-time or recurring contributions.
    - Options for various payment methods, including M-Pesa, to cater to the local context and promote financial inclusion.
7. **Special GO Needs:**
    - Host information about special GO needs that will improve their operations.
    - These will include volunteering to perform services like cleaning, cooking; donation of physical items like sanitary products; content creation needs like videos and photography etc.
8. **GO Establishment Process:**
    - A step-by-step guide on how GOs can register their operations with the government, making sure to be transparent about my sources of information etc.
    - Potentially have some information on how they could create an online presence.
9. **Volunteer Matching:** 
    - Allow GOs to post specific volunteer needs, and have a system for interested individuals to filter based on skills, location, and availability.
10. 

**III. Benefits:**

- Empower small Kenyan GOs by providing them with a robust online presence.
- Increase their visibility, fostering trust and legitimacy among potential donors.
- Increased opportunities for financial contributions and other forms of support.

**IV. Donors & Stakeholders:**

1. **Small Kenyan GOs:**
    - These organisations are the direct users of GOHub, utilising the platform to create and manage their online presence, connect with donors, and showcase their work.
2. **Donors and Supporters:**
    - Individuals, corporations, and organisations interested in supporting and contributing to small Kenyan GOs are crucial stakeholders. They use GOHub to discover and engage with GOs aligned with their interests.
3. **Community Members:**
    - The local community served by the GOs benefits from increased awareness of the organisations and their projects, fostering community engagement and collaboration.

**V. Approach / Methodology:**

1. **Needs Assessment:**
    - Conduct thorough research to understand the specific needs and challenges faced by small Kenyan GOs in establishing and managing their online presence.
2. **User-Centric Design:**
    - Employ a user-centric design approach to create an intuitive and user-friendly platform, ensuring GOs can easily customise profiles and donors can navigate seamlessly.
3. **Collaboration with GOs:**
    - Engage in collaborative discussions with representative GOs to gather insights, test prototypes, and refine features based on their feedback. (Agile Methodology)
4. **Verification System Design:**
    - Develop a robust verification system, potentially in collaboration with relevant authorities, to ensure the legitimacy of listed GOs, promoting trust among users
5. **Integration with M-Pesa API:**
    - Collaborate with mobile payment providers like M-Pesa to seamlessly integrate secure donation options, considering the local context and enhancing financial inclusion.
6. **Documentation and Training:**
    - Provide comprehensive documentation and training resources for GOs, donors, and administrators to ensure effective utilisation of the platform.

Create database tables:
```
cd backend
python create_db.py
```

Run the Flask app:
```
cd backend
source venv/bin/activate
export FLASK_APP=app
export FLASK_DEBUG=1
flask run --host=0.0.0.0 --port=5162 
```

Run the react app
```
cd frontend
npm start
```