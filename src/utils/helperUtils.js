import parseInt from 'lodash/parseInt';

export const loadMoreValidator = (target, threshold, callback) => {
  threshold = parseInt(threshold);
  if (target.scrollTop + target.clientHeight >= target.scrollHeight - threshold) {
    callback();
  }
};

export const convertToRupiah = (number) => {
  if (number) {
    let rupiah = '';
    const numberrev = number.toString().split('').reverse().join('');

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < numberrev.length; i++) if (i % 3 === 0) rupiah += `${numberrev.substr(i, 3)}.`;

    return (
      // eslint-disable-next-line prefer-template
      'Rp. ' +
      rupiah

        .split('', rupiah.length - 1)

        .reverse()

        .join('')
    );
  }

  return number;
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING':
      return 'warning';
    case 'PROGRESS':
      return 'info';
    case 'COMPLETE':
    case 'COMPLETED':
      return 'success';
    case 'CANCELED':
      return 'error';
    case 'NEED_CONVERT':
      return 'warning';
    default:
      break;
  }
};

export const appendSortQuery = (order, orderBy) => {
  return {
    sortBy: order === 'asc' ? orderBy : `-${orderBy}`,
  };
};
