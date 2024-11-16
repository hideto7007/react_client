import { Align, KeyConst, LabelConst } from "./const";
import { ColumnNotEdit } from "./entity";

export const columns: readonly ColumnNotEdit[] = [
    {
        id: KeyConst.PaymentDate,
        label: LabelConst.PaymentDate,
        minWidth: 100,
        required: true,
        disablePadding: true 
    },
    { 
        id: KeyConst.Age,
        label: LabelConst.Age,
        minWidth: 100,
        required: true,
        disablePadding: false
    },
    { 
        id: KeyConst.Industry,
        label: LabelConst.Industry,
        minWidth: 100,
        required: true,
        disablePadding: false
    },
    {
      id: KeyConst.TotalAmount,
      label: LabelConst.TotalAmount,
      minWidth: 170,
      align: Align.Right,
      required: true,
      disablePadding: false
    },
    {
      id: KeyConst.DeductionAmount,
      label: LabelConst.DeductionAmount,
      minWidth: 170,
      align: Align.Right,
      required: true,
      disablePadding: false
    },
    {
      id: KeyConst.TakeHomeAmount,
      label: LabelConst.TakeHomeAmount,
      minWidth: 170,
      align: Align.Right,
      required: true,
      disablePadding: false
    }
  ];
