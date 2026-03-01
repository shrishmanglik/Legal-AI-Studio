from uuid import UUID

from pydantic import BaseModel


class DocumentTemplateResponse(BaseModel):
    id: UUID
    name: str
    category: str
    description: str
    jurisdiction: str
    variables_schema: dict

    class Config:
        from_attributes = True


class DocumentGenerateRequest(BaseModel):
    template_id: UUID
    variables: dict


class DocumentGenerateResponse(BaseModel):
    id: UUID
    title: str
    content: str
    file_url: str | None

    class Config:
        from_attributes = True
