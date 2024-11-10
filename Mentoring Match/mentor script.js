// Global variables for pagination
let allProfiles = [];
let originalProfiles = []; // Store the original profiles for resetting filters
let currentPage = 1; // Track the current page
const profilesPerPage = 6; // Number of profiles per page

// Global variable to store selected years of experience filters
let selectedExperienceRanges = [];

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

document.addEventListener('DOMContentLoaded', async () => {
    await fetchExcelData(); // Fetch Excel data on page load
    setupFilterListeners(); // Setup listeners for filter inputs

    // Check for selected interests in the query parameters
    const interests = getQueryParam('interests');
    if (interests) {
        console.log('Interests from query parameters:', interests); // Log the raw interests
        const selectedInterests = interests.split(','); // Split by comma
        console.log('Selected Interests:', selectedInterests); // Log the array of selected interests
        
        // Optionally set the filters visually on the UI
        setPresetFilters(selectedInterests);
        applyFilters();
    }
});

// Set the filters based on query parameters (like 'interests')
function setPresetFilters(selectedInterests) {
    const checkboxes = document.querySelectorAll('input[name="interests"]');
    console.log('Checkboxes:', checkboxes);
    checkboxes.forEach(checkbox => {
        // Check the checkbox if it matches a selected interest
        if (selectedInterests.includes(checkbox.value)) {
            checkbox.checked = true;
            console.log(`Checked checkbox: ${checkbox.value}`); // Log checked checkboxes
        }
    });

    // Ensure area checkboxes are also set
    const areaCheckboxes = document.querySelectorAll('.mentoring-area-checkbox-label input[type="checkbox"]');
    areaCheckboxes.forEach(areaCheckbox => {
        if (selectedInterests.includes(areaCheckbox.value)) {
            areaCheckbox.checked = true; // Check the area checkbox if it matches a selected interest
        }
    });
}



// Fetch the Excel file from the repository
async function fetchExcelData() {
    try {
        const response = await fetch('../assets/Mentor Profiles.xlsx'); // Update with the correct path
        if (!response.ok) throw new Error('Network response was not ok');

        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });

        console.log('Fetched data:', jsonData);
        createProfiles(jsonData);
    } catch (error) {
        console.error('Error fetching or processing Excel data:', error);
    }
}

// Create profiles from fetched data
function createProfiles(data) {
    allProfiles = []; // Reset all profiles
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = ''; // Clear existing profiles

    for (let i = 1; i < data.length; i++) {
        const profileData = data[i];

        // Skip if essential data is missing
        if (!profileData[0] || !profileData[1] || !profileData[2] || !profileData[3]) {
            continue;
        }

        const profile = document.createElement('div');
        profile.className = 'profile';

        // Set data attributes for filtering
        profile.setAttribute('data-agencies', profileData[2]);
        profile.setAttribute('data-mentoring-areas', profileData[4]);

        // Create profile image
        const img = document.createElement('img');
        img.src = profileData[5] || ''; // Assuming image URL is in index 5
        img.alt = 'Profile Image';
        img.className = 'profile-pic';
        profile.appendChild(img);

        // Profile info container
        const profileInfo = document.createElement('div');
        profileInfo.className = 'profile-info';

        // Profile Name
        const name = document.createElement('h3');
        name.textContent = `${profileData[0] || 'N/A'}`;
        profileInfo.appendChild(name);

        // Profile Title
        const title = document.createElement('div');
        title.className = 'title';
        title.textContent = `${profileData[1] || 'N/A'}`;
        profileInfo.appendChild(title);

        // Agencies
        const agencies = document.createElement('div');
        agencies.className = 'agencies';
        agencies.textContent = `${profileData[2] || 'N/A'}`;
        profileInfo.appendChild(agencies);        

        // Years of Experience
        const experience = document.createElement('div');
        experience.className = 'experience';
        experience.innerHTML = `<strong>Years of Experience:</strong> ${profileData[7] || 'N/A'}`; // Added strong for bolding the label
        profileInfo.appendChild(experience);

        // Mentoring Areas
        const mentoringAreas = document.createElement('div');
        mentoringAreas.className = 'mentoring-areas';
        const areas = profileData[4] ? profileData[4].split(', ') : [];
        areas.forEach(area => {
            const mentoringBtn = document.createElement('button');
            mentoringBtn.className = 'mentoring-btn';
            mentoringBtn.textContent = area;
            mentoringBtn.value = area;
            mentoringBtn.addEventListener('click', () => {
                console.log(`Selected Mentoring Area: ${area}`);
            });
            mentoringAreas.appendChild(mentoringBtn);
        });

        // Add mentoring areas to profile info
        profileInfo.appendChild(mentoringAreas);
        profile.appendChild(profileInfo);

        // Create "View Full Profile" button
        const profileBtn = document.createElement('button');
        profileBtn.className = 'profile-btn';
        profileBtn.textContent = 'See Full Profile'; // Fixed text for button

        
        profileBtn.addEventListener('click', () => {
            const mentorName = profileData[0];  // Name
            const mentorTitle = profileData[1];  // Title
            const mentorAgencies = profileData[2];  // Agencies
            const mentorMentoringAreas = profileData[4];  // Mentoring Areas
            const mentorEmail = profileData[6];  // Email (assuming it's in index 6)
            const profileImage = profileData[5] || '';  // Profile image URL (assuming index 5)

            // Get the user's email from local storage
            const userEmail = localStorage.getItem('userEmail');

            // Redirect to booking.html with mentor details and user email
            const queryString = new URLSearchParams({
                name: mentorName,
                title: mentorTitle,
                agencies: mentorAgencies,
                mentoringAreas: mentorMentoringAreas,
                email: mentorEmail,
                profileImage: profileImage,
                userEmail: userEmail  // Pass the user's email as a query parameter
            }).toString();

            // Redirect to the booking page
            window.location.href = `mentor profile.html?${queryString}`;
        });

        // Append the contact button
        profile.appendChild(profileBtn);

        // Append profile to the list of all profiles
        allProfiles.push(profile);
    }

    // Store a copy of the original profiles for resetting filters
    originalProfiles = [...allProfiles];

    // Display the first page of profiles
    displayProfiles();
}

// Display profiles for the current page
function displayProfiles() {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = ''; // Clear existing profiles

    const startIndex = (currentPage - 1) * profilesPerPage;
    const endIndex = startIndex + profilesPerPage;
    const profilesToDisplay = allProfiles.slice(startIndex, endIndex);

    profilesToDisplay.forEach(profile => {
        resultsContainer.appendChild(profile);
    });

    // Update pagination controls
    updatePaginationControls();
}

// Update pagination controls
function updatePaginationControls() {
    const paginationContainer = document.getElementById('paginationControls');
    paginationContainer.innerHTML = ''; // Clear previous pagination controls

    const totalPages = Math.ceil(allProfiles.length / profilesPerPage);

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayProfiles(); // Update displayed profiles
        }
    });

    const pageInfo = document.createElement('span');
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayProfiles(); // Update displayed profiles
        }
    });

    paginationContainer.appendChild(prevButton);
    paginationContainer.appendChild(pageInfo);
    paginationContainer.appendChild(nextButton);

    // Always show pagination controls
    if (allProfiles.length === 0) {
        const noProfilesMessage = document.createElement('div');
        noProfilesMessage.textContent = 'No profiles available.';
        paginationContainer.appendChild(noProfilesMessage);
    }
}

// Function to check if the profile's years of experience matches the selected range
function checkExperience(profileExperience) {
    console.log('Profile Experience:', profileExperience);
    // Check if profileExperience is a valid string and contains the expected structure
    if (typeof profileExperience !== 'string' || !profileExperience.includes('Years of Experience:')) {
        console.log('Invalid profile experience format:', profileExperience);
        return false; // Invalid experience format
    }

    // Extract the number after "Years of Experience:"
    const profileYearsString = profileExperience.split(':')[1]?.trim(); // Split by colon and trim any spaces
    const profileYears = parseInt(profileYearsString, 10);
    console.log('Parsed Profile Years:', profileYears);

    // If no years are specified (e.g., 'N/A' or empty), return false
    if (isNaN(profileYears)) {
        return false;
    }

    // Check if the profile's years of experience match the selected ranges
    return selectedExperienceRanges.some(range => {
        const [start, end] = range.split(' - ').map(Number);
        return profileYears >= start && profileYears <= end;
    });
}


// Setup listeners for filter inputs
function setupFilterListeners() {
    const agencyFilters = document.querySelectorAll('.agency-checkbox-label input[type="checkbox"]');
    const areaFilters = document.querySelectorAll('.mentoring-area-checkbox-label input[type="checkbox"]');
    const experienceFilters = document.querySelectorAll('.checkbox-column input[type="checkbox"]'); // New Experience Filters

    agencyFilters.forEach(input => {
        input.addEventListener('change', () => {
            console.log('Agency Filters:', Array.from(agencyFilters).filter(i => i.checked).map(i => i.nextSibling.nodeValue.trim()));
            applyFilters();
        });
    });

    areaFilters.forEach(input => {
        input.addEventListener('change', () => {
            console.log('Area Filters:', Array.from(areaFilters).filter(i => i.checked).map(i => i.nextSibling.nodeValue.trim()));
            applyFilters();
        });
    });

    experienceFilters.forEach(input => {
        input.addEventListener('change', () => {
            selectedExperienceRanges = Array.from(experienceFilters)
                .filter(i => i.checked)
                .map(i => i.value);
            console.log('Selected Experience Ranges:', selectedExperienceRanges);
            applyFilters();
        });
    });
}

function applyFilters() {
    const agencyFilters = document.querySelectorAll('.agency-checkbox-label input[type="checkbox"]');
    const areaFilters = document.querySelectorAll('.mentoring-area-checkbox-label input[type="checkbox"]');
    const experienceFilters = document.querySelectorAll('.checkbox-column input[type="checkbox"]'); // New Experience Filters

    // Get selected agencies and areas
    const selectedAgencies = Array.from(agencyFilters).filter(input => input.checked).map(input => input.nextSibling.nodeValue.trim());
    const selectedAreas = Array.from(areaFilters).filter(input => input.checked).map(input => input.nextSibling.nodeValue.trim());

    // Update selected experience ranges
    selectedExperienceRanges = Array.from(experienceFilters)
        .filter(input => input.checked)
        .map(input => input.value);

    console.log('Selected Areas:', selectedAreas);
    console.log('Selected Experience Ranges:', selectedExperienceRanges); // Ensure ranges are logged

    // Filter profiles based on selected criteria
    allProfiles = originalProfiles.filter(profile => {
        const profileAgencies = profile.getAttribute('data-agencies').split(', ').map(str => str.trim());
        const profileAreas = profile.getAttribute('data-mentoring-areas').split(', ').map(str => str.trim());
        const profileExperience = profile.querySelector('.experience').textContent || '';

        const agencyMatch = selectedAgencies.length === 0 || selectedAgencies.some(agency => profileAgencies.includes(agency));
        const areaMatch = selectedAreas.length === 0 || selectedAreas.some(area => profileAreas.includes(area));
        const experienceMatch = selectedExperienceRanges.length === 0 || checkExperience(profileExperience); // Add experience check

        return agencyMatch && areaMatch && experienceMatch;
    });

    currentPage = 1; // Reset to first page
    displayProfiles();
}


// Function to reset filters
function resetFilters() {
    document.querySelectorAll('.checkbox-group input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    allProfiles = [...originalProfiles]; // Reset to original profiles
    currentPage = 1;
    displayProfiles();
}

document.addEventListener('DOMContentLoaded', function() {
    // Retrieve the user's email from local storage
    const userEmail = localStorage.getItem('userEmail');
    console.log("User email:", userEmail); // Log the email

    // Store the email value in a hidden input (or in your data structure for use later)
    // Optionally, you can pass it to the next page in the form submission or URL.
});
