from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional

from scam_detector import analyze_job_text
from phishing_detector import analyze_email
from salary_analyzer import analyze_salary

app = FastAPI(
    title="JobShield AI NLP Microservice",
    description="NLP scam and phishing verification microservice for job descriptions, emails, and salary levels.",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class JobRequest(BaseModel):
    text: str = Field(..., min_length=10, description="The job posting text content to analyze")

class EmailRequest(BaseModel):
    text: str = Field(..., min_length=10, description="The body of the email")
    sender: Optional[str] = Field("", description="The sender's email address")

class SalaryRequest(BaseModel):
    title: str = Field(..., min_length=2, description="Job title")
    salary: float = Field(..., gt=0, description="Offered annual salary in USD")
    experience_level: str = Field(..., description="Experience tier: Entry, Mid, or Senior")

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "jobshield-nlp-engine"}

@app.post("/analyze/job")
def analyze_job_endpoint(payload: JobRequest):
    try:
        results = analyze_job_text(payload.text)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Job analysis failed: {str(e)}")

@app.post("/analyze/email")
def analyze_email_endpoint(payload: EmailRequest):
    try:
        results = analyze_email(payload.text, payload.sender)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Email analysis failed: {str(e)}")

@app.post("/analyze/salary")
def analyze_salary_endpoint(payload: SalaryRequest):
    try:
        results = analyze_salary(payload.title, payload.salary, payload.experience_level)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Salary analysis failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
