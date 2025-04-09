import * as XLSX from 'xlsx';
import { message } from 'antd';

export const COLUMN_COLOR_CONFIG = {
  nameCol: {
    bg: '#d7f1e1',
    text: 'green',
  },
  mobileCol: {
    bg: '#d0ebff',
    text: '#1890ff',
  },
  tableNumberCol: {
    bg: '#fff1b8',
    text: '#faad14',
  },
};


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

export const generateGuestPayload = (data, nameCol, mobileCol, tableCol) => {
  const nameIndex = getColumnIndex(nameCol);
  const mobileIndex = getColumnIndex(mobileCol);
  const tableIndex = getColumnIndex(tableCol);

  // Step 1: Filter valid rows only
  const validRows = data.filter((row) => {
    const mobile = row[mobileIndex]?.toString().trim();
    const name = row[nameIndex]?.toString().trim();

    // Must have a valid name and numeric mobile
    return name && mobile && !isNaN(mobile);
  });

  // Step 2: Assign IDs to only valid entries
  const guests = validRows.map((row, idx) => {
    const name = row[nameIndex].toString().trim();
    const mobile = row[mobileIndex].toString().trim();
    const tableNumber = row[tableIndex]?.toString().trim() || '';

    return {
      id: idx + 1,
      name,
      mobile,
      tableNumber,
      isPresent: false,
    };
  });

  return guests;
};
