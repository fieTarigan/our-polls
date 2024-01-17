import { TrashIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { useState } from "react";

interface Answer {
    id: string;
    answer: string;
}

interface QuestionEditorProps {
    answer: Answer;
    deleteAnswer: (answer: Answer) => void;
    answerChange: (answer: Answer) => void;
}

export default function QuestionEditor({
    answer,
    deleteAnswer,
    answerChange,
}: QuestionEditorProps) {
    const [model, setModel] = useState({ ...answer });

    useEffect(() => {
        console.log(model);
        answerChange(model);
    }, [model]);

    return (
        <>
            <div>
                <div className="flex justify-between mb-3">
                    <div className="flex items-center">
                        <button
                            type="button"
                            className="flex items-center text-xs py-1 px-3 rounded-sm border border-transparent text-red-500 hover:border-red-600 font-semibold"
                            onClick={() => deleteAnswer(answer)}
                        >
                            <TrashIcon className="w-4" />
                            Delete
                        </button>
                    </div>
                </div>
                <div className="flex gap-3 justify-between mb-3">
                    {/* Question Text */}
                    <div className="flex-1">
                        <label
                            htmlFor="question"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Answer
                        </label>
                        <input
                            type="text"
                            name="question"
                            id="question"
                            value={model.answer}
                            onChange={(ev) =>
                                setModel({
                                    ...model,
                                    answer: ev.target.value,
                                })
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    {/* Question Text */}

                </div>
            </div>
            <hr />
        </>
    );
}
