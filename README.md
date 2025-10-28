# Tic Tac Toe Backend + Frontend Prototype

## Overview
Minimal working slice of our full project:
- Flask backend (port 5050)
- React frontend (port 3000)
- Simple API connection via `/api/tictactoe/move` and `/reset`

## Run Instructions
### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python run.py
```

### Frontend
```bash 
cd frontend
npm install
npm start
```