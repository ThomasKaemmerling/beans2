# Beans - Angular PWA

This is an Angular Progressive Web App (PWA) version of the original Flutter beans app. The app helps users collect positive moments throughout their day as "beans" to focus on the good things in life.

## Features

- **Collect Beans**: Add positive moments with date and description
- **Bean Overview**: View collected beans with date filtering (last 2 weeks by default)
- **Statistics**: Charts showing beans collected per day/week/month
- **PWA Support**: Offline functionality, installable on mobile and desktop
- **Internationalization**: English and German language support
- **Material Design**: Clean, responsive UI with Angular Material

## Technology Stack

- Angular 17+ with PWA capabilities
- Angular Material for UI components
- TypeScript for type safety
- SCSS for styling
- Service Worker for offline support
- Local Storage for data persistence

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
cd beans-pwa
npm install
```

### Development

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Building for Production

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

### PWA Features

The app includes:
- Service worker for offline functionality
- Web app manifest for installation
- Responsive design for mobile and desktop
- Background sync capabilities

## App Structure

```
beans-pwa/
├── src/
│   ├── app/
│   │   ├── components/          # Angular components
│   │   │   ├── home/           # Main dashboard
│   │   │   ├── add-bean-dialog/ # Add bean modal
│   │   │   ├── bean-list/      # List of collected beans
│   │   │   └── statistics/     # Charts and analytics
│   │   ├── services/           # Angular services
│   │   │   ├── bean.ts         # Bean data management
│   │   │   └── localization.ts # i18n support
│   │   └── models/             # TypeScript interfaces
│   └── assets/                 # Static assets (images, translations)
```

## Data Model

```typescript
interface Bean {
  id?: string;
  text: string;          // Description of positive moment
  date: string;          // ISO date string for the bean
  insertDate: string;    // ISO date string when bean was created
}
```

## Translation Support

The app supports English and German languages with translation files located in `/assets/lang/`:
- `en.json` - English translations
- `de.json` - German translations

## Contributing

This Angular PWA maintains the same core functionality as the original Flutter app while providing web-native features like PWA capabilities and responsive design.

## License

Same as the original Flutter project.
"# beans2" 
