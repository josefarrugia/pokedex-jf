const convertGqlOrderBy = (array) => {
  return array.map((obj) => `${obj.key}: ${obj.order}`).join(", ");
};

export default convertGqlOrderBy;
