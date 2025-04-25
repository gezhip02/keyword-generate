// Initialize table
let resultsTable;
let generatedKeywords = [];

$(document).ready(function() {
    initializeTable();
    setupEventListeners();
});

function initializeTable() {
    const columns = [
        { data: 'keyword' },
        { data: 'translation' },
        {
            data: null,
            render: function(data, type, row, meta) {
                return `
                    <button class="btn btn-sm btn-primary edit-btn">Edit</button>
                    <button class="btn btn-sm btn-danger delete-btn">Delete</button>
                `;
            }
        }
    ];

    resultsTable = initializeDataTable('resultsTable', addNumberColumn(columns));

    // Handle edit button click
    $('#resultsTable').on('click', '.edit-btn', function() {
        const row = $(this).closest('tr');
        const data = resultsTable.row(row).data();
        
        // Create edit form
        const editForm = `
            <tr class="editing">
                <td></td>
                <td><input type="text" class="form-control edit-keyword" value="${data.keyword}"></td>
                <td><input type="text" class="form-control edit-translation" value="${data.translation}"></td>
                <td>
                    <button class="btn btn-sm btn-success save-btn">Save</button>
                    <button class="btn btn-sm btn-secondary cancel-btn">Cancel</button>
                </td>
            </tr>
        `;
        
        row.hide();
        row.after(editForm);
    });

    // Handle save button click
    $('#resultsTable').on('click', '.save-btn', function() {
        const editRow = $(this).closest('tr');
        const originalRow = editRow.prev();
        const rowData = resultsTable.row(originalRow).data();
        
        // Update data
        rowData.keyword = editRow.find('.edit-keyword').val();
        rowData.translation = editRow.find('.edit-translation').val();
        
        // Update table
        resultsTable.row(originalRow).data(rowData).draw();
        
        // Clean up
        editRow.remove();
        originalRow.show();
    });

    // Handle cancel button click
    $('#resultsTable').on('click', '.cancel-btn', function() {
        const editRow = $(this).closest('tr');
        const originalRow = editRow.prev();
        editRow.remove();
        originalRow.show();
    });

    // Handle delete button click
    $('#resultsTable').on('click', '.delete-btn', function() {
        if (confirm('Are you sure you want to delete this row?')) {
            const row = $(this).closest('tr');
            resultsTable.row(row).remove().draw();
        }
    });
}

function setupEventListeners() {
    // Keywords file upload handler
    document.getElementById('keywordsFileInput').addEventListener('change', handleFileUpload);
}

function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onerror = function(error) {
        console.error('Error reading file:', error);
        alert('Error reading file. Please try again.');
    };
    
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);

            // Process and display the keywords
            generatedKeywords = jsonData.map(row => ({
                keyword: row.Keywords || row.keywords || '',
                translation: row['Chinese Translation'] || row['中文翻译'] || ''
            })).filter(item => item.keyword); // Filter out empty keywords

            // Update the results table
            resultsTable.clear().rows.add(generatedKeywords).draw();
        } catch (error) {
            console.error('Error processing file:', error);
            alert('Error processing file. Please make sure the file format is correct.');
        }
    };

    try {
        reader.readAsArrayBuffer(file);
    } catch (error) {
        console.error('Error reading file:', error);
        alert('Error reading file. Please try again.');
    }
}

function downloadResults() {
    if (generatedKeywords.length === 0) {
        alert('No keywords available to download');
        return;
    }

    downloadExcel(generatedKeywords, 'keywords_result.xlsx');
} 