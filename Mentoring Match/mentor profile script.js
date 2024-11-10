async function fetchMentorData() {
    const urlParams = new URLSearchParams(window.location.search);
    const mentorName = urlParams.get('name');  // Get the mentor name from query string

    if (!mentorName) {
        alert('No mentor specified.');
        return;
    }

    try {
        const response = await fetch('../assets/Mentor Profiles.xlsx');  // Path to Excel file
        if (!response.ok) throw new Error('Failed to fetch Excel file.');

        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });

        // Find the mentor's profile based on name
        const mentorProfile = jsonData.find(row => row[0] === mentorName);
        
        if (!mentorProfile) {
            alert('Mentor not found.');
            return;
        }

        // Populate mentor details
        displayMentorProfile(mentorProfile);
    } catch (error) {
        console.error('Error loading mentor data:', error);
    }
}

function displayMentorProfile(profileData) {
    // Get the elements where data will be inserted
    const name = document.getElementById('mentor-name');
    const title = document.getElementById('mentor-title');
    const agencies = document.getElementById('mentor-agency');
    const email = document.getElementById('mentor-email');
    const pastAgenciesList = document.getElementById('mentor-past-agencies-list');
    const mentoringAreasList = document.getElementById('mentor-mentoring-area-list');
    const image = document.getElementById('mentor-image');

    // Set mentor details
    name.textContent = profileData[0];  // Mentor Name
    title.textContent = `${profileData[1]} | ${profileData[2]}`;  // Title | Agency
    email.textContent = `Email: ${profileData[6]}`;

    // Set image source
    image.src = profileData[5] || '';  // Mentor Image (if available)

    // Populate Past Agencies as buttons with hover effect
    pastAgenciesList.innerHTML = ''; // Clear past agencies list before adding new ones
    const pastAgencies = profileData[3] ? profileData[3].split(',') : [];  // Assuming past agencies are in column 4 (index 3)

    pastAgencies.forEach(agency => {
        const agencyButton = document.createElement('button');
        agencyButton.className = 'past-agency-btn';
        agencyButton.textContent = agency.trim();  // Agency name
        
        // Optionally, add an event listener for click or hover actions
        agencyButton.addEventListener('click', () => {
            console.log(`Agency clicked: ${agency}`);
        });

        // Append the button to the list
        pastAgenciesList.appendChild(agencyButton);
    });

    // Populate Mentoring Areas as buttons
    mentoringAreasList.innerHTML = '';  // Clear mentoring areas list before adding new ones
    const mentoringAreas = profileData[4] ? profileData[4].split(',') : [];  // Assuming mentoring areas are in column 5 (index 4)

    mentoringAreas.forEach(area => {
        const mentoringButton = document.createElement('button');
        mentoringButton.className = 'mentoring-area-btn';  // You can style this class
        mentoringButton.textContent = area.trim();  // Mentoring area name
        
        // Optionally, add an event listener for click or hover actions
        mentoringButton.addEventListener('click', () => {
            console.log(`Mentoring Area clicked: ${area}`);
        });

        // Append the button to the list
        mentoringAreasList.appendChild(mentoringButton);
    });
}

document.addEventListener('DOMContentLoaded', fetchMentorData);
