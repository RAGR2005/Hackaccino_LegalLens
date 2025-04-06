# Legal Lens: AI-Powered Legal Assistant

Legal Lens is an AI-powered legal assistant that helps users analyze legal cases, determine applicable Indian Penal Code (IPC) sections, and find similar precedents. It combines a Next.js frontend with machine learning models trained on Indian law to provide accurate and insightful legal analysis.


## Features

- 🔍 *Case Analysis*: Analyze legal cases and identify applicable IPC sections
- 📚 *Legal Reference*: Access detailed explanations of IPC sections and legal provisions
- 🧠 *AI Recommendations*: Get AI-powered recommendations based on case details
- 👨‍⚖ *Similar Cases*: Find similar precedents from Supreme Court and High Court judgments
- 🔐 *User Authentication*: Secure user accounts and data

## Project Structure

The project consists of several key components:

1. *Frontend (Next.js)*: User interface built with Next.js, React, and Tailwind CSS
2. *Legal Model*: Machine learning models trained on Indian legal data
3. *Ollama Integration*: Local AI model deployment using Ollama

## Technology Stack

- *Frontend*: Next.js, React, Tailwind CSS, shadcn/ui
- *Authentication*: Clerk
- *AI/ML*: TensorFlow, scikit-learn, Ollama (Llama 3)
- *Data Processing*: Python, Pandas, NumPy
- *API Integration*: OpenAI, OpenRouter

## Prerequisites

Before running the project, make sure you have the following installed:

- Node.js (v18+)
- Python (v3.8+)
- Ollama (for local model deployment)
- Git

## Installation and Setup

### 1. Clone the Repository

bash
git clone https://github.com/yourusername/legal-lens.git
cd legal-lens


### 2. Frontend Setup

Install the required Node.js packages:

bash
npm install
Fir next.js issue - npm install next react react-dom --legacy-peer-deps


Create a .env.local file with the following variables:


NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
OPENROUTER_API_KEY=your_openrouter_api_key


### 3. Legal Model Setup

Set up the Python environment for the legal model:

bash
cd legal_model
pip install -r requirements.txt


### 4. Ollama Model Setup

Install Ollama from [https://ollama.ai](https://ollama.ai)

Create the legal model using the Modelfile:

bash
cd pinggg-legal-model
ollama create pinggg-legal -f Modelfile


## Running the Project

### Start the Frontend

bash
npm run dev


The application will be available at http://localhost:3000

### Use the Legal Model

You can use the legal model in two ways:

1. *Through the web interface*: Simply navigate to the "Predict" or "Analysis" section in the web app
2. *Directly using Python*:

bash
cd legal_model
python analyze_case.py "Your legal case description here"


## How It Works

### Frontend Flow

1. Users sign in using Clerk authentication
2. They can submit case details through various forms
3. Case data is processed and sent to either:
   - The local Ollama model (for complete privacy)
   - OpenRouter/OpenAI API (for enhanced capabilities)
4. Results are displayed in a structured format with explanations

### Model Architecture

The project uses a combination of models:

1. *TF-IDF Vectorizer + RandomForest Classifier*: For initial IPC section prediction
2. *Fine-tuned Llama 3 (8B)*: For detailed legal analysis and case references

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built using Llama 3 by Meta
- Legal data sourced from Indian legal databases
- Special thanks to the contributors and the legal experts who validated the model's outputs
