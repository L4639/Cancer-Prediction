import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
import joblib

# Load the dataset
df = pd.read_csv("genomic_data.csv")  # Update if filename differs

# Check for nulls
if df.isnull().sum().sum() > 0:
    print("⚠️ Warning: Dataset contains null values. Filling with mean...")
    df = df.fillna(df.mean(numeric_only=True))

# Round values to 2 decimals
df = df.round(2)

# Separate input features and label
X = df.drop("Diagnosis", axis=1)
y = df["Diagnosis"]

# Split the dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale the input features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train KNN model
knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(X_train_scaled, y_train)

# Save model and scaler
joblib.dump(knn, "cancer_model.pkl")
joblib.dump(scaler, "scaler.pkl")

print("✅ Model trained and saved as 'cancer_model.pkl'")
