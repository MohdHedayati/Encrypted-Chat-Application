# Introduction to React

React is a popular **JavaScript library** for building user interfaces, especially single-page web apps. It lets you create reusable UI components that update efficiently when your data changes.

---

## Key Concepts

- **Components:** Independent, reusable pieces of UI (like buttons, forms, headers). Written as JavaScript functions or classes.
- **JSX:** A syntax that looks like HTML but works inside JavaScript. React uses JSX to define what the UI looks like.
- **State & Props:**  
  - **State** holds data that can change inside a component.  
  - **Props** are inputs passed to components to customize them.

---

## Typical React App File Setup

my-react-app/  
├── public/  
│ └── index.html # The HTML page where React injects the app  
├── src/  
│ ├── App.js # Main root component  
│ ├── index.js # Entry point that renders App.js into the page  
│ └── (OtherComponents).js # Additional UI components  
├── package.json # Project config and dependencies  
└── node_modules/ # Installed packages (auto-generated)


---

## How to Create a Basic React App

### 1. Create React App (using terminal)

```bash
npx create-react-app my-react-app
cd my-react-app
npm start
```
This sets up the folder structure above and starts the app on `localhost:3000`.

### 2. `index.js` (Entry point)

```
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

```
This code tells React to render the `<App />` component inside the `<div id="root"></div>` of `index.html`.

### 3. `App.js` (Main Component)

```
import React from 'react';

function App() {
  return (
    <div>
      <h1>Hello, React!</h1>
      <p>Welcome to my first React app.</p>
    </div>
  );
}

export default App;

```
This defines a simple component that renders a heading and paragraph.

### 4. `public/index.html` (Basic HTML)

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div> <!-- React app renders here -->
  </body>
</html>

```
