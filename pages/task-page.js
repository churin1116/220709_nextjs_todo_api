import { useEffect } from 'react';
import Link from "next/link";
import Layout from "../components/Layout";
import Task from "../components/Task";
import { getAllTaskData } from '../lib/tasks'
import useSWR from 'swr';

import StateContextProvider from '../context/StateContext';
import TaskForm from '../components/TaskForm';

const fetcher = (url) => fetch(url).then((res) => res.json());
const apiUrl = `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-task/`

export default function TaskPage({ staticfilterdTasks }) {

    const { data: tasks, mutate } = useSWR(apiUrl, fetcher, { // useSWR( フェッチ先のurl, jsonでデータ取得する関数, ↓でビルド時に生成したprops )
        fallbackData: staticfilterdTasks, // とりあえず最初に写す、同時に最新データもfetchして↓でsortし、読み込み次第非同期処理で内容を更新
    });
    const filteredTasks = tasks?.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    useEffect(() => {
        mutate(); // useSWRのところの情報に最新のものを入れる
    }, []); // 敢えて[]（トリガー）は空。↑のあとに1回だけ行う

    return (
        <StateContextProvider>
            <Layout title="task-page">
                <TaskForm taskCreated={mutate} />
                <ul>
                    {filteredTasks && filteredTasks.map((task) => 
                        <Task key={task.id} task={task} taskDeleted={mutate} />
                    )}
                </ul>
                <Link href='/main-page'>
                    <div className="flex mt-12 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                        <span>Back to main page</span>
                    </div>
                    
                </Link>
            </Layout>
        </StateContextProvider>
    )
}

export async function getStaticProps() {
    const staticfilterdTasks = await getAllTaskData();
    return {
        props: { staticfilterdTasks },
        revalidate: 3,
    };
}