# ♻️ ScrapChain

> India's digital waste marketplace — connecting households, kabadi-walas, and industrial recyclers.

## Stack
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Auth:** JWT + bcryptjs
- **Frontend:** HTML, CSS, Vanilla JS

## Quick Start

```bash
git clone https://github.com/your-org/scrapchain.git
cd scrapchain
npm install
cp .env.example .env   # add your MONGO_URI and JWT_SECRET
npm run dev            # http://localhost:5000
```

## Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/scrapchain
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
```

## API Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login & get token |
| GET | `/api/materials` | Live scrap prices |
| POST | `/api/pickups` | Schedule pickup |
| GET | `/api/pickups` | List pickups |
| PUT | `/api/pickups/:id` | Update pickup status |
| GET | `/api/transactions` | Transaction history |
| GET | `/api/epr/credits` | EPR credit listing |

## User Roles

| Role | Access |
|---|---|
| `citizen` | Schedule pickups, view prices, track impact |
| `kabadi` | Accept pickups, log weights, manage inventory |
| `recycler` | Buy bulk scrap, purchase EPR credits |
| `admin` | Full platform access |

## Project Structure

```
scrapchain/
├── server/
│   ├── models/        # Mongoose schemas
│   ├── routes/        # Express route handlers
│   ├── middleware/    # Auth, validation, errors
│   └── config/        # DB connection
├── public/            # Frontend (HTML/CSS/JS)
├── server.js          # Entry point
└── .env
```

## License
MIT — Built with ♻️ in India
