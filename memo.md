### 次の学習内容

- バリデーションを実装

### Reactコンポーネントについて

- レンダリングとは

  - コンポーネントが描画されること

- useCallbackの使い方

  - レンダリングされても関数の値が変わらないようにする際に使用する

- useMemoの使い方

  - 計算結果を再利用したい場面で使用する

- React.memoの使い方

  - 再レンダリングが不要なコンポーネントがある際に使用

1. ESLint確認:

- npm run lint

2. Prettier確認:

- npx prettier --write .

```typescript
// {/* <nav>
//   <ul>
//     <li><Link href={`${MONEY_MANAGEMENT}/signin`}>サインイン</Link></li>
//     <li><Link href={`${MONEY_MANAGEMENT}/signup`}>サインアップ</Link></li>
//     <li><Link href={`${MONEY_MANAGEMENT}/about`}>About</Link></li>
//     <li><Link href={`${MONEY_MANAGEMENT}/Sample`}>Sample</Link></li>
//     <li><Link href={`${MONEY_MANAGEMENT}/posts/1`}>Post 1</Link></li>
//     <li><Link href={`${MONEY_MANAGEMENT}/table`}>Table</Link></li>
//     <li><Link href={`${MONEY_MANAGEMENT}/table1`}>Table1</Link></li>
//   </nav>
//   </ul> */}
```

// const res: ErrorResponse = {
// status: 500,
// error_data: {
// recode_rows: 2,
// result: [
// {
// field: "user_name",
// message: "メールアドレスが存在しません",
// },
// {
// field: "user_password",
// message: "パスワードが一致しません",
// },
// ],
// }
// }

// const res: ErrorResponse = {
// status: 401,
// error_data: {
// error_msg: "サーバーエラーが発生しました",
// }
// }

          if (res.status === 404) {
            errorMsgInfo = Common.ErrorMsgInfo(
              Message.NotFound,
              Message.NotFoundText
            );
            setErrorMsg(errorMsgInfo);
            setOpen(true);
            setOverlayOpen(true);
            return;
          }
