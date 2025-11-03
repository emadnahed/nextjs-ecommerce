import requests
from bs4 import BeautifulSoup
import json
import csv
from urllib.parse import urljoin
from typing import List, Dict, Any
import time
import re

class ZeyreyScraper:
    BASE_URL = "https://www.zeyrey.net"
    COLLECTION_URL = "https://www.zeyrey.net/collections/all"

    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        })

    def get_page_products(self, page_url: str) -> List[Dict[str, Any]]:
        """Extract products from a single page"""
        try:
            print(f"Fetching: {page_url}")
            response = self.session.get(page_url, timeout=15)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html5lib')

            products = []
            # Find all product cards
            product_cards = soup.select('li.grid__item .card-wrapper')
            print(f"Found {len(product_cards)} products on this page")

            for idx, card in enumerate(product_cards, 1):
                try:
                    # Extract product URL
                    link = card.select_one('a.full-unstyled-link')
                    if not link:
                        continue

                    product_url = urljoin(self.BASE_URL, link['href'])
                    print(f"  [{idx}/{len(product_cards)}] Processing: {product_url}")

                    # Get product details from the product page
                    product_data = self.get_product_details(product_url)
                    if product_data:
                        products.append(product_data)
                        print(f"    ✓ Extracted: {product_data['title'][:50]}...")

                    # Be nice to the server
                    time.sleep(1.5)

                except Exception as e:
                    print(f"    ✗ Error processing product: {e}")
                    continue

            return products

        except Exception as e:
            print(f"Error fetching page {page_url}: {e}")
            return []

    def get_product_details(self, url: str) -> Dict[str, Any]:
        """Extract detailed product information from product page"""
        try:
            response = self.session.get(url, timeout=15)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html5lib')

            # Extract title
            title_elem = soup.find('h1')
            if not title_elem:
                print("      Warning: Title not found")
                return None
            title = self._clean_text(title_elem.text)

            # Extract description
            desc_elem = soup.select_one('.product__description, .product-single__description, [class*="description"]')
            description = self._clean_text(desc_elem.text) if desc_elem else f"{title} - Premium quality clothing"
            if len(description) < 10:
                description = f"{title} - Premium quality clothing"

            # Extract price
            price = self._extract_price(soup)
            if not price or price <= 0:
                print(f"      Warning: Invalid price for {title}")
                return None

            # Extract images
            image_urls = self._get_image_urls(soup)

            # Determine gender from title
            gender = self._determine_gender(title)

            # Determine type
            product_type = self._determine_type(title)

            # Extract colors (try to find color variants)
            colors = self._extract_colors(soup, title)

            # Extract sizes
            sizes = self._extract_sizes(soup)

            # Extract material
            material = self._extract_material(soup, title)

            # Build product data
            product = {
                'title': title,
                'description': description[:500],  # Limit description length
                'type': product_type,
                'gender': gender,
                'colors': colors,
                'material': material,
                'price': price,
                'salePrice': '',
                'discount': '',
                'featured': 'false',
                'inStock': 'true',
                'sku': self._generate_sku(title),
                'sizes': sizes,
                'imageURLs': image_urls
            }

            # Check for sale price
            sale_price = self._extract_sale_price(soup)
            if sale_price and sale_price < price:
                product['salePrice'] = sale_price
                product['discount'] = int(((price - sale_price) / price) * 100)

            return product

        except Exception as e:
            print(f"      Error getting product details from {url}: {e}")
            return None

    def _extract_price(self, soup) -> float:
        """Extract regular price from product page"""
        try:
            # Try multiple selectors
            price_elem = soup.select_one('.price-item--regular, .product-price, [class*="price"]')
            if price_elem:
                price_text = price_elem.text
                # Extract numbers (handle Rs. format)
                numbers = re.findall(r'[\d,]+\.?\d*', price_text.replace(',', ''))
                if numbers:
                    return float(numbers[0])
        except:
            pass
        return 0

    def _extract_sale_price(self, soup) -> float:
        """Extract sale price if available"""
        try:
            sale_elem = soup.select_one('.price-item--sale')
            if sale_elem:
                price_text = sale_elem.text
                numbers = re.findall(r'[\d,]+\.?\d*', price_text.replace(',', ''))
                if numbers:
                    return float(numbers[0])
        except:
            pass
        return 0

    def _get_image_urls(self, soup) -> str:
        """Extract image URLs from product page"""
        try:
            images = []

            # Try multiple selectors for product images
            img_selectors = [
                '.product__media img',
                '.product-single__photo img',
                '[class*="product-image"] img',
                '.product-gallery img'
            ]

            for selector in img_selectors:
                for img in soup.select(selector):
                    src = img.get('src') or img.get('data-src')
                    if src and 'no-image' not in src and 'placeholder' not in src:
                        # Clean up the URL
                        if src.startswith('//'):
                            src = f'https:{src}'
                        # Remove size parameters to get full size
                        src = re.sub(r'[?&]width=\d+', '', src)
                        src = re.sub(r'_\d+x\d+\.', '.', src)

                        if src not in images:
                            images.append(src)

                if images:  # If we found images with this selector, stop
                    break

            return ','.join(images[:5])  # Return up to 5 images
        except:
            return ''

    def _extract_colors(self, soup, title: str) -> str:
        """Extract available colors"""
        colors = []

        # Try to infer from title
        color_keywords = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple',
                        'Gray', 'Navy', 'Khaki', 'Beige', 'Brown', 'Orange', 'Maroon']
        for color in color_keywords:
            if color.lower() in title.lower():
                colors.append(color)

        # Default colors if none found
        if not colors:
            colors = ['Black', 'White', 'Navy']

        return ','.join(colors[:5])  # Limit to 5 colors

    def _extract_sizes(self, soup) -> str:
        """Extract available sizes"""
        sizes = []

        # Try to find size options
        size_elems = soup.select('[class*="size"] option, [class*="variant"] option, select option')
        for elem in size_elems:
            size_text = elem.text.strip()
            if size_text and len(size_text) <= 5 and size_text.upper() in ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']:
                sizes.append(size_text.upper())

        # Default sizes if none found
        if not sizes:
            sizes = ['S', 'M', 'L', 'XL']

        return ','.join(sizes)

    def _extract_material(self, soup, title: str) -> str:
        """Extract material information"""
        # Common materials
        materials = ['Cotton', 'Polyester', 'Linen', 'Silk', 'Wool', 'Denim', 'Leather']

        # Check in description or title
        desc = soup.select_one('.product__description, .product-single__description')
        search_text = (title + ' ' + (desc.text if desc else '')).lower()

        for material in materials:
            if material.lower() in search_text:
                return material

        # Check for percentage (like "100% Cotton")
        if '100%' in search_text and 'cotton' in search_text:
            return 'Cotton'

        return 'Cotton'  # Default

    def _determine_type(self, title: str) -> str:
        """Determine product type from title"""
        title_lower = title.lower()

        type_keywords = {
            'T-Shirt': ['t-shirt', 'tshirt', 't shirt', 'tee'],
            'Hoodie': ['hoodie', 'sweatshirt', 'hooded'],
            'Shirt': ['shirt', 'blouse'],
            'Dress': ['dress'],
            'Jacket': ['jacket', 'coat'],
            'Pants': ['pants', 'trousers', 'jeans'],
            'Shorts': ['shorts'],
            'Skirt': ['skirt']
        }

        for ptype, keywords in type_keywords.items():
            for keyword in keywords:
                if keyword in title_lower:
                    return ptype

        return 'Clothing'

    def _determine_gender(self, title: str) -> str:
        """Determine gender from title"""
        title_lower = title.lower()

        # Check for women first (more specific patterns)
        if any(word in title_lower for word in ['women\'s', 'womens', 'female', 'woman', 'for women', 'ladies', 'girl']):
            return 'Women'
        # Then check for men
        elif any(word in title_lower for word in ['men\'s', 'mens', 'male', 'man', 'for men', 'gentleman']):
            return 'Men'
        elif 'unisex' in title_lower:
            return 'Unisex'

        # Default to Unisex
        return 'Unisex'

    def _generate_sku(self, title: str) -> str:
        """Generate a unique SKU"""
        # Create SKU from first letters and hash
        words = title.split()[:3]
        prefix = ''.join([w[0].upper() for w in words if w])
        hash_val = abs(hash(title)) % 10000
        return f"{prefix}-{hash_val}"

    def _clean_text(self, text: str) -> str:
        """Clean and normalize text"""
        if not text:
            return ''
        # Remove extra whitespace and newlines
        text = ' '.join(text.split())
        # Remove special characters but keep basic punctuation
        text = re.sub(r'[^\w\s\-,.\']', '', text)
        return text.strip()

    def scrape_all_products(self, max_pages: int = 8) -> List[Dict[str, Any]]:
        """Scrape products from multiple pages"""
        all_products = []

        for page_num in range(1, max_pages + 1):
            if page_num == 1:
                page_url = self.COLLECTION_URL
            else:
                page_url = f"{self.COLLECTION_URL}?page={page_num}"

            print(f"\n{'='*60}")
            print(f"Scraping page {page_num}/{max_pages}...")
            print(f"{'='*60}")

            products = self.get_page_products(page_url)

            if not products:
                print(f"No products found on page {page_num}. Stopping.")
                break

            all_products.extend(products)
            print(f"\nPage {page_num} complete: {len(products)} products extracted")
            print(f"Total products so far: {len(all_products)}")

            # Small delay between pages
            time.sleep(2)

        return all_products

def save_to_csv(products: List[Dict[str, Any]], filename: str):
    """Save products to CSV file"""
    if not products:
        print("No products to save!")
        return

    fieldnames = [
        'title', 'description', 'type', 'gender', 'colors', 'material',
        'price', 'salePrice', 'discount', 'featured', 'inStock', 'sku', 'sizes', 'imageURLs'
    ]

    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(products)

    print(f"✓ CSV file saved: {filename}")


def save_to_json(products: List[Dict[str, Any]], filename: str):
    """Save products to JSON file"""
    if not products:
        print("No products to save!")
        return

    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2, ensure_ascii=False)

    print(f"✓ JSON file saved: {filename}")


def main():
    """Main function to run the scraper"""
    import sys

    print("\n" + "="*60)
    print("Zeyrey Product Scraper")
    print("="*60 + "\n")

    # Get max pages from command line or use default
    max_pages = 8  # Default to all pages as mentioned by user
    if len(sys.argv) > 1:
        try:
            max_pages = int(sys.argv[1])
            print(f"Scraping {max_pages} page(s) as requested\n")
        except ValueError:
            print("Invalid page number, using default (8 pages)\n")

    # Initialize scraper
    scraper = ZeyreyScraper()

    # Scrape products
    print("Starting product extraction from https://www.zeyrey.net/")
    print(f"This may take a while depending on the number of products...\n")

    products = scraper.scrape_all_products(max_pages=max_pages)

    if not products:
        print("\n❌ No products found or an error occurred.")
        return

    # Display summary
    print("\n" + "="*60)
    print("SCRAPING COMPLETE")
    print("="*60)
    print(f"\nTotal products extracted: {len(products)}")

    # Show sample product
    if products:
        print("\nSample product:")
        print(f"  Title: {products[0]['title']}")
        print(f"  Type: {products[0]['type']}")
        print(f"  Gender: {products[0]['gender']}")
        print(f"  Price: Rs. {products[0]['price']}")
        print(f"  SKU: {products[0]['sku']}")

    # Save to files
    print("\nSaving data...")
    save_to_csv(products, 'products_export.csv')
    save_to_json(products, 'products_export.json')

    print("\n" + "="*60)
    print("FILES SAVED SUCCESSFULLY")
    print("="*60)
    print("\nYou can now import these files to your e-commerce platform:")
    print("  • products_export.csv - For spreadsheet applications")
    print("  • products_export.json - For direct database import")
    print("\nNext steps:")
    print("  1. Review the exported files")
    print("  2. Verify product data accuracy")
    print("  3. Upload images to your preferred hosting service")
    print("  4. Update imageURLs with the new hosted URLs")
    print("  5. Import to your database using the import endpoint")
    print("\n")


if __name__ == "__main__":
    main()
