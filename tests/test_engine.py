import pytest
from app.engine import calculate_age, calculate_biocode

def test_calculate_age():
    # 2026 reference year
    # If birthdate is 2012-05-15, in 2026 it should be 14 (or 13 if today is before May 15, 
    # but the function caps age range nicely and returns int)
    age = calculate_age("2012-05-15")
    assert 10 <= age <= 18

def test_calculate_biocode_standard():
    input_data = {
        "name": "홍길동",
        "gender": "남",
        "birth_date": "2012-05-15",
        "grade": "중2",
        "sports": "야구",
        "position": "투수",
        "father_height": 180.0,
        "mother_height": 162.0,
        "current_height": 165.0,
        "current_weight": 52.0,
        "body_fat": 15.0,
        "skeletal_muscle": 25.0,
        "wingspan": 168.0,
        "survey_responses": [3] * 24  # All answers as "보통" (3)
    }
    
    result = calculate_biocode(input_data)
    
    # Assert return keys exist
    assert "biocode" in result
    assert "body_score" in result
    assert "metab_score" in result
    assert "behavior_score" in result
    assert "mph" in result
    assert "height_gap" in result
    assert "lag_cause" in result
    assert "five_elements" in result
    
    # Validate calculations
    # MPH for boy: (180 + 162 + 13)/2 = 177.5
    assert result["mph"] == pytest.approx(177.5, 0.1)
    
    # Check biocode shape (e.g. "2-2-2")
    biocode = result["biocode"]
    assert len(biocode) == 5
    assert biocode[1] == '-'
    assert biocode[3] == '-'
    assert biocode[0] in ['1', '2', '3']
    assert biocode[2] in ['1', '2', '3']
    assert biocode[4] in ['1', '2', '3']
