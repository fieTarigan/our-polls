<?php

namespace App\Http\Controllers;

use App\Http\Resources\PollResource;
use App\Models\Poll;
use App\Models\PollAnswer;
use App\Models\PollUserVote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;

class PollController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        return PollResource::collection(
            Poll::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->paginate(2)
        );
    }
    
    public function popular()
    {
        $polls = Poll::all();

        return $this->sendResponse(PollResource::collection($polls), 'Polls is retrieved');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'description' => 'nullable|string',
            'end_date' => 'nullable|date|after:today',
            'question' => 'required|string',
            'answer' => 'array'
        ]);

        if($validator->fails()) {
            return $this->sendError('Validation error: ', $validator->errors());
        }

        $input = $request->all();
        $user = $request->user();

        $poll = Poll::create([
            'user_id' => $user->id,
            'title' => $input['title'],
            'slug' => preg_replace('/[^A-Za-z0-9]+/', '-', strtolower($input['title'])),
            'description' => $input['description'],
            'end_date' => $input['end_date'],
            'question' => $input['question'],
        ]);

        foreach ($input['answer'] as $id => $answer) {
            PollAnswer::create([
                'poll_id' => $poll->id,
                'answer' => $answer['answer']
            ]);
        }

        return new PollResource($poll);
    }

    public function show(Poll $poll, Request $request)
    {
        $user = $request->user();

        if($user->id !== $poll->user_id) { 
            return abort(403, 'Unauthorized action');
        }

        return new PollResource($poll);
    }

    public function update(Request $request, Poll $poll)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'description' => 'nullable|string',
            'end_date' => 'nullable|date|after:today',
            'question' => 'required|string',
            'answer' => 'array'
        ]);

        if($validator->fails()) {
            return $this->sendError('Validation error: ', $validator->errors());
        }

        $input = $request->all();
        $user = $request->user();

        if($user->id !== $poll->user_id) { 
            return abort(403, 'Unauthorized action');
        }

        $poll->update([
            'title' => $input['title'],
            'slug' => preg_replace('/[^A-Za-z0-9]+/', '-', strtolower($input['title'])),
            'description' => $input['description'],
            'end_date' => $input['end_date'],
            'question' => $input['question'],
        ]);

        $existingIds = $poll->answers()->pluck('id')->toArray();
        $newIds = Arr::pluck($input['answer'], 'id');
        $toAdd = array_diff($newIds, $existingIds);
        $toDelete = array_diff($existingIds, $newIds);

        PollAnswer::destroy($toDelete);

        foreach ($input['answer'] as $id => $answer) {
            if (in_array($answer['id'], $toAdd)) {
                PollAnswer::create([
                    'poll_id' => $poll->id,
                    'answer' => $answer
                ]);
            }
        }

        $map = collect($input['answer'])->keyBy('id');
        foreach ($poll->answers as $answer) {
            if (isset($map[$answer->id])) {
                $this->updateAnswer($answer, $map[$answer->id]);
            }
        }

        return new PollResource($poll);
    }

    public function destroy(Poll $poll, Request $request)
    {
        $user = $request->user();

        if($user->id !== $poll->user_id) { 
            return abort(403, 'Unauthorized action');
        }

        $poll->delete();

        return response('', 204);
    }

    private function updateAnswer(PollAnswer $answer, $data)
    {
        $validator = Validator::make($data, [
            'id' => 'exists:App\Models\PollAnswer,id',
            'answer' => 'required|string',
        ]);

        return $answer->update($validator->validated());
    }

    public function getBySlug($slug)
    {
        $poll = Poll::with(['answers'])->where('slug', $slug)->first();

        if(is_null($poll)) { return response("", 404); }

        $currentDate = new \DateTime();
        $expireDate = new \DateTime($poll['end_date']);
        if ($currentDate > $expireDate) { return response("", 404); }

        return new PollResource($poll);
    }

    public function storeAnswer(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pollId' => 'required',
            'answerId' => 'required',
        ]);

        if($validator->fails()) {
            return $this->sendError('Validation error: ', $validator->errors());
        }

        $user = $request->user();
        $input = $request->all();

        PollUserVote::create([
            'poll_id' => $input['pollId'],
            'answer_id' => $input['answerId'],
            'user_id' => $user->id,
        ]);

        return response("", 201);
    }
}
