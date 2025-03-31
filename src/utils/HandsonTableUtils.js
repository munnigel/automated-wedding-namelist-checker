import * as XLSX from 'xlsx';
import { message } from 'antd';

export const parseSheetToJSON = (sheet) => {
  const rawData = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    blankrows: true,
    defval: '',
    raw: true,
  });

  const maxCols = Math.max(...rawData.map(row => row.length));

  return rawData.map(row =>
    Array.from({ length: maxCols }, (_, colIndex) =>
      row[colIndex] !== undefined ? String(row[colIndex]) : ''
    )
  );
};

export const extractMergeConfig = (sheet, data) => {
  const merges = sheet['!merges'] || [];
  const maxRows = data.length;
  const maxCols = data[0]?.length || 0;

  return merges
    .filter(m =>
      m.s.r < maxRows &&
      m.s.c < maxCols &&
      m.e.r < maxRows &&
      m.e.c < maxCols
    )
    .map(m => ({
      row: m.s.r,
      col: m.s.c,
      rowspan: m.e.r - m.s.r + 1,
      colspan: m.e.c - m.s.c + 1,
    }));
};

export const getColumnIndex = (letter) => {
  return letter.toUpperCase().charCodeAt(0) - 65;
};

export const calculateColWidths = (data, zoom, base = 100) => {
  return data[0]?.length
    ? new Array(data[0].length).fill(base * zoom)
    : [];
};

export const calculateRowHeights = (data, zoom, base = 23) => {
  return new Array(data.length).fill(base * zoom);
};

export const constrainZoom = (current, deltaY) => {
  let newZoom = current + (deltaY > 0 ? -0.05 : 0.05);
  return Math.min(Math.max(newZoom, 0.7), 1.75);
};

export const applyZoomToFont = (zoomLevel) => {
  document.documentElement.style.setProperty('--table-font-size', `${10 * zoomLevel}px`);
};

export const generateGuestPayload = (data, nameColLetter, mobileColLetter) => {
    const nameIndex = getColumnIndex(nameColLetter);
    const mobileIndex = getColumnIndex(mobileColLetter);
  
    const cleaned = data
      .slice(1) // skip header row
      .map((row, i) => ({
        name: row[nameIndex]?.trim() || '',
        mobile: row[mobileIndex]?.trim() || '',
      }))
      .filter(g => g.name && g.mobile); // remove empty rows
  
    // Sort alphabetically by name
    const sorted = cleaned.sort((a, b) => a.name.localeCompare(b.name));
  
    // Add running ID
    return sorted.map((guest, i) => ({
      id: i + 1,
      name: guest.name,
      mobile: guest.mobile,
    }));
  };