import pytest
from app.services.crs_calculator import CRSCalculator
from app.schemas.immigration import CRSInput, LanguageScores


class TestCRSCalculator:
    def test_age_17_scores_zero(self):
        assert CRSCalculator.calculate_age_points(17, False) == 0

    def test_age_20_single_scores_110(self):
        assert CRSCalculator.calculate_age_points(20, False) == 110

    def test_age_20_with_spouse_scores_100(self):
        assert CRSCalculator.calculate_age_points(20, True) == 100

    def test_age_29_single_scores_110(self):
        assert CRSCalculator.calculate_age_points(29, False) == 110

    def test_age_30_single_scores_105(self):
        assert CRSCalculator.calculate_age_points(30, False) == 105

    def test_age_45_scores_zero(self):
        assert CRSCalculator.calculate_age_points(45, False) == 0

    def test_age_below_17_scores_zero(self):
        assert CRSCalculator.calculate_age_points(16, False) == 0

    def test_age_above_45_scores_zero(self):
        assert CRSCalculator.calculate_age_points(50, False) == 0

    def test_education_masters_single(self):
        assert CRSCalculator.calculate_education_points("masters", False) == 135

    def test_education_phd_single(self):
        assert CRSCalculator.calculate_education_points("phd", False) == 150

    def test_education_none(self):
        assert CRSCalculator.calculate_education_points("none", False) == 0

    def test_education_bachelors_with_spouse(self):
        assert CRSCalculator.calculate_education_points("bachelors", True) == 112

    def test_first_language_all_clb10_single(self):
        scores = LanguageScores(speaking=10, listening=10, reading=10, writing=10)
        result = CRSCalculator.calculate_language_points(scores, True, False)
        assert result == 136  # 34*4

    def test_first_language_all_clb7_single(self):
        scores = LanguageScores(speaking=7, listening=7, reading=7, writing=7)
        result = CRSCalculator.calculate_language_points(scores, True, False)
        assert result == 68  # 17*4

    def test_canadian_work_5_years_single(self):
        assert CRSCalculator.calculate_canadian_work_experience_points(5, False) == 80

    def test_canadian_work_0_years(self):
        assert CRSCalculator.calculate_canadian_work_experience_points(0, False) == 0

    def test_full_calculation_returns_positive_score(self):
        input_data = CRSInput(
            age=30,
            has_spouse=False,
            education_level="masters",
            first_language=LanguageScores(speaking=10, listening=10, reading=10, writing=10),
            canadian_work_experience_years=3,
        )
        result = CRSCalculator.calculate(input_data)
        assert result.total_score > 0
        assert result.total_score <= 1200
        assert result.breakdown.core_human_capital > 0

    def test_full_calculation_with_spouse(self):
        input_data = CRSInput(
            age=30,
            has_spouse=True,
            education_level="bachelors",
            first_language=LanguageScores(speaking=9, listening=9, reading=9, writing=9),
            canadian_work_experience_years=2,
            spouse_education_level="masters",
            spouse_language=LanguageScores(speaking=7, listening=7, reading=7, writing=7),
            spouse_canadian_work_years=1,
        )
        result = CRSCalculator.calculate(input_data)
        assert result.total_score > 0
        assert result.breakdown.spouse_factors > 0

    def test_provincial_nomination_adds_600(self):
        input_data = CRSInput(
            age=30,
            education_level="bachelors",
            first_language=LanguageScores(speaking=7, listening=7, reading=7, writing=7),
            has_provincial_nomination=True,
        )
        result = CRSCalculator.calculate(input_data)
        assert result.breakdown.additional_points >= 600

    def test_skill_transferability_capped_at_100(self):
        input_data = CRSInput(
            age=30,
            education_level="phd",
            first_language=LanguageScores(speaking=10, listening=10, reading=10, writing=10),
            canadian_work_experience_years=5,
            foreign_work_experience_years=3,
            has_certificate_of_qualification=True,
        )
        result = CRSCalculator.calculate(input_data)
        assert result.breakdown.skill_transferability <= 100
