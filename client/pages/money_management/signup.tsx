import { useRouter } from 'next/router';
import React from 'react';
import { Breadcrumbs } from '@/common/component';

const SinUp: React.FC = () => {
    const router = useRouter();
    const { sinup } = router.query;

    return (
        <div>
            <Breadcrumbs />  {/* Include Breadcrumbs at the top */}
            <h1>サインアップ</h1>
        </div>
    );
}

export default SinUp;