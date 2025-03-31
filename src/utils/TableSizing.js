export const calculateColWidths = (data, zoom) => {
    if (!data || !data[0]) return [];
  
    const baseWidth = 100;
    return data[0].map(() => baseWidth * zoom);
  };
  
  export const calculateRowHeights = (data, zoom) => {
    if (!data) return [];
  
    const baseHeight = 24;
    return data.map(() => baseHeight * zoom);
  };
  