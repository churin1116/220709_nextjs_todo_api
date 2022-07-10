import Link from "next/link";
import Layout from "../../components/Layout";
import { useRouter } from 'next/router';
import { getAllTaskIds, getTaskData } from "../../lib/tasks";

import { useEffect } from 'react';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Task({ staticTask, id }) {
    const router = useRouter();

    const { data: task, mutate } = useSWR( // useSWR( フェッチ先のurl, jsonでデータ取得する関数, ↓でビルド時に生成したprops )
        `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/detail-task/${id}`,
        fetcher,
        { 
            fallbackData: staticTask, // とりあえず最初に写す、同時に最新データもfetchして↓でsortし、読み込み次第非同期処理で内容を更新
        }
    );
    
    useEffect(() => {
        mutate(); // useSWRのところの情報に最新のものを入れる
    }, []); // 敢えて[]（トリガー）は空。↑のあとに1回だけ行う

    if (router.isFallback || !task) {
        return <div>Loading...</div>;
    }
    return (
        <Layout title={task.title}>
            <p className="m-4">{'ID : '}{task.id}</p>
            <p className="mb-4 text-xl font-bold">{ task.title }</p>
            <p className="mb-12">{ task.created }</p>
            <p className="px-10">{task.content}</p>
            <Link href='/task-page'>
                <div className="flex cursor-pointer mt-12">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                    <span>Back to task-page</span>
                </div>
            </Link>
        </Layout>
    );
}

export async function getStaticPaths() {
    const paths = await getAllTaskIds();
    return {
        paths,
        fallback: true, // trueにすると、DBcreate/delete時に自動リビルド
    };
}

export async function getStaticProps({params}) {
    const staticTask = await getTaskData(params.id);
    return {
        props: {
            id: staticTask.id,
            staticTask,
        },
        revalidate: 3, // 設定すると、DB内容updateでも自動リビルド(ISR)
    };
}