# Trip Plotter

Transform your travel itinerary into an interactive map. Plan, edit, and share your journey with ease.

## Features

- **AI-Powered Parsing**: Paste your itinerary in natural language and watch it transform into structured trip data
- **Interactive Map**: Visualize all your destinations on a beautiful dark-themed Leaflet map
- **Calendar Integration**: View and edit trip dates with a built-in calendar
- **Location Management**: Add, edit, reorder, and remove locations
- **Shareable Links**: Generate URL-encoded links to share your trip with others
- **Natural Language Itinerary**: Generate a polished, readable itinerary from your trip data
- **Session Caching**: Generated itineraries are cached to avoid redundant API calls

## Getting Started

### Prerequisites

- Node.js 18+
- A Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Create a `.env.local` file with your Gemini API key:

```
GEMINI_API_KEY=your_api_key_here
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Creating a Trip

1. On the home page, paste your itinerary in natural language format:

```
27th - Travel from Hanoi to Sapa, stop by Sapa Stone Church
28th - Trek to Muong Hoa Valley, explore local villages
29th - Cable car to Fansipan Mountain
30th - Return to Hanoi
```

2. Click "Plan My Trip" to parse your itinerary
3. View your trip on the interactive map

### Editing Your Trip

- **Change dates**: Click on a location card, expand it, and use the date picker
- **Edit names**: Click the pencil icon next to a location name
- **Add locations**: Use the "Add Location" button at the bottom of the sidebar
- **Remove locations**: Expand a location card and click "Remove"
- **Reorder**: Locations are connected in order; future updates will support drag-and-drop

### Sharing

Click the "Share" button in the header to copy a shareable URL. The entire trip is encoded in the URL, so recipients can view your exact itinerary without needing an account.

### Generating Itinerary

Click "Generate Itinerary" to create a natural language description of your trip. The generated text is cached in your browser session, so you can view it again without hitting the API.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI Components**: shadcn/ui (Radix primitives)
- **Styling**: Tailwind CSS 4
- **Maps**: Leaflet.js with react-leaflet
- **AI**: Google Gemini 1.5 Flash
- **Date Handling**: date-fns
- **URL Compression**: lz-string

## Project Structure

```
app/
├── page.tsx                 # Home page (itinerary input)
├── trip/page.tsx            # Trip page (map + sidebar)
├── api/
│   ├── parse-itinerary/     # Parse text with Gemini
│   └── generate-itinerary/  # Generate NL itinerary

components/
├── ui/                      # shadcn components
├── itinerary-input.tsx      # Main input form
├── trip-map.tsx             # Leaflet map
├── trip-sidebar.tsx         # Calendar + locations
├── location-card.tsx        # Editable location
├── calendar-view.tsx        # Trip calendar
├── itinerary-modal.tsx      # Generated itinerary
└── share-button.tsx         # Copy share link

lib/
├── types.ts                 # TypeScript interfaces
├── gemini.ts                # Gemini API client
└── url-encoding.ts          # lz-string utilities

hooks/
├── use-trip.ts              # Trip state management
└── use-itinerary-cache.ts   # Session storage caching
```

## License

MIT
