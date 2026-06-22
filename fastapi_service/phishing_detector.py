import re
from typing import Dict, List, Any

PHISHING_KEYWORDS = [
    r"urgent response", r"action required", r"verify your account", r"bank details",
    r"social security number", r"ssn", r"tax return", r"confidential document",
    r"click the link below", r"claim your prize", r"security alert", r"immediate action",
    r"suspended", r"unusual activity", r"confirm password", r"credential verification"
]

GENERIC_GREETINGS = [
    r"dear applicant", r"dear candidate", r"dear job seeker", r"dear customer", 
    r"dear sir or madam", r"hello applicant", r"attention applicant"
]

FREE_DOMAINS = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "protonmail.com", "mail.com", "aol.com"]

def analyze_email(email_content: str, sender_email: str = "") -> Dict[str, Any]:
    content_lower = email_content.lower()
    red_flags = []
    
    keyword_score = 0
    sender_score = 0
    greeting_score = 0
    link_score = 0
    
    # 1. Keywords check
    matched_keywords = []
    for pattern in PHISHING_KEYWORDS:
        matches = re.findall(pattern, content_lower)
        if matches:
            matched_keywords.extend(matches)
            keyword_score += 15
            
    if matched_keywords:
        red_flags.append(f"Contains phishing phrases or data-harvesting keywords: {', '.join(set(matched_keywords))}")
        
    # 2. Greeting check
    matched_greetings = []
    for pattern in GENERIC_GREETINGS:
        if re.search(pattern, content_lower):
            matched_greetings.append(pattern)
            greeting_score += 15
            
    if matched_greetings:
        red_flags.append("Uses a generic greeting rather than addressing you by name.")
        
    # 3. Sender domain check (if provided)
    if sender_email:
        sender_email_lower = sender_email.lower()
        domain_match = re.search(r"@([\w\.-]+)", sender_email_lower)
        if domain_match:
            domain = domain_match.group(1)
            if domain in FREE_DOMAINS:
                sender_score += 35
                red_flags.append(f"Official recruitment email sent from a free email provider (@{domain}).")
            # Look for lookalike domains (simple heuristic: containing keywords like 'job', 'careers', 'hr' inside subdomains, or hyphens)
            elif any(kw in domain for kw in ["careers-", "jobs-", "hr-portal", "verification-"]):
                sender_score += 25
                red_flags.append(f"Sender domain (@{domain}) appears to mimic a corporate entity.")
    else:
        # If no sender email, scan content for emails
        emails_found = re.findall(r"[\w\.-]+@[\w\.-]+", content_lower)
        free_emails_found = [e for e in emails_found if any(fd in e for fd in FREE_DOMAINS)]
        if free_emails_found:
            sender_score += 25
            red_flags.append(f"Asks you to contact a free email address: {', '.join(free_emails_found)}")

    # 4. URLs / Links Check
    # Look for http links in text
    urls = re.findall(r"https?://[^\s/$.?#].[^\s]*", content_lower)
    suspicious_urls = []
    for url in urls:
        # Check for IP address in URL
        if re.search(r"https?://\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}", url):
            suspicious_urls.append(url)
            link_score += 30
        # Check for URL shortening services
        elif any(short in url for short in ["bit.ly", "tinyurl.com", "t.co", "cutt.ly"]):
            suspicious_urls.append(url)
            link_score += 20
            
    if suspicious_urls:
        red_flags.append("Contains suspicious, shortened, or raw IP address links.")

    raw_score = keyword_score + sender_score + greeting_score + link_score
    risk_score = min(max(raw_score, 0), 100)
    
    if risk_score <= 15:
        risk_level = "Low"
    elif risk_score <= 45:
        risk_level = "Medium"
    elif risk_score <= 75:
        risk_level = "High"
    else:
        risk_level = "Critical"
        
    breakdown = {
        "phishing_triggers": min(keyword_score, 100),
        "sender_credibility": min(sender_score, 100),
        "generic_greeting": min(greeting_score, 100),
        "link_safety": min(link_score, 100)
    }

    return {
        "risk_score": int(risk_score),
        "risk_level": risk_level,
        "red_flags": red_flags,
        "breakdown": breakdown
    }
