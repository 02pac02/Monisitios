<?php

use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UrlController;
use App\Http\Controllers\Api\WebsiteController;
use Illuminate\Support\Facades\Route;

Route::controller(AuthController::class)->group(function (){
    Route::post('/register', 'register');
    Route::post('/login', 'login')->name('login');
    Route::post('/logout', 'logout')->name('logout');
    Route::post('/user', 'getUserData')->name('user');
    Route::put('/user', 'updateUserData')->name('user.update');
    Route::post('/user/change-password', 'changePassword')->name('user.change-password');
});

// Obtener todas las URLs de un usuario
Route::get('/urls', [UrlController::class, 'index']);

// Obtener detalles de una URL específica
Route::get('/urls/{id}', [UrlController::class, 'show']);

// Verificar una nueva URL
Route::post('/urls', [UrlController::class, 'store']);

// Actualizar una URL existente
Route::put('/urls/{id}', [UrlController::class, 'update']);

// Eliminar una URL
Route::delete('/urls/{id}', [UrlController::class, 'destroy']);

// Mostrar formulario de verificación de sitios web
Route::get('/verweb', [WebsiteController::class, 'showForm']);

// Verificar un nuevo sitio web
Route::post('/nuevaweb', [WebsiteController::class, 'checkWebsite']);

// Obtener datos para la gráfica
Route::get('/grafica', [WebsiteController::class, 'getCheckData']);

Route::get('/grafica/{id}', [WebsiteController::class, 'getChecksByURLId']);
