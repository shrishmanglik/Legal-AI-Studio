import pytest
from app.data.employment_standards import EMPLOYMENT_STANDARDS


class TestComplianceService:
    def test_ontario_standards_exist(self):
        """Ontario standards data should contain entries."""
        on_standards = [s for s in EMPLOYMENT_STANDARDS if s["province"] == "Ontario"]
        assert len(on_standards) > 0

    def test_ontario_has_minimum_wage(self):
        """Ontario standards should include a minimum_wage topic."""
        on_standards = [s for s in EMPLOYMENT_STANDARDS if s["province"] == "Ontario"]
        topics = [s["topic"] for s in on_standards]
        assert "minimum_wage" in topics

    def test_unknown_province_returns_empty(self):
        """Filtering by a non-existent province should yield an empty list."""
        standards = [s for s in EMPLOYMENT_STANDARDS if s["province"] == "ZZ"]
        assert len(standards) == 0

    def test_standards_have_required_fields(self):
        """Every standard entry must have province, topic, and rule_text keys."""
        for s in EMPLOYMENT_STANDARDS:
            assert "province" in s
            assert "topic" in s
            assert "rule_text" in s
