import { LinkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import TButton from "../components/core/TButton";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios.js";
import { useNavigate, useParams } from "react-router-dom";
import QuestionEditor from "../components/QuestionEditor";
import { useEffect } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { v4 as uuidv4 } from "uuid";

interface Answer {
    id: string;
    answer: string;
}

interface Survey {
    title: string;
    slug?: string | undefined;
    description: string;
    question: string;
    end_date: string;
    answer: Answer[];
}

export default function SurveyView() {
    const { showToast } = useStateContext();
    const navigate = useNavigate();
    const { id } = useParams();

    const [survey, setSurvey] = useState<Survey>({
        title: "",
        slug: "",
        description: "",
        question: "",
        end_date: "",
        answer: [],
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        const payload = { ...survey };
        console.log(payload);

        let res = null;
        if (id) {
            res = axiosClient.put(`/poll/${id}`, payload);
        } else {
            res = axiosClient.post("/poll", payload);
        }

        res.then((res) => {
            console.log(res);
            navigate("/surveys");
            if (id) {
                showToast("The poll was updated");
            } else {
                showToast("The poll was created");
            }
        }).catch((err) => {
            if (err && err.response) {
                setError(err.response.data.message);
            }
            console.log(err, err.response);
        });
    };

    function onAnswerUpdate(answer: Answer[]) {
        setSurvey((survey) => ({
            ...survey,
            answer,
        }));
    }

    const addAnswer = () => {
        survey.answer.push({
            id: uuidv4(),
            answer: "",
        });
        setSurvey({ ...survey });
    };

    const answerChange = (answer: Answer) => {
        if (!answer) return;
        const newAnswers = survey.answer.map((ans) => {
            if (ans.id == answer.id) {
                return { ...answer };
            }
            return ans;
        });
        onAnswerUpdate(newAnswers);
    };

    const deleteAnswer = (answer: Answer) => {
        console.log('answer: ', answer);
        const newQuestions = survey.answer.filter((ans) => ans.id !== answer.id);

        onAnswerUpdate(newQuestions);
    };

    useEffect(() => {
        if (id) {
            setLoading(true);
            axiosClient.get(`/poll/${id}`).then(({ data }) => {
                console.log('data:', data);
                setSurvey(data.data);
                setLoading(false);
            }).catch((err) => {
                console.log(err);
            });
        }
    }, [id]);

    return (
        <PageComponent
            title={!id ? "Create new Poll" : "Update Poll"}
            buttons={
                id ? 
                <div className="flex gap-2">
                    <TButton
                        color="green"
                        href={`/survey/public/${survey.slug}`}
                    >
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Public Link
                    </TButton>
                </div>
                : <></>
            }
        >
            {loading && <div className="text-center text-lg">Loading...</div>}
            {!loading && (
                <form action="#" method="POST" onSubmit={onSubmit}>
                    <div className="shadow sm:overflow-hidden sm:rounded-md">
                        <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                            {error && (
                                <div className="bg-red-500 text-white py-3 px-3">
                                    {error}
                                </div>
                            )}

                            {/*Title*/}
                            <div className="col-span-6 sm:col-span-3">
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Poll Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={survey.title}
                                    onChange={(ev) =>
                                        setSurvey({
                                            ...survey,
                                            title: ev.target.value,
                                        })
                                    }
                                    placeholder="Poll Title"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            {/*Title*/}

                            {/*Description*/}
                            <div className="col-span-6 sm:col-span-3">
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Poll Description
                                </label>
                                <textarea
                                    name="description"
                                    id="description"
                                    value={survey.description || ""}
                                    onChange={(ev) =>
                                        setSurvey({
                                            ...survey,
                                            description: ev.target.value,
                                        })
                                    }
                                    placeholder="Poll Description"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                ></textarea>
                            </div>
                            {/*Description*/}

                            {/*Question*/}
                            <div className="col-span-6 sm:col-span-3">
                                <label
                                    htmlFor="question"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Poll Question
                                </label>
                                <input
                                    type="text"
                                    name="question"
                                    id="question"
                                    value={survey.question}
                                    onChange={(ev) =>
                                        setSurvey({
                                            ...survey,
                                            question: ev.target.value,
                                        })
                                    }
                                    placeholder="Poll question"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            {/*Question*/}

                            {/*End Date*/}
                            <div className="col-span-6 sm:col-span-3">
                                <label
                                    htmlFor="end_date"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    name="end_date"
                                    id="end_date"
                                    value={survey.end_date}
                                    onChange={(ev) =>
                                        setSurvey({
                                            ...survey,
                                            end_date: ev.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            {/*End Date*/}

                            <button type="button" onClick={addAnswer}>
                                Add answer
                            </button>
                            {survey.answer.length ? (
                                survey.answer.map((ans) => (
                                    <QuestionEditor
                                        key={ans.id}
                                        answer={ans}
                                        answerChange={answerChange}
                                        deleteAnswer={deleteAnswer}
                                    />
                                ))
                            ) : (
                                <div className="text-gray-400 text-center py-4">
                                    You don't have any answers created
                                </div>
                            )}
                        </div>
                        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                            <TButton>Save</TButton>
                        </div>
                    </div>
                </form>
            )}
        </PageComponent>
    );
}
