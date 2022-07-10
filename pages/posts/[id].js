import Link from "next/link";
import Layout from "../../components/Layout";
import { useRouter } from 'next/router';
import { getAllPostIds, getPostData } from "../../lib/posts";

export default function Post({ post }) {
    const router = useRouter();

    if (router.isFallback || !post) {
        return <div>Loading...</div>;
    }
    return (
        <Layout title={post.title}>
            <p className="m-4">{'ID : '}{post.id}</p>
            <p className="mb-4 text-xl font-bold">{ post.title }</p>
            <p className="mb-12">{ post.created }</p>
            <p className="px-10">{post.content}</p>
            <Link href='/blog-page'>
                <div className="flex cursor-pointer mt-12">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                    <span>Back to blog-page</span>
                </div>
            </Link>
        </Layout>
    );
}

export async function getStaticPaths() {
    const paths = await getAllPostIds();
    return {
        paths,
        fallback: true, // trueにすると、DBcreate/delete時に自動リビルド
    };
}

export async function getStaticProps({params}) {
    const post = await getPostData(params.id);
    return {
        props: {
            post,
        },
        revalidate: 3, // 設定すると、DB内容updateでも自動リビルド(ISR)
    };
}