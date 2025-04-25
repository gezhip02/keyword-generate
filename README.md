# SEO Keyword Generator Pro

A powerful web-based tool for generating SEO keywords by combining topics with root words. This tool is designed to help content creators and SEO specialists generate relevant keyword combinations efficiently.

## Features

- **Topic and Root Word Management**
  - Input topics and their Chinese translations
  - Manage root words and their Chinese meanings
  - Excel file upload support for bulk data input

- **Keyword Generation**
  - Automatic combination of topics with root words
  - Smart filtering to avoid invalid combinations
  - Bilingual support (English and Chinese)

- **Data Management**
  - DataTables integration for better data visualization
  - Pagination and search functionality
  - Excel export feature for generated keywords

## Getting Started

### Prerequisites

No installation required! This is a client-side web application that runs directly in your browser.

### Usage

1. **Open the Application**
   - Open `index.html` in a modern web browser

2. **Input Data**
   - Use the default sample data, or
   - Upload your own Excel file with topics and root words
   - Excel format should include columns for English terms and Chinese translations

3. **Generate Keywords**
   - Click the "Generate Keywords" button to create combinations
   - Review the generated keywords in the Keywords tab
   - Download results as an Excel file

### Excel File Format

#### For Topics and Roots Upload:
- Required columns:
  - `topic` - English topic words
  - `主题词中文释义` - Chinese translations (optional)
  - `roots` - English root words
  - `词根中文释义` - Chinese translations (optional)

#### For Keywords Upload:
- Required columns:
  - `Keywords` - English keywords
  - `Chinese Translation` - Chinese translations (optional)

## Technical Details

### Built With
- HTML5
- CSS3 (Bootstrap 5.1.3)
- JavaScript (jQuery 3.6.0)
- DataTables 1.11.5
- SheetJS (XLSX) for Excel file handling

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

This project is available for free use.

## Acknowledgments

- Bootstrap for the responsive design framework
- DataTables for enhanced table functionality
- SheetJS for Excel file processing 