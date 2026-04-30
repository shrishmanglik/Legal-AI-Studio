"""
Seed data for Ontario Employment Standards Act (ESA) rules.

Each entry matches the EmploymentStandard model schema:
    province, topic, rule_text, effective_date, source_url

Reference: https://www.ontario.ca/document/your-guide-employment-standards-act-0
"""

from datetime import date

EMPLOYMENT_STANDARDS = [
    # --- Minimum Wage ---
    {
        "province": "Ontario",
        "topic": "minimum_wage",
        "rule_text": (
            "The general minimum wage in Ontario is $16.55 per hour, effective "
            "October 1, 2024. This rate applies to most employees."
        ),
        "effective_date": date(2024, 10, 1),
        "source_url": "https://www.ontario.ca/document/your-guide-employment-standards-act-0/minimum-wage",
    },
    {
        "province": "Ontario",
        "topic": "minimum_wage",
        "rule_text": (
            "Student minimum wage is $15.60 per hour for students under 18 who work "
            "28 hours a week or less during the school year, or work during a school "
            "break or summer holiday."
        ),
        "effective_date": date(2024, 10, 1),
        "source_url": "https://www.ontario.ca/document/your-guide-employment-standards-act-0/minimum-wage",
    },
    {
        "province": "Ontario",
        "topic": "minimum_wage",
        "rule_text": (
            "Liquor servers minimum wage is $15.60 per hour for employees who directly "
            "serve liquor to customers in licensed premises."
        ),
        "effective_date": date(2024, 10, 1),
        "source_url": "https://www.ontario.ca/document/your-guide-employment-standards-act-0/minimum-wage",
    },
    # --- Hours of Work ---
    {
        "province": "Ontario",
        "topic": "hours_of_work",
        "rule_text": (
            "Most employees cannot be required to work more than 8 hours a day or "
            "48 hours a week unless they agree electronically or in writing. An employer "
            "can ask an employee to work more than 48 hours in a week only if the "
            "employee has an agreement and the employer has approval from the Director "
            "of Employment Standards or the hours are within the limits set by regulation."
        ),
        "effective_date": None,
        "source_url": "https://www.ontario.ca/document/your-guide-employment-standards-act-0/hours-work",
    },
    {
        "province": "Ontario",
        "topic": "hours_of_work",
        "rule_text": (
            "Employees must receive at least 11 consecutive hours free from work each "
            "day. They must also receive at least 8 hours free from work between shifts, "
            "or if the total time worked on successive shifts exceeds 13 hours, the "
            "time off between shifts must be at least 8 hours."
        ),
        "effective_date": None,
        "source_url": "https://www.ontario.ca/document/your-guide-employment-standards-act-0/hours-work",
    },
    {
        "province": "Ontario",
        "topic": "hours_of_work",
        "rule_text": (
            "Employees must receive an eating period of at least 30 minutes for every "
            "5 consecutive hours of work. The employer and employee may agree to split "
            "the eating period into two periods. Eating periods are unpaid unless the "
            "employee's employment contract provides otherwise."
        ),
        "effective_date": None,
        "source_url": "https://www.ontario.ca/document/your-guide-employment-standards-act-0/hours-work",
    },
    # --- Overtime ---
    {
        "province": "Ontario",
        "topic": "overtime",
        "rule_text": (
            "Most employees are entitled to overtime pay at a rate of 1.5 times their "
            "regular rate of pay for each hour of work in excess of 44 hours per week. "
            "This threshold is 44 hours, not 40 hours."
        ),
        "effective_date": None,
        "source_url": "https://www.ontario.ca/document/your-guide-employment-standards-act-0/overtime-pay",
    },
    {
        "province": "Ontario",
        "topic": "overtime",
        "rule_text": (
            "An employer and employee may agree in writing or electronically that the "
            "employee will receive paid time off in lieu of overtime pay. The time off "
            "must be 1.5 hours for each hour of overtime worked and must be taken within "
            "three months of the week in which the overtime was earned, or if the "
            "employee agrees, within 12 months."
        ),
        "effective_date": None,
        "source_url": "https://www.ontario.ca/document/your-guide-employment-standards-act-0/overtime-pay",
    },
    # --- Public Holidays ---
    {
        "province": "Ontario",
        "topic": "public_holidays",
        "rule_text": (
            "Ontario has nine public holidays: New Year's Day, Family Day, Good Friday, "
            "Victoria Day, Canada Day, Labour Day, Thanksgiving Day, Christmas Day, and "
            "Boxing Day. Most employees are entitled to take these days off work and "
            "receive public holiday pay."
        ),
        "effective_date": None,
        "source_url": "https://www.ontario.ca/document/your-guide-employment-standards-act-0/public-holidays",
    },
    {
        "province": "Ontario",
        "topic": "public_holidays",
        "rule_text": (
            "Public holiday pay is calculated as: total regular wages earned plus "
            "vacation pay payable in the 4 work weeks before the work week with the "
            "public holiday, divided by 20. If an employee agrees to work on a public "
            "holiday, the employer must pay premium pay (1.5 times regular rate) for "
            "hours worked plus a substitute day off, or regular pay for the holiday "
            "plus premium pay for hours worked."
        ),
        "effective_date": None,
        "source_url": "https://www.ontario.ca/document/your-guide-employment-standards-act-0/public-holidays",
    },
    # --- Vacation ---
    {
        "province": "Ontario",
        "topic": "vacation",
        "rule_text": (
            "Employees who have worked for an employer for less than 5 years are "
            "entitled to a minimum of 2 weeks of vacation after each 12-month "
            "vacation entitlement year. Vacation pay must be at least 4% of gross "
            "wages earned in the vacation entitlement year."
        ),
        "effective_date": None,
        "source_url": "https://www.ontario.ca/document/your-guide-employment-standards-act-0/vacation",
    },
    {
        "province": "Ontario",
        "topic": "vacation",
        "rule_text": (
            "Employees who have worked for an employer for 5 years or more are entitled "
            "to a minimum of 3 weeks of vacation after each 12-month vacation entitlement "
            "year. Vacation pay must be at least 6% of gross wages earned in the vacation "
            "entitlement year."
        ),
        "effective_date": None,
        "source_url": "https://www.ontario.ca/document/your-guide-employment-standards-act-0/vacation",
    },
    # --- Termination Notice ---
    {
        "province": "Ontario",
        "topic": "termination_notice",
        "rule_text": (
            "An employer must provide written notice of termination or termination pay "
            "in lieu of notice. The notice period depends on the employee's period of "
            "employment: less than 1 year = 1 week; 1 to 3 years = 2 weeks; 3 to 4 years "
            "= 3 weeks; 4 to 5 years = 4 weeks; 5 to 6 years = 5 weeks; 6 to 7 years = "
            "6 weeks; 7 to 8 years = 7 weeks; 8 or more years = 8 weeks."
        ),
        "effective_date": None,
        "source_url": "https://www.ontario.ca/document/your-guide-employment-standards-act-0/termination-employment",
    },
    {
        "province": "Ontario",
        "topic": "termination_notice",
        "rule_text": (
            "Termination pay in lieu of notice must equal the wages the employee would "
            "have earned during the notice period, including any commissions the employee "
            "would have earned. Benefits must continue during the notice period."
        ),
        "effective_date": None,
        "source_url": "https://www.ontario.ca/document/your-guide-employment-standards-act-0/termination-employment",
    },
    # --- Severance Pay ---
    {
        "province": "Ontario",
        "topic": "severance_pay",
        "rule_text": (
            "Severance pay is separate from termination pay. An employee is entitled "
            "to severance pay if they have worked for the employer for 5 or more years "
            "and the employer has a payroll of at least $2.5 million or severed the "
            "employment of 50 or more employees in a 6-month period because all or part "
            "of the business closed."
        ),
        "effective_date": None,
        "source_url": "https://www.ontario.ca/document/your-guide-employment-standards-act-0/severance-pay",
    },
    {
        "province": "Ontario",
        "topic": "severance_pay",
        "rule_text": (
            "Severance pay is calculated as 1 week of regular wages per year of "
            "employment, up to a maximum of 26 weeks. Partial years are included on a "
            "pro-rated basis."
        ),
        "effective_date": None,
        "source_url": "https://www.ontario.ca/document/your-guide-employment-standards-act-0/severance-pay",
    },
    # --- Parental Leave ---
    {
        "province": "Ontario",
        "topic": "pregnancy_leave",
        "rule_text": (
            "A pregnant employee is entitled to up to 16 weeks of unpaid pregnancy leave. "
            "The leave can start no earlier than 17 weeks before the expected due date. "
            "The employee must have been employed for at least 13 weeks before the "
            "expected due date."
        ),
        "effective_date": None,
        "source_url": "https://www.ontario.ca/document/your-guide-employment-standards-act-0/pregnancy-and-parental-leave",
    },
    {
        "province": "Ontario",
        "topic": "parental_leave",
        "rule_text": (
            "An employee who has taken pregnancy leave is entitled to up to 61 weeks "
            "of unpaid parental leave. An employee who has not taken pregnancy leave is "
            "entitled to up to 63 weeks of unpaid parental leave. Parental leave must "
            "begin no later than 78 weeks after the child is born or comes into the "
            "employee's custody, care, and control for the first time."
        ),
        "effective_date": None,
        "source_url": "https://www.ontario.ca/document/your-guide-employment-standards-act-0/pregnancy-and-parental-leave",
    },
    # --- Sick Leave / Personal Emergency Leave ---
    {
        "province": "Ontario",
        "topic": "sick_leave",
        "rule_text": (
            "Employees are entitled to up to 3 days of unpaid sick leave per calendar "
            "year if they have been employed for at least 2 consecutive weeks. Sick "
            "leave can be taken for personal illness, injury, or medical emergency."
        ),
        "effective_date": None,
        "source_url": "https://www.ontario.ca/document/your-guide-employment-standards-act-0/sick-leave",
    },
    # --- Bereavement Leave ---
    {
        "province": "Ontario",
        "topic": "bereavement_leave",
        "rule_text": (
            "Employees are entitled to up to 2 days of unpaid bereavement leave per "
            "calendar year on the death of certain family members, including spouse, "
            "parent, step-parent, foster parent, child, step-child, foster child, "
            "grandparent, step-grandparent, grandchild, step-grandchild, spouse of "
            "child, brother, sister, and a relative who is dependent on the employee "
            "for care or assistance."
        ),
        "effective_date": None,
        "source_url": "https://www.ontario.ca/document/your-guide-employment-standards-act-0/bereavement-leave",
    },
    # --- Family Responsibility Leave ---
    {
        "province": "Ontario",
        "topic": "family_responsibility_leave",
        "rule_text": (
            "Employees are entitled to up to 3 days of unpaid family responsibility "
            "leave per calendar year to deal with illness, injury, or urgent matter "
            "relating to certain family members, including spouse, parent, step-parent, "
            "foster parent, child, step-child, foster child, grandparent, step-grandparent, "
            "grandchild, step-grandchild, spouse of the employee's child, brother, or sister."
        ),
        "effective_date": None,
        "source_url": "https://www.ontario.ca/document/your-guide-employment-standards-act-0/family-responsibility-leave",
    },
    # --- Domestic or Sexual Violence Leave ---
    {
        "province": "Ontario",
        "topic": "domestic_or_sexual_violence_leave",
        "rule_text": (
            "An employee who has been employed for at least 13 consecutive weeks and "
            "who has experienced or whose child has experienced domestic or sexual "
            "violence or the threat of domestic or sexual violence is entitled to up to "
            "10 days and up to 15 weeks of leave. The first 5 days taken in a calendar "
            "year are paid."
        ),
        "effective_date": None,
        "source_url": "https://www.ontario.ca/document/your-guide-employment-standards-act-0/domestic-or-sexual-violence-leave",
    },
    # --- Equal Pay ---
    {
        "province": "Ontario",
        "topic": "equal_pay",
        "rule_text": (
            "An employer must not pay an employee at a rate of pay less than the rate "
            "paid to another employee of the employer on the basis of sex when they "
            "perform substantially the same kind of work in the same establishment, "
            "the performance requires substantially the same skill, effort, and "
            "responsibility, and the work is performed under similar working conditions."
        ),
        "effective_date": None,
        "source_url": "https://www.ontario.ca/document/your-guide-employment-standards-act-0/equal-pay-equal-work",
    },
    # --- Temporary / Casual / Part-time Equal Pay ---
    {
        "province": "Ontario",
        "topic": "equal_pay",
        "rule_text": (
            "An employer must not pay an employee at a rate of pay less than the rate "
            "paid to another employee on the basis that the employee is a casual, "
            "part-time, temporary, or seasonal employee when they perform substantially "
            "the same kind of work."
        ),
        "effective_date": None,
        "source_url": "https://www.ontario.ca/document/your-guide-employment-standards-act-0/equal-pay-equal-work",
    },
    # --- Pay Period and Pay Day ---
    {
        "province": "Ontario",
        "topic": "pay_period",
        "rule_text": (
            "An employer must establish a recurring pay period and a recurring pay day. "
            "Wages must be paid on the pay day. Wages can be paid by cash, cheque, or "
            "direct deposit into an account of the employee's choosing at a financial "
            "institution."
        ),
        "effective_date": None,
        "source_url": "https://www.ontario.ca/document/your-guide-employment-standards-act-0/payment-wages",
    },
    # --- Wage Statements ---
    {
        "province": "Ontario",
        "topic": "wage_statements",
        "rule_text": (
            "An employer must provide a wage statement to the employee on or before "
            "each pay day. The statement must include: the pay period, wage rate, "
            "gross and net amounts, deductions and the purpose of each deduction, "
            "and any vacation pay."
        ),
        "effective_date": None,
        "source_url": "https://www.ontario.ca/document/your-guide-employment-standards-act-0/payment-wages",
    },
    # --- Record Keeping ---
    {
        "province": "Ontario",
        "topic": "record_keeping",
        "rule_text": (
            "Employers must keep records for each employee for at least 3 years after "
            "the employee ceases to be employed. Records must include: name, address, "
            "date of birth (if under 18), date employment began, hours worked each day "
            "and each week, vacation time and pay, and all documents relating to leaves."
        ),
        "effective_date": None,
        "source_url": "https://www.ontario.ca/document/your-guide-employment-standards-act-0/record-keeping",
    },
    # --- Lie Detectors ---
    {
        "province": "Ontario",
        "topic": "lie_detectors",
        "rule_text": (
            "An employer cannot require, request, or permit an employee or applicant "
            "to take a lie detector test. No person may administer a lie detector test "
            "on an employee or applicant for employment."
        ),
        "effective_date": None,
        "source_url": "https://www.ontario.ca/document/your-guide-employment-standards-act-0/lie-detectors",
    },
    # --- Child Employment ---
    {
        "province": "Ontario",
        "topic": "child_employment",
        "rule_text": (
            "No employer shall employ a person under 14 years of age. Persons aged 14 "
            "and 15 may be employed only during hours when they are not required to "
            "attend school, and the work must not be harmful to their health or safety."
        ),
        "effective_date": None,
        "source_url": "https://www.ontario.ca/document/your-guide-employment-standards-act-0",
    },
    # --- Temporary Layoff ---
    {
        "province": "Ontario",
        "topic": "temporary_layoff",
        "rule_text": (
            "A temporary layoff is a layoff of up to 13 weeks in any period of 20 "
            "consecutive weeks, or up to 35 weeks in any period of 52 consecutive weeks "
            "if certain conditions are met (e.g., the employer continues benefit "
            "contributions). If the layoff exceeds these limits, it is considered a "
            "termination and the employee is entitled to termination pay and possibly "
            "severance pay."
        ),
        "effective_date": None,
        "source_url": "https://www.ontario.ca/document/your-guide-employment-standards-act-0/termination-employment",
    },
    # --- Tips and Gratuities ---
    {
        "province": "Ontario",
        "topic": "tips_and_gratuities",
        "rule_text": (
            "An employer cannot withhold tips or other gratuities from employees, make "
            "deductions from tips, or cause employees to return or give tips to the "
            "employer. Employers may collect and redistribute tips through a tip pool."
        ),
        "effective_date": None,
        "source_url": "https://www.ontario.ca/document/your-guide-employment-standards-act-0/tips-and-other-gratuities",
    },
]
