/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Formats a Chilean RUT to the standard format (XX.XXX.XXX-X).
 * If the input doesn't look like a RUT, it returns the cleaned input.
 */
export function formatRut(rut: string): string {
  if (!rut) return '';
  // Clean special characters but keep alphanumeric
  const clean = rut.replace(/[^0-9kK]/g, '').toUpperCase();
  if (clean.length < 2) return clean;
  
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  
  let formattedBody = '';
  let count = 0;
  for (let i = body.length - 1; i >= 0; i--) {
    formattedBody = body[i] + formattedBody;
    count++;
    if (count === 3 && i !== 0) {
      formattedBody = '.' + formattedBody;
      count = 0;
    }
  }
  return `${formattedBody}-${dv}`;
}

/**
 * Validates a Chilean RUT using the Modulus 11 algorithm.
 */
export function validateRut(rut: string): boolean {
  if (!rut) return false;
  const clean = rut.replace(/[^0-9kK]/g, '').toUpperCase();
  if (clean.length < 2) return false;
  
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  
  let sum = 0;
  let multiplier = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const expectedDvNum = 11 - (sum % 11);
  let expectedDv = '';
  if (expectedDvNum === 11) {
    expectedDv = '0';
  } else if (expectedDvNum === 10) {
    expectedDv = 'K';
  } else {
    expectedDv = expectedDvNum.toString();
  }
  
  return dv === expectedDv;
}

/**
 * Formats document numbers depending on their types (RUT, Pasaporte, DNI).
 */
export function formatDocument(docType: string, docNumber: string): string {
  if (!docNumber) return '';
  const trimmed = docNumber.trim();
  
  // If the document type indicates RUT, use RUT formatter
  if (docType === 'RUT' || docType.toUpperCase() === 'RUT') {
    return formatRut(trimmed);
  }
  
  if (docType === 'Pasaporte' || docType.toUpperCase() === 'PASAPORTE') {
    return trimmed.toUpperCase();
  }
  
  if (docType === 'DNI' || docType.toUpperCase() === 'DNI') {
    // Mercosur DNI can be formatted with dots for 7 or 8 digits (e.g. Argentina DNI)
    const clean = trimmed.replace(/[^0-9]/g, '');
    if (clean.length >= 7 && clean.length <= 8) {
      let formattedBody = '';
      let count = 0;
      for (let i = clean.length - 1; i >= 0; i--) {
        formattedBody = clean[i] + formattedBody;
        count++;
        if (count === 3 && i !== 0) {
          formattedBody = '.' + formattedBody;
          count = 0;
        }
      }
      return formattedBody;
    }
    return trimmed.toUpperCase();
  }
  
  return trimmed;
}
