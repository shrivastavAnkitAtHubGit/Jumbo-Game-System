# Real-Time Quiz Game Backend

## Overview
This project is a backend for a real-time quiz game where two players compete by answering four questions. The player with the highest score at the end wins. The backend handles authentication, real-time question delivery, answer validation, scoring, and session state management.

## Tech Stack
- **Backend**: NodeJS
- **Database**: MongoDB
- **Real-Time Communication**: WebSockets (socket io)
- **Authentication**: JWT

## Features
1. **User Authentication**
   - User registration and login with JWT authentication
   - Secure password hashing using bcrypt
2. **Game Session Management**
   - Start a game session and match two players
   - Notify players when a game starts
3. **Question Handling**
   - Store and retrieve a set of four multiple-choice questions
   - Deliver questions in real-time
4. **Answer Submission & Scoring**
   - Validate user answers
   - Calculate scores and determine winners
5. **Result Calculation**
   - Calculate the winner at the end of all (default 4) questions
   - Store session results in MongoDB
6. **Real-Time Communication**
   - WebSocket-based event handling
   - Notify users about game progress

## Installation
### Prerequisites
- Node.js (16.20.2+ LTS version recommended)
- MongoDB (local or cloud-based instance)

### Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/shrivastavAnkitAtHubGit/Jumbo-Game-System.git
   cd Jumbo-Game-System
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `development.config.json` file for configuration:
   ```json
   {
     "PORT": 3000,
     "mongoDB": {
       "connectionUri": "your-connectionUri"
     },
     "jwt": {
      "secret": ""
    }
   }
   ```
4. Start the server:
   ```sh
   npm run start
   ```

## API Endpoints
### Authentication
- **`POST /user/register`** - Register a new user
- **`POST /user/login`** - Authenticate a user

### New Game Addition
- **`POST /auth/game`** - Add a new game into system (only admin allowed, *validation not implemented)

### New Question Addition
- **`POST /auth/question`** - Add a new question into system (only admin allowed, *validation not implemented)

### Game Management
- **`POST /auth/game/start`** - Start a new game session

## WebSocket Events
- **`gameInit`** - Notify players when a game starts
- **`questionSend`** - Send a question to players
- **`answerSubmit`** - Receive player answers
- **`gameEnd`** - Announce the winner and end the game

## Project Structure
```
├── modules
│   ├── heath
│   ├── user
│   ├── game
│   ├── question
│   ├── session
├── routes
├── middlewares
├── mongodb
├── utils
├── app.js
├── package.json
└── README.md
```

## Dependencies
- `bcrypt` - For password hashing
- `body-parser` - Parse incoming request bodies
- `compression` - Compress response data
- `helmet` - Secure HTTP headers
- `jsonwebtoken` - Handle JWT authentication
- `lodash` - Utility functions
- `mongoose` - MongoDB ORM
- `restana` - Lightweight web framework
- `socket.io` - Real-time WebSocket communication

## Contributing
Feel free to fork the repository and submit a pull request.

## License
This project is licensed under the ISC License.

---
Developed by **Ankit Shrivastav** 🚀

