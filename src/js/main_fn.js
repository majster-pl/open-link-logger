const getReadableSpeedString = (fileSizeInBytes) => {
  let i = -1;
  const byteUnits = [
    " kbps",
    " Mbps",
    " Gbps",
    " Tbps",
    "Pbps",
    "Ebps",
    "Zbps",
    "Ybps",
  ];
  do {
    fileSizeInBytes = fileSizeInBytes / 1024;
    i++;
  } while (fileSizeInBytes > 1024);

  return [Math.max(fileSizeInBytes, 0).toFixed(2), byteUnits[i]];
};

const getReadableFileSizeString = (fileSizeInBytes) => {
  let i = -1;
  const byteUnits = [
    " kbps",
    " Mbps",
    " Gbps",
    " Tbps",
    "Pbps",
    "Ebps",
    "Zbps",
    "Ybps",
  ];
  do {
    fileSizeInBytes = fileSizeInBytes / 1024;
    i++;
  } while (fileSizeInBytes > 1024);

  return [Math.max(fileSizeInBytes, 0.1).toFixed(1), byteUnits[i]];
};

export { getReadableSpeedString, getReadableFileSizeString };
