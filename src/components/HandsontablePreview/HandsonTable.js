import React, { useEffect, useState } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import debounce from 'lodash.debounce';

import {
  calculateColWidths,
  calculateRowHeights,
  constrainZoom,
  applyZoomToFont,
} from '../../utils/HandsonTableUtils.js';

import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';
import styles from './HandsonTable.module.scss';

registerAllModules();

const HandsonTable = ({
  data = [],
  mergeSettings = []
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
          height="80vh"
          width="100%"
          className={`${styles.handsontable} ht-theme-main`}
          licenseKey="non-commercial-and-evaluation"
        />
      ) : (
        <div style={{ padding: 20, color: 'red' }}>⚠️ No data to preview.</div>
      )}
    </div>
  );
};

export default HandsonTable;
