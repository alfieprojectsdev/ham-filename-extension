# HAM Filename Generator (ham-filename-extension)

A lightweight Chrome extension that automatically generates standardized **Hazard Assessment Map (HAM)** filenames from formatted request text.  
It parses clipboard or pasted request details, extracts key fields, and outputs one or more properly structured filenames — also copying the results (as JSON) to clipboard.

---

## 🧩 Features

- Extracts key fields from formatted text:
  - Request ID  
  - Hazard Type(s)  
  - Requested For  
  - Requested By  
  - Province, City, Barangay  
- Maps hazard types to official hazard codes (e.g., `Active Fault → AF`, `Liquefaction → LIQN`)
- Auto-abbreviates organization names (`Department → Dept`, `Corporation → Corp`, etc.)
- Generates all valid hazard group combinations
- Copies formatted JSON output to clipboard for quick pasting into reports or GIS systems

---

## 🚀 Usage

1. **Install / Load Extension**
   - Open Chrome → `chrome://extensions`
   - Enable **Developer Mode**
   - Click **“Load unpacked”** and select the `ham-filename-extension` folder.

2. **Generate Filenames**
   - Copy your request text (e.g. from `View Request Detail` page from `https://hasadmin.phivolcs.dost.gov.ph/index.php?r=requests/view&id=[id]` or from text editor).
   - Click the extension icon.
   - The text auto-pastes into the input box.
   - Click **“Generate Filename(s)”**.

3. **Output**
   - The generated filenames appear in a list.
   - A JSON summary (including hazards and requester info) is automatically copied to clipboard.

---

## 🧠 Example

### **Input:**
```

Request 2025-010
Hazard Type Active Fault, Liquefaction, Lahar
Province, City, Barangay Batangas City, Batangas, Pallocan West
Requested For ABC Engineering and Development Corporation
Requested By Juan P Dela Cruz

```

### **Output Filenames:**
```

2025-010_AF_Batangas-BatangasCity-BrgyPallocanWest_ABCEnggDevtCorp-JPDelaCruz_ArP
2025-010_AF-LIQN_Batangas-BatangasCity-BrgyPallocanWest_ABCEnggDevtCorp-JPDelaCruz_ArP
2025-010_VOL_Batangas-BatangasCity-BrgyPallocanWest_ABCEnggDevtCorp-JPDelaCruz_ArP
2025-010_VOL-LHR_Batangas-BatangasCity-BrgyPallocanWest_ABCEnggDevtCorp-JPDelaCruz_ArP

````

### **JSON Copied to Clipboard:**
```json
{
  "Request": "2025-010",
  "Hazard Type": ["Active Fault", "Liquefaction", "Lahar"],
  "Hazard Assessment Map filenames": [
    "2025-010_AF_Batangas-BatangasCity-BrgyPallocanWest_ABCEnggDevtCorp-JPDelaCruz_ArP",
    "2025-010_AF-LIQN_Batangas-BatangasCity-BrgyPallocanWest_ABCEnggDevtCorp-JPDelaCruz_ArP",
    "2025-010_VOL_Batangas-BatangasCity-BrgyPallocanWest_ABCEnggDevtCorp-JPDelaCruz_ArP",
    "2025-010_VOL-LHR_Batangas-BatangasCity-BrgyPallocanWest_ABCEnggDevtCorp-JPDelaCruz_ArP"
  ],
  "Requested For": "ABC Engineering and Development Corporation",
  "Requested By": "Juan P Dela Cruz"
}
````

---

## 🛠️ Files

| File         | Purpose                                                                                 |
| ------------ | --------------------------------------------------------------------------------------- |
| `popup.html` | UI for pasting request text and displaying output                                       |
| `popup.js`   | Core logic for parsing text, mapping hazards, generating filenames, and copying results |
| `styles.css` | Optional styling for popup interface                                                    |

---

## 🧾 License

MIT License © 2025 Alfie P.

---

**HAM Filename Generator** — built for PHIVOLCS-style hazard assessment workflows.