import React, { useEffect, useState } from 'react';
import { Backdrop, Box } from '@mui/material';
import { useRouter } from 'next/router';
import { Auth } from '@/common/const';
import { Toast } from '@/common/component';


const AuthCheck: React.FC = () => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [overlayOpen, setOverlayOpen] = useState(false);

    useEffect(() => {
        const auth = localStorage.getItem(Auth.AuthToken)
        if (!auth) {
            setOpen(true);
            setOverlayOpen(true);
        }
    }, [router])

    // トーストを閉じる処理
    const handleClose = () => {
        setOpen(false);
        setOverlayOpen(false);
        router.push('/money_management/signin');
    };

    return (
      <>
        <Box sx={{ width: 500 }}>
          {/* 背景をグレーにするオーバーレイ */}
            <Backdrop
              sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // グレーの背景
              }}
              open={overlayOpen}
            />
            <Toast
              open={open}
              handleClose={handleClose}
              vertical={'top'}
              horizontal={'center'}
              severity={'error'}
              message={'認証の有効期限が切れました。<br />再度サインインをお願いします。'}              
            />
        </Box>
      </>
    );
  };
  
  export default AuthCheck;
