import React from 'react'
import { render, screen } from '@testing-library/react'

import {
  getIncomeDataFetchData,
  create,
  EnhancedTableHead,
  EnhancedTableToolbar,
  EditDialog,
} from '../../../src/common/component'
import { LabelConst } from '../../../src/constants/const'

describe('component.tsx', () => {
  it('fetches and processes income data correctly', async () => {
    console.log('Test started')
    const startDate: string = '2024-01-01'
    const endDate: string = '2024-12-31'
    const userId: number = 1

    const data = await getIncomeDataFetchData(startDate, endDate, userId)

    expect(data).toBeDefined()
    if (data) {
      expect(data.length).toBeGreaterThan(0)
      expect(data[0]).toHaveProperty('payment_date')
    }
  })

  it('calls create function with correct data', async () => {
    const data = {
      id: 1,
      income_forecast_id: '12345',
      payment_date: '2024-01-01',
      age: 30,
      industry: 'IT',
      total_amount: 100000,
      deduction_amount: 20000,
      take_home_amount: 80000,
      update_user: 'user123',
      classification: 'Salary',
      user_id: 1,
    }

    const consoleSpy = jest.spyOn(console, 'log')
    await create(data)

    expect(consoleSpy).toHaveBeenCalledWith('create', data)
  })
  it('renders table head with correct columns', () => {
    const props = {
      onSelectAllClick: jest.fn(),
      order: 'asc' as 'asc' | 'desc',
      orderBy: 'age',
      numSelected: 0,
      rowCount: 5,
      onRequestSort: jest.fn(),
    }

    render(<EnhancedTableHead {...props} />)

    const columnHeaders = screen.getAllByRole('columnheader')
    expect(columnHeaders.length).toBe(7) // カラム数に応じて調整
  })

  it('renders table toolbar with correct text when items are selected', () => {
    const props = {
      numSelected: 2,
      selected: [1, 2],
      data: [],
      onDelete: jest.fn(),
      checkboxLabel: 'Select All',
      checked: false,
      onCheckBox: jest.fn(),
    }

    render(<EnhancedTableToolbar {...props} />)

    expect(screen.getByText('2 selected')).toBeInTheDocument()
  })

  it('renders toolbar with delete icon when items are selected', () => {
    const props = {
      numSelected: 2,
      selected: [1, 2],
      data: [],
      onDelete: jest.fn(),
      checkboxLabel: 'Select All',
      checked: false,
      onCheckBox: jest.fn(),
    }

    render(<EnhancedTableToolbar {...props} />)

    expect(screen.getByLabelText('Delete')).toBeInTheDocument()
  })

  it('renders edit dialog with correct initial values', () => {
    const props = {
      editDialogLabel: 'Edit Data',
      dialogOpen: true,
      row: {
        id: 1,
        income_forecast_id: '12345',
        payment_date: '2024-01-01',
        age: 30,
        industry: 'IT',
        total_amount: 100000,
        deduction_amount: 20000,
        take_home_amount: 80000,
        update_user: 'user123',
        classification: 'Salary',
        user_id: 1,
      },
      handleClose: jest.fn(),
    }

    render(<EditDialog {...props} />)

    expect(screen.getByLabelText(LabelConst.PaymentDate)).toHaveValue(
      '2024-01-01'
    )
    expect(screen.getByLabelText(LabelConst.Age)).toHaveValue(30)
  })

  // it('calls handleFieldChange on input change', () => {
  //   const props = {
  //     editDialogLabel: 'Edit Data',
  //     dialogOpen: true,
  //     row: {
  //       id: 1,
  //       income_forecast_id: '12345',
  //       payment_date: '2024-01-01',
  //       age: 30,
  //       industry: 'IT',
  //       total_amount: 100000,
  //       deduction_amount: 20000,
  //       take_home_amount: 80000,
  //       update_user: 'user123',
  //       classification: 'Salary',
  //       user_id: 1
  //     },
  //     handleClose: jest.fn(),
  //   };

  //   render(<EditDialog {...props} />);

  //   const ageInput = screen.getByLabelText(LabelConst.Age);
  //   fireEvent.change(ageInput, { target: { value: '35' } });

  //   expect(ageInput).toHaveValue(35);
  // });
})
