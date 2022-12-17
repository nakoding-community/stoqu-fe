import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Autocomplete } from '@mui/material';
import { getUnits } from '../../client/unitsClient';

const ComboboxUnits = ({ onChange, defaultValue, label = 'Unit' }) => {
  const [units, setUnits] = useState([]);

  const options = useCallback(() => {
    return units?.map((unit) => {
      return {
        label: unit?.name,
        id: unit?.id,
      };
    });
  }, [units]);

  const defaultAutoCompleteValue = options()?.find((option) => option.id === defaultValue);

  const getUnitsHandler = async () => {
    const { data } = await getUnits();
    if (data) {
      setUnits(data);
    }
  };

  const onChangeHandler = (e, newValue) => {
    onChange(newValue);
  };

  useEffect(() => {
    getUnitsHandler();
  }, []);

  return units?.length > 0 ? (
    <Autocomplete
      disablePortal
      id="combo-box-units"
      options={options()}
      onChange={onChangeHandler}
      defaultValue={defaultAutoCompleteValue}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  ) : (
    <></>
  );
};

export default ComboboxUnits;
