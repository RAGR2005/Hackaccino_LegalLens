#!/usr/bin/env python
"""
PINGGG Legal Analyzer

A simple command-line tool for analyzing legal cases using the PINGGG legal model.
"""

import requests
import argparse
import json
import sys

def analyze_case(query):
    """Send a query to the Ollama API running the PINGGG legal model"""
    try:
        response = requests.post(
            'http://localhost:11434/api/generate',
            json={
                'model': 'pinggg-legal',
                'prompt': query
            },
            timeout=120  # Increased timeout for longer responses
        )
        
        if response.status_code != 200:
            return f"Error: API returned status code {response.status_code}\n{response.text}"
        
        return response.json().get('response', 'No response received')
    
    except requests.exceptions.RequestException as e:
        return f"Error connecting to Ollama API: {str(e)}\nMake sure Ollama is running on your machine."

def interactive_mode():
    """Run the analyzer in interactive mode"""
    print("\n===== PINGGG Legal Analyzer =====")
    print("Type 'exit' or 'quit' to end the session")
    print("Type your legal query and press Enter")
    print("===================================\n")
    
    while True:
        try:
            user_input = input("Query: ")
            
            if user_input.lower() in ['exit', 'quit']:
                print("Goodbye!")
                break
            
            if user_input.strip():
                print("\nAnalyzing...\n")
                result = analyze_case(user_input)
                print(result)
                print("\n" + "-" * 80 + "\n")
        
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break
        
        except Exception as e:
            print(f"Error: {str(e)}")

def main():
    """Main function with argument parsing"""
    parser = argparse.ArgumentParser(description="PINGGG Legal Analyzer")
    parser.add_argument("--query", type=str, help="The legal query to analyze")
    parser.add_argument("--output", type=str, help="Output file to save the analysis (JSON format)")
    args = parser.parse_args()
    
    if args.query:
        # Run with the provided query
        print("Analyzing...\n")
        result = analyze_case(args.query)
        print(result)
        
        # Save to output file if specified
        if args.output:
            try:
                with open(args.output, 'w') as f:
                    json.dump({"query": args.query, "result": result}, f, indent=2)
                print(f"\nAnalysis saved to {args.output}")
            except Exception as e:
                print(f"Error saving to file: {str(e)}")
    
    else:
        # Run in interactive mode
        interactive_mode()

if __name__ == "__main__":
    main() 