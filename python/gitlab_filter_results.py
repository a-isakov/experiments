import os
import csv
import glob
import tempfile
import shutil
from collections import Counter

GITLAB_USER_COLUMN = 2


def filter_csv_file(filename, filter_values, combined_writer=None):
    """
    Filter the given CSV file to remove lines where the 4th column equals any value in filter_values
    
    Args:
        filename: Path to the CSV file to process
        filter_values: List of strings to filter out from the 4th column
        combined_writer: Optional CSV writer to write valid rows to a combined output file
        
    Returns:
        Counter object with statistics of remaining values in the 4th column
    """
    print(f"Processing {filename}...")
    
    # Create a temporary file
    temp_file = tempfile.NamedTemporaryFile(mode='w', delete=False, newline='')
    
    # Initialize counter for remaining values
    remaining_values = Counter()
    
    try:
        # Open the input file and temporary file
        with open(filename, 'r', newline='') as input_file, temp_file:
            reader = csv.reader(input_file)
            writer = csv.writer(temp_file)
            
            # Process each row
            filtered_count = 0
            total_count = 0
            
            for row in reader:
                total_count += 1
                # Check if the row has at least 4 columns and the 4th column equals any of the target values
                if len(row) >= 4 and row[GITLAB_USER_COLUMN] in filter_values:
                    filtered_count += 1
                    continue  # Skip this row
                
                # Count this value for statistics
                if len(row) >= 4:
                    remaining_values[row[GITLAB_USER_COLUMN]] += 1
                
                # Write the row to the output file
                writer.writerow(row)
                
                # Also write to the combined output if provided
                if combined_writer:
                    combined_writer.writerow(row)
        
        # Close the temp file
        temp_file.close()
        
        # Replace the original file with the filtered one
        shutil.move(temp_file.name, filename)
        
        print(f"  Done. Filtered out {filtered_count} rows out of {total_count} total rows.")
        return remaining_values
    
    except Exception as e:
        # Clean up the temp file in case of error
        os.unlink(temp_file.name)
        print(f"  Error processing {filename}: {e}")
        return Counter()


# Define the list of values to filter out
values_to_filter = [
    'user@email'
]

# Find all files matching the pattern
csv_files = glob.glob('commits-*.csv')

if not csv_files:
    print("No matching CSV files found in the current directory.")
else:
    print(f"Found {len(csv_files)} CSV files to process.")

    # Initialize counter for all files
    all_remaining_values = Counter()
    
    # Create the combined output file
    combined_output_file = 'commits.csv'
    with open(combined_output_file, 'w', newline='') as combined_file:
        combined_writer = csv.writer(combined_file)
        
        # Process each file
        for csv_file in csv_files:
            file_stats = filter_csv_file(csv_file, values_to_filter, combined_writer)
            all_remaining_values.update(file_stats)

    print("\nStatistics of remaining values in column 4:")
    print("Value - Count")
    print("-" * 50)
    
    # Sort alphabetically by value
    for value in sorted(all_remaining_values.keys()):
        count = all_remaining_values[value]
        print(f"{value} - {count}")
    
    print(f"\nTotal unique values remaining: {len(all_remaining_values)}")
    print(f"All files processed successfully. Combined output saved to '{combined_output_file}'")