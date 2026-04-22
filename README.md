# Build Your Own AI Assistant 🤖

A modern, minimal, and fully responsive web UI for creating customized AI assistants on any topic.

## Features ✨

- **Landing Screen**: Enter a topic and create a specialized AI
- **Loading State**: Beautiful animated loading with Lottie integration
- **Chat Interface**: Full-featured chat with topic-specific AI responses
- **Glassmorphism Design**: Modern UI with frosted glass effects and neon accents
- **Fully Responsive**: Works seamlessly on mobile, tablet, and desktop
- **Smooth Transitions**: Elegant animations between pages
- **Green Gradient Theme**: Premium, startup-like aesthetic

## Pages

### 1. Landing Page
- Bold heading: "Build Your Own AI Assistant"
- Subtitle: "Create a focused AI for anything you want"
- Large input field with placeholder
- 6 example topic chips (clickable)
- Primary CTA button with glow effect
- Decorative gradient elements

### 2. Loading Page
- Displays selected topic
- Lottie animation integration (from your .lottie file)
- Fallback spinner if animation unavailable
- Animated loading dots
- Gradient background

### 3. Chat Interface
- Header showing AI specialization
- Full-screen chat layout
- User messages on the right
- AI messages on the left
- Bottom input bar with send button
- "New" button to create a new AI
- Simulated AI responses

## Tech Stack

- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **Lottie React** - Animations
- **PostCSS** - CSS processing

## Installation

1. Navigate to the project directory:
```bash
cd c:\Users\Varun\Desktop\chatty_1
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Project Structure

```
src/
├── App.js                 # Main component with state management
├── index.js              # React entry point
├── index.css             # Global styles
├── App.css               # App-specific styles
└── pages/
    ├── Landing.js        # Landing page component
    ├── Loading.js        # Loading state component
    └── Chat.js           # Chat interface component
```

## Key Features

### State Management
- Topic is maintained across all pages
- Smooth page transitions with fade-in animations
- 3-second simulated loading before chat starts

### Styling
- Glassmorphism effects with backdrop blur
- Neon green gradient accents (hex: #22c55e)
- Responsive grid layouts
- Custom animations (fade-in, pulse, bounce)

### Interactive Elements
- Click example chips to populate input
- Press Enter to send messages
- Hover effects on buttons and inputs
- Loading states with visual feedback

## Customization

### Colors
Edit `src/index.css` to change the green accent color:
```css
color: #22c55e;  /* Change this hex value */
```

### Animation Duration
Modify loading delay in `src/App.js`:
```javascript
setTimeout(() => {
  setCurrentPage('chat');
}, 3000);  // Change timeout duration
```

### Example Topics
Update `EXAMPLE_TOPICS` in `src/pages/Landing.js` to add more suggestions.

## Notes

- The Lottie animation loads from `C:\Users\Varun\Downloads\Live chatbot.lottie`
- If the animation file is not found, a fallback spinner is displayed
- AI responses are simulated - connect to a real API for production use

## Future Enhancements

- Connect to OpenAI API or other LLM services
- Add persistent chat history
- User authentication
- Conversation export/sharing
- Voice input/output
- Custom AI personality settings

## License

MIT
