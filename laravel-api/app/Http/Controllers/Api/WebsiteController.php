<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use GuzzleHttp\Client;
use App\Models\Url;
use App\Models\Check;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\UrlRequest;
use Illuminate\Support\Facades\DB;

class WebsiteController extends Controller
{

    public function showForm()
    {
        $urls = Url::with(['checks' => function ($query) {
            $query->orderBy('created_at', 'desc')->take(10);
        }])->get();

        $totalChecks = Check::count();
        $successfulChecks = Check::where('status_code', 200)->count();
        $availabilityPercentage = $totalChecks > 0 ? ($successfulChecks / $totalChecks) * 100 : 0;
        $averageResponseTime = $totalChecks > 0 ? Check::avg('load_time') : 0;

        $htmlContent = '';
        if ($urls->isEmpty()) {
            $htmlContent .= '<p>No se han realizado verificaciones de sitios web todavía.</p>';
        } else {
            $htmlContent .= '
            <p>Total de verificaciones realizadas: ' . $totalChecks . ' </p>
            <p>Porcentaje de disponibilidad: ' . number_format($availabilityPercentage, 2) . '%</p>
            <p>Tiempo de respuesta promedio: ' . number_format($averageResponseTime, 2) . ' ms</p>
            ';
            foreach ($urls as $url) {
                $htmlContent .= '
                <h2>Verificaciones para: ' . $url['url'] . '</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Estado</th>
                            <th>Tiempo de Respuesta (ms)</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                ';
                foreach ($url->checks as $check) {
                    $htmlContent .= '
                            <tr>
                                <td>' . ($check['status_code'] ? 'Disponible' : 'No Disponible') . '</td>
                                <td>' . $check['load_time'] . '</td>
                                <td>' . $check['created_at'] . '</td>
                            </tr>
                            ';
                }
                $htmlContent .= '
                    </tbody>
                </table>
                ';
            }
        }

        return response($htmlContent, 200)->header('Content-Type', 'text/html');
    }

    public function checkWebsite(UrlRequest $request)
    {
        $htmlContent = '';

        // Iniciar una transacción de base de datos
        DB::beginTransaction();

        try {
            // Obtener el ID del URL anterior registrado
            $previousUrl = Url::where('user_id', $request->input('user_id'))
                ->where('url', $request->input('url'))
                ->latest('id')
                ->first();

            // Actualizar o crear el registro de URL
            // $urlh = $request->input('url');
            $url = Url::updateOrCreate(
                [
                    'user_id' => $request->input('user_id'),
                    'url' => $request->input('url')
                ],
                [
                    'interval' => $request->input('interval')
                ]
            );

            // Verificar si el modelo fue creado recientemente o no
            if (!$url->wasRecentlyCreated) {
                $htmlContent .= 'Se ha actualizado el registro existente.';
            } else {
                $htmlContent .= 'Se ha creado un nuevo registro.';
            }

            // Verificar la disponibilidad del sitio web y guardar el registro del cheque
            $statusCode = $this->isWebsiteAvailable($url->url);
            $loadTime = $statusCode ? intval($this->getResponseTime($url->url)) : 0;

            // Usar el ID del URL anterior si existe
            $urlId = $previousUrl ? $previousUrl->id : $url->id;
            // $htmlContent .= "<br/>" . $urlId . " " . $statusCode . " " . $loadTime . "<br/>";
            // $htmlContent .= gettype($urlId) . " " . gettype($statusCode) . " " . gettype($loadTime);
            $check = Check::create([
                'url_id' => $urlId,
                'status_code' => $statusCode,
                'load_time' => $loadTime,
                'content_check' => true,
            ]);

            // Confirmar la transacción si todo se realizó correctamente
            DB::commit();
        } catch (\Exception $e) {
            // Revertir la transacción si ocurre algún error
            DB::rollback();
            // Manejar el error
            return response('Error en la solicitud', 500)->header('Content-Type', 'text/html');
        }

        // Devolver la respuesta exitosa
        return response($htmlContent, 200)->header('Content-Type', 'text/html');
    }



    private function isWebsiteAvailable($url)
    {
        try {
            $client = new Client(['timeout' => 10]);
            $response = $client->request('GET', $url);
            return $response->getStatusCode();
        } catch (\GuzzleHttp\Exception\RequestException $e) {
            if ($e->hasResponse()) {
                return $e->getResponse()->getStatusCode();
            }
        } catch (\Exception $e) {
            return $response->getStatusCode();
        }
    }

    private function getResponseTime($url)
    {
        $start = microtime(true);
        try {
            $client = new Client(['timeout' => 10]);
            $client->request('GET', $url);
        } catch (\Exception $e) {
            // Ignorar la excepción ya que isWebsiteAvailable maneja esto
        }
        return (microtime(true) - $start) * 1000; // Tiempo en milisegundos
    }

    public function getCheckData()
    {
        $urls = Url::with(['checks' => function ($query) {
            $query->orderBy('created_at', 'desc');
        }])->get();

        $totalChecks = Check::count();
        $successfulChecks = Check::where('status_code', 200)->count();
        $availabilityPercentage = $totalChecks > 0 ? ($successfulChecks / $totalChecks) * 100 : 0;
        $averageResponseTime = $totalChecks > 0 ? Check::avg('load_time') : 0;

        $data = [
            'totalChecks' => $totalChecks,
            'successfulChecks' => $successfulChecks,
            'availabilityPercentage' => $availabilityPercentage,
            'averageResponseTime' => $averageResponseTime,
            'urls' => $urls->map(function ($url) {
                return [
                    'url' => $url->url,
                    'checks' => $url->checks->map(function ($check) {
                        return [
                            'status_code' => $check->status_code,
                            'load_time' => $check->load_time,
                            'created_at' => $check->created_at,
                        ];
                    }),
                ];
            }),
        ];

        return response()->json($data)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
    
    public function getChecksByURLId($id)
    {
        try {
            // Verificar si la URL existe
            $url = Url::with(['checks' => function ($query) {
                $query->latest();
            }])->find($id);
    
            if (!$url) {
                return response()->json(['error' => 'URL not found'], 404);
            }
    
            // Obtener las verificaciones asociadas a la URL, ordenadas por fecha descendente
            $checks = $url->checks;
    
            // Calcular estadísticas específicas de la URL
            $totalChecks = $checks->count();
            $successfulChecks = $checks->where('status_code', 200)->count();
            $availabilityPercentage = $totalChecks > 0 ? ($successfulChecks / $totalChecks) * 100 : 0;
            $averageResponseTime = $totalChecks > 0 ? $checks->avg('load_time') : 0;
    
            // Preparar los datos para la respuesta JSON
            $data = [
                'totalChecks' => $totalChecks,
                'successfulChecks' => $successfulChecks,
                'availabilityPercentage' => $availabilityPercentage,
                'averageResponseTime' => $averageResponseTime,
                'url' => $url->url,
                'checks' => $checks->map(function ($check) {
                    return [
                        'status_code' => $check->status_code,
                        'load_time' => $check->load_time,
                        'created_at' => $check->created_at->toISOString(), // Convertir a ISO 8601
                    ];
                }),
            ];
    
            // Devolver los datos como respuesta JSON
            return response()->json($data)
                ->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        } catch (\Exception $e) {
            // Manejar cualquier excepción que pueda ocurrir
            return response()->json(['error' => 'Internal server error: ' . $e->getMessage()], 500);
        }
    }
    
    
}
