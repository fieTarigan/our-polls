<?php

namespace App\Http\Controllers;

use App\Http\Resources\LatestPollResource;
use App\Models\Poll;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $totalPolls = Poll::where('user_id', $user->id)->count();
        $latestPoll = Poll::where('user_id', $user->id)->latest('created_at')->first();
        
        return [
            'totalPolls' => $totalPolls,
            'latestPoll' => $latestPoll ? new LatestPollResource($latestPoll) : null,
        ];
    }
}
