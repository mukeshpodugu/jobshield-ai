const scanBtn = document.getElementById('scanBtn');
const textInput = document.getElementById('textInput');
const resultBox = document.getElementById('resultBox');
const riskScore = document.getElementById('riskScore');
const riskLevel = document.getElementById('riskLevel');
const flagList = document.getElementById('flagList');

// Run search on load to see if a context selection was saved by the background script
if (typeof chrome !== 'undefined' && chrome.storage) {
  chrome.storage.local.get(['selectedText'], (result) => {
    if (result.selectedText) {
      textInput.value = result.selectedText;
      // Trigger scan automatically
      triggerScan(result.selectedText);
      // Clear storage
      chrome.storage.local.remove('selectedText');
    }
  });
}

scanBtn.addEventListener('click', () => {
  const text = textInput.value;
  if (text.trim()) {
    triggerScan(text);
  }
});

async function triggerScan(text) {
  scanBtn.disabled = true;
  scanBtn.innerText = 'Scanning...';
  resultBox.style.display = 'none';
  flagList.innerHTML = '';

  try {
    const res = await fetch('http://localhost:5000/api/scans/job', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });
    
    const json = await res.json();
    
    if (json.success) {
      const data = json.data;
      
      // Update UI elements
      riskScore.innerText = `${data.risk_score}%`;
      riskLevel.innerText = `${data.risk_level} Risk`;
      
      // Reset classes
      riskLevel.className = 'risk-level';
      if (data.risk_score >= 75) {
        riskLevel.classList.add('critical');
      } else if (data.risk_score >= 45) {
        riskLevel.classList.add('high');
      } else {
        riskLevel.classList.add('safe');
      }
      
      // Populate red flags
      if (data.red_flags.length > 0) {
        data.red_flags.forEach(flag => {
          const li = document.createElement('li');
          li.innerText = flag;
          flagList.appendChild(li);
        });
      } else {
        const li = document.createElement('li');
        li.innerText = 'No threat signals matching fake job markers.';
        flagList.appendChild(li);
      }
      
      resultBox.style.display = 'block';
    } else {
      alert(json.message || 'Scan failed.');
    }
  } catch (err) {
    alert('Security backend is offline. Start Express API server first!');
  } finally {
    scanBtn.disabled = false;
    scanBtn.innerText = 'Scan Content';
  }
}
