// Global variables for pagination
let allProfiles = [];
let originalProfiles = []; // Store the original profiles for resetting filters
let currentPage = 1; // Track the current page
const profilesPerPage = 6; // Number of profiles per page

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
        applyFilters()
    }
});

function setPresetFilters(selectedInterests) {
    const checkboxes = document.querySelectorAll('input[name="interests"]');
    console.log('Checkboxes', checkboxes);
    checkboxes.forEach(checkbox => {
        // Check the checkbox if it matches a selected interest
        if (selectedInterests.includes(checkbox.value)) {
            checkbox.checked = true;
            console.log(`Checked checkbox: ${checkbox.value}`); // Log checked checkboxes
        }
    });

    // Optionally, ensure the area checkboxes are also set
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

function createProfiles(data) {
    allProfiles = []; // Reset all profiles
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = ''; // Clear existing profiles

    for (let i = 1; i < data.length; i++) {
        const profileData = data[i];

        // Check if profile data contains valid information before proceeding
        if (!profileData[0] || !profileData[1] || !profileData[2] || !profileData[3]) {
            // Skip if essential data like name, title, agencies, or mentoring areas are missing
            continue;
        }

        const profile = document.createElement('div');
        profile.className = 'profile';

        // Set data attributes for filtering
        profile.setAttribute('data-agencies', profileData[2]); // Adjust index as needed
        profile.setAttribute('data-mentoring-areas', profileData[4]); // Adjust index as needed

        // Create and set the profile image
        const img = document.createElement('img');
        img.src = profileData[5] || ''; // Assuming image URL is in index 4
        img.alt = 'Profile Image';
        img.className = 'profile-pic';
        profile.appendChild(img);

        // Create and set the profile info container
        const profileInfo = document.createElement('div');
        profileInfo.className = 'profile-info';

        // Create and set the profile name
        const name = document.createElement('h3');
        name.textContent = `${profileData[0] || 'N/A'}`; // Assuming name is in index 0
        profileInfo.appendChild(name);

        // Create and set the profile title
        const title = document.createElement('div');
        title.className = 'title';
        title.textContent = `${profileData[1] || 'N/A'}`; // Assuming title is in index 1
        profileInfo.appendChild(title);

        // Create and set the agencies
        const agencies = document.createElement('div');
        agencies.className = 'agencies';
        agencies.textContent = `${profileData[2] || 'N/A'}`; // Assuming agencies are in index 2
        profileInfo.appendChild(agencies);

        // Create and add mentoring areas
        const mentoringAreas = document.createElement('div');
        mentoringAreas.className = 'mentoring-areas';
        const areas = profileData[4] ? profileData[4].split(', ') : []; // Assuming mentoring areas are in index 4
        areas.forEach(area => {
            const mentoringBtn = document.createElement('button');
            mentoringBtn.className = 'mentoring-btn';
            mentoringBtn.textContent = area; // Set button text
            mentoringBtn.value = area; // Set value for filtering purposes
            mentoringBtn.addEventListener('click', () => {
                console.log(`Selected Mentoring Area: ${area}`);
            });
            mentoringAreas.appendChild(mentoringBtn);
        });

        // Add mentoring areas to the profile info
        profileInfo.appendChild(mentoringAreas);
        profile.appendChild(profileInfo);

        // Create a contact button
        const contactBtn = document.createElement('button');
        contactBtn.className = 'contact-btn';
        contactBtn.textContent = profileData[6] || 'Contact'; // Set button text based on email (index 5)
        profile.appendChild(contactBtn);

        // Append the profile to the allProfiles array
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

// Setup listeners for filter inputs
function setupFilterListeners() {
    const agencyFilters = document.querySelectorAll('.agency-checkbox-label input[type="checkbox"]');
    const areaFilters = document.querySelectorAll('.mentoring-area-checkbox-label input[type="checkbox"]');

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
}

function applyFilters() {
    const agencyFilters = document.querySelectorAll('.agency-checkbox-label input[type="checkbox"]');
    const areaFilters = document.querySelectorAll('.mentoring-area-checkbox-label input[type="checkbox"]');

    const selectedAgencies = Array.from(agencyFilters).filter(input => input.checked).map(input => input.nextSibling.nodeValue.trim());
    const selectedAreas = Array.from(areaFilters).filter(input => input.checked).map(input => input.nextSibling.nodeValue.trim());

    // Log selected areas to the console
    console.log('Selected Areas:', selectedAreas);

    // Filter profiles based on selected criteria
    allProfiles = originalProfiles.filter(profile => {
        const profileAgencies = profile.getAttribute('data-agencies').split(', ').map(str => str.trim());
        const profileAreas = profile.getAttribute('data-mentoring-areas').split(', ').map(str => str.trim());

        const agencyMatch = selectedAgencies.length === 0 || selectedAgencies.some(agency => profileAgencies.includes(agency));
        const areaMatch = selectedAreas.length === 0 || selectedAreas.some(area => profileAreas.includes(area));

        return agencyMatch && areaMatch;
    });

    // Reset current page and update displayed profiles
    currentPage = 1;
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
