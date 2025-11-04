<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use DOMDocument;
use App\Models\Url;
use App\Models\Check;

class CheckController extends Controller
{
    public function showForm()
    {
        return view('check-form');
    }

    public function checkWebsite(Request $request)
    {
        // Valida la entrada del formulario
        $validatedData = $request->validate([
            'url' => 'required|url',
        ]);

        // Guarda la URL en la base de datos (suponiendo que tienes un modelo Url)
        $url = new Url();
        $url->url = $validatedData['url'];
        $url->save();

        // Realiza las comprobaciones y guarda los resultados
        $status_code = $this->checkStatusCode($validatedData['url']);
        $load_time = $this->checkLoadTime($validatedData['url']);
        $content_check = $this->checkContent($validatedData['url']) ? 'Presente' : 'No presente';

        $check = new Check();
        $check->url_id = $url->id;
        $check->status_code = $status_code;
        $check->load_time = $load_time;
        $check->content_check = $content_check;
        $check->save();

        // Redirecciona de vuelta al formulario con un mensaje de éxito
        return redirect('/')->with('success', 'Website checked successfully.');
    }

    public function showCheckWebsite()
    {
        $urls = Url::with('checks')->get();
        $results = [];

        foreach ($urls as $url) {
            $result = [
                'url' => $url->url,
                'status_code' => $this->checkStatusCode($url->url),
                'load_time' => $this->checkLoadTime($url->url),
                'content_check' => $this->checkContent($url->url) ? 'Presente' : 'No presente',
            ];

            $results[] = $result;
        }

        return view('check-website', compact('results'));
    }

    public function checkStatusCode($url)
    {
        try {
            $client = new Client();
            $response = $client->request('GET', $url);
            return $response->getStatusCode();
        } catch (RequestException $e) {
            return null; // Si hay un error en la solicitud, retorna null
        }
    }

    public function checkLoadTime($url)
    {
        $start = microtime(true);
        try {
            $client = new Client();
            $response = $client->request('GET', $url);
            $end = microtime(true);
            return round(($end - $start) * 1000); // Convertimos a milisegundos
        } catch (RequestException $e) {
            return null; // Si hay un error en la solicitud, retorna null
        }
    }

    public function checkContent($url)
    {
        try {
            $client = new Client();
            $response = $client->request('GET', $url);
            $html = $response->getBody()->getContents();
            return strpos($html, 'example') !== false;
        } catch (RequestException $e) {
            return false; // Si hay un error en la solicitud, retorna false
        }
    }
}
