import { FormEvent, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../axios";

interface FormAnswer {
    pollId?: number | undefined;
    answerId: number;
}

interface Answer {
    id: string;
    answer: string;
}

interface Survey {
    id: number;
    title: string;
    slug?: string | undefined;
    description: string;
    question: string;
    end_date: string;
    answer: Answer[];
}

export default function SurveyPublicView() {
    const [myAnswer, setMyAnswer] = useState<FormAnswer>();
    const [surveyFinished, setSurveyFinished] = useState<boolean>(false);
    const [survey, setSurvey] = useState<Survey>({
        id: 0,
        title: "",
        end_date: "",
        description: "",
        question: "",
        answer: [],
    });
    const [loading, setLoading] = useState<boolean>(false);
    const { slug } = useParams<{ slug: string }>();

    useEffect(() => {
        setLoading(true);
        axiosClient
            .get(`polls/${slug}`)
            .then(({ data }) => {
                console.log("data: ", data);
                setLoading(false);
                setSurvey(data.data);
                setMyAnswer({
                    pollId: data.data.id,
                    answerId: 0
                })
            })
            .catch((error) => {
                console.log("error: ", error);
                setLoading(false);
            });
    }, [slug]);

    function answerChanged(answer: number) {
        console.log(answer);
        setMyAnswer({ ...myAnswer, answerId: answer });
    }

    function onSubmit(ev: FormEvent) {
        ev.preventDefault();

        console.log(myAnswer);
        axiosClient
            .post(`/poll/answer`, {
                pollId: myAnswer!["pollId"],
                answerId: myAnswer!["answerId"],
            })
            .then(() => {
                setSurveyFinished(true);
            });
    }

    return (
        <div>
            {loading && <div className="flex justify-center">Loading..</div>}
            {!loading && (
                <form
                    onSubmit={(ev) => onSubmit(ev)}
                    className="container mx-auto p-4"
                >
                    <div className="grid grid-cols-6">
                        <div className="col-span-5">
                            <h1 className="text-3xl mb-3">{survey.title}</h1>
                            <p className="text-gray-500 text-sm mb-3">
                                Expire Date: {survey.end_date}
                            </p>
                            <p className="text-gray-500 text-sm mb-3">
                                {survey.description}
                            </p>
                        </div>
                    </div>

                    {surveyFinished && (
                        <div className="py-8 px-6 bg-emerald-500 text-white w-[600px] mx-auto">
                            Thank you for participating in the survey
                        </div>
                    )}
                    {!surveyFinished && (
                        <>
                            <div>
                                {survey.answer.map((ans, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center"
                                    >
                                        <input
                                            id={`${index}`}
                                            name={"answer"}
                                            value={ans.id}
                                            onChange={() =>
                                                answerChanged(Number(ans.id))
                                            }
                                            type="radio"
                                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                        />
                                        <label
                                            htmlFor={`${index}`}
                                            className="ml-3 block text-sm font-medium text-gray-700"
                                        >
                                            {ans.answer}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Submit
                            </button>
                        </>
                    )}
                </form>
            )}
        </div>
    );
}
