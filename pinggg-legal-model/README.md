---
license: llama3
base_model: meta-llama/Llama-3-8B
tags:
- legal
- indian-law
- ipc
- law
- legal-analysis
---

# Pinggg Legal Model

A specialized legal analysis model trained on Indian Law and the Indian Penal Code (IPC).

## Model Details

- **Model Name**: pinggg-legal
- **Base Model**: Llama 3 8B
- **Context Length**: 8192
- **Quantization**: Q4_0
- **Specialization**: Indian Law and IPC Analysis

## Model Description

This model is a specialized legal expert system trained to analyze and interpret Indian Law, with particular focus on the Indian Penal Code (IPC). It has been fine-tuned to provide detailed legal analysis, case references, and interpretations of legal provisions.

## Capabilities

- Legal analysis of cases
- IPC section interpretation
- Case law referencing
- Legal recommendations
- Structured legal responses

## Training Data

The model has been trained on:
1. Complete Indian Penal Code (IPC)
2. Supreme Court and High Court judgments
3. Case law database
4. IPC section definitions and interpretations
5. Additional legal references

## Usage

The model follows a structured format for responses:

1. Case Description
2. Legal Analysis
3. Detailed Analysis
4. Similar Cases
5. Recommendations

## License

This model is subject to the Meta Llama 3 Community License Agreement.

## Ethical Considerations

This model is intended for educational and research purposes only. It should not be used as a substitute for professional legal advice.

## Limitations

- The model's knowledge is based on the training data provided
- It may not have information on very recent legal developments
- Should not be used as a substitute for professional legal counsel

## How to Use

This model is designed to be used with Ollama. To use it:

1. Install Ollama from [https://ollama.ai](https://ollama.ai)

2. Create the model using the provided Modelfile:
```bash
ollama create pinggg-legal -f Modelfile
```

3. Run the model:
```bash
ollama run pinggg-legal "Your legal query here"
```

## Example Usage

```python
import requests

def analyze_case(query):
    response = requests.post('http://localhost:11434/api/generate', 
        json={
            'model': 'pinggg-legal',
            'prompt': query
        }
    )
    return response.json()['response']

# Example query
result = analyze_case("What is IPC Section 302?")
print(result)
```

## Output Format

The model provides structured responses in the following format:

1. Case Description
2. Legal Analysis
3. Detailed Analysis
4. Similar Cases
5. Recommendations

## Example Queries

- "If person A tries to kill Person B and person B kills Person A in self defense, is Person B guilty?"
- "What is IPC Section 302?"
- "Employer failed to pay minimum wages"
- "A person committed theft of goods worth Rs. 10,000 from a shop"

## Model Files

- `Modelfile`: Contains the model configuration and training data references
- `legal_analyzer.py`: Python script for interacting with the model
- `ipc_sec_dataset.csv`: IPC section definitions and interpretations
- Case database files: Contains Supreme Court and High Court judgments

## Citation

If you use this model in your research or work, please cite:

```bibtex
@misc{pinggg-legal-model,
  author = {Your Name},
  title = {PINGGG Legal Model},
  year = {2024},
  publisher = {HuggingFace},
  journal = {HuggingFace Hub},
  howpublished = {\url{https://huggingface.co/your-username/pinggg-legal}}
}
``` 