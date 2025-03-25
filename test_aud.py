import whisper

# Load Whisper's "tiny" model
model = whisper.load_model("medium")

# Function to transcribe the audio file to text
def transcribe_audio(audio_file):
    # Perform transcription using Whisper's model
    result = model.transcribe(audio_file)
    
    # Extract the transcribed text
    transcription = result["text"].strip()

    return transcription

# Specify the path of your audio file (make sure the file is accessible)
audio_file = "output.wav"  # Update this with your audio file's path

# Transcribe the audio file
transcription = transcribe_audio(audio_file)

# Save the transcription to a text file
output_file = "transcription.txt"
with open(output_file, "w") as f:
    f.write(transcription)

print(f"Transcription saved to {output_file}")
