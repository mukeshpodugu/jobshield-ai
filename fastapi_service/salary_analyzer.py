from typing import Dict, Any

# Benchmark data for salaries (in USD)
# Structure: { role_key: { entry: (min, max, avg), mid: (min, max, avg), senior: (min, max, avg) } }
SALARY_BENCHMARKS: Dict[str, Dict[str, tuple]] = {
    "software engineer": {
        "entry": (60000, 110000, 85000),
        "mid": (95000, 160000, 125000),
        "senior": (140000, 250000, 185000)
    },
    "data analyst": {
        "entry": (45000, 75000, 60000),
        "mid": (70000, 110000, 88000),
        "senior": (100000, 160000, 125000)
    },
    "data entry": {
        "entry": (25000, 42000, 32000),
        "mid": (35000, 52000, 43000),
        "senior": (45000, 65000, 54000)
    },
    "virtual assistant": {
        "entry": (20000, 38000, 28000),
        "mid": (30000, 48000, 38000),
        "senior": (40000, 60000, 49000)
    },
    "customer support": {
        "entry": (30000, 48000, 38000),
        "mid": (40000, 58000, 48000),
        "senior": (50000, 75000, 62000)
    },
    "marketing coordinator": {
        "entry": (40000, 65000, 52000),
        "mid": (60000, 90000, 75000),
        "senior": (85000, 130000, 105000)
    },
    "project manager": {
        "entry": (55000, 85000, 70000),
        "mid": (80000, 125000, 100000),
        "senior": (110000, 180000, 145000)
    }
}

# Default benchmark fallback (generic role)
DEFAULT_BENCHMARK = {
    "entry": (35000, 70000, 50000),
    "mid": (60000, 110000, 85000),
    "senior": (95000, 170000, 130000)
}

def find_matching_role(title: str) -> str:
    title_lower = title.lower()
    for role_name in SALARY_BENCHMARKS.keys():
        if role_name in title_lower or any(word in title_lower for word in role_name.split()):
            # Exact or partial word match
            return role_name
    return "generic"

def analyze_salary(title: str, salary: float, experience_level: str) -> Dict[str, Any]:
    # Ensure experience level is normalized
    exp_key = experience_level.lower()
    if exp_key not in ["entry", "mid", "senior"]:
        exp_key = "mid"
        
    role_key = find_matching_role(title)
    
    if role_key == "generic":
        benchmarks = DEFAULT_BENCHMARK[exp_key]
        matched_role_display = "Generic Professional Role"
    else:
        benchmarks = SALARY_BENCHMARKS[role_key][exp_key]
        matched_role_display = role_key.title()
        
    min_val, max_val, avg_val = benchmarks
    
    # Calculate anomaly indicators
    # 1. Salary is astronomically high (classic check/overpayment fraud indicator)
    anomaly_score = 0
    message = ""
    status = "normal"
    
    if salary > (max_val * 2.2):
        anomaly_score = min(int(((salary - max_val) / max_val) * 35) + 50, 100)
        status = "suspiciously_high"
        message = (
            f"The offered salary (${salary:,.2f}) is significantly higher than the standard market range "
            f"for a {exp_key} level {matched_role_display} (${min_val:,.2f} - ${max_val:,.2f}). "
            "This is a common tactic in job scams to attract victims."
        )
    elif salary < (min_val * 0.5):
        anomaly_score = min(int(((min_val - salary) / min_val) * 20) + 30, 80)
        status = "suspiciously_low"
        message = (
            f"The offered salary (${salary:,.2f}) is substantially lower than market expectations "
            f"(${min_val:,.2f} - ${max_val:,.2f}). This may indicate wage exploitation or a low-quality post."
        )
    else:
        status = "normal"
        message = (
            f"The offered salary (${salary:,.2f}) is within standard market expectations "
            f"for a {exp_key} level {matched_role_display} (${min_val:,.2f} - ${max_val:,.2f})."
        )
        
    return {
        "salary_offered": salary,
        "role_matched": matched_role_display,
        "experience_level": exp_key.title(),
        "market_range": {
            "min": min_val,
            "max": max_val,
            "avg": avg_val
        },
        "anomaly_score": anomaly_score,
        "status": status,
        "message": message
    }
