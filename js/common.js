// Shared data storage
let generatedKeywords = [];

// Local storage keys
const STORAGE_KEYS = {
    KEYWORDS: 'seo_keywords',
    TOPICS: 'seo_topics',
    ROOTS: 'seo_roots'
};

// Check if localStorage is available
function isLocalStorageAvailable() {
    try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch(e) {
        console.error('localStorage is not available:', e);
        return false;
    }
}

// Save data to storage
function saveToStorage(key, data) {
    try {
        if (!isLocalStorageAvailable()) {
            showMessage('Warning: Local storage is not available. Your data will not be saved.', 'warning');
            return;
        }
        const dataString = JSON.stringify(data);
        localStorage.setItem(key, dataString);
        console.log(`Successfully saved to ${key}:`, {
            rawData: data,
            stringified: dataString,
            storageSize: dataString.length
        });
        showMessage('Data saved successfully!', 'success');
    } catch (e) {
        console.error(`Error saving to localStorage (${key}):`, e);
        showMessage('Failed to save data. Please try again.', 'danger');
    }
}

// Load data from storage
function loadFromStorage(key) {
    try {
        if (!isLocalStorageAvailable()) {
            showMessage('Warning: Local storage is not available. Using default data.', 'warning');
            return null;
        }
        const dataString = localStorage.getItem(key);
        if (dataString) {
            const parsedData = JSON.parse(dataString);
            console.log(`Successfully loaded from ${key}:`, {
                rawString: dataString,
                parsed: parsedData
            });
            return parsedData;
        }
        console.log(`No data found for key: ${key}`);
        return null;
    } catch (e) {
        console.error(`Error loading from localStorage (${key}):`, e);
        showMessage('Failed to load saved data.', 'danger');
        return null;
    }
}

// Format Excel data for download
function formatExcelData(data) {
    return data.map((item, index) => ({
        'No.': index + 1,
        'Keywords': item.keyword,
        'Chinese Translation': item.translation || ''
    }));
}

// Download Excel file
function downloadExcel(data, filename) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(formatExcelData(data));

    // Set column widths
    const colWidths = [
        { wch: 5 },  // No.
        { wch: 30 }, // Keywords
        { wch: 30 }  // Chinese Translation
    ];
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Keywords');
    XLSX.writeFile(wb, filename);
}

// Initialize DataTable with common settings
function initializeDataTable(tableId, columns) {
    return $(`#${tableId}`).DataTable({
        pageLength: 50,
        columns: columns,
        language: {
            search: "Search:",
            lengthMenu: "Show _MENU_ entries per page",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            paginate: {
                first: "First",
                last: "Last",
                next: "Next",
                previous: "Previous"
            }
        }
    });
}

// Add number column to columns configuration
function addNumberColumn(columns) {
    return [
        {
            data: null,
            render: function (data, type, row, meta) {
                return meta.row + meta.settings._iDisplayStart + 1;
            },
            className: 'number-column'
        },
        ...columns
    ];
}

// Display status message
function showMessage(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    const container = document.querySelector('.main-container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
} 