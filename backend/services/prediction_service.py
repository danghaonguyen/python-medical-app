
from ml.prediction import predict_from_input as ml_predict


# =========================
# BMI CALC
# =========================
def calc_bmi(weight, height):
    try:
        height = float(height)
        weight = float(weight)

        if height <= 0:
            return 0.0

        return weight / (height ** 2)

    except (TypeError, ValueError, OverflowError):
        return 0.0


# =========================
# MEDICAL BOOST
# =========================
def medical_boost(data, prob):
    boost = 0.0
    hard_flag = False

    # GLUCOSE
    if data["glucose"] >= 11:
        boost += 0.25
        hard_flag = True
    elif data["glucose"] >= 7.8:
        boost += 0.18
    elif data["glucose"] >= 6.5:
        boost += 0.06

    # SYSTOLIC BLOOD PRESSURE
    if data["systolic_bp"] >= 160:
        boost += 0.18
        hard_flag = True
    elif data["systolic_bp"] >= 140:
        boost += 0.10

    # DIASTOLIC BLOOD PRESSURE
    if data["diastolic_bp"] >= 100:
        boost += 0.15
        hard_flag = True
    elif data["diastolic_bp"] >= 90:
        boost += 0.08

    # BMI
    if data["bmi"] >= 30:
        boost += 0.12
        hard_flag = True

    # AGE
    if data["age"] >= 75:
        boost += 0.10
        hard_flag = True

    final = prob + boost

    if hard_flag:
        final = max(final, 0.80)

    return min(final, 0.98)


# =========================
# RISK CLASSIFICATION
# =========================
def get_risk(prob, data):
    if (
        data["glucose"] >= 11
        or data["systolic_bp"] >= 160
        or data["diastolic_bp"] >= 100
        or data["bmi"] >= 30
        or data["age"] >= 75
    ):
        return "Cao"

    if prob >= 0.70:
        return "Cao"
    elif prob >= 0.40:
        return "Trung bình"

    return "Thấp"


# =========================
# MAIN SERVICE
# =========================
def predict_from_input(data):
    age = float(data.get("age", 0))
    systolic_bp = float(data.get("systolic_bp", 0))
    diastolic_bp = float(data.get("diastolic_bp", 0))
    glucose = float(data.get("glucose", 0))
    height = float(data.get("height", 0))
    weight = float(data.get("weight", 0))

    bmi = calc_bmi(weight, height)

    # Run Machine Learning model
    ml_result = ml_predict(data)
    prob = float(ml_result["probability"])

    # Adjust probability using medical rules
    medical_data = {
        "age": age,
        "glucose": glucose,
        "systolic_bp": systolic_bp,
        "diastolic_bp": diastolic_bp,
        "bmi": bmi,
    }

    prob = medical_boost(medical_data, prob)

    # Determine risk level
    risk = get_risk(prob, medical_data)

    # Preserve the original final threshold
    pred = int(prob > 0.5)

    return {
        "prediction": pred,
        "probability": float(prob),
        "risk_level": risk,
    }
