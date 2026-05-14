# readme-gen 🚀

An AI-powered CLI tool that automates the creation of professional `README.md` files. It scans your project structure, detects your tech stack (languages, frameworks), and uses OpenAI to generate high-quality documentation.

## 🌟 Features
- **Project Scanning**: Automatically walks your directory and generates a visual file tree (ignoring common noise like `node_modules`).
- **Tech Detection**: Identifies languages (TS, JS, Python, etc.) and frameworks (React, Next.js, Express, etc.).
- **Interactive CLI**: Prompts for project name, description, author, and license.
- **AI Integration**: Uses OpenAI's GPT models to write clean, human-sounding documentation.
- **Mock Mode**: Safely runs and shows what it *would* generate if no API key is provided.

## 🛠️ Installation

1. Clone the repository
   ```bash
   git clone <your-repo-url>
   cd readme-gen
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```

## 🚀 Usage

To use the AI generation, add your OpenAI API key to a `.env` file or export it:
```bash
export OPENAI_API_KEY='your-key-here'
```

Run the tool on any project directory:
```bash
node dist/index.js /path/to/your/project
```

### Options:
- `-y, --yes`: Skip interactive prompts and use default settings.
- `-o, --output <filename>`: Specify the output filename (default is `README_NEW.md`).

## 🧪 Development:
- `npm run dev`: Run the tool using `ts-node` for faster development.
- `npm run build`: Compile TypeScript to JavaScript.
