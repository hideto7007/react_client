import { useRouter } from 'next/router';
import React from 'react';

const Post: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;

    return <h1> Post: {id}</h1>;
}

export default Post;