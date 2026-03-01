"""
Complete IRCC Comprehensive Ranking System (CRS) scoring tables.

Reference: https://www.canada.ca/en/immigration-refugees-citizenship/services/
           immigrate-canada/express-entry/eligibility/criteria-comprehensive-ranking-system.html
"""

# ---------------------------------------------------------------------------
# A. Core / Human-capital factors
# ---------------------------------------------------------------------------

# Age points: age -> (single_points, with_spouse_points)
AGE_POINTS = {
    17: (0, 0), 18: (99, 90), 19: (105, 95),
    20: (110, 100), 21: (110, 100), 22: (110, 100), 23: (110, 100),
    24: (110, 100), 25: (110, 100), 26: (110, 100), 27: (110, 100),
    28: (110, 100), 29: (110, 100),
    30: (105, 95), 31: (99, 90), 32: (94, 85), 33: (88, 80),
    34: (83, 75), 35: (77, 70), 36: (72, 65), 37: (66, 60),
    38: (61, 55), 39: (55, 50), 40: (50, 45), 41: (39, 35),
    42: (28, 25), 43: (17, 15), 44: (6, 5), 45: (0, 0),
}

# Education points: level -> (single_points, with_spouse_points)
EDUCATION_POINTS = {
    "none": (0, 0),
    "high_school": (30, 28),
    "one_year_post_secondary": (90, 84),
    "two_year_post_secondary": (98, 91),
    "bachelors": (120, 112),
    "two_or_more_post_secondary": (128, 119),
    "masters": (135, 126),
    "phd": (150, 140),
}

# First official language points per CLB level (per ability: reading, writing, listening, speaking)
FIRST_LANGUAGE_POINTS_SINGLE = {
    3: 0, 4: 6, 5: 6, 6: 9, 7: 17, 8: 23, 9: 31, 10: 34,
}
FIRST_LANGUAGE_POINTS_WITH_SPOUSE = {
    3: 0, 4: 6, 5: 6, 6: 8, 7: 16, 8: 22, 9: 29, 10: 32,
}

# Second official language points per CLB level (per ability)
SECOND_LANGUAGE_POINTS_SINGLE = {
    0: 0, 4: 0, 5: 1, 6: 1, 7: 3, 8: 3, 9: 6, 10: 6,
}
SECOND_LANGUAGE_POINTS_WITH_SPOUSE = {
    0: 0, 4: 0, 5: 1, 6: 1, 7: 3, 8: 3, 9: 6, 10: 6,
}

# Canadian work experience: years -> (single_points, with_spouse_points)
CANADIAN_WORK_EXPERIENCE_POINTS = {
    0: (0, 0), 1: (40, 35), 2: (53, 46), 3: (64, 56), 4: (72, 63), 5: (80, 70),
}

# ---------------------------------------------------------------------------
# B. Spouse / common-law partner factors
# ---------------------------------------------------------------------------

SPOUSE_EDUCATION_POINTS = {
    "none": 0, "high_school": 2, "one_year_post_secondary": 6,
    "two_year_post_secondary": 7, "bachelors": 8,
    "two_or_more_post_secondary": 9, "masters": 10, "phd": 10,
}

SPOUSE_LANGUAGE_POINTS = {
    0: 0, 4: 0, 5: 1, 6: 1, 7: 3, 8: 3, 9: 5, 10: 5,
}

SPOUSE_WORK_EXPERIENCE_POINTS = {
    0: 0, 1: 5, 2: 7, 3: 8, 4: 9, 5: 10,
}

# ---------------------------------------------------------------------------
# C. Skill transferability factors
# ---------------------------------------------------------------------------

# Education + Official Language (education_level, min_clb) -> points
EDUCATION_LANGUAGE_POINTS = {
    ("one_year_post_secondary", 7): 13, ("one_year_post_secondary", 8): 13,
    ("one_year_post_secondary", 9): 25, ("one_year_post_secondary", 10): 25,
    ("two_year_post_secondary", 7): 13, ("two_year_post_secondary", 8): 13,
    ("two_year_post_secondary", 9): 25, ("two_year_post_secondary", 10): 25,
    ("bachelors", 7): 13, ("bachelors", 8): 13,
    ("bachelors", 9): 25, ("bachelors", 10): 25,
    ("two_or_more_post_secondary", 7): 13, ("two_or_more_post_secondary", 8): 13,
    ("two_or_more_post_secondary", 9): 25, ("two_or_more_post_secondary", 10): 25,
    ("masters", 7): 13, ("masters", 8): 13,
    ("masters", 9): 25, ("masters", 10): 25,
    ("phd", 7): 13, ("phd", 8): 13,
    ("phd", 9): 25, ("phd", 10): 25,
}

# Education + Canadian work experience (education_level, years) -> points
EDUCATION_CANADIAN_WORK_POINTS = {
    ("one_year_post_secondary", 1): 13, ("one_year_post_secondary", 2): 25,
    ("two_year_post_secondary", 1): 13, ("two_year_post_secondary", 2): 25,
    ("bachelors", 1): 13, ("bachelors", 2): 25,
    ("two_or_more_post_secondary", 1): 13, ("two_or_more_post_secondary", 2): 25,
    ("masters", 1): 13, ("masters", 2): 25,
    ("phd", 1): 13, ("phd", 2): 25,
}

# Foreign work experience + Language (foreign_years, min_clb) -> points
FOREIGN_WORK_LANGUAGE_POINTS = {
    (1, 7): 13, (1, 8): 13, (1, 9): 25, (1, 10): 25,
    (2, 7): 13, (2, 8): 13, (2, 9): 25, (2, 10): 25,
    (3, 7): 25, (3, 8): 25, (3, 9): 50, (3, 10): 50,
}

# Foreign work experience + Canadian work experience (foreign_years, canadian_years) -> points
FOREIGN_CANADIAN_WORK_POINTS = {
    (1, 1): 13, (1, 2): 25,
    (2, 1): 13, (2, 2): 25,
    (3, 1): 25, (3, 2): 50,
}

# Certificate of qualification + Language (min_clb) -> points
CERTIFICATE_LANGUAGE_POINTS = {
    5: 0, 6: 0, 7: 25, 8: 25, 9: 50, 10: 50,
}

# ---------------------------------------------------------------------------
# D. Additional points
# ---------------------------------------------------------------------------

PROVINCIAL_NOMINATION_POINTS = 600
JOB_OFFER_NOC_00_POINTS = 200
JOB_OFFER_OTHER_POINTS = 50
CANADIAN_EDUCATION_POINTS = {1: 15, 2: 15, 3: 30}  # years -> points
FRENCH_BONUS_WITH_ENGLISH = 50   # French CLB 7+ with English CLB 5+
FRENCH_BONUS_WITHOUT_ENGLISH = 25  # French CLB 7+ without English CLB 5+
SIBLING_IN_CANADA_POINTS = 15

# ---------------------------------------------------------------------------
# E. Maximums
# ---------------------------------------------------------------------------

MAX_CORE_SINGLE = 500
MAX_CORE_WITH_SPOUSE = 460
MAX_SPOUSE = 40
MAX_SKILL_TRANSFERABILITY = 100
MAX_ADDITIONAL = 600
MAX_TOTAL = 1200
