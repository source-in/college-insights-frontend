export const handleState = (e, setState) => {
  const { name, value } = e.target;
  setState((prev) => ({
    ...prev,
    [name]: value,
  }));
};

export const handleFileState = (e, setState) => {
  const { name, files } = e.target;
  if (files) {
    setState((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  }
};

export const mergeArrayToString = (array) => {
  return array.join(",");
};
