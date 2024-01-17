<?php

namespace App\Http\Controllers;

use App\Http\Requests\SignupRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function signup(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|email|string|unique:users,email',
            'password' => [
                'required',
                'confirmed',
                Password::min(8)->mixedCase()->numbers()->symbols()
            ],
        ]);

        if ($validator->fails()) {
            return response([
                'success' => false,
                'message' => $validator->errors(),
            ], 500);
            // return $this->sendError('Validation error: ', $validator->errors());
        }

        $input = $request->all();
        $input['password'] = bcrypt($input['password']);

        $user = User::create($input);

        $token = $user->createToken('token')->accessToken;

        return response([
            'user' => $user,
            'token' => $token
        ]);
    }
    
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|string',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation error: ', $validator->errors());
        }

        if(Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            /** @var User $user */
            $user = Auth::user();
            $token = $user->createToken('token')->accessToken;

            return response([
                'user' => $user,
                'token' => $token
            ]);
        } else {
            return $this->sendError('Login failed', ['error' => 'Unauthorized']);
        }
    }

    public function logout(Request $request)
    {
        /** @var User $user */
        $user = Auth::user()->token();
        $user->revoke();

        return response([
            'success' => true
        ]);
    }

    public function me(Request $request)
    {
        return $request->user();
    }
}
