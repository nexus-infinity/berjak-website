# Berjak & Partners Website

Modern Next.js website for Berjak & Partners, a Melbourne-based metals and minerals trading company operating since 1954.

## Features

- **Modern Next.js 15.3** - Latest features and optimizations
- **Tailwind CSS 4.1** - Custom Berjak brand styling
- **TypeScript Support** - Type-safe development
- **Responsive Design** - Mobile-first approach
- **SEO Optimized** - Meta tags and structured data
- **Vercel Deployment** - Optimized for Vercel hosting

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/berjak-website.git
cd berjak-website

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Development

```bash
# Start development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Build the application
npm run build
# or
yarn build
# or
pnpm build

# Start production server
npm start
# or
yarn start
# or
pnpm start
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.js       # Navigation header
│   ├── Footer.js       # Site footer
│   └── Layout.js       # Page layout wrapper
├── pages/              # Next.js pages
│   ├── _app.js        # App component
│   ├── index.js       # Home page
│   ├── profile.js     # Company profile
│   ├── products.js    # Products showcase
│   ├── contact.js     # Contact information
│   └── offers.js      # Current offers
├── styles/             # Global styles
│   └── globals.css    # Tailwind CSS imports
public/
├── images/            # Static images
└── favicon.ico        # Site favicon
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Configure environment variables if needed
4. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build the application
npm run build

# Deploy the 'out' directory to your hosting provider
```

## Customization

### Brand Colors

Berjak brand colors are defined in `tailwind.config.js`:

```javascript
colors: {
  'berjak-primary': '#1a365d',    // Deep blue
  'berjak-secondary': '#2d5aa0',  // Medium blue
  'berjak-light': '#e2e8f0',      // Light gray-blue
  'berjak-lighter': '#f7fafc',    // Very light gray
  'berjak-text': '#2d3748'        // Dark gray text
}
```

### Adding New Pages

1. Create a new file in `src/pages/`
2. Export a React component as default
3. The Layout component will automatically wrap your page

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary to Berjak & Partners.

## Contact

For questions about this website, contact:
- Email: trading@berjak.com.au
- Phone: +61-3-9596 6999

## Company Information

Berjak & Partners  
240 Bay Street  
Brighton, Victoria 3186  
Australia  

Trading in Ferrous/Non Ferrous Metals & Minerals since 1954

# Berjak Website Rebuild

Modern website rebuild for Berjak, migrating from Crazy Domains hosting.
