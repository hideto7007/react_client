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