import React from 'react';
import { TableRow, TableCell, Skeleton } from '@mui/material';

const TableRowSkeleton = ({ countCell = 0 }) => {
  const cellSkeleton = [];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < countCell; i++) {
    cellSkeleton.push('skeleton');
  }

  return (
    <TableRow>
      {cellSkeleton.map((_, index) => (
        <TableCell key={index}>
          <Skeleton />
        </TableCell>
      ))}
    </TableRow>
  );
};

export default TableRowSkeleton;
