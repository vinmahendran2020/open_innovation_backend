# My NestJS Project

## Getting Started

### Clone Repository

```bash
git clone <repository-url>
cd my-nestjs-project
```

### Install Dependencies

```bash
npm install
```

### Environment Setup

```bash
cp .env.example .env
```

Update `.env` with your database configuration:
- Set `DBURL` to your PostgreSQL instance URL from https://neon.com/ or local PostgreSQL connection string

### Database Setup

```bash
npm run migration:generate
npm run migration:run
```

### Start Service

```bash
npm run start:dev
```

### API Documentation

Visit `http://localhost:3001/api` for Swagger documentation.
