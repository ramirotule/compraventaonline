export interface CsvRow {
  name?: string;
  brand?: string;
  description?: string;
  category_slug?: string;
  price?: string;
  condition?: string;
  stock?: string;
  attributes?: string;
  images?: string;
}

/**
 * Parses a CSV string into an array of objects.
 * Handles double-quoted fields containing commas, carriage returns, and escaped quotes.
 */
export function parseCsv(csvText: string): CsvRow[] {
  const lines: string[] = [];
  let currentLine = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      currentLine += char;
    } else if (char === '\r' && !inQuotes) {
      // Skip carriage returns
    } else if (char === '\n' && !inQuotes) {
      lines.push(currentLine);
      currentLine = '';
    } else {
      currentLine += char;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }

  if (lines.length === 0) return [];

  // Parse headers
  const headers = parseCsvLine(lines[0]);
  const rows: CsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const lineText = lines[i].trim();
    if (!lineText) continue; // Skip empty lines
    
    const values = parseCsvLine(lines[i]);
    const rowObj: any = {};
    
    headers.forEach((header, index) => {
      // Normalize header name to lowercase and strip quotes
      const cleanHeader = header.trim().toLowerCase().replace(/^"|"$/g, '');
      const value = values[index] ? values[index].trim() : '';
      rowObj[cleanHeader] = value;
    });
    
    rows.push(rowObj);
  }

  return rows;
}

/**
 * Parses a single CSV line into an array of cell values, respect quotes.
 */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      // Check if it's an escaped double quote ("")
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // Skip the next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}
