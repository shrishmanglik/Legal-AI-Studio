import uuid

import pytest
from app.services.pnp_matcher import PNPMatcher
from app.schemas.immigration import CRSInput, ImmigrationProgramResponse, LanguageScores


def _make_programs() -> list[ImmigrationProgramResponse]:
    """Create mock ImmigrationProgramResponse objects for testing."""
    return [
        ImmigrationProgramResponse(
            id=uuid.uuid4(),
            name="Federal Skilled Worker Program (FSWP)",
            province="Federal",
            program_type="Express Entry",
            min_crs_score=67,
            requirements={
                "work_experience_years": 1,
                "language_min_clb": 7,
                "education": "one_year_post_secondary",
            },
            active=True,
        ),
        ImmigrationProgramResponse(
            id=uuid.uuid4(),
            name="Canadian Experience Class (CEC)",
            province="Federal",
            program_type="Express Entry",
            min_crs_score=None,
            requirements={
                "canadian_work_experience_years": 1,
                "language_min_clb": 7,
            },
            active=True,
        ),
        ImmigrationProgramResponse(
            id=uuid.uuid4(),
            name="Ontario Immigrant Nominee Program - Human Capital Priorities",
            province="Ontario",
            program_type="Provincial Nominee Program",
            min_crs_score=400,
            requirements={
                "work_experience_years": 1,
                "language_min_clb": 7,
                "education": "bachelors",
            },
            active=True,
        ),
    ]


class TestPNPMatcher:
    def test_high_crs_matches_fsw(self):
        """A profile with a high CRS score should be eligible for FSW."""
        profile = CRSInput(
            age=30,
            education_level="masters",
            first_language=LanguageScores(speaking=9, listening=9, reading=9, writing=9),
            canadian_work_experience_years=3,
            foreign_work_experience_years=1,
        )
        programs = _make_programs()
        results = PNPMatcher.match_programs(profile, 470, programs)
        fsw_match = next(
            (r for r in results if "Skilled Worker" in r.program.name), None
        )
        assert fsw_match is not None
        assert fsw_match.eligible is True

    def test_cec_requires_canadian_experience(self):
        """A profile with 0 Canadian work experience should be ineligible for CEC."""
        profile = CRSInput(
            age=30,
            education_level="masters",
            first_language=LanguageScores(speaking=9, listening=9, reading=9, writing=9),
            canadian_work_experience_years=0,
        )
        programs = _make_programs()
        results = PNPMatcher.match_programs(profile, 470, programs)
        cec_match = next(
            (r for r in results if "Canadian Experience" in r.program.name), None
        )
        assert cec_match is not None
        assert cec_match.eligible is False

    def test_provincial_programs_filter_by_crs(self):
        """Ontario HCP requires CRS >= 400; a score of 450 should be eligible."""
        profile = CRSInput(
            age=30,
            education_level="bachelors",
            first_language=LanguageScores(speaking=9, listening=9, reading=9, writing=9),
            canadian_work_experience_years=2,
            foreign_work_experience_years=1,
        )
        programs = _make_programs()
        results = PNPMatcher.match_programs(profile, 450, programs)
        ontario = next(
            (r for r in results if "Ontario" in r.program.name), None
        )
        assert ontario is not None
        assert ontario.eligible is True

    def test_low_crs_fails_ontario_pnp(self):
        """A CRS score below 400 should not be eligible for Ontario HCP."""
        profile = CRSInput(
            age=30,
            education_level="high_school",
            first_language=LanguageScores(speaking=5, listening=5, reading=5, writing=5),
            canadian_work_experience_years=0,
        )
        programs = _make_programs()
        results = PNPMatcher.match_programs(profile, 200, programs)
        ontario = next(
            (r for r in results if "Ontario" in r.program.name), None
        )
        assert ontario is not None
        assert ontario.eligible is False
