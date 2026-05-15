// Base URL of the Spring Boot backend API.
const API_BASE_URL = "http://localhost:8080/api/requests";

// Selecting HTML elements once makes the code easy to read and reuse.
const requestForm = document.getElementById("requestForm");
const requestsContainer = document.getElementById("requestsContainer");
const statusMessage = document.getElementById("statusMessage");
const totalRequests = document.getElementById("totalRequests");
const refreshButton = document.getElementById("refreshButton");

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
    card.className = "request-card";

    const isCompleted = request.status === "COMPLETED";

    card.innerHTML = `
        <h3>${request.title}</h3>
        <p>${request.description}</p>

        <div class="request-meta">
            <span><strong>Requester:</strong> ${request.requesterName}</span>
            <span class="status-badge ${isCompleted ? "completed" : ""}">${request.status}</span>
            <span><strong>Created:</strong> ${formatDate(request.createdAt)}</span>
            <span><strong>Completed:</strong> ${formatDate(request.completedAt)}</span>
            <span><strong>Completed By:</strong> ${request.completedBy || "Not assigned"}</span>
        </div>
    `;

    // Completed requests do not need the button again.
    if (!isCompleted) {
        const completeButton = document.createElement("button");
        completeButton.className = "complete-button";
        completeButton.textContent = "Mark as Completed";

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
            requestsContainer.innerHTML = "";
            totalRequests.textContent = requests.length;

            if (requests.length === 0) {
                requestsContainer.innerHTML = '<div class="empty-state">No help requests found. Create the first request.</div>';
                statusMessage.textContent = "No records yet";
                return;
            }

            requests.forEach(function (request) {
                const card = createRequestCard(request);
                requestsContainer.appendChild(card);
            });

            statusMessage.textContent = "Requests loaded successfully";
        })
        .catch(function () {
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

// Load existing requests when the page first opens.
loadRequests();
