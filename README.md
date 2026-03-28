# Future Message AI

A SaaS web app that generates personalized "messages from the future self" using AI.

## Features

- **Personalized AI Messages**: Get emotional messages from your future self based on your current problems
- **Beautiful UI**: Modern glass-morphism design with purple/blue gradient theme
- **Monetization Lock**: Preview system with paid unlock functionality
- **Responsive Design**: Mobile-first, works on all devices
- **Typing Animation**: Realistic message reveal effect
- **Vanilla JavaScript**: No React dependencies for better performance

## Tech Stack

- **Frontend**: Vanilla JavaScript + Vite
- **Styling**: Tailwind CSS
- **AI**: OpenAI API (gpt-4o-mini)
- **Deployment**: Vercel-ready

## Quick Start

1. **Clone and install:**
   ```bash
   git clone <your-repo>
   cd future-message-ai
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Add your OpenAI API key to .env
   VITE_OPENAI_API_KEY=your_key_here
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

```
Future Message AI/
├── index.html          # Main HTML file
├── style.css           # Tailwind CSS + custom styles
├── script.js           # Main JavaScript logic
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind configuration
├── postcss.config.js   # PostCSS configuration
└── .env.example        # Environment variables template
```

## Environment Variables

- `VITE_OPENAI_API_KEY`: Your OpenAI API key

## Deployment

The app is ready for Vercel deployment:

1. Connect your repository to Vercel
2. Add `VITE_OPENAI_API_KEY` as an environment variable
3. Deploy!

## Monetization

Currently uses a simulated payment system. To integrate real payments:

1. Replace the `unlockBtn` event handler in `script.js`
2. Integrate Razorpay, Stripe, or UPI payment gateway
3. Handle payment success/failure states

## Customization

- **AI Prompt**: Modify the prompt in `script.js`
- **Styling**: Update CSS classes in `style.css`
- **Pricing**: Change the unlock price in `index.html`

## License

MIT
