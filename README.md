# ADVITIYA_JPD_HUB
# Talent Pool Website

This repository contains the codebase for the "Talent Pool" website, which allows users to register, log in, and manage their profiles. The website integrates Twilio for notifications and Supabase for backend services. Below is a detailed description of the project structure and functionalities.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Project Structure](#project-structure)
5. [Installation](#installation)
6. [Usage](#usage)
7. [Contributing](#contributing)
8. [License](#license)

---

## Project Overview
The "Talent Pool" website is designed for users to join a professional community by registering their profiles. It features sections for user registration, login, and profile management. Twilio integration enables email/SMS notifications, while Supabase manages user authentication and database storage.

---

## Features
- **User Registration**: Allows users to create accounts by entering their full name, email, phone number, skills, professional summary, profile photo URL, and password.
- **Twilio Notifications**: Sends notifications via SMS or email upon successful registration.
- **Profile Management**: Users can update their profiles after logging in.
- **Authentication**: Secure login and registration using Supabase authentication.

---

## Technologies Used
- **Frontend**: HTML, CSS (TailwindCSS), and JavaScript
- **Backend**: Python (Flask for Twilio integration) and JavaScript (Supabase SDK)
- **Notification Service**: Twilio API
- **Database**: Supabase
- **Build Tools**: Vite, PostCSS

---

## Project Structure
```
├── .bolt
├── js
├── src
├── supabase\migrations
├── .gitignore
├── auth.js                # JavaScript for handling authentication (Supabase)
├── eslint.config.js       # ESLint configuration
├── index.html             # Main HTML file
├── package-lock.json      # Auto-generated dependency tree
├── package.json           # Project dependencies
├── postcss.config.js      # PostCSS configuration
├── style.css              # Custom CSS file
├── tailwind.config.js     # TailwindCSS configuration
├── tsconfig.app.json      # TypeScript app-specific configuration
├── tsconfig.json          # Global TypeScript configuration
├── tsconfig.node.json     # Node-specific TypeScript configuration
├── vite.config.ts         # Vite build configuration
```

### Key Files:
1. **index.html**: Main webpage containing sections for registration and login.
2. **auth.js**: Handles authentication using Supabase.
3. **style.css**: Contains the styling for the website.
4. **Twilio Integration (Backend)**: Python script connects the registration form to Twilio for notifications.
5. **Supabase Migrations**: Stores database schema changes.

---

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/talent-pool.git
   cd talent-pool
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a project on [Supabase](https://supabase.com/).
   - Obtain your API keys and add them to `auth.js`.

4. Set up Twilio:
   - Sign up on [Twilio](https://www.twilio.com/).
   - Obtain your `account_sid`, `auth_token`, and phone number.
   - Add these credentials to the Python backend file.

5. Run the application:
   ```bash
   npm run dev
   ```

---

## Usage

1. Open the app in your browser:
   ```
   http://127.0.0.1:5500/index.html
   ```
2. Navigate to the "Register" page to create a new account.
3. Receive an SMS/email notification upon successful registration.
4. Log in using your registered email and password.

---

## Contributing

We welcome contributions to improve this project! To contribute:
1. Fork this repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Create a Pull Request.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

### Author
Stephen Rodrick
Dhruv Patel 
Aabharan Rout 

