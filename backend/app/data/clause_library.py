"""
Seed data for the contract clause library.

Each entry matches the ClauseLibrary model schema:
    clause_type, name, description, risk_level, example_text

risk_level values: "low", "medium", "high"
"""

CLAUSE_LIBRARY = [
    {
        "clause_type": "confidentiality",
        "name": "Mutual Confidentiality Obligation",
        "description": (
            "Requires both parties to keep exchanged confidential information secret "
            "and only use it for the purposes of the agreement. Standard in most "
            "commercial contracts."
        ),
        "risk_level": "low",
        "example_text": (
            "Each party agrees to hold in confidence all Confidential Information "
            "received from the other party and to use such information solely for the "
            "purposes of this Agreement. Neither party shall disclose Confidential "
            "Information to any third party without the prior written consent of the "
            "disclosing party, except to its employees, agents, or contractors who "
            "have a need to know and are bound by obligations of confidentiality at "
            "least as protective as those set forth herein."
        ),
    },
    {
        "clause_type": "confidentiality",
        "name": "Unilateral Confidentiality (Discloser-Favored)",
        "description": (
            "Only the receiving party is bound by confidentiality obligations. This "
            "is riskier for the receiving party as there is no reciprocal duty on the "
            "disclosing party."
        ),
        "risk_level": "medium",
        "example_text": (
            "The Receiving Party shall maintain the confidentiality of all Confidential "
            "Information disclosed by the Disclosing Party and shall not, without the "
            "prior written consent of the Disclosing Party, disclose, publish, or "
            "otherwise disseminate such information to any third party or use such "
            "information for any purpose other than as expressly permitted under this "
            "Agreement."
        ),
    },
    {
        "clause_type": "indemnification",
        "name": "Mutual Indemnification",
        "description": (
            "Each party agrees to indemnify the other against losses arising from their "
            "own breach, negligence, or willful misconduct. Balanced and commonly "
            "accepted in commercial agreements."
        ),
        "risk_level": "low",
        "example_text": (
            "Each party (the 'Indemnifying Party') shall indemnify, defend, and hold "
            "harmless the other party and its officers, directors, employees, and agents "
            "(the 'Indemnified Party') from and against any and all claims, damages, "
            "losses, costs, and expenses (including reasonable attorneys' fees) arising "
            "out of or relating to: (a) any breach of this Agreement by the Indemnifying "
            "Party; (b) the negligence or willful misconduct of the Indemnifying Party; "
            "or (c) any violation of applicable law by the Indemnifying Party."
        ),
    },
    {
        "clause_type": "indemnification",
        "name": "Unlimited One-Sided Indemnification",
        "description": (
            "Only one party provides indemnification with no cap on liability. This "
            "is heavily one-sided and creates significant financial exposure for the "
            "indemnifying party."
        ),
        "risk_level": "high",
        "example_text": (
            "The Service Provider shall indemnify, defend, and hold harmless the Client "
            "and its affiliates from and against any and all claims, liabilities, damages, "
            "losses, and expenses, including but not limited to reasonable legal fees, "
            "arising out of or in any way connected with the Service Provider's "
            "performance or failure to perform under this Agreement, regardless of "
            "whether such claims are based in contract, tort, or otherwise."
        ),
    },
    {
        "clause_type": "limitation_of_liability",
        "name": "Standard Limitation of Liability",
        "description": (
            "Caps total liability at the fees paid under the agreement and excludes "
            "consequential damages. Standard commercial practice that balances risk."
        ),
        "risk_level": "low",
        "example_text": (
            "IN NO EVENT SHALL EITHER PARTY'S TOTAL AGGREGATE LIABILITY ARISING OUT OF "
            "OR RELATED TO THIS AGREEMENT EXCEED THE TOTAL AMOUNTS PAID OR PAYABLE BY "
            "CLIENT TO SERVICE PROVIDER DURING THE TWELVE (12) MONTHS PRECEDING THE "
            "CLAIM. IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR ANY INDIRECT, "
            "INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT "
            "LIMITED TO LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITY, REGARDLESS OF "
            "THE THEORY OF LIABILITY."
        ),
    },
    {
        "clause_type": "limitation_of_liability",
        "name": "No Liability Cap (Missing Clause)",
        "description": (
            "The contract contains no limitation of liability, which means each party's "
            "exposure is theoretically unlimited. This is a high-risk omission for both "
            "parties."
        ),
        "risk_level": "high",
        "example_text": (
            "WARNING: This contract does not contain a limitation of liability clause. "
            "It is strongly recommended that a limitation of liability clause be added "
            "to cap potential exposure for both parties."
        ),
    },
    {
        "clause_type": "termination",
        "name": "Mutual Termination for Convenience",
        "description": (
            "Either party may terminate the agreement at any time by providing written "
            "notice, typically with a 30 or 60-day notice period. Provides flexibility "
            "for both parties."
        ),
        "risk_level": "low",
        "example_text": (
            "Either party may terminate this Agreement for any reason or no reason upon "
            "thirty (30) days' prior written notice to the other party. Upon termination, "
            "all obligations shall cease except for those that by their nature survive "
            "termination, including without limitation confidentiality, indemnification, "
            "and limitation of liability."
        ),
    },
    {
        "clause_type": "termination",
        "name": "Termination for Cause Only",
        "description": (
            "The agreement can only be terminated for material breach with a cure period. "
            "This limits flexibility but provides stability for longer-term engagements."
        ),
        "risk_level": "medium",
        "example_text": (
            "Either party may terminate this Agreement upon written notice if the other "
            "party materially breaches any provision of this Agreement and fails to cure "
            "such breach within thirty (30) days after receiving written notice specifying "
            "the nature of the breach. Termination under this section shall not relieve "
            "the breaching party of its obligation to pay any amounts owed prior to the "
            "effective date of termination."
        ),
    },
    {
        "clause_type": "intellectual_property",
        "name": "Work-for-Hire / IP Assignment",
        "description": (
            "All intellectual property created during the engagement belongs to the "
            "client. This is standard for service agreements but should be reviewed "
            "carefully to ensure pre-existing IP is excluded."
        ),
        "risk_level": "medium",
        "example_text": (
            "All work product, inventions, discoveries, and intellectual property "
            "created by the Service Provider in the course of performing services under "
            "this Agreement shall be considered 'work made for hire' and shall be the "
            "sole and exclusive property of the Client. To the extent any such work "
            "product does not qualify as work made for hire, the Service Provider hereby "
            "irrevocably assigns to the Client all right, title, and interest in and to "
            "such work product."
        ),
    },
    {
        "clause_type": "intellectual_property",
        "name": "IP License (Non-Exclusive)",
        "description": (
            "The service provider retains ownership of IP but grants the client a "
            "non-exclusive license to use it. Less risky for the provider but the "
            "client should ensure the license scope is sufficient."
        ),
        "risk_level": "low",
        "example_text": (
            "Service Provider retains all right, title, and interest in and to any "
            "pre-existing intellectual property and any intellectual property created "
            "during the performance of this Agreement. Service Provider hereby grants "
            "to Client a perpetual, non-exclusive, royalty-free, worldwide license to "
            "use, reproduce, and display the deliverables solely for Client's internal "
            "business purposes."
        ),
    },
    {
        "clause_type": "non_compete",
        "name": "Non-Competition Restriction",
        "description": (
            "Restricts one party from competing with the other for a specified period "
            "and within a defined geographic area. Enforceability varies by jurisdiction "
            "and must be reasonable in scope."
        ),
        "risk_level": "high",
        "example_text": (
            "During the term of this Agreement and for a period of twelve (12) months "
            "following its termination, the Service Provider shall not, directly or "
            "indirectly, engage in, own, manage, operate, or provide services to any "
            "business that is in direct competition with the Client's business within "
            "the Province of Ontario. The parties acknowledge that this restriction is "
            "reasonable and necessary to protect the Client's legitimate business interests."
        ),
    },
    {
        "clause_type": "non_solicitation",
        "name": "Non-Solicitation of Employees",
        "description": (
            "Prevents one party from soliciting or hiring the other party's employees "
            "for a defined period after the agreement ends. Commonly paired with "
            "non-compete clauses."
        ),
        "risk_level": "medium",
        "example_text": (
            "During the term of this Agreement and for a period of twelve (12) months "
            "following its termination, neither party shall, directly or indirectly, "
            "solicit, recruit, or hire any employee, contractor, or consultant of the "
            "other party who was involved in the performance of this Agreement, without "
            "the prior written consent of the other party."
        ),
    },
    {
        "clause_type": "governing_law",
        "name": "Governing Law and Jurisdiction",
        "description": (
            "Specifies which jurisdiction's laws govern the contract and where disputes "
            "will be resolved. Essential for clarity in cross-border or multi-province "
            "agreements."
        ),
        "risk_level": "low",
        "example_text": (
            "This Agreement shall be governed by and construed in accordance with the "
            "laws of the Province of Ontario and the federal laws of Canada applicable "
            "therein, without regard to conflict of laws principles. The parties "
            "irrevocably submit to the exclusive jurisdiction of the courts of the "
            "Province of Ontario for the resolution of any disputes arising out of or "
            "relating to this Agreement."
        ),
    },
    {
        "clause_type": "force_majeure",
        "name": "Force Majeure",
        "description": (
            "Excuses performance when prevented by events beyond the parties' control, "
            "such as natural disasters, pandemics, wars, or government actions. Should "
            "include a termination right if the event persists beyond a defined period."
        ),
        "risk_level": "medium",
        "example_text": (
            "Neither party shall be liable for any failure or delay in performing its "
            "obligations under this Agreement to the extent that such failure or delay "
            "results from circumstances beyond the reasonable control of that party, "
            "including but not limited to acts of God, natural disasters, pandemic, "
            "epidemic, war, terrorism, riots, embargoes, acts of civil or military "
            "authorities, fire, floods, strikes, or power failures. The affected party "
            "must provide prompt written notice and use commercially reasonable efforts "
            "to mitigate the impact. If the force majeure event continues for more than "
            "ninety (90) days, either party may terminate this Agreement upon written notice."
        ),
    },
    {
        "clause_type": "data_protection",
        "name": "Data Protection and Privacy",
        "description": (
            "Obligates the receiving party to protect personal information in accordance "
            "with applicable privacy laws (PIPEDA, provincial privacy acts). Critical "
            "for any agreement involving personal data."
        ),
        "risk_level": "high",
        "example_text": (
            "Each party shall comply with all applicable privacy and data protection "
            "legislation, including the Personal Information Protection and Electronic "
            "Documents Act (PIPEDA) and any applicable provincial privacy legislation. "
            "The Receiving Party shall implement and maintain appropriate technical and "
            "organizational measures to protect any personal information received under "
            "this Agreement against unauthorized access, disclosure, alteration, or "
            "destruction. In the event of a data breach involving personal information, "
            "the Receiving Party shall notify the Disclosing Party within seventy-two "
            "(72) hours and cooperate fully in any investigation or remediation efforts."
        ),
    },
]
