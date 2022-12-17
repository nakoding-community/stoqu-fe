import React, { useEffect, useState, useImperativeHandle, forwardRef, useRef } from 'react';
import { useDebounce } from 'use-debounce';

import { TextField, Autocomplete, Box } from '@mui/material';

import { getBrands } from '../../client/brandsClient';
import { getVariants } from '../../client/variantsClient';
import { getTypes } from '../../client/typesClient';
import { getOrders } from '../../client/ordersClient';
import { getProducts, searchProductType } from '../../client/productsClient';
import { getLookupStocks } from '../../client/lookupStocksClient';
import { getRoles } from '../../client/rolesClient';
import { getUnits } from '../../client/unitsClient';
import { getUsers, createUser } from '../../client/usersClient';
import { loadMoreValidator } from '../../utils/helperUtils';
import { useDeepEffect } from '../../hooks/useDeepEffect';

import Scrollbar from '../Scrollbar';

const LIMIT = 10;

const InfiniteCombobox = React.memo(
  ({
    label,
    type,
    onChange,
    value,
    additionalQuery,
    useStaticOption,
    staticOptions,
    autoFocus,
    useCreateOnEnter = false,
    labelText,
    excludeIds = [],
    ...other
  }) => {
    const [inputValue, setInputValue] = useState('');
    const [inputValueDebounce] = useDebounce(inputValue, 300);

    const [options, setOptions] = useState(staticOptions || []);
    const [selectedId, setSelectedId] = useState('');
    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [isOpen, setIsOpen] = useState(false);
    const [onLoadMore, setOnLoadMore] = useState(false);

    const selectedValueLabel =
      (useStaticOption ? staticOptions : options)?.find((option) => option?.id === selectedId)?.label ||
      labelText ||
      '';

    let queryFn = () => {};
    switch (type) {
      case 'brands':
        queryFn = getBrands;
        break;
      case 'variants':
        queryFn = getVariants;
        break;
      case 'types':
        queryFn = getTypes;
        break;
      case 'orders':
        queryFn = getOrders;
        break;
      case 'products':
        queryFn = getProducts;
        break;
      case 'lookupStocks':
        queryFn = getLookupStocks;
        break;
      case 'roles':
        queryFn = getRoles;
        break;
      case 'units':
        queryFn = getUnits;
        break;
      case 'productTypes':
        queryFn = searchProductType;
        break;
      case 'users':
        queryFn = getUsers;
        break;
      default:
        break;
    }

    const getRestructuredOptions = (optionsData) => {
      if (optionsData?.length === 0) {
        return [];
      }

      switch (type) {
        case 'brands':
          return optionsData?.map((option) => {
            return {
              id: option?.id,
              label: option?.name,
            };
          });
        case 'types':
          return optionsData?.map((option) => {
            return {
              id: option?.id,
              label: `${option?.value} ${option?.unit?.unit}`,
            };
          });
        case 'variants':
          return optionsData?.map((option) => {
            return {
              id: option?.id,
              label: option?.name,
            };
          });
        case 'orders':
        case 'lookupStocks':
          return optionsData?.map((option) => {
            return {
              ...option,
              id: option?.id,
              label: option?.code,
            };
          });
        case 'roles':
          return optionsData?.map((option) => {
            return {
              ...option,
              id: option?.id,
              label: option?.role,
            };
          });
        case 'products':
          return optionsData?.map((option) => {
            return {
              ...option,
              id: option?.id,
              label: `${option?.brand?.brand} - ${option?.variant?.variant} ${option?.type?.value} ${option?.type?.unit?.unit}`,
            };
          });
        case 'units':
          return optionsData?.map((option) => {
            return {
              id: option?.id,
              label: option?.unit,
            };
          });
        case 'productTypes':
          return optionsData?.map((option) => {
            return {
              ...option,
              id: option?.id,
              label: option?.name,
            };
          });
        case 'users':
          return optionsData?.map((option) => {
            return {
              id: option?.id,
              label: option?.name,
            };
          });
        default:
          return '';
      }
    };

    const getFilteredOptions = (optionsData) => {
      const newOptions = [...optionsData];
      const filteredOptions = newOptions?.filter((opt) => {
        return !excludeIds?.includes(opt?.id);
      });
      return filteredOptions;
    };

    const appendAdditionalQuery = () => {
      return {
        ...additionalQuery,
      };
    };

    const getOptionsHandler = async () => {
      const query = {
        pageSize: LIMIT,
        page: currentPage,
        search: inputValue,
        ...(additionalQuery && appendAdditionalQuery()),
      };

      const { data, meta } = await queryFn(query);

      const restructuredData = getRestructuredOptions(data || []);
      const filteredOptions = getFilteredOptions(restructuredData);
      setOptions(filteredOptions || []);
      setTotalPage(meta?.info?.totalPage);
    };

    const loadMoreOptionsHandler = async (page) => {
      const query = {
        pageSize: LIMIT,
        page,
        search: inputValue,
        ...(additionalQuery && appendAdditionalQuery()),
      };

      const { data, meta } = await queryFn(query);
      if (data) {
        const restructuredData = getRestructuredOptions(data || []);
        const filteredOptions = getFilteredOptions(restructuredData);
        setOptions((prev) => [...prev, ...filteredOptions]);
        setTotalPage(meta?.info?.totalPage);
      }
    };

    const onChangeHandler = (e, newValue) => {
      onChange(newValue);
      setSelectedId(newValue?.id);
    };

    const onInputChangeHandler = (e) => {
      setInputValue(e?.target?.value);
      setCurrentPage(1);
    };

    const getRoleIdCustomers = async () => {
      const { data } = await getRoles();
      if (data) {
        return data?.find((user) => user?.role === 'customer')?.id;
      }
    };

    const onKeyDownHandler = async (e) => {
      if (useCreateOnEnter) {
        if (e.code === 'Enter') {
          if (type === 'users') {
            const roleId = await getRoleIdCustomers();
            const { data } = await createUser({ roleId, name: e.target.value });
            if (data) {
              getOptionsHandler();
            }
          }
        }
      }
    };

    const onScrollHandler = (e) => {
      const target = e.currentTarget;

      if (currentPage < totalPage && !onLoadMore) {
        loadMoreValidator(target, 30, async () => {
          setOnLoadMore(true);
          await loadMoreOptionsHandler(currentPage + 1);
          setCurrentPage(currentPage + 1);
          setOnLoadMore(false);
        });
      }
    };

    const onOpenHandler = () => {
      setIsOpen(true);
      setOptions(staticOptions || []);
      if (useStaticOption) {
        setOptions(staticOptions);
      } else {
        getOptionsHandler();
      }
    };

    const onCloseHandler = () => {
      setIsOpen(false);
      setCurrentPage(1);
      setOptions([]);
      setInputValue('');
    };

    useDeepEffect(() => {
      if (isOpen) {
        getOptionsHandler();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValueDebounce]);

    useEffect(() => {
      setSelectedId(value);
    }, [value]);

    useEffect(() => {
      // to hit next data if scroll is not visible
      if (isOpen) {
        setTimeout(async () => {
          const listBox = document.querySelector('#listBox .simplebar-content-wrapper');
          const isScrollVisible = listBox?.scrollHeight > listBox?.clientHeight;
          if (!isScrollVisible && currentPage < totalPage) {
            setOnLoadMore(true);
            await loadMoreOptionsHandler(currentPage + 1);
            setCurrentPage(currentPage + 1);
            setOnLoadMore(false);
          }
        }, 250);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    return (
      <Autocomplete
        id="combo-box-demo"
        // inputValue={inputValue}
        onOpen={onOpenHandler}
        onClose={onCloseHandler}
        noOptionsText={
          useCreateOnEnter ? 'No options found, press enter button to create a new user' : 'No options found'
        }
        onInputChange={onInputChangeHandler}
        options={options}
        onChange={onChangeHandler}
        renderInput={(params) => (
          <TextField {...params} label={label} autoFocus={autoFocus} onKeyDown={onKeyDownHandler} />
        )}
        renderOption={(props, option) => {
          return (
            <Box {...props} component="li" key={`${option?.id}-${option?.label}-${props?.['data-option-index']}`}>
              {option?.label}
            </Box>
          );
        }}
        value={selectedValueLabel}
        ListboxProps={{
          onScroll: onScrollHandler,
          id: 'listBox',
        }}
        ListboxComponent={ListBox}
        {...other}
      />
    );
  }
);

const ListBox = forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function ListBoxBase(props, ref) {
    const { children, ...rest } = props;

    const innerRef = useRef(null);

    useImperativeHandle(ref, () => innerRef.current);

    return (
      <Scrollbar
        {...rest}
        ref={innerRef}
        // eslint-disable-next-line jsx-a11y/aria-role
        role="list-box"
      >
        {children}
      </Scrollbar>
    );
  }
);

InfiniteCombobox.whyDidYouRender = true;

export default InfiniteCombobox;
