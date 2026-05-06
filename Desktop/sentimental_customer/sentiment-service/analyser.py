import re
import emoji
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from textblob import TextBlob
from datetime import datetime, timezone
from transformers import pipeline

# ---------------------------
# Models
# ---------------------------
_vader = SentimentIntensityAnalyzer()

sentiment_model = pipeline(
    "sentiment-analysis",
    model="cardiffnlp/twitter-roberta-base-sentiment"
)

emotion_model = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    top_k=1
)

# ---------------------------
# UI colors
# ---------------------------
COLOR_MAP = {
    "positive": "#059669",
    "neutral": "#d97706",
    "negative": "#dc2626",
}

# ---------------------------
# Emotion mapping
# ---------------------------
EMOTION_MAP = {
    "joy": "Excited / Happy",
    "anger": "Angry",
    "sadness": "Sad",
    "fear": "Anxious",
    "surprise": "Surprised",
    "disgust": "Disgusted",
    "neutral": "Neutral"
}

# ---------------------------
# Preprocess text (UPDATED)
# ---------------------------
def preprocess_text(text):
    # Convert emoji → text
    text = emoji.demojize(text, delimiters=(" ", " "))
    
    # remove underscores
    text = text.replace("_", " ")

    # clean spaces
    text = re.sub(r"\s+", " ", text).strip()

    return text

# ---------------------------
# Sarcasm detection
# ---------------------------
def detect_sarcasm(text):
    sarcasm_phrases = [
        "yeah great job","great job ruining","exactly what nobody wanted",
        "amazing just amazing","thanks for ruining","fantastic way to ruin",
        "wow great update","oh wow","groundbreaking","just what we needed",
        "life changing","amazing update not"
    ]
    text = text.lower()
    return any(phrase in text for phrase in sarcasm_phrases)

# ---------------------------
# Technical issue detection
# ---------------------------
def detect_issue(text):
    issue_phrases = [
        "can't access","cannot access","cant access","not working",
        "doesn't work","doesnt work","nothing happens","unable to","issue",
        "bug","error","failed","fail","crash","crashes","stuck",
        "won't load","wont load","not loading","can't login","cant login",
        "unable to login","poor review","bad decision","terrible choice",
        "not acceptable","unbelievable","ridiculous"
    ]
    text = text.lower()
    return any(phrase in text for phrase in issue_phrases)

# ---------------------------
# Main function
# ---------------------------
def analyse(text: str, user_id: str = None, timestamp: str = None) -> dict:
    cleaned_text = preprocess_text(text)

    final_compound = None
    emotion_text = cleaned_text

    # Handle "but" sentences
    if " but " in cleaned_text.lower():
        parts = re.split(r"\bbut\b", cleaned_text, flags=re.IGNORECASE)
        if len(parts) >= 2:
            first_part = parts[0].strip()
            second_part = parts[1].strip()

            first_score = _vader.polarity_scores(first_part)["compound"]
            second_score = _vader.polarity_scores(second_part)["compound"]

            final_compound = (first_score * 0.5) + (second_score * 0.5)
            emotion_text = second_part

    # VADER
    vader_raw = _vader.polarity_scores(cleaned_text)
    compound = vader_raw["compound"] if final_compound is None else round(final_compound, 4)

    # TextBlob
    blob = TextBlob(cleaned_text)

    # HuggingFace sentiment
    hf_sentiment = sentiment_model(cleaned_text)[0]
    label_mapping = {"LABEL_0": "negative","LABEL_1": "neutral","LABEL_2": "positive"}
    label = label_mapping.get(hf_sentiment["label"], "neutral")

    # Override for "but"
    if final_compound is not None:
        if compound >= 0.05:
            label = "positive"
        elif compound <= -0.05:
            label = "negative"
        else:
            label = "neutral"

    # Mixed sentence fix
    if abs(compound) < 0.3 and " but " in cleaned_text.lower():
        label = "neutral"
        compound = 0.0

    # Emotion
    hf_emotion = emotion_model(emotion_text)[0][0]
    emotion = EMOTION_MAP.get(hf_emotion["label"].lower(), "Neutral")

    # Sarcasm
    if detect_sarcasm(cleaned_text):
        emotion = "Sarcastic"
        label = "negative"
        compound = -0.3

    # Issue detection
    elif detect_issue(cleaned_text):
        emotion = "Frustrated"
        label = "negative"
        compound = -0.5

    # Final score
    if label == "neutral":
        blended_score = 0.0
    else:
        hf_score = hf_sentiment["score"]
        if label == "negative":
            hf_score = -hf_score
        blended_score = round((compound * 0.5) + (hf_score * 0.5), 4)

    return {
        "text": text,
        "sentiment": label,
        "emotion": emotion,
        "color": COLOR_MAP[label],
        "score": blended_score,

        "textblob": {
            "polarity": round(blob.sentiment.polarity, 4),
            "subjectivity": round(blob.sentiment.subjectivity, 4),
        },

        "vader": {
            "positive": round(vader_raw["pos"], 4),
            "neutral": round(vader_raw["neu"], 4),
            "negative": round(vader_raw["neg"], 4),
            "compound": round(compound, 4),
        },

        "confidence": round(hf_sentiment["score"], 4),

        "timestamp": timestamp or datetime.now(timezone.utc).isoformat(),
        "user_id": user_id,
    }