export const splitData = (data: Array<any>) => {
  const columns = [[], []];

  data.forEach((item, index) => {
    columns[index % 2].push(item as never);
  });

  return columns;
};
