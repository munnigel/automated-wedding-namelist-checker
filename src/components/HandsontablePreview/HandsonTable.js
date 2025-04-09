import React, { useEffect, useState } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import debounce from 'lodash.debounce';

import {
  calculateColWidths,
  calculateRowHeights,
  constrainZoom,
  applyZoomToFont,
  getColumnIndex,
  COLUMN_COLOR_CONFIG
} from '../../utils/HandsonTableUtils.js';

import Handsontable from 'handsontable';

import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';
import styles from './HandsonTable.module.scss';

registerAllModules();

Object.entries(COLUMN_COLOR_CONFIG).forEach(([key, { bg, text }]) => {
  Handsontable.renderers.registerRenderer(`highlight-${key}`, (hot, TD, ...rest) => {
    Handsontable.renderers.getRenderer('text')(hot, TD, ...rest);
    TD.style.background = bg;
    TD.style.color = text;
    TD.style.fontWeight = 'bold';
  });
});


const HandsonTable = ({
  data = [],
  mergeSettings = [],
  highlightCols = null,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  // Zoom via Ctrl + Scroll
  const handleWheelZoom = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      setZoomLevel((prev) => constrainZoom(prev, e.deltaY));
    }
  };

  // Apply zoom to font size
  useEffect(() => {
    const updateFontSize = debounce(() => applyZoomToFont(zoomLevel), 200);
    updateFontSize();
    return () => updateFontSize.cancel();
  }, [zoomLevel]);

  // Bind zoom handler
  useEffect(() => {
    document.addEventListener('wheel', handleWheelZoom, { passive: false });
    return () => document.removeEventListener('wheel', handleWheelZoom);
  }, []);

  const getHighlightCells = () => {
    if (!highlightCols) return [];
  
    const cells = [];
  
    for (const [key, colLetter] of Object.entries(highlightCols)) {
      const colIndex = getColumnIndex(colLetter);
      if (isNaN(colIndex)) continue;
  
      for (let row = 0; row < data.length; row++) {
        cells.push({
          row,
          col: colIndex,
          renderer: `highlight-${key}`, // match renderer name
        });
      }
    }
  
    return cells;
  };
  
  

  return (
    <div className={styles.handsontable}>
      {data.length > 0 ? (
        <HotTable
          data={data}
          colHeaders
          rowHeaders
          readOnly
          mergeCells={mergeSettings}
          colWidths={calculateColWidths(data, zoomLevel)}
          rowHeights={calculateRowHeights(data, zoomLevel)}
          height="60vh"
          width="100%"
          className={`${styles.handsontable} ht-theme-main`}
          cell={getHighlightCells()}
          licenseKey="non-commercial-and-evaluation"
        />
      ) : (
        <div style={{ padding: 20, color: 'red' }}>⚠️ No data to preview.</div>
      )}
    </div>
  );
};

export default HandsonTable;
