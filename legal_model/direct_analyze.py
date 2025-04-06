import numpy as np
import json
import re
import pickle
import sys
import os
from sklearn.feature_extraction.text import TfidfVectorizer

def preprocess_text(text):
    """Clean and preprocess text"""
    # Convert to lowercase
    text = text.lower()
    # Remove special characters but keep spaces between words
    text = re.sub(r'[^a-zA-Z\s]', ' ', text)
    # Remove extra whitespace
    text = ' '.join(text.split())
    return text

def extract_parties(text):
    """Extract only the relevant parties (people) from the case text"""
    parties = []
    
    # Find standard Person A/B/C references
    person_pattern = r'(person\s+[A-Za-z])\b'
    matches = re.findall(person_pattern, text, re.IGNORECASE)
    for match in matches:
        if match.lower() not in [p.lower() for p in parties]:
            parties.append(match.title())
    
    # Find names that look like actual person names (two capitalized words)
    name_pattern = r'\b([A-Z][a-z]+\s+[A-Z][a-z]+)\b'
    matches = re.findall(name_pattern, text)
    for match in matches:
        if match.lower() not in [p.lower() for p in parties]:
            parties.append(match)
    
    # Find references to "the accused", "the victim", etc.
    role_patterns = [r'\b(the\s+accused)\b', r'\b(the\s+victim)\b', r'\b(the\s+complainant)\b']
    for pattern in role_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        for match in matches:
            if match.lower() not in [p.lower() for p in parties]:
                parties.append(match.title())
    
    # If no parties found, but case has standard terminology
    if not parties:
        if "accused" in text.lower():
            parties.append("The Accused")
        if "victim" in text.lower():
            parties.append("The Victim")
    
    return parties

def extract_case_description(text):
    """Extract the actual case description from formatted input"""
    # Check if text contains the marker "Case Description:"
    if "Case Description:" in text:
        # Split by the marker and get the content after it
        parts = text.split("Case Description:", 1)
        if len(parts) > 1:
            return parts[1].strip()
    
    # If no marker found or no content after marker, return the original text
    return text

def analyze_case(case_text):
    """Analyze a legal case and identify relevant IPC sections with detailed explanation"""
    try:
        # First extract the actual case description if it's embedded in formatted text
        case_description = extract_case_description(case_text)
        
        # Find the model files in the current directory
        current_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Try different paths to find the model files
        possible_paths = [
            current_dir,  # Try current directory first
            os.path.join(current_dir, ".."),  # Try parent directory
            os.path.join(os.path.dirname(current_dir), "legal_model"),  # Try legal_model directory
            # Add absolute paths as fallbacks
            "C:\\Users\\LENOVO\\Downloads\\legelly\\legaltrack4\\legal_model"
        ]
        
        model_files_found = False
        clf = None
        vectorizer = None
        label_encoder = None
        config = None
        
        # Try each path
        for base_path in possible_paths:
            try:
                # Check if model files exist in this path
                rf_path = os.path.join(base_path, "rf_classifier.pkl")
                tfidf_path = os.path.join(base_path, "tfidf_vectorizer.pkl")
                label_path = os.path.join(base_path, "label_encoder.pkl")
                config_path = os.path.join(base_path, "model_config.json")
                
                if (os.path.exists(rf_path) and os.path.exists(tfidf_path) and 
                    os.path.exists(label_path) and os.path.exists(config_path)):
                    # Found all files, load them
                    with open(rf_path, 'rb') as f:
                        clf = pickle.load(f)
                    
                    with open(tfidf_path, 'rb') as f:
                        vectorizer = pickle.load(f)
                        
                    with open(label_path, 'rb') as f:
                        label_encoder = pickle.load(f)
                        
                    with open(config_path, 'r') as f:
                        config = json.load(f)
                    
                    model_files_found = True
                    break
            except Exception as e:
                continue
        
        if not model_files_found:
            raise FileNotFoundError("Could not find model files in any of the expected locations")
        
        # Preprocess the case text
        processed_text = preprocess_text(case_description)
        
        # Vectorize the text
        text_vector = vectorizer.transform([processed_text])
        
        # Get prediction (class index) and probabilities
        prediction_idx = clf.predict(text_vector)[0]
        probabilities = clf.predict_proba(text_vector)[0]
        
        # Get the IPC section from the prediction index
        section = label_encoder.inverse_transform([prediction_idx])[0]
        
        # Find confidence for the predicted class
        confidence = probabilities[prediction_idx] * 100
        
        # Extract crime type from full text if available
        crime_type = ""
        if "Crime Type:" in case_text:
            crime_type_match = re.search(r"Crime Type: *(.*?)(?:\n| Location:)", case_text)
            if crime_type_match:
                crime_type = crime_type_match.group(1).strip()
        
        # Special case handling for specific scenarios
        case_text_lower = case_description.lower()
        crime_type_lower = crime_type.lower() if crime_type else ""
        override_section = None
        
        # Handle self-defense case (crucial for your specific requirement)
        if (("self defense" in case_text_lower or "self-defense" in case_text_lower) or
            (("kill" in case_text_lower or "killed" in case_text_lower) and 
             ("in defense" in case_text_lower or "defending" in case_text_lower))):
            override_section = "100"  # Right of private defense causing death
        
        # Crime type-based overrides (only if not self-defense)
        elif "murder" in crime_type_lower or ("kill" in case_text_lower and "self defense" not in case_text_lower):
            override_section = "302"  # Murder
        elif "robbery" in crime_type_lower or "robbery" in case_text_lower:
            override_section = "392"  # Robbery
        elif "theft" in crime_type_lower or "stole" in case_text_lower:
            override_section = "379"  # Theft
        elif "assault" in crime_type_lower or "hurt" in case_text_lower:
            override_section = "323"  # Voluntarily causing hurt
        # Labor law special case
        elif "minimum wage" in case_text_lower or ("employer" in case_text_lower and "wage" in case_text_lower):
            override_section = "420"  # Cheating
            
        # Use the overridden section if applicable
        if override_section:
            section = override_section
        
        # Debug information
        debug_info = {
            'prediction_idx': int(prediction_idx),
            'original_section': label_encoder.inverse_transform([prediction_idx])[0],
            'final_section': section,
            'is_override': override_section is not None,
            'top_probs': []
        }
        
        # Get top 3 probabilities
        top_indices = np.argsort(probabilities)[::-1][:3]
        for idx in top_indices:
            prob = probabilities[idx] * 100
            section_label = label_encoder.inverse_transform([idx])[0]
            debug_info['top_probs'].append((section_label, prob))
        
        # Extract parties involved
        parties = extract_parties(case_description)
        
        # Get explanation for this section (with special handling for section 100)
        if section == "100":
            explanation = get_self_defense_explanation(case_description)
        else:
            explanation = get_section_explanation(section, case_description)
        
        # Get recommendations
        recommendations = get_recommendations(confidence)
        
        # Create the analysis result
        result = {
            "case_text": case_text,
            "predicted_section": section,
            "confidence": confidence,
            "parties": parties,
            "explanation": explanation,
            "recommendations": recommendations,
            "debug": debug_info
        }
        
        return result
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {
            "case_text": case_text,
            "error": str(e),
            "message": "An error occurred during analysis. Please check if all model files are available."
        }

def get_section_explanation(section, case_text):
    # Check for special case scenarios
    if "self-defense" in case_text.lower() or "self defense" in case_text.lower():
        return get_self_defense_explanation(case_text)
    elif "minimum wage" in case_text.lower() or "labor" in case_text.lower() or "employer" in case_text.lower():
        return get_labor_law_explanation(case_text)
    
    # General section explanations
    if section == "302":
        return """Murder:
- Punishment: Death or imprisonment for life, and fine
- For proving murder, the prosecution must establish intention to cause death
- The case must show premeditation or intention to cause bodily injury sufficient to cause death"""
    
    elif section == "304":
        return """Culpable Homicide Not Amounting to Murder:
- Punishment: Imprisonment for life, or up to 10 years, and fine
- Applies when death is caused without the intention to cause death
- May apply when the act is done with the knowledge that it is likely to cause death"""
    
    elif section == "304A":
        return """Death by Negligence:
- Punishment: Imprisonment up to 2 years, or fine, or both
- Applies when death is caused by a rash or negligent act
- No intention to cause death or knowledge that the act would likely cause death"""
    
    elif section == "308":
        return """Attempt to Commit Culpable Homicide:
- Punishment: Imprisonment up to 3 years, or fine, or both
- Applies when an act is done with the intention of causing culpable homicide
- The attempt does not result in death"""
    
    elif section == "319":
        return """Hurt:
- Punishment: Imprisonment up to 1 year, or fine up to 1,000 rupees, or both
- Causing bodily pain, disease, or infirmity to any person
- Includes physical injury that causes pain"""
    
    elif section == "320":
        return """Grievous Hurt:
- Punishment: Imprisonment up to 7 years, and fine
- Includes emasculation, permanent privation of sight or hearing, fracture or dislocation of bones, or any hurt which endangers life"""
    
    elif section == "376":
        return """Rape:
- Punishment: Rigorous imprisonment for a term not less than 7 years, may extend to life, and fine
- Sexual intercourse without consent or with consent obtained under fear, threat, or false promises"""
    
    elif section == "379":
        return """Theft:
- Punishment: Imprisonment up to 3 years, or fine, or both
- Involves dishonestly taking property without consent
- Must be done with the intention to permanently deprive the owner of the property"""
    
    elif section == "392":
        return """Robbery:
- Punishment: Rigorous imprisonment up to 10 years, and fine
- Theft with the use of force or threat of force
- Includes cases where force is used immediately before or after the theft"""
    
    elif section == "323":
        return """Voluntarily Causing Hurt:
- Punishment: Imprisonment up to 1 year, or fine up to 1,000 rupees, or both
- Intentionally causing bodily pain, disease, or infirmity
- Includes physical injury that is not severe enough to be grievous hurt"""
    
    elif section == "420":
        return """Cheating:
- Punishment: Imprisonment up to 7 years, and fine
- Involves dishonestly inducing a person to deliver property or consent to the keeping of property
- Must involve deception or fraudulent means"""
    
    elif section == "354":
        return """Assault on Woman:
- Punishment: Imprisonment of 1 to 5 years, and fine
- Assault or criminal force on a woman with intent to outrage her modesty
- The act must be intentional and with the knowledge that it would outrage modesty"""
    
    elif section == "100":
        return get_self_defense_explanation(case_text)
    
    else:
        return f"""Section {section} of the Indian Penal Code:
- This section of the IPC applies to the described case
- Consult the IPC for detailed provisions regarding this offense
- Legal advice is recommended for specific interpretation of this section"""

def get_self_defense_explanation(case_text):
    return """Self-Defense Analysis:

Under Indian law, the right to private defense is available under Sections 96-106 of the IPC.

When someone acts in self-defense resulting in death:
- Section 100 covers the right of private defense of the body extending to causing death
- This is applicable when there is reasonable apprehension of death or grievous hurt
- No recourse to public authorities was possible
- The force used was proportional to the threat

If the case involves Person B killing Person A in legitimate self-defense, Person B would not be considered guilty at all.

However, if excessive force beyond what was necessary for self-defense was used, Person B may be guilty of culpable homicide not amounting to murder under Section 304."""

def get_labor_law_explanation(case_text):
    return """Failure to pay minimum wage is primarily a violation under labor laws, specifically:

1. The Minimum Wages Act, 1948:
   - Section 22: Imprisonment up to 6 months or fine up to 500 rupees, or both
   - Employers are legally obligated to pay at least the minimum wage as notified

2. Under the Indian Penal Code, it may be considered:
   - Section 420 (Cheating): If the employer induced work with no intention to pay
   - May also be considered as criminal breach of trust in certain circumstances

The employee can:
1. File a complaint with the Labor Commissioner
2. File a civil suit for recovery of wages
3. In egregious cases, file a criminal complaint for cheating

The exact penalty depends on:
- Whether this was a systematic practice
- Number of employees affected
- Duration of non-payment
- Whether there was deceit involved"""

def get_recommendations(confidence):
    if confidence > 80:
        return """Recommendations:
- Strong confidence in legal analysis
- Recommended to proceed with legal proceedings under the identified section
- Document all evidence thoroughly"""
    elif confidence > 60:
        return """Recommendations:
- Moderate confidence in legal analysis
- Further investigation and evidence gathering recommended
- Consider consulting a legal expert for case-specific advice"""
    else:
        return """Recommendations:
- Low confidence in automated analysis
- Consult legal experts for detailed evaluation
- Consider gathering more case details and evidence
- Complex case may involve multiple legal provisions"""

def display_result(result):
    """Display the analysis result in console format similar to analyze_case.py"""
    print("\nLegal Case Analysis")
    print("==================================================")
    
    print("\nCase Description:")
    print(result.get("case_text", "N/A"))
    
    if "error" in result:
        print("\nError:", result["error"])
        print("Message:", result["message"])
        return
    
    # Add debug information
    if "debug" in result:
        print("\nDebug Information:")
        print(f"Raw prediction index: {result['debug'].get('prediction_idx')}")
        print(f"Original section: {result['debug'].get('original_section')}")
        
        if result['debug'].get('is_override'):
            print(f"⚠️ Section overridden to: {result['debug'].get('final_section')}")
        
        print(f"Top classes by probability:")
        for i, (section, prob) in enumerate(result['debug'].get('top_probs', [])):
            print(f"  {i+1}. Section {section}: {prob:.1f}%")
    
    print("\nLegal Analysis:")
    print("--------------------------------------------------")
    
    if result.get("parties"):
        print("\nParties Involved:")
        for party in result["parties"]:
            print(f"- {party}")
    
    # Use the final section
    print(f"\nApplicable IPC Section: {result['predicted_section']} (Confidence: {result['confidence']:.1f}%)")
    
    print("\n" + result["explanation"])
    
    print("\n" + result["recommendations"])

if __name__ == "__main__":
    # Get the case text directly from command line arguments
    if len(sys.argv) > 1:
        # Skip the first argument (script name) and join all other arguments with spaces
        case_text = ' '.join(sys.argv[1:])
        result = analyze_case(case_text)
        
        # Display the result in console format
        display_result(result)
        
        # Also print the result as JSON for the API to parse
        print(json.dumps(result)) 