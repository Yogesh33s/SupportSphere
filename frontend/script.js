// Base URL of the Spring Boot backend API.
// In Docker, nginx forwards /api requests to the backend container.
const API_BASE_URL = "/api/requests";

// Selecting HTML elements once makes the code easy to read and reuse.
const requestForm = document.getElementById("requestForm");
const requestsContainer = document.getElementById("requestsContainer");
const statusMessage = document.getElementById("statusMessage");
const totalRequests = document.getElementById("totalRequests");
const activeRequests = document.getElementById("activeRequests");
const completedRequests = document.getElementById("completedRequests");
const refreshButton = document.getElementById("refreshButton");
const filterButtons = document.querySelectorAll(".filter-button");

let allRequests = [];
let activeFilter = "all";

// This function converts backend date values into readable text.
function formatDate(dateValue) {
    if (!dateValue) {
        return "Not completed yet";
    }

    return new Date(dateValue).toLocaleString();
}

// This function creates one card for one help request.
function createRequestCard(request) {
    const card = document.createElement("article");

    const isCompleted = request.status === "COMPLETED";
    card.className = `request-card ${isCompleted ? "is-completed" : "is-active"}`;

    card.innerHTML = `
        <div class="request-card-header">
            <div class="request-title-row">
                <span class="request-icon" aria-hidden="true">
                    <i class="fa-solid ${isCompleted ? "fa-circle-check" : "fa-hand-holding-heart"}"></i>
                </span>
                <div>
                    <p class="request-label">${isCompleted ? "Resolved support case" : "Open support case"}</p>
                    <h3>${request.title}</h3>
                </div>
            </div>
            <span class="status-badge ${isCompleted ? "completed" : ""}">
                <i class="fa-solid ${isCompleted ? "fa-circle-check" : "fa-clock"}" aria-hidden="true"></i>
                ${request.status}
            </span>
        </div>

        <p class="request-description">${request.description}</p>

        <div class="request-meta">
            <span><i class="fa-solid fa-user" aria-hidden="true"></i><small>Requester</small><strong>${request.requesterName}</strong></span>
            <span><i class="fa-solid fa-calendar-plus" aria-hidden="true"></i><small>Created</small><strong>${formatDate(request.createdAt)}</strong></span>
            <span><i class="fa-solid fa-calendar-check" aria-hidden="true"></i><small>Completed</small><strong>${formatDate(request.completedAt)}</strong></span>
            <span><i class="fa-solid fa-user-check" aria-hidden="true"></i><small>Completed By</small><strong>${request.completedBy || "Not assigned"}</strong></span>
        </div>
    `;

    // Completed requests do not need the button again.
    if (!isCompleted) {
        const completeButton = document.createElement("button");
        completeButton.className = "complete-button";
        completeButton.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i><span>Mark as Completed</span>';

        completeButton.addEventListener("click", function () {
            const completedBy = prompt("Enter the name of the person completing this request:");

            if (completedBy) {
                markRequestAsCompleted(request.id, completedBy);
            }
        });

        card.appendChild(completeButton);
    }

    return card;
}

function isDateInCurrentMonth(dateValue) {
    if (!dateValue) {
        return false;
    }

    const date = new Date(dateValue);
    const today = new Date();

    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
}

function filterRequests(requests) {
    return requests.filter(function (request) {
        if (activeFilter === "pending") {
            return request.status !== "COMPLETED";
        }

        if (activeFilter === "completed") {
            return request.status === "COMPLETED";
        }

        if (activeFilter === "month") {
            return isDateInCurrentMonth(request.createdAt);
        }

        return true;
    });
}

function displayRequests(requests) {
    const filteredRequests = filterRequests(requests);

    requestsContainer.innerHTML = "";

    if (filteredRequests.length === 0) {
        requestsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-inbox" aria-hidden="true"></i>
                <strong>No matching requests found</strong>
                <span>Try another filter or create a new community support request.</span>
            </div>
        `;
        return;
    }

    filteredRequests.forEach(function (request) {
        const card = createRequestCard(request);
        requestsContainer.appendChild(card);
    });
}

// Fetches all help requests from the backend and displays them.
function loadRequests() {
    statusMessage.textContent = "Loading requests...";

    fetch(API_BASE_URL)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Backend returned an error");
            }

            return response.json();
        })
        .then(function (requests) {
            allRequests = requests;
            totalRequests.textContent = requests.length;
            completedRequests.textContent = requests.filter(function (request) {
                return request.status === "COMPLETED";
            }).length;
            activeRequests.textContent = requests.filter(function (request) {
                return request.status !== "COMPLETED";
            }).length;

            if (requests.length === 0) {
                requestsContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fa-solid fa-inbox" aria-hidden="true"></i>
                        <strong>No help requests found</strong>
                        <span>Create the first request to begin tracking community support.</span>
                    </div>
                `;
                statusMessage.textContent = "No records yet";
                return;
            }

            displayRequests(allRequests);

            statusMessage.textContent = "Requests loaded successfully";
        })
        .catch(function () {
            totalRequests.textContent = "0";
            activeRequests.textContent = "0";
            completedRequests.textContent = "0";
            statusMessage.textContent = "Unable to connect to backend";
        });
}

// Sends form data to the backend to create a new help request.
function createHelpRequest(event) {
    event.preventDefault();

    const newRequest = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        requesterName: document.getElementById("requesterName").value
    };

    fetch(API_BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newRequest)
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Backend returned an error");
            }

            return response.json();
        })
        .then(function () {
            requestForm.reset();
            statusMessage.textContent = "Help request created";
            loadRequests();
        })
        .catch(function () {
            statusMessage.textContent = "Could not create request";
        });
}

// Updates one request as completed in the backend.
function markRequestAsCompleted(id, completedBy) {
    const completeUrl = `${API_BASE_URL}/${id}/complete?completedBy=${encodeURIComponent(completedBy)}`;

    fetch(completeUrl, {
        method: "PUT"
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Backend returned an error");
            }

            statusMessage.textContent = "Request marked as completed";
            loadRequests();
        })
        .catch(function () {
            statusMessage.textContent = "Could not complete request";
        });
}

// Event listeners connect user actions to JavaScript functions.
requestForm.addEventListener("submit", createHelpRequest);
refreshButton.addEventListener("click", loadRequests);

filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        activeFilter = button.dataset.filter;

        filterButtons.forEach(function (filterButton) {
            filterButton.classList.remove("active");
        });

        button.classList.add("active");
        displayRequests(allRequests);
    });
});

// Load existing requests when the page first opens.
loadRequests();
