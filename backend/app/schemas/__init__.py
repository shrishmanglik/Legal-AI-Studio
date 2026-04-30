from app.schemas.common import BaseResponse, PaginatedResponse, MessageResponse
from app.schemas.auth import (
    UserCreate,
    UserLogin,
    UserResponse,
    TokenResponse,
    RefreshTokenRequest,
)
from app.schemas.immigration import (
    LanguageScores,
    CRSInput,
    CRSBreakdown,
    CRSResult,
    ImmigrationProgramResponse,
    PathwayMatchResponse,
    ChecklistItem,
    EEDrawResponse,
)
from app.schemas.contracts import (
    ContractUploadResponse,
    ClauseFound,
    ContractReviewResponse,
    ClauseLibraryResponse,
)
from app.schemas.documents import (
    DocumentTemplateResponse,
    DocumentGenerateRequest,
    DocumentGenerateResponse,
)
from app.schemas.compliance import (
    EmploymentStandardResponse,
    ComplianceRuleResponse,
    ComplianceChecklistResponse,
)
from app.schemas.legal import (
    LegalQARequest,
    LegalQAResponse,
    LegalQAHistoryItem,
)

__all__ = [
    # common
    "BaseResponse",
    "PaginatedResponse",
    "MessageResponse",
    # auth
    "UserCreate",
    "UserLogin",
    "UserResponse",
    "TokenResponse",
    "RefreshTokenRequest",
    # immigration
    "LanguageScores",
    "CRSInput",
    "CRSBreakdown",
    "CRSResult",
    "ImmigrationProgramResponse",
    "PathwayMatchResponse",
    "ChecklistItem",
    "EEDrawResponse",
    # contracts
    "ContractUploadResponse",
    "ClauseFound",
    "ContractReviewResponse",
    "ClauseLibraryResponse",
    # documents
    "DocumentTemplateResponse",
    "DocumentGenerateRequest",
    "DocumentGenerateResponse",
    # compliance
    "EmploymentStandardResponse",
    "ComplianceRuleResponse",
    "ComplianceChecklistResponse",
    # legal
    "LegalQARequest",
    "LegalQAResponse",
    "LegalQAHistoryItem",
]
