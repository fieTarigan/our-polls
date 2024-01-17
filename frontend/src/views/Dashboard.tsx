import PageComponent from "../components/PageComponent";
import DashboardCard from "../components/DashboardCard.jsx";
import { useEffect, useState } from "react";
import axiosClient from "../axios.js";
import TButton from "../components/core/TButton.jsx";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";

interface DashboardData {
    totalPolls: number;
    latestPoll: {
        title: string;
        slug: string;
        created_at: string;
        end_date: string;
        questions: number;
        id: string;
    };
}

export default function Dashboard() {
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<DashboardData>();

    useEffect(() => {
        setLoading(true);
        axiosClient
            .get(`/dashboard`)
            .then((res) => {
                setLoading(false);
                setData(res.data);
                return res;
            })
            .catch((error) => {
                setLoading(false);
                return error;
            });
    }, []);

    return (
        <PageComponent title="Dashboard">
            {loading && <div className="flex justify-center">Loading...</div>}
            {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-gray-700">
                    <DashboardCard
                        title="Total Polls"
                        className="order-1 lg:order-2"
                        style={{ animationDelay: "0.1s" }}
                    >
                        <div className="text-8xl pb-4 font-semibold flex-1 flex items-center justify-center">
                            {data!.totalPolls}
                        </div>
                    </DashboardCard>
                    <DashboardCard
                        title="Latest Poll"
                        className="order-3 lg:order-1 row-span-2"
                        style={{ animationDelay: "0.2s" }}
                    >
                        {data!.latestPoll && (
                            <div>
                                <h3 className="font-bold text-xl mb-3">
                                    {data!.latestPoll.title}
                                </h3>
                                <div className="flex justify-between text-sm mb-1">
                                    <div>Create Date:</div>
                                    <div>{data!.latestPoll.created_at}</div>
                                </div>
                                <div className="flex justify-between text-sm mb-1">
                                    <div>End Date:</div>
                                    <div>{data!.latestPoll.end_date}</div>
                                </div>
                                <div className="flex justify-between text-sm mb-1">
                                    <div>Questions:</div>
                                    <div>{data!.latestPoll.questions}</div>
                                </div>
                                <div className="flex justify-between">
                                    <TButton
                                        to={`/surveys/${data!.latestPoll.id}`}
                                        link
                                    >
                                        <PencilIcon className="w-5 h-5 mr-2" />
                                        Edit Poll
                                    </TButton>

                                    <TButton link>
                                        <EyeIcon className="w-5 h-5 mr-2" />
                                        View Answers
                                    </TButton>
                                </div>
                            </div>
                        )}
                        {!data!.latestPoll && (
                            <div className="text-gray-600 text-center py-16">
                                Your don't have polls yet
                            </div>
                        )}
                    </DashboardCard>
                </div>
            )}
        </PageComponent>
    );
}
