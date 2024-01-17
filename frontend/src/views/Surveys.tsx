import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import axiosClient from "../axios";
import TButton from "../components/core/TButton";
import PageComponent from "../components/PageComponent.tsx";
import PaginationLinks from "../components/PaginationLinks";
import SurveyListItem from "../components/SurveyListItem.tsx";
import { useStateContext } from "../contexts/ContextProvider.tsx";

interface Survey {
    id: string;
    image_url: string;
    title: string;
    description: string;
    slug: string;
}

interface Link {
    url: string;
    active: boolean;
    label: string;
}

interface Meta {
    links: Link[];
    from: number;
    to: number;
    total: number;
    per_page: number;
}

export default function Surveys() {
    const { showToast } = useStateContext();
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [meta, setMeta] = useState<Meta>({
        links: [],
        from: 0,
        to: 0,
        total: 0,
        per_page: 0,
    });
    const [loading, setLoading] = useState<boolean>(false);

    const onDeleteClick = (id: string) => {
        if (window.confirm("Are you sure you want to delete this survey?")) {
            axiosClient.delete(`/poll/${id}`).then(() => {
                getSurveys();
                showToast("The survey was deleted");
            });
        }
    };

    const onPageClick = (link: { url: string }) => {
        getSurveys(link.url);
    };

    const getSurveys = (url?: string) => {
        url = url || "/poll";
        setLoading(true);
        axiosClient.get(url).then(({ data }) => {
            console.log('data: ', data);
            setSurveys(data.data);
            setMeta(data.meta);
            setLoading(false);
        })
        .catch((error) => {
            console.log('error: ', error);
            console.error(error);
        });
    };

    useEffect(() => {
        getSurveys();
    }, []);

    return (
        <PageComponent
            title="Polls"
            buttons={
                <TButton color="green" to="/surveys/create">
                    <PlusCircleIcon className="h-6 w-6 mr-2" />
                    Create new
                </TButton>
            }
        >
            {loading && <div className="text-center text-lg">Loading...</div>}
            {!loading && (
                <div>
                    {surveys.length === 0 && (
                        <div className="py-8 text-center text-gray-700">
                            You don't have surveys created
                        </div>
                    )}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                        {surveys.map((survey) => (
                            <SurveyListItem
                                survey={survey}
                                key={survey.id}
                                onDeleteClick={onDeleteClick}
                            />
                        ))}
                    </div>
                    {surveys.length > 0 && (
                        <PaginationLinks
                            meta={meta}
                            onPageClick={onPageClick}
                        />
                    )}
                </div>
            )}
        </PageComponent>
    );
}
