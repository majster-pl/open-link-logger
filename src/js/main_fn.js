const getReadableSpeedString = (fileSizeInBytes) => {
  fileSizeInBytes = fileSizeInBytes / 125000;

  return [Math.max(fileSizeInBytes, 0).toFixed(2), "Mbps"];
};

const getReadableFileSizeString = (fileSizeInBytes) => {
  let i = -1;
  const byteUnits = [" kb", " Mb", " Gb", " Tb", "Pb", "Eb", "Zb", "Yb"];
  do {
    fileSizeInBytes = fileSizeInBytes / 1024;
    i++;
  } while (fileSizeInBytes > 1024);

  return [Math.max(fileSizeInBytes, 0).toFixed(2), byteUnits[i]];
};


const checkIfExists = (str) => {
  if (typeof str !== "undefined") {
    return str;
  } else {
    return "no data";
  }
};

export { getReadableSpeedString, getReadableFileSizeString, checkIfExists };
