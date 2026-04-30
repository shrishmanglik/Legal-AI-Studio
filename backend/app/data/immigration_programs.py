"""
Seed data for Canadian immigration programs.

Each entry matches the ImmigrationProgram model schema:
    name, province, program_type, min_crs_score, requirements, active
"""

IMMIGRATION_PROGRAMS = [
    {
        "name": "Federal Skilled Worker Program (FSWP)",
        "province": "Federal",
        "program_type": "Express Entry",
        "min_crs_score": 67,
        "requirements": {
            "work_experience_years": 1,
            "language_min_clb": 7,
            "education": "one_year_post_secondary",
            "proof_of_funds": True,
            "description": (
                "For skilled workers with foreign work experience who want to "
                "immigrate to Canada permanently."
            ),
        },
        "active": True,
    },
    {
        "name": "Federal Skilled Trades Program (FSTP)",
        "province": "Federal",
        "program_type": "Express Entry",
        "min_crs_score": None,
        "requirements": {
            "work_experience_years": 2,
            "language_min_clb_speaking_listening": 5,
            "language_min_clb_reading_writing": 4,
            "qualifying_offer_or_certificate": True,
            "description": (
                "For skilled tradespeople who want to become permanent "
                "residents based on their qualification in a skilled trade."
            ),
        },
        "active": True,
    },
    {
        "name": "Canadian Experience Class (CEC)",
        "province": "Federal",
        "program_type": "Express Entry",
        "min_crs_score": None,
        "requirements": {
            "canadian_work_experience_years": 1,
            "language_min_clb_noc_0_a": 7,
            "language_min_clb_noc_b": 5,
            "description": (
                "For skilled workers who have Canadian work experience and "
                "want to become permanent residents."
            ),
        },
        "active": True,
    },
    {
        "name": "Ontario Immigrant Nominee Program - Human Capital Priorities",
        "province": "Ontario",
        "program_type": "Provincial Nominee Program",
        "min_crs_score": 400,
        "requirements": {
            "work_experience_years": 1,
            "language_min_clb": 7,
            "education": "bachelors",
            "ee_profile_required": True,
            "settlement_funds": True,
            "description": (
                "Ontario nominates candidates from the Express Entry pool "
                "who have the skills and experience to contribute to Ontario's economy."
            ),
        },
        "active": True,
    },
    {
        "name": "British Columbia Provincial Nominee Program - Skills Immigration",
        "province": "British Columbia",
        "program_type": "Provincial Nominee Program",
        "min_crs_score": None,
        "requirements": {
            "job_offer_required": True,
            "language_min_clb": 4,
            "work_experience_years": 2,
            "noc_skill_level": ["0", "A", "B"],
            "description": (
                "BC PNP Skills Immigration stream for workers with skills, "
                "experience and qualifications needed by BC employers."
            ),
        },
        "active": True,
    },
    {
        "name": "Alberta Advantage Immigration Program - Alberta Express Entry",
        "province": "Alberta",
        "program_type": "Provincial Nominee Program",
        "min_crs_score": 300,
        "requirements": {
            "ee_profile_required": True,
            "work_experience_years": 1,
            "language_min_clb": 5,
            "strong_ties_to_alberta": True,
            "description": (
                "Alberta nominates Express Entry candidates who have strong "
                "ties to Alberta and can support the province's economic development."
            ),
        },
        "active": True,
    },
    {
        "name": "Quebec Regular Skilled Worker Program (QSWP)",
        "province": "Quebec",
        "program_type": "Quebec Selection",
        "min_crs_score": None,
        "requirements": {
            "selection_grid_pass_mark": 50,
            "french_language_required": True,
            "work_experience_years": 1,
            "education": "one_year_post_secondary",
            "description": (
                "Quebec selects skilled workers using its own criteria. "
                "Applicants must first obtain a Quebec Selection Certificate (CSQ)."
            ),
        },
        "active": True,
    },
    {
        "name": "Atlantic Immigration Program (AIP)",
        "province": "Atlantic",
        "program_type": "Atlantic Immigration",
        "min_crs_score": None,
        "requirements": {
            "job_offer_required": True,
            "language_min_clb": 4,
            "work_experience_years": 1,
            "education": "high_school",
            "designated_employer": True,
            "provinces": ["New Brunswick", "Nova Scotia", "Prince Edward Island", "Newfoundland and Labrador"],
            "description": (
                "Employer-driven program helping designated Atlantic employers "
                "hire qualified candidates for jobs they have not been able to fill locally."
            ),
        },
        "active": True,
    },
]
