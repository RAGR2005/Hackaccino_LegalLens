from huggingface_hub import HfApi
import os

# Initialize the API
api = HfApi()

# Your repository ID
repo_id = "Shogun69/legallity-lenses"

# List of files to upload
files_to_upload = [
    "Modelfile",
    "README.md",
    "legal_analyzer.py",
    "ipc_sec_dataset.csv"
]

# Upload each file
for file_path in files_to_upload:
    if os.path.exists(file_path):
        print(f"Uploading {file_path}...")
        try:
            api.upload_file(
                path_or_fileobj=file_path,
                path_in_repo=os.path.basename(file_path),
                repo_id=repo_id
            )
            print(f"Successfully uploaded {file_path}")
        except Exception as e:
            print(f"Error uploading {file_path}: {str(e)}")
    else:
        print(f"File not found: {file_path}")

# Upload the entire final_Export directory structure
def upload_directory(directory, base_path=""):
    for item in os.listdir(directory):
        item_path = os.path.join(directory, item)
        repo_path = os.path.join(base_path, item)
        
        if os.path.isfile(item_path):
            print(f"Uploading {item_path}...")
            try:
                api.upload_file(
                    path_or_fileobj=item_path,
                    path_in_repo=repo_path,
                    repo_id=repo_id
                )
                print(f"Successfully uploaded {item}")
            except Exception as e:
                print(f"Error uploading {item}: {str(e)}")
        elif os.path.isdir(item_path):
            upload_directory(item_path, repo_path)

# Upload the final_Export directory
final_export_dir = "final_Export"  # Note the capital 'E'
if os.path.exists(final_export_dir):
    print("\nUploading final_Export directory...")
    upload_directory(final_export_dir, "final_Export")
else:
    print("final_Export directory not found") 