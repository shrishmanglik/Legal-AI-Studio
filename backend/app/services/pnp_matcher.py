"""
Provincial Nominee Program (PNP) pathway matcher.

Uses rule-based matching to compare a candidate's CRS profile against
a list of immigration programs and returns eligibility + match scores.
"""

from app.schemas.immigration import (
    CRSInput,
    ImmigrationProgramResponse,
    PathwayMatchResponse,
)


class PNPMatcher:
    """Match immigration programs to a candidate profile."""

    @classmethod
    def match_programs(
        cls,
        profile: CRSInput,
        crs_score: int,
        programs: list[ImmigrationProgramResponse],
    ) -> list[PathwayMatchResponse]:
        """Evaluate each program against the profile and return ranked matches."""
        results: list[PathwayMatchResponse] = []
        for program in programs:
            eligible, score, notes = cls._evaluate_program(profile, crs_score, program)
            results.append(
                PathwayMatchResponse(
                    program=program,
                    eligible=eligible,
                    match_score=round(score, 2),
                    notes=notes,
                )
            )
        # Sort by match_score descending
        results.sort(key=lambda r: r.match_score, reverse=True)
        return results

    # ------------------------------------------------------------------
    # Internal evaluation
    # ------------------------------------------------------------------

    @classmethod
    def _evaluate_program(
        cls,
        profile: CRSInput,
        crs_score: int,
        program: ImmigrationProgramResponse,
    ) -> tuple[bool, float, list[str]]:
        """Return (eligible, match_score 0-100, notes) for one program."""
        notes: list[str] = []
        score = 0.0
        eligible = True
        reqs = program.requirements or {}

        # --- CRS minimum ---
        if program.min_crs_score is not None:
            if crs_score >= program.min_crs_score:
                score += 30
                notes.append(
                    f"CRS score {crs_score} meets minimum {program.min_crs_score}"
                )
            else:
                eligible = False
                notes.append(
                    f"CRS score {crs_score} below minimum {program.min_crs_score}"
                )

        # --- Work experience ---
        req_work = reqs.get("work_experience_years")
        if req_work is not None:
            total_exp = (
                profile.canadian_work_experience_years
                + profile.foreign_work_experience_years
            )
            if total_exp >= req_work:
                score += 20
                notes.append(f"Work experience ({total_exp} yrs) meets requirement")
            else:
                eligible = False
                notes.append(
                    f"Work experience ({total_exp} yrs) below required {req_work}"
                )

        # --- Canadian work experience (specific requirement) ---
        req_can_work = reqs.get("canadian_work_experience_years")
        if req_can_work is not None:
            if profile.canadian_work_experience_years >= req_can_work:
                score += 20
                notes.append("Canadian work experience requirement met")
            else:
                eligible = False
                notes.append(
                    f"Canadian work experience ({profile.canadian_work_experience_years} yrs) "
                    f"below required {req_can_work}"
                )

        # --- Language CLB minimum ---
        req_lang = reqs.get("language_min_clb")
        if req_lang is not None:
            min_clb = min(
                profile.first_language.speaking,
                profile.first_language.listening,
                profile.first_language.reading,
                profile.first_language.writing,
            )
            if min_clb >= req_lang:
                score += 20
                notes.append(f"Language CLB {min_clb} meets minimum {req_lang}")
            else:
                eligible = False
                notes.append(f"Language CLB {min_clb} below minimum {req_lang}")

        # --- Education level ---
        req_edu = reqs.get("education")
        if req_edu is not None:
            edu_order = [
                "none",
                "high_school",
                "one_year_post_secondary",
                "two_year_post_secondary",
                "bachelors",
                "two_or_more_post_secondary",
                "masters",
                "phd",
            ]
            profile_idx = (
                edu_order.index(profile.education_level)
                if profile.education_level in edu_order
                else 0
            )
            req_idx = edu_order.index(req_edu) if req_edu in edu_order else 0

            if profile_idx >= req_idx:
                score += 15
                notes.append("Education level meets requirement")
            else:
                eligible = False
                notes.append(
                    f"Education level '{profile.education_level}' below "
                    f"required '{req_edu}'"
                )

        # --- Job offer ---
        req_job_offer = reqs.get("job_offer_required")
        if req_job_offer:
            if profile.job_offer_noc_level is not None:
                score += 15
                notes.append("Has qualifying job offer")
            else:
                eligible = False
                notes.append("Job offer required but not present")

        # --- Provincial nomination (Express Entry linked PNPs) ---
        if program.program_type == "Provincial Nominee Program":
            if profile.has_provincial_nomination:
                score += 10
                notes.append("Has provincial nomination")

        # Normalize score to 0-100 range
        max_possible = 100.0
        score = min(score, max_possible)

        return eligible, score, notes
