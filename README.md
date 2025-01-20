

# 📧 Email Builder

Welcome to the **Email Builder** project! This full-stack web application allows users to create customizable email templates easily, even if they have no technical background. Built using the MERN stack (MongoDB, Express.js, React, Node.js), this app provides a seamless experience for designing and managing email templates.

## 📚 Table of Contents

- [✨ Features](#-features)
- [🚀 Getting Started](#-getting-started)
- [🔧 Installation](#-installation)
- [📝 Usage](#-usage)
- [📡 API Endpoints](#-api-endpoints)
- [🌐 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)

## ✨ Features

- **User-Friendly Interface**: Intuitive design for easy navigation and template creation.
- **Dynamic Editing**: Modify text fields such as Title and Content directly in the editor.
- **Image Upload**: Seamlessly upload images to enhance your email templates.
- **JSON Storage**: Store email configurations in a structured JSON format.
- **Template Rendering**: Generate and download the final HTML email template.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have the following installed:

- 🟢 Node.js
- 🗄️ MongoDB
- 🛠️ Git

### 🔧 Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/imoamo/Email-Builder.git
   cd Email-Builder
   ```

2. **Create a `.env` file in the `server` directory and fill in the following:**

   ```plaintext
   PORT=5000
   MONGO_URI=your_mongo_uri
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   ```

   Replace the placeholders with your actual credentials.

3. **Install server dependencies:**

   ```bash
   cd server
   npm install
   ```

4. **Install client dependencies:**

   ```bash
   cd ../client
   npm install
   ```

5. **Start the development server:**

   - In the `server` directory, run:

     ```bash
     npm run dev
     ```

   - In the `client` directory, run:

     ```bash
     npm start
     ```

6. **Access the application:**

   Open your browser and navigate to `http://localhost:3000`.

## 📝 Usage

1. **Load Template**: Fetch the base HTML layout from the server.
2. **Edit Content**: Use the editor to modify text fields and upload images.
3. **Save Configuration**: Store your email template configuration in the database.
4. **Render & Download**: Generate the final HTML file with your customizations.

## 📡 API Endpoints

- **GET /getEmailLayout**: Retrieve the HTML layout.
- **POST /uploadImage**: Upload image assets.
- **POST /uploadEmailConfig**: Save the email template configuration.
- **POST /renderAndDownloadTemplate**: Generate and download the customized HTML template.

## 🌐 Deployment

The application is hosted on [Your Hosting Service]. You can access it via this [public URL](#).

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

