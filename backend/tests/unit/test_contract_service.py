import pytest
from app.services.contract_service import _detect_clauses, _find_missing_clauses, _calculate_risk_score


class TestContractService:
    def test_clause_detection_finds_keywords(self):
        """_detect_clauses should detect confidentiality and termination in sample text."""
        text = (
            "Both parties agree to maintain strict confidentiality of all proprietary "
            "information shared during the term of this agreement. Either party may "
            "terminate this agreement with 30 days written notice."
        )
        clauses = _detect_clauses(text)
        found_types = {c.clause_type for c in clauses}
        assert "confidentiality" in found_types
        assert "termination" in found_types

    def test_missing_clause_detection(self):
        """_find_missing_clauses should return clause types not found in the document."""
        found_types = ["confidentiality", "termination"]
        all_standard = [
            "confidentiality", "termination", "indemnification",
            "governing_law", "force_majeure",
        ]
        missing = _find_missing_clauses(found_types, all_standard)
        assert "indemnification" in missing
        assert "governing_law" in missing
        assert "force_majeure" in missing
        assert "confidentiality" not in missing
        assert "termination" not in missing

    def test_risk_score_calculation(self):
        """5 missing out of 10 standard clauses should yield a 50.0% risk score."""
        missing = ["a", "b", "c", "d", "e"]
        all_standard = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]
        score = _calculate_risk_score(missing, all_standard)
        assert score == 50.0

    def test_risk_score_no_missing(self):
        """When no clauses are missing the risk score should be 0."""
        score = _calculate_risk_score([], ["a", "b", "c"])
        assert score == 0.0
