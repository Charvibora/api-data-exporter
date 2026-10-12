
const form = document.querySelector("#api-form");
const endpointInput = document.querySelector("#api-url");
const fetchButton = document.querySelector("#fetch-btn");
const sampleButton = document.querySelector("#sample-btn");

const recordCount = document.querySelector("#record-count");
const dataFormat = document.querySelector("#data-format");
const exportStatus = document.querySelector("#export-status");
const previewMessage = document.querySelector("#preview-message");
const message = document.querySelector("#message");
const tableHead = document.querySelector("#table-head");
const tableBody = document.querySelector("#table-body");

const jsonButton = document.querySelector("#json-btn");
const csvButton = document.querySelector("#csv-btn");

const SAMPLE_URL = "https://jsonplaceholder.typicode.com/users";

let fetchedData = null;

// Show a message without changing the page design.
function showMessage(text, type = "") {
    message.textContent = text;
    message.className = type ? `message ${type}` : "message";
}

// Safely display values inside table cells.
function formatValue(value) {
    if (value === null || value === undefined) {
        return "";
    }

    if (typeof value === "object") {
        return JSON.stringify(value);
    }

    return String(value);
}

// Create a table cell.
function createCell(value, tagName = "td") {
    const cell = document.createElement(tagName);
    cell.textContent = formatValue(value);
    return cell;
}

function flattenRecord(value, prefix = "", result = {}) {
    if (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
    ) {
        for (const [key, nestedValue] of Object.entries(value)) {
            const newKey = prefix ? `${prefix}.${key}` : key;

            flattenRecord(nestedValue, newKey, result);
        }
    } else {
        result[prefix || "data"] =
            Array.isArray(value) ? JSON.stringify(value) : value;
    }

    return result;
}


// Render fetched API data in the existing preview table.

function flattenRecord(value, prefix = "", result = {}) {
    if (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
    ) {
        for (const [key, nestedValue] of Object.entries(value)) {
            const newKey = prefix ? `${prefix}.${key}` : key;
            flattenRecord(nestedValue, newKey, result);
        }
    } else {
        result[prefix || "data"] =
            Array.isArray(value) ? JSON.stringify(value) : value;
    }

    return result;
}

function renderTable(data) {
    const records = Array.isArray(data) ? data : [data];

    tableHead.replaceChildren();
    tableBody.replaceChildren();

    if (records.length === 0) {
        tableHead.innerHTML = "<tr><th>DATA</th></tr>";

        const row = document.createElement("tr");
        const cell = createCell("The API returned no records.");
        cell.className = "empty-state";
        row.appendChild(cell);
        tableBody.appendChild(row);

        recordCount.textContent = "0";
        previewMessage.textContent = "No records returned.";
        return;
    }

    const flattenedRecords = records.map((record) =>
        flattenRecord(record)
    );

    const columns = [
        ...new Set(flattenedRecords.flatMap((record) =>
            Object.keys(record)
        ))
    ];

    const headerRow = document.createElement("tr");

    columns.forEach((column) => {
        const heading = createCell(
            column.replaceAll(".", " ").replaceAll("_", " "),
            "th"
        );

        heading.textContent = column
            .replaceAll(".", " ")
            .replaceAll("_", " ")
            .toUpperCase();

        headerRow.appendChild(heading);
    });

    tableHead.appendChild(headerRow);

    flattenedRecords.forEach((record) => {
        const row = document.createElement("tr");

        columns.forEach((column) => {
            row.appendChild(createCell(record[column]));
        });

        tableBody.appendChild(row);
    });

    recordCount.textContent = records.length;
    previewMessage.textContent =
        `Showing ${records.length} record${records.length === 1 ? "" : "s"}.`;
}


// Fetch data when the form is submitted.
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const url = endpointInput.value.trim();

    if (!url) {
        showMessage("Please enter an API endpoint URL.", "error");
        return;
    }

    try {
        // Validate the URL before making a request.
        const parsedUrl = new URL(url);

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            throw new Error("Only HTTP and HTTPS URLs are supported.");
        }

        fetchButton.disabled = true;
        fetchButton.textContent = "Fetching...";
        jsonButton.disabled = true;
        csvButton.disabled = true;

        showMessage("Fetching data from the API...", "loading");

        const response = await fetch(parsedUrl.href);

if (!response.ok) {
    throw new Error(
        `Request failed with HTTP ${response.status} ${response.statusText}.`
    );
}

let data;

try {
    data = await response.json();
} catch {
    throw new Error(
        "The API did not return valid JSON. Check that the endpoint returns JSON data."
    );
}

if (data === null || typeof data !== "object") {
    throw new Error(
        "Unexpected response: expected a JSON object or array."
    );
}

        

        if (
            data === null ||
            typeof data !== "object"
        ) {
            throw new Error("The API response must be a JSON object or array.");
        }

        
fetchedData = data;

let records;

if (Array.isArray(data)) {
    records = data;
} else if (Array.isArray(data.users)) {
    records = data.users;
} else {
    records = [data];
}

renderTable(records);


        dataFormat.textContent = "JSON";
        exportStatus.textContent = "Not exported";

        jsonButton.disabled = false;
        csvButton.disabled = false;

        showMessage("Data fetched successfully!", "success");

    } catch (error) {
        console.error("API fetch failed:", error);

        fetchedData = null;
        recordCount.textContent = "—";
        tableHead.innerHTML = "<tr><th>STATUS</th><th>DETAILS</th></tr>";
        tableBody.replaceChildren();

        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 2;
        cell.className = "empty-state";
        cell.textContent = error instanceof TypeError
            ? "Network error. Check the URL, internet connection, and API CORS permissions."
            : error.message;

        row.appendChild(cell);
        tableBody.appendChild(row);

        previewMessage.textContent = "Unable to load records.";
        jsonButton.disabled = true;
        csvButton.disabled = true;

        showMessage(error.message, "error");

    } finally {
        fetchButton.disabled = false;
        fetchButton.textContent = "Fetch data ↗";
    }
});

// Fill in the sample API URL.
sampleButton.addEventListener("click", () => {
    endpointInput.value = SAMPLE_URL;
    endpointInput.focus();
});

// Download a file in the browser.
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(downloadUrl);
}

// Export the complete response as JSON.
jsonButton.addEventListener("click", () => {
    if (fetchedData === null) return;

    downloadFile(
        JSON.stringify(fetchedData, null, 2),
        "api-data.json",
        "application/json;charset=utf-8"
    );

    dataFormat.textContent = "JSON";
    exportStatus.textContent = "JSON exported";
    showMessage("JSON file download started.", "success");
});

// Escape CSV values safely.
function csvEscape(value) {
    const text = formatValue(value);
    return `"${text.replaceAll('"', '""')}"`;
}

// Export arrays and objects as CSV.
function convertToCSV(data) {
    const records = Array.isArray(data) ? data : [data];

    if (records.length === 0) {
        return "";
    }

    const columns = [
        ...new Set(
            records.flatMap((record) =>
                record !== null && typeof record === "object"
                    ? Object.keys(record)
                    : ["data"]
            )
        )
    ];

    const header = columns.map(csvEscape).join(",");

    const rows = records.map((record) =>
        columns.map((column) => {
            const value =
                column === "data" ? record : record?.[column];

            return csvEscape(value);
        }).join(",")
    );

    return [header, ...rows].join("\r\n");
}

// Export the fetched data as CSV.
csvButton.addEventListener("click", () => {
    if (fetchedData === null) return;

    const csv = convertToCSV(fetchedData);

    downloadFile(
        csv,
        "api-data.csv",
        "text/csv;charset=utf-8"
    );

    dataFormat.textContent = "CSV";
    exportStatus.textContent = "CSV exported";
    showMessage("CSV file download started.", "success");
});

