<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Response;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\Log;
use App\Helpers\CustomTokenGenerator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        try {
            $user = User::create($request->validated());
            return response()->json($user);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }

    public function login(LoginRequest $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response([
                'errors' => 'Credenciales incorrectas'
            ], Response::HTTP_UNAUTHORIZED);
        }
        $user = Auth::user();
        $customToken = CustomTokenGenerator::generateToken([
            'user_id' => $user->id,
            'email' => $user->email,
        ]);

        return response(['custom_token' => $customToken]);
    }

    public function logout(Request $request)
    {
        $token = $request->bearerToken();
        $key = env('JWT_SECRET');
        if ($token) {
            try {
                $decoded = JWT::decode($token, new Key($key, 'HS512'));
                $userId = $decoded->data->user_id;
                return response()->json(['message' => 'Sesión cerrada correctamente']);
            } catch (\Exception $e) {
                Log::error('Error decoding token: ' . $e->getMessage());
                return response()->json(['message' => 'Token no válido'], 401);
            }
        }
        return response()->json(['message' => 'Token no encontrado'], 401);
    }

    public function getUserData(Request $request)
    {
        $token = $request->bearerToken();
        $key = env('JWT_SECRET');
        if ($token) {
            try {
                $decoded = JWT::decode($token, new Key($key, 'HS512'));
                $userId = $decoded->data->user_id;
                $user = User::find($userId);
                if ($user) {
                    return response()->json($user);
                } else {
                    return response()->json(['message' => 'Usuario no encontrado'], 404);
                }
            } catch (\Exception $e) {
                Log::error('Error decoding token: ' . $e->getMessage());
                return response()->json(['message' => 'Token no válido'], 401);
            }
        }
        return response()->json(['message' => 'Token no encontrado'], 401);
    }

    public function updateUserData(Request $request)
    {
        $token = $request->bearerToken();
        $key = env('JWT_SECRET');
        if ($token) {
            try {
                $decoded = JWT::decode($token, new Key($key, 'HS512'));
                $userId = $decoded->data->user_id;
                $user = User::find($userId);
                if ($user) {
                    $validatedData = $request->validate([
                        'name' => 'required|string|max:255',
                        'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
                    ]);

                    $user->name = $validatedData['name'];
                    $user->email = $validatedData['email'];
                    $user->save();

                    return response()->json($user, 200);
                } else {
                    return response()->json(['message' => 'Usuario no encontrado'], 404);
                }
            } catch (\Exception $e) {
                Log::error('Error decoding token: ' . $e->getMessage());
                return response()->json(['message' => 'Token no válido'], 401);
            }
        }
        return response()->json(['message' => 'Token no encontrado'], 401);
    }

    public function changePassword(Request $request)
    {
        $token = $request->bearerToken();
        $key = env('JWT_SECRET');
        if ($token) {
            try {
                $decoded = JWT::decode($token, new Key($key, 'HS512'));
                $userId = $decoded->data->user_id;
                $user = User::find($userId);
                if ($user) {
                    $validatedData = $request->validate([
                        'current_password' => 'required|string',
                        'new_password' => 'required|string',
                    ]);

                    if (Hash::check($validatedData['current_password'], $user->password)) {
                        $user->password = Hash::make($validatedData['new_password']);
                        $user->save();

                        return response()->json(['message' => 'Contraseña actualizada correctamente'], 200);
                    } else {
                        return response()->json(['message' => 'Contraseña actual incorrecta'], 400);
                    }
                } else {
                    return response()->json(['message' => 'Usuario no encontrado'], 404);
                }
            } catch (\Exception $e) {
                Log::error('Error decoding token: ' . $e->getMessage());
                return response()->json(['message' => 'Token no válido'], 401);
            }
        }
        return response()->json(['message' => 'Token no encontrado'], 401);
    }
}
