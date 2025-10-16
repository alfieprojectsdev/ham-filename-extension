// ham-filename-extension/popup.js
// Map hazard keywords to codes
const hazardMap = {
  'Active Fault': 'AF',
  'Liquefaction': 'LIQN',
  'Landslide - Earthquake - Induced': 'EIL',
  'Tsunami': 'TSU',
  'Lahar': 'LHR',
  'Pyroclastic Flow': 'PF',
  'Base Surge': 'BS',
  'Lava Flow': 'LF'
};

// File suffix; use initials of your name
const suffix = 'ArP'

// Helper to PascalCase + strip punctuation
function normalizePascal(text) {
  return text
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

// Helper to extract field value
function extractField(label, text) {
  const regex = new RegExp(`${label}\\s+(.+)`);
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}

// Main function to generate filenames
function generateFilename(text) {
  // Extract relevant fields
  const reqId = extractField('Request', text);
  const hazards = extractField('Hazard Type', text);
  const requestedFor = extractField('Requested For', text);
  const requestedBy = extractField('Requested By', text);
  const location = extractField('Province, City, Barangay', text).split(',');

  const brgy = location[0]?.trim() || '';
  const city = location[1]?.trim() || '';
  const province = location[2]?.trim() || '';

  // Parse hazard codes
  const hazardList = hazards.split(',').map(h => h.trim());
  const hazardCodes = Object.entries(hazardMap)
    .filter(([label]) => hazardList.includes(label))
    .map(([_, code]) => code);

  const afGroup = hazardCodes.filter(h => ['AF', 'LIQN', 'EIL', 'TSU'].includes(h));
  const volGroup = hazardCodes.filter(h => ['LHR', 'PF', 'BS', 'LF'].includes(h));

  // Generate filenames array
  const filenames = [];
  
  // Add AF base filename if Active Fault is present
  if (hazardCodes.includes('AF')) {
    filenames.push('AF');
    // Add individual AF combinations with other earthquake hazards
    const otherEQHazards = afGroup.filter(code => code !== 'AF');
    otherEQHazards.forEach(code => {
      filenames.push(`AF-${code}`);
    });
  }

  // Add VOL base filename and individual volcanic hazards if any volcanic hazard is present
  if (volGroup.length > 0) {
    filenames.push('VOL');
    volGroup.forEach(code => {
      filenames.push(`VOL-${code}`);
    });
  }

  // Format location and client details
  const locationFormatted = `${province}-${city}-Brgy${brgy}`.replace(/\s+/g, '');
  const client = normalizePascal(abbreviateOrgName(requestedFor));
  
  // Format requester - taking first two name initials plus last name, camelCase
  let reqByFormatted = '';
  if (requestedBy) {
    const parts = requestedBy.split(' ');
    if (parts.length >= 3) {
      // If there are 3 or more parts, take first two initials and last name
      const firstInitial = parts[0].charAt(0).toUpperCase();
      const middleInitial = parts[1].charAt(0).toUpperCase();
      const lastName = parts[parts.length - 1].charAt(0).toUpperCase() + parts[parts.length - 1].slice(1).toLowerCase();
      reqByFormatted = `${firstInitial}${middleInitial}${lastName}`;
    } else if (parts.length === 2) {
      // If only two parts, take first initial and last name
      const firstInitial = parts[0].charAt(0).toUpperCase();
      const lastName = parts[1].charAt(0).toUpperCase() + parts[1].slice(1).toLowerCase();
      reqByFormatted = `${firstInitial}${lastName}`;
    } else {
      // If only one part, use it as is
      reqByFormatted = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
    }
  }

  // Build filenames
  return filenames.map(hazardCode => 
    `${reqId}_${hazardCode}_${locationFormatted}_${client}-${reqByFormatted}_${suffix}`
  );
}

// Abbreviation mapping for organization names
const orgAbbreviations = {
  'Government': 'Govt',
  'Department': 'Dept',
  'Company': 'Co',
  'Development': 'Devt',
  'Incorporated': 'Inc',
  'Corporation': 'Corp',
  'Limited': 'Ltd',
  'and': '&',
  'Association': 'Assn',
  'Foundation': 'Fdn',
  'Cooperative': 'Coop',
  'Services': 'Svcs',
  'International': 'Intl',
  'Group': 'Grp',
  'Construction': 'Constr',
  'Builders': 'Bldrs',
  'Consultants': 'Cons',
  'Enterprises': 'Ent',
  'Trading': 'Trdg',
  'Manufacturing': 'Mfg',
  'Engineering': 'Engr'
};

function abbreviateOrgName(name) {
  // Replace whole words only, case-insensitive
  let result = name;
  Object.entries(orgAbbreviations).forEach(([full, abbr]) => {
    const regex = new RegExp(`\\b${full}\\b`, 'gi');
    result = result.replace(regex, abbr);
  });
  return result;
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  const inputText = document.getElementById('inputText');
  const generateButton = document.getElementById('generateButton');
  const result = document.getElementById('result');
  const filename = document.getElementById('filename');
  const copyStatus = document.getElementById('copyStatus');

  // Auto-paste from clipboard when popup opens
  navigator.clipboard.readText().then(text => {
    inputText.value = text;
  }).catch(err => {
    console.error('Failed to read clipboard:', err);
  });

  generateButton.addEventListener('click', () => {
    const generatedFilenames = generateFilename(inputText.value);
    
    // Create a formatted list of filenames
    filename.innerHTML = generatedFilenames
      .map(name => `<div class="filename-item">${name}</div>`)
      .join('');
    result.classList.remove('hidden');

    // Create JSON output structure
    const clipboardData = {
      Request: extractField('Request', inputText.value),
      'Hazard Type': extractField('Hazard Type', inputText.value).split(',').map(h => h.trim()),
      'Hazard Assessment Map filenames': generatedFilenames,
      'Requested For': extractField('Requested For', inputText.value),
      'Requested By': extractField('Requested By', inputText.value)
    };

    // Copy formatted JSON to clipboard
    navigator.clipboard.writeText(JSON.stringify(clipboardData, null, 2)).then(() => {
      copyStatus.textContent = 'JSON data copied to clipboard!';
      setTimeout(() => {
        copyStatus.textContent = '';
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
      copyStatus.textContent = 'Failed to copy to clipboard';
    });
  });
});