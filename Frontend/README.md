# Vibe Commerce Frontend

The React-based frontend for the Vibe Commerce e-commerce application.

## 🌟 Features

- Modern, responsive UI built with React and Tailwind CSS
- Product browsing from both local database and external APIs
- Shopping cart functionality with real-time updates
- Complete checkout process with order confirmation
- Context API for state management
- Axios for API integration
- React Router for client-side navigation

## 🛠️ Technologies Used

- **React 18** - UI library
- **React Router v7** - Client-side routing
- **Tailwind CSS v4** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **Vite** - Build tool and development server
- **Lucide React** - Icon library
- **React Toastify** - Notification system

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── cart/          # Cart-related components
│   ├── layout/        # Layout components (Header, Footer)
│   ├── products/      # Product display components
│   └── ui/            # Generic UI components
├── context/           # React context providers
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── services/          # API service layer
├── utils/             # Utility functions
├── App.jsx            # Main application component
└── main.jsx           # Application entry point
```

## 🎨 Styling

This project uses Tailwind CSS for styling. All styles are utility classes applied directly to components.

## 🔄 API Integration

The frontend integrates with the backend API through the service layer in `src/services/`:

- `cartService.js` - Cart management operations
- `externalProductService.js` - External product API calls
- `orderService.js` - Order processing
- `productService.js` - Local product management

## 🧪 Development

### Linting

```bash
npm run lint
```

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, open an issue in the repository.