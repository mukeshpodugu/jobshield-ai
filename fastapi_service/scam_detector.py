import re
from typing import Dict, List, Any

# High-risk scam markers
FINANCIAL_TRIGGERS = [
    r"processing fee", r"deposit", r"wire transfer", r"buy equipment", r"send money",
    r"purchase gift cards", r"payment upfront", r"credit check fee", r"training fee",
    r"bitcoin", r"cryptocurrency", r"money transfer", r"cashier check", r"background check fee"
]

COMMUNICATION_TRIGGERS = [
    r"whatsapp", r"telegram", r"signal app", r"direct message on", r"text us at",
    r"g-mail", r"yahoo mail", r"outlook\.com recruitment", r"protonmail"
]

URGENCY_EASY_MONEY_TRIGGERS = [
    r"quick money", r"no experience required", r"make \$\d+", r"earn \$\d+ per hour",
    r"immediate start", r"work only \d+ hours", r"envelope stuffing", r"package handler",
    r"mystery shopper", r"re-shipping", r"easy task", r"unlimited earning"
]

VAGUE_ROLES = [
    r"data entry clerk", r"virtual assistant", r"customer representative", 
    r"administrative assistant", r"shipping coordinator"
]

def analyze_job_text(text: str) -> Dict[str, Any]:
    text_lower = text.lower()
    red_flags = []
    
    # Initial scores (0 means safe, higher is riskier)
    financial_score = 0
    comm_score = 0
    urgency_score = 0
    format_score = 0
    
    # 1. Financial Requests Evaluation
    matched_financial = []
    for pattern in FINANCIAL_TRIGGERS:
        matches = re.findall(pattern, text_lower)
        if matches:
            matched_financial.extend(matches)
            financial_score += 30
            
    if matched_financial:
        red_flags.append(f"Contains financial demands or monetary transactions: {', '.join(set(matched_financial))}")
        
    # 2. Suspicious Communication Channels
    matched_comm = []
    for pattern in COMMUNICATION_TRIGGERS:
        matches = re.findall(pattern, text_lower)
        if matches:
            matched_comm.extend(matches)
            comm_score += 25
            
    if matched_comm:
        red_flags.append(f"Asks to migrate conversation to personal messengers or uses free email: {', '.join(set(matched_comm))}")

    # 3. Urgency and "Too Good to be True" Promises
    matched_urgency = []
    for pattern in URGENCY_EASY_MONEY_TRIGGERS:
        matches = re.findall(pattern, text_lower)
        if matches:
            matched_urgency.extend(matches)
            urgency_score += 20
            
    if matched_urgency:
        red_flags.append(f"Offers unrealistic conditions or suspicious tasks: {', '.join(set(matched_urgency))}")

    # 4. Text Formatting Anomalies
    # Excessive Caps
    caps_ratio = sum(1 for c in text if c.isupper()) / (len(text) + 1)
    if caps_ratio > 0.35 and len(text) > 100:
        format_score += 15
        red_flags.append("Excessive use of CAPITAL letters (potential lack of professionalism).")
        
    # Excessive Exclamation Marks
    excl_count = text.count("!")
    if excl_count > 5:
        format_score += 10
        red_flags.append(f"Unusual number of exclamation marks ({excl_count} found).")

    # Vague job title check
    for role in VAGUE_ROLES:
        if re.search(role, text_lower):
            # Vague role increases overall risk slightly if combined with other flags
            urgency_score += 5
            break

    # Calculate overall risk score
    raw_score = financial_score + comm_score + urgency_score + format_score
    risk_score = min(max(raw_score, 0), 100)

    # Determine risk level
    if risk_score <= 15:
        risk_level = "Low"
    elif risk_score <= 45:
        risk_level = "Medium"
    elif risk_score <= 75:
        risk_level = "High"
    else:
        risk_level = "Critical"

    # Breakdowns
    breakdown = {
        "financial_risk": min(financial_score, 100),
        "communication_risk": min(comm_score, 100),
        "urgency_risk": min(urgency_score, 100),
        "formatting_anomalies": min(format_score, 100)
    }

    return {
        "risk_score": int(risk_score),
        "risk_level": risk_level,
        "red_flags": red_flags,
        "breakdown": breakdown
    }
