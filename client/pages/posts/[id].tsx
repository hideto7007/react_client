import { useRouter } from 'next/router';
import React from 'react';
import { Breadcrumbs } from '@/common/component';

const Post: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <div>
            <Breadcrumbs />  {/* Include Breadcrumbs at the top */}
            <h1> Post: {id}</h1>
        </div>
    );
}

export default Post;