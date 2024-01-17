<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PollController;
use App\Http\Controllers\VoteController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);


Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    Route::get('/polls/{slug}', [PollController::class, 'getBySlug']);
    Route::post('/poll/answer', [PollController::class, 'storeAnswer']);

    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::apiResource('poll', PollController::class);

    // Route::post('polls', [PollController::class, 'store']);
    // Route::put('polls', [PollController::class, 'update']);
    // Route::delete('polls', [PollController::class, 'destroy']);
    // Route::resource('votes', VoteController::class);
});
