# Xeno Mini CRM Platform

A modern CRM platform that enables customer segmentation, personalized campaign delivery, and intelligent insights using AI.

## Features

- 🔐 Secure Google OAuth 2.0 Authentication
- 📊 Dynamic Customer Segmentation with Rule Builder
- 📈 Campaign Management & Analytics
- 🤖 AI-Powered Features:
  - Natural Language to Segment Rules
  - Campaign Performance Summarization
  - Smart Message Suggestions
- 🚀 Asynchronous Data Processing with RabbitMQ
- 📊 Real-time Campaign Delivery Tracking

## Tech Stack

- **Frontend**: React.js with TypeScript
- **Backend**: Node.js with Express
- **Database**: MySQL
- **Message Broker**: RabbitMQ
- **Cache & Queue**: Redis
- **AI Integration**: OpenAI GPT-4
- **Authentication**: Google OAuth 2.0

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- MySQL 8.0
- RabbitMQ
- Redis
- Google Cloud Platform account (for OAuth)
- OpenAI API key

## Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/xeno-crm.git
   cd xeno-crm
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in your credentials in the `.env` file.

3. Start the infrastructure services:
   ```bash
   docker-compose up -d
   ```

4. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

5. Start the development servers:
   ```bash
   # Start backend (from backend directory)
   npm run dev

   # Start frontend (from frontend directory)
   npm start
   ```

## Project Structure

```
├── frontend/                 # React frontend application
│   ├── public/              # Static files
│   └── src/
│       ├── components/      # Reusable React components
│       ├── pages/          # Page components
│       ├── services/       # API services
│       └── utils/          # Utility functions
│
├── backend/                 # Node.js backend application
│   ├── src/
│   │   ├── apis/          # API routes
│   │   ├── services/      # Business logic
│   │   ├── models/        # Database models
│   │   └── utils/         # Utility functions
│   └── tests/             # Backend tests
│
└── docker-compose.yml      # Docker services configuration
```

## API Documentation

### Data Ingestion APIs

- `POST /api/customers` - Create new customer
- `POST /api/orders` - Create new order
- `GET /api/segments` - List all segments
- `POST /api/segments` - Create new segment
- `POST /api/campaigns` - Create new campaign

### AI Features

- `POST /api/ai/parse-query` - Convert natural language to segment rules
- `POST /api/ai/summarize-campaign` - Generate campaign performance insights

## Known Limitations

- Campaign delivery is simulated with a mock vendor API
- No pagination for large campaign lists
- Limited to 1000 customers per segment preview
- AI features require OpenAI API key

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 