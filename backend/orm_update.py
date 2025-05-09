import os

def replace_orm_mode_with_from_attributes(root_dir):
    for subdir, _, files in os.walk(root_dir):
        for file in files:
            if file.endswith(".py"):
                file_path = os.path.join(subdir, file)
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
                new_content = content.replace("orm_mode = True", "from_attributes = True")
                if content != new_content:
                    with open(file_path, "w", encoding="utf-8") as f:
                        f.write(new_content)
                    print(f"✅ Updated: {file_path}")

# Adjust the path to your backend folder
replace_orm_mode_with_from_attributes("backend")
