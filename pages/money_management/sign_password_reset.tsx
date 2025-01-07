import React from "react";
import {
  TWTextForm,
  TWPasswordTextForm,
  TWToast,
  TWBackDrop,
  TWContainer,
  TWCssBaseline,
  TWBox,
  TWAvatar,
  TWTypography,
  TWButton,
  TWCommonCircularProgress,
  ExternalSignButton,
  TWExternalText,
} from "@/src/common/component";

/**
 * パスワード再設定コンポーネント
 *
 * @returns {JSX.Element} - ダイアログのJSX要素を返す
 */
const SignPasswordReset: React.FC = (): JSX.Element => {
    return (
        <div>
        <TWTypography component="h1" variant="h5">
          パスワード再設定
        </TWTypography>
      </div>
    );
};

export default SignPasswordReset;