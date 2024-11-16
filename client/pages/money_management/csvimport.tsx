import { FC, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  CsvFileSetting,
  FileSelectProps,
  CsvImportMainProps
} from '@/common/entity';
import { Box, Button, Typography } from '@mui/material';
import { BoxLayoutPadding, Breadcrumbs } from "@/common/component";


const ERROR_MESSAGE = 'ファイルを選択してください';

/**
 * CSVファイル選択オプション.
 */
const FileSelect: FC<FileSelectProps> = (props) => {
  const [csvName, setCsvName] = useState<string | null>(null);
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  // ファイル選択ボタンクリックでinput[type="file"]をクリック
  const handleFileSelectClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  // ファイル選択時の処理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      setCsvName(file.name);
      props.setValue('file', file);
      props.clearErrors('file'); // ファイル選択時にエラーをクリア
    } else {
      setCsvName(null);
      props.setValue('file', null);
      props.setError('file', { message: ERROR_MESSAGE }); // ファイルキャンセル時にエラーを設定
    }
  };

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" flexDirection="row" alignItems="center" gap={2}> 
        <Button
          variant="contained"
          onClick={handleFileSelectClick}>
          ファイル選択
        </Button>
        <Typography>{csvName}</Typography>
        <Controller
          name="file"
          control={props.control}
          rules={{ required: ERROR_MESSAGE }}
          render={({ field }) => (
            <input
              type="file"
              ref={inputFileRef}
              style={{ display: "none" }}
              onChange={(e) => {
                field.onChange(e.target.files);
                handleFileChange(e);
              }}
            />
          )}
        />
      </Box>
      {/* エラーメッセージをボタンの下に表示 */}
      {props.errors.file && <Typography style={{ color: "red" }}>{props.errors.file.message}</Typography>}
    </Box>
  );
};

/**
 * CsvImportMainコンポーネント.
 */
const CsvImportMain: FC<CsvImportMainProps> = (props) => {
  const { control, setError, setValue, register, handleSubmit, formState: { errors }, clearErrors } = useForm<CsvFileSetting>();

  // アップロードボタンクリック時の処理
  const onUploadClick = async (data: CsvFileSetting): Promise<void> => {
    const formData = new FormData();

    if (data.file) {
      formData.append('file', data.file);
      console.log(data.file);
      console.log(formData.get('file'));
    }
  };

  const onSubmit = handleSubmit(
    (data) => {
      console.log("submit", data);
    },
    (err) => {
      console.log("validation error", err);
    }
  );

  return (
    <BoxLayoutPadding>
        <Breadcrumbs
          marginBottom="12px"/> {/* パンくずを表示する */}
      <form
        noValidate
        onSubmit={onSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
      >
        <Box display="flex" flexDirection="column">
          <FileSelect
            control={control}
            errors={errors}
            setValue={setValue}
            register={register}
            setError={setError}
            clearErrors={clearErrors}
          />
        </Box>
        <Box display="flex">
          <Button
            onClick={handleSubmit(onUploadClick)}
            variant="contained"
          >
            アップロード
          </Button>
        </Box>
      </form>
    </BoxLayoutPadding>
  );
};

export default CsvImportMain;