# Zeyrey Product Scraper Guide

## Overview
This scraper extracts product data from https://www.zeyrey.net/ and formats it according to your e-commerce platform requirements.

## Features
- Scrapes all product pages (up to 8 pages or configurable)
- Extracts comprehensive product information
- Generates both CSV and JSON output formats
- Handles pagination automatically
- Implements polite scraping with delays
- Auto-generates SKUs
- Intelligently determines product type, gender, colors, and materials
- Extracts multiple product images

## Installation

### 1. Install Python Dependencies
```bash
pip install -r requirements.txt
```

Or install manually:
```bash
pip install requests beautifulsoup4 lxml html5lib
```

### 2. Verify Installation
```bash
python scraper.py --help
```

## Usage

### Basic Usage (Scrape All 8 Pages)
```bash
python scraper.py
```

### Scrape Specific Number of Pages
```bash
# Scrape only first 2 pages (for testing)
python scraper.py 2

# Scrape all pages
python scraper.py 8
```

### Test Run (1 Page)
```bash
python scraper.py 1
```

## Output Files

The scraper generates two files:

### 1. products_export.csv
- Human-readable CSV format
- Can be opened in Excel/Google Sheets
- Easy to review and edit

### 2. products_export.json
- Machine-readable JSON format
- Direct database import
- API integration ready

## Extracted Data Fields

### Required Fields
- **title**: Product name (min 3 characters)
- **description**: Product description (min 10 characters)
- **type**: Product category (T-Shirt, Hoodie, Shirt, etc.)
- **gender**: Men, Women, or Unisex
- **colors**: Comma-separated color list
- **material**: Fabric type (Cotton, Polyester, etc.)
- **price**: Product price (numeric)
- **featured**: true/false
- **inStock**: true/false
- **sizes**: Comma-separated size list (S,M,L,XL)
- **imageURLs**: Comma-separated image URLs

### Optional Fields
- **salePrice**: Discounted price (if on sale)
- **discount**: Discount percentage (auto-calculated)
- **sku**: Stock Keeping Unit (auto-generated)

## Data Extraction Logic

### Product Type Detection
The scraper automatically detects product types from titles:
- T-Shirt: "t-shirt", "tshirt", "tee"
- Hoodie: "hoodie", "sweatshirt"
- Shirt: "shirt", "blouse"
- Dress: "dress"
- Jacket: "jacket", "coat"
- Pants: "pants", "trousers", "jeans"

### Gender Detection
Intelligently determines gender from title keywords:
- **Men**: "men's", "mens", "male", "for men"
- **Women**: "women's", "womens", "female", "for women", "ladies"
- **Unisex**: Default if no gender keywords found

### Material Detection
Searches for common materials in title and description:
- Cotton (100% Cotton detected automatically)
- Polyester
- Linen
- Silk
- Wool
- Denim
- Leather

### Color Extraction
1. Attempts to extract from product variants
2. Detects from title keywords
3. Falls back to default: Black, White, Gray

### Size Extraction
1. Extracts from product size options
2. Falls back to default: S, M, L, XL

## Output Example

### CSV Format
```csv
title,description,type,gender,colors,material,price,salePrice,discount,featured,inStock,sku,sizes,imageURLs
"Classic T-Shirt","Premium cotton t-shirt","T-Shirt","Unisex","Black,White","Cotton",29.99,24.99,17,false,true,"CT-1234","S,M,L,XL","https://example.com/img1.jpg,https://example.com/img2.jpg"
```

### JSON Format
```json
{
  "title": "Classic T-Shirt",
  "description": "Premium cotton t-shirt",
  "type": "T-Shirt",
  "gender": "Unisex",
  "colors": "Black,White",
  "material": "Cotton",
  "price": 29.99,
  "salePrice": 24.99,
  "discount": 17,
  "featured": false,
  "inStock": true,
  "sku": "CT-1234",
  "sizes": "S,M,L,XL",
  "imageURLs": "https://example.com/img1.jpg,https://example.com/img2.jpg"
}
```

## Important Notes

### Image URLs
- The scraper extracts image URLs from zeyrey.net
- These URLs point to the original website
- **Before importing**: Upload images to your own hosting service
- Update imageURLs field with your hosted URLs
- Recommended hosting: Imgur, ImgBB, Cloudinary, AWS S3

### Data Validation
After scraping, verify:
1. Prices are in correct currency format
2. All required fields are populated
3. Image URLs are accessible
4. Colors and sizes match your database options
5. Gender values are: "Men", "Women", or "Unisex" (case-sensitive)

### Performance
- Each product requires a separate page request
- Average time: ~1.5 seconds per product
- For 100 products: ~2.5 minutes
- For all 8 pages (~120 products): ~3-4 minutes

### Politeness
The scraper implements delays to be respectful:
- 1.5 seconds between products
- 2 seconds between pages
- Proper User-Agent header
- No concurrent requests

## Post-Scraping Workflow

### 1. Review Exported Data
```bash
# Open CSV in spreadsheet
open products_export.csv

# View JSON
cat products_export.json | jq '.'
```

### 2. Upload Images
Upload all product images to your hosting service and note the URLs.

### 3. Update Image URLs
Option A: Manual update in CSV/JSON
Option B: Use a script to batch update

### 4. Import to Database
Use your platform's import endpoint:
```bash
# Example using your API
curl -X POST http://localhost:3000/api/admin/products/import \
  -H "Content-Type: application/json" \
  -d @products_export.json
```

## Troubleshooting

### "No products found"
- Check internet connection
- Verify website is accessible: https://www.zeyrey.net/
- Website structure may have changed

### "Error processing product"
- Some products may fail due to missing data
- Check individual error messages
- Script continues with other products

### Slow Performance
- This is normal due to polite delays
- Reduce pages for testing: `python scraper.py 1`
- Don't reduce delays (be respectful to server)

### Import Errors
Common fixes:
- Ensure gender is: "Men", "Women", or "Unisex" (not "male")
- Boolean values must be lowercase: "true" not "TRUE"
- Remove spaces from comma-separated values
- Use HTTPS for all image URLs

## Advanced Usage

### Modify Scraper for Your Needs

Edit `scraper.py` to customize:

```python
# Change default sizes
sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

# Change default colors
colors = ['Black', 'White', 'Navy', 'Gray']

# Add more product types
type_keywords = {
    'Sweater': ['sweater', 'pullover'],
    'Accessory': ['hat', 'cap', 'bag']
}
```

### Extract Additional Fields

The scraper can be extended to extract:
- Brand name
- Product ratings
- Stock quantity
- Additional descriptions
- Meta tags

## Best Practices

1. **Test First**: Run with 1 page before full scrape
2. **Backup**: Keep original export files
3. **Verify**: Review data before importing
4. **Images**: Host images on reliable service
5. **Schedule**: Run during off-peak hours
6. **Update**: Re-scrape periodically for new products

## Data Format Requirements

As per your specifications:

✅ Valid:
- gender: "Men", "Women", "Unisex"
- featured: true, false (lowercase)
- colors: "Black,White,Red" (no spaces)
- imageURLs: https://... (HTTPS required)

❌ Invalid:
- gender: "male", "M", "m"
- featured: TRUE, False
- colors: "Black, White, Red"
- imageURLs: http://... or local paths

## Support

For issues or questions:
1. Check error messages in console output
2. Review this guide
3. Verify website structure hasn't changed
4. Check your internet connection

## License

This scraper is for authorized use only. Ensure you have permission to scrape the website and comply with its terms of service.

---

**Version**: 2.0
**Last Updated**: November 2025
**Supported Python**: 3.7+
