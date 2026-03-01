"""
Comprehensive Ranking System (CRS) calculator.

Implements the full IRCC CRS scoring methodology used for Express Entry.
Reference: https://www.canada.ca/en/immigration-refugees-citizenship/services/
           immigrate-canada/express-entry/eligibility/criteria-comprehensive-ranking-system.html
"""

from app.data.crs_rules import (
    AGE_POINTS,
    EDUCATION_POINTS,
    FIRST_LANGUAGE_POINTS_SINGLE,
    FIRST_LANGUAGE_POINTS_WITH_SPOUSE,
    SECOND_LANGUAGE_POINTS_SINGLE,
    SECOND_LANGUAGE_POINTS_WITH_SPOUSE,
    CANADIAN_WORK_EXPERIENCE_POINTS,
    SPOUSE_EDUCATION_POINTS,
    SPOUSE_LANGUAGE_POINTS,
    SPOUSE_WORK_EXPERIENCE_POINTS,
    EDUCATION_LANGUAGE_POINTS,
    EDUCATION_CANADIAN_WORK_POINTS,
    FOREIGN_WORK_LANGUAGE_POINTS,
    FOREIGN_CANADIAN_WORK_POINTS,
    CERTIFICATE_LANGUAGE_POINTS,
    PROVINCIAL_NOMINATION_POINTS,
    JOB_OFFER_NOC_00_POINTS,
    JOB_OFFER_OTHER_POINTS,
    CANADIAN_EDUCATION_POINTS,
    FRENCH_BONUS_WITH_ENGLISH,
    FRENCH_BONUS_WITHOUT_ENGLISH,
    SIBLING_IN_CANADA_POINTS,
    MAX_CORE_SINGLE,
    MAX_CORE_WITH_SPOUSE,
    MAX_SPOUSE,
    MAX_SKILL_TRANSFERABILITY,
    MAX_ADDITIONAL,
    MAX_TOTAL,
)
from app.schemas.immigration import CRSBreakdown, CRSInput, CRSResult, LanguageScores


class CRSCalculator:
    """Static helper that computes a CRS score from a *CRSInput* profile."""

    # ------------------------------------------------------------------
    # A. Core / Human-capital factors
    # ------------------------------------------------------------------

    @staticmethod
    def calculate_age_points(age: int, has_spouse: bool) -> int:
        """Look up age points from the AGE_POINTS table.

        Returns 0 for ages outside the 17-45 range.
        """
        entry = AGE_POINTS.get(age)
        if entry is None:
            return 0
        return entry[1] if has_spouse else entry[0]

    @staticmethod
    def calculate_education_points(level: str, has_spouse: bool) -> int:
        """Look up education points for the principal applicant."""
        entry = EDUCATION_POINTS.get(level)
        if entry is None:
            return 0
        return entry[1] if has_spouse else entry[0]

    @staticmethod
    def calculate_language_points(
        scores: LanguageScores, is_first: bool, has_spouse: bool
    ) -> int:
        """Sum per-ability language points for a single official language.

        For each of speaking, listening, reading, and writing the CLB level
        is looked up in the appropriate table.  CLB values above 10 are
        capped to 10; values below the table minimum receive 0.
        """
        abilities = [scores.speaking, scores.listening, scores.reading, scores.writing]

        if is_first:
            table = (
                FIRST_LANGUAGE_POINTS_WITH_SPOUSE
                if has_spouse
                else FIRST_LANGUAGE_POINTS_SINGLE
            )
        else:
            table = (
                SECOND_LANGUAGE_POINTS_WITH_SPOUSE
                if has_spouse
                else SECOND_LANGUAGE_POINTS_SINGLE
            )

        total = 0
        for clb in abilities:
            # Cap at 10 (table maximum)
            capped = min(clb, 10)
            # Find the best matching key that is <= capped
            best = 0
            for key in sorted(table.keys()):
                if key <= capped:
                    best = table[key]
            total += best
        return total

    @staticmethod
    def calculate_canadian_work_experience_points(years: int, has_spouse: bool) -> int:
        """Canadian work experience points, capped at 5 years."""
        capped = min(years, 5)
        entry = CANADIAN_WORK_EXPERIENCE_POINTS.get(capped)
        if entry is None:
            return 0
        return entry[1] if has_spouse else entry[0]

    # ------------------------------------------------------------------
    # B. Spouse / common-law partner factors
    # ------------------------------------------------------------------

    @staticmethod
    def calculate_spouse_education_points(level: str) -> int:
        """Spouse education points."""
        return SPOUSE_EDUCATION_POINTS.get(level, 0)

    @staticmethod
    def calculate_spouse_language_points(scores: LanguageScores) -> int:
        """Sum per-ability spouse language points (CLB based)."""
        abilities = [scores.speaking, scores.listening, scores.reading, scores.writing]
        total = 0
        for clb in abilities:
            capped = min(clb, 10)
            best = 0
            for key in sorted(SPOUSE_LANGUAGE_POINTS.keys()):
                if key <= capped:
                    best = SPOUSE_LANGUAGE_POINTS[key]
            total += best
        return total

    @staticmethod
    def calculate_spouse_work_experience_points(years: int) -> int:
        """Spouse Canadian work experience points, capped at 5 years."""
        capped = min(years, 5)
        return SPOUSE_WORK_EXPERIENCE_POINTS.get(capped, 0)

    # ------------------------------------------------------------------
    # C. Skill transferability factors (max 100)
    # ------------------------------------------------------------------

    @staticmethod
    def _min_clb(scores: LanguageScores) -> int:
        """Return the minimum CLB across the four abilities, capped at 10."""
        return min(
            min(scores.speaking, 10),
            min(scores.listening, 10),
            min(scores.reading, 10),
            min(scores.writing, 10),
        )

    @staticmethod
    def _best_skill_key(table: dict, lookup_key: tuple) -> int:
        """Return points from *table* for the exact or best matching key.

        Skill-transferability tables use composite tuple keys.  When the
        exact key is missing we iterate to find the best match whose
        components are all <= the supplied values.
        """
        if lookup_key in table:
            return table[lookup_key]
        return 0

    @classmethod
    def calculate_skill_transferability(cls, input: CRSInput) -> int:
        """Compute skill transferability points (Section C).

        Five cross-factor groups, each individually capped at 50.
        Education group (education+language, education+work) capped at 50.
        Foreign group (foreign+language, foreign+canadian) capped at 50.
        Certificate group (certificate+language) capped at 50.
        Overall total capped at 100.
        """
        min_clb = cls._min_clb(input.first_language)
        edu = input.education_level
        can_years = min(input.canadian_work_experience_years, 5)
        for_years = min(input.foreign_work_experience_years, 3)

        # --- Education + Language ---
        edu_lang_pts = 0
        if edu != "none" and edu != "high_school":
            # Find best matching CLB bucket
            for clb_key in sorted(
                {k[1] for k in EDUCATION_LANGUAGE_POINTS if k[0] == edu}, reverse=True
            ):
                if min_clb >= clb_key:
                    edu_lang_pts = EDUCATION_LANGUAGE_POINTS.get((edu, clb_key), 0)
                    break
        edu_lang_pts = min(edu_lang_pts, 50)

        # --- Education + Canadian work experience ---
        edu_work_pts = 0
        if edu != "none" and edu != "high_school" and can_years >= 1:
            work_key = min(can_years, 2)
            edu_work_pts = EDUCATION_CANADIAN_WORK_POINTS.get((edu, work_key), 0)
        edu_work_pts = min(edu_work_pts, 50)

        # Education group capped at 50
        education_group = min(edu_lang_pts + edu_work_pts, 50)

        # --- Foreign work experience + Language ---
        for_lang_pts = 0
        if for_years >= 1:
            capped_for = min(for_years, 3)
            for clb_key in sorted(
                {k[1] for k in FOREIGN_WORK_LANGUAGE_POINTS if k[0] == capped_for},
                reverse=True,
            ):
                if min_clb >= clb_key:
                    for_lang_pts = FOREIGN_WORK_LANGUAGE_POINTS.get(
                        (capped_for, clb_key), 0
                    )
                    break
        for_lang_pts = min(for_lang_pts, 50)

        # --- Foreign work experience + Canadian work experience ---
        for_can_pts = 0
        if for_years >= 1 and can_years >= 1:
            capped_for = min(for_years, 3)
            work_key = min(can_years, 2)
            for_can_pts = FOREIGN_CANADIAN_WORK_POINTS.get(
                (capped_for, work_key), 0
            )
        for_can_pts = min(for_can_pts, 50)

        # Foreign group capped at 50
        foreign_group = min(for_lang_pts + for_can_pts, 50)

        # --- Certificate of qualification + Language ---
        cert_lang_pts = 0
        if input.has_certificate_of_qualification:
            for clb_key in sorted(CERTIFICATE_LANGUAGE_POINTS.keys(), reverse=True):
                if min_clb >= clb_key:
                    cert_lang_pts = CERTIFICATE_LANGUAGE_POINTS[clb_key]
                    break
        certificate_group = min(cert_lang_pts, 50)

        # Total skill transferability capped at 100
        total = education_group + foreign_group + certificate_group
        return min(total, MAX_SKILL_TRANSFERABILITY)

    # ------------------------------------------------------------------
    # D. Additional points
    # ------------------------------------------------------------------

    @staticmethod
    def calculate_additional_points(input: CRSInput) -> int:
        """Compute Section D additional points (max 600)."""
        points = 0

        # Provincial nomination
        if input.has_provincial_nomination:
            points += PROVINCIAL_NOMINATION_POINTS

        # Arranged employment / job offer
        if input.job_offer_noc_level == "00":
            points += JOB_OFFER_NOC_00_POINTS
        elif input.job_offer_noc_level in ("0ab", "other"):
            points += JOB_OFFER_OTHER_POINTS

        # Canadian education
        if input.canadian_education_years >= 3:
            points += CANADIAN_EDUCATION_POINTS[3]
        elif input.canadian_education_years >= 1:
            points += CANADIAN_EDUCATION_POINTS.get(input.canadian_education_years, 0)

        # French language bonus
        if input.french_clb7_plus:
            if input.english_clb5_plus:
                points += FRENCH_BONUS_WITH_ENGLISH
            else:
                points += FRENCH_BONUS_WITHOUT_ENGLISH

        # Sibling in Canada
        if input.has_sibling_in_canada:
            points += SIBLING_IN_CANADA_POINTS

        return min(points, MAX_ADDITIONAL)

    # ------------------------------------------------------------------
    # E. Orchestrator
    # ------------------------------------------------------------------

    @classmethod
    def calculate(cls, input: CRSInput) -> CRSResult:
        """Compute the full CRS score and return a structured result."""

        has_spouse = input.has_spouse

        # --- A. Core / human-capital ---
        age_pts = cls.calculate_age_points(input.age, has_spouse)
        edu_pts = cls.calculate_education_points(input.education_level, has_spouse)

        first_lang_pts = cls.calculate_language_points(
            input.first_language, is_first=True, has_spouse=has_spouse
        )
        second_lang_pts = 0
        if input.second_language is not None:
            second_lang_pts = cls.calculate_language_points(
                input.second_language, is_first=False, has_spouse=has_spouse
            )

        can_work_pts = cls.calculate_canadian_work_experience_points(
            input.canadian_work_experience_years, has_spouse
        )

        core_max = MAX_CORE_WITH_SPOUSE if has_spouse else MAX_CORE_SINGLE
        core_human_capital = min(
            age_pts + edu_pts + first_lang_pts + second_lang_pts + can_work_pts,
            core_max,
        )

        # --- B. Spouse factors ---
        spouse_factors = 0
        if has_spouse:
            if input.spouse_education_level:
                spouse_factors += cls.calculate_spouse_education_points(
                    input.spouse_education_level
                )
            if input.spouse_language:
                spouse_factors += cls.calculate_spouse_language_points(
                    input.spouse_language
                )
            spouse_factors += cls.calculate_spouse_work_experience_points(
                input.spouse_canadian_work_years
            )
            spouse_factors = min(spouse_factors, MAX_SPOUSE)

        # --- C. Skill transferability ---
        skill_transferability = cls.calculate_skill_transferability(input)

        # --- D. Additional points ---
        additional_points = cls.calculate_additional_points(input)

        # --- Total ---
        total = (
            core_human_capital + spouse_factors + skill_transferability + additional_points
        )
        total = min(total, MAX_TOTAL)

        breakdown = CRSBreakdown(
            core_human_capital=core_human_capital,
            spouse_factors=spouse_factors,
            skill_transferability=skill_transferability,
            additional_points=additional_points,
        )

        return CRSResult(total_score=total, breakdown=breakdown)
