
from routers.predict import (
    clean_prediction,
    to_number,
    to_integer,
)


def test_clean_prediction():
    result = clean_prediction({
        "prediction": 1,
        "probability": 0.8,
        "risk_level": "Cao",
    })

    assert result == {
        "prediction": 1,
        "probability": 0.8,
        "risk_level": "Cao",
    }


def test_to_number_valid_value():
    assert to_number("12.5") == 12.5


def test_to_number_invalid_value_uses_default():
    assert to_number("abc") == 0


def test_to_number_boolean_uses_default():
    assert to_number(True) == 0


def test_to_number_infinity_uses_default():
    assert to_number(float("inf")) == 0


def test_to_integer_valid_value():
    assert to_integer(12) == 12


def test_to_integer_decimal_truncates():
    assert to_integer(12.9) == 12
