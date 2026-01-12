# AI CodeLens - Elite AI Code Architect

AI CodeLens is a sophisticated code analysis tool acting as your personal "Senior Architect". It reviews your code for security, performance, and logic issues, offering instant fixes and professional insights.

![App Screenshot](https://via.placeholder.com/800x400?text=AI+CodeLens+Preview)

## 🚀 Features
- **AI-Powered Analysis**: Deep scanning of code for bugs and security risks using GPT-4o.
- **Objective-Based Review**: Tell the AI what the code *should* do, and it will verify if you succeeded.
- **Auto-Fix**: One-click application of suggested code improvements.
- **Responsive Design**: Fully functional on Desktop and Mobile.
- **Secure Auth**: Powered by Supabase for secure user management.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, TypeScript, TailwindCSS
- **Backend (Auth)**: Supabase
- **AI Core**: OpenAI API (GPT-4o)
- **Editor**: Monaco Editor (VS Code engine)

## 📖 How to Use

### 1. Initial Setup
1.  **Clone the Repo**:
    ```bash
    git clone https://github.com/bastola-wrld/AI-CodeLens.git
    cd AI-CodeLens
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Configure Environment**:
    Create a `.env` file in the root directory (do not commit this file!):
    ```env
    VITE_OPENAI_API_KEY=your_openai_key
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```
4.  **Run Locally**:
    ```bash
    npm run dev
    ```
    Open `http://localhost:5174` in your browser.

### 2. Using the App
1.  **Sign Up / Login**: Click the "Sign In" button top-right. Create an account to get 5 free credits.
2.  **Paste Code**: Copy your code snippet into the left-hand Editor panel.
3.  **Set Objective**: In the "Mission Objective" box, type what the code is supposed to do (e.g., "Calculate Fibonacci sequence").
4.  **Analyze**: Click **Analyze Code**.
    - The AI will audit your code.
    - Review the "AI Insights" on the right.
    - If a fix is proposed, click **Apply Fix** to update your code automatically.

### 3. Deployment (Vercel)
To deploy this app publicly:
1.  Import the repository to Vercel.
2.  In Vercel **Settings > Environment Variables**, add the 3 keys from your `.env` file.
3.  Deploy!

## 🤝 Contributing
Built & Powered by Creative World Protocol v2.0.
