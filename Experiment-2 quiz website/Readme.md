# Experiment 2: Timed Interactive Quiz with Local Storage Leaderboard & Weather Dashboard

## 📌 Experiment Overview

This experiment focuses on developing an interactive, browser-based quiz application with multiple categories, a question-wise countdown timer, score calculation, and a persistent leaderboard using Local Storage.

The project also includes an asynchronous weather dashboard that retrieves and displays current weather information for a searched city using a public REST API.

The application demonstrates important web development concepts such as React components, event handling, state management, timers, browser storage, and asynchronous API communication.

---

## 🎯 Objectives

- To develop a multi-category interactive quiz application.
- To implement a countdown timer for each question.
- To handle user interactions and quiz events.
- To calculate and display the final quiz score.
- To store leaderboard data using browser Local Storage.
- To understand asynchronous JavaScript using `fetch()` and `async/await`.
- To retrieve and display weather information from a public REST API.
- To build a responsive and user-friendly web interface.

---

## 🚀 Major Features

### 📝 Interactive Quiz

- Three quiz categories:
  - Web Development
  - JavaScript
  - Data & AI
- Multiple-choice questions.
- Selectable time limit per question:
  - 15 seconds
  - 20 seconds
  - 30 seconds
- Automatic countdown timer.
- Automatic handling of unanswered questions after timeout.
- Answer highlighting for correct and incorrect responses.
- Score calculation based on user performance.
- Final result screen displaying the quiz score.

### 🏆 Local Storage Leaderboard

- Stores quiz scores in the browser.
- Preserves leaderboard data after page refresh.
- Displays top-performing quiz participants.
- Supports clearing the leaderboard.
- Demonstrates browser-based data persistence using Local Storage.

### 🌤️ Weather Dashboard

- Allows users to search for a city.
- Retrieves current weather information asynchronously.
- Uses a public weather REST API.
- Displays weather details dynamically.
- Handles loading and API request errors.
- Demonstrates `fetch()` and `async/await`.

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| React.js | Developing reusable, component-based UI |
| Vite | Frontend development and build tool |
| JavaScript (ES6+) | Application logic, events, timers, and API handling |
| CSS3 | Styling, layouts, cards, and responsive design |
| React Router | Navigation between application pages |
| Node.js | JavaScript runtime environment |
| Express.js | Backend server and REST API development |
| Local Storage | Persisting leaderboard data in the browser |
| Fetch API | Communicating with the weather REST API |
| VS Code | Code development and project management |

> **Note:** Express.js and Node.js are included in the technology stack if the project uses a separate backend server. If the application is entirely frontend-based, they may be used only for development or serving purposes.

---

## 🧠 Concepts Demonstrated

### 1. React Components

The application is divided into reusable components to improve code organization and maintainability.

Examples:

- Quiz
- Question Card
- Timer
- Result Screen
- Leaderboard
- Weather Dashboard

### 2. State Management

React state is used to manage:

- Current question
- Selected answer
- Remaining time
- Current score
- Quiz progress
- Weather information
- Loading and error states

### 3. Event Handling

The application responds to user actions such as:

- Selecting a quiz category
- Choosing a time limit
- Clicking an answer
- Moving to the next question
- Searching for a city
- Clearing the leaderboard

### 4. Countdown Timer

A countdown timer is implemented using JavaScript timing functions and React effects.

The timer automatically moves the quiz forward when the allotted time expires.

### 5. Local Storage

The browser's Local Storage API is used to save leaderboard information.

Example:

```javascript
localStorage.setItem("leaderboard", JSON.stringify(scores));
