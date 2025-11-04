<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Url;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;

class UrlController extends Controller
{
    // public function index()
    // {
    //     $htmlContent = '';

    //     $htmlContent .= '
    //     <div>
    //         <h1>¡Hola desde la API de Laravel!</h1>
    //         <p style="color:red;">Este es un contenido HTML dinámico.</p>
    //     </div>
    //     ';

    //     // $user = User::all();
    //     // foreach ($user as $i => $v) {
    //     //     $htmlContent .= $v['name'] . '<br/>';
    //     // }

    //     return response($htmlContent, 200)->header('Content-Type', 'text/html');
    // }
    public function index(Request $request)
    {
        try {
            $userId = $request->user_id;
    
            $urls = Url::with(['checks' => function ($query) {
                $query->orderBy('created_at', 'desc')->take(1);
            }])
            ->where('user_id', $userId)
            ->get();
    
            $data = [
                // 'user_id' => $userId,
                'urls' => $urls->map(function ($url) {
                    return [
                        'id' => $url->id,
                        'url' => $url->url,
                        'checks' => $url->checks->map(function ($check) {
                            return [
                                'load_time' => $check->load_time,
                                'created_at' => $check->created_at,
                            ];
                        }),
                    ];
                }),
            ];
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }    


    // Obtener detalles de una URL específica
    public function show($id)
    {
        try {
            $url = Url::findOrFail($id);
            return response()->json($url);
        } catch (\Exception $e) {
            return response()->json(['error' => 'URL not found'], 404);
        }
    }

    // Crear una nueva URL
    public function store(Request $request)
    {
        try {
            $url = Url::create($request->all());
            return response()->json($url, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Could not create URL'], 500);
        }
    }

    // Actualizar una URL existente
    public function update(Request $request, $id)
    {
        try {
            $url = Url::findOrFail($id);
            $url->update($request->all());
            return response()->json($url, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'URL not found'], 404);
        }
    }

    // Eliminar una URL
    public function destroy($id)
    {
        try {
            $url = Url::findOrFail($id);
            $url->delete();
            return response()->json(null, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'URL not found'], 404);
        }
    }
}
