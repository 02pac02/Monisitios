<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use GuzzleHttp\Client;
use App\Models\Url;
use App\Models\Check;
use GuzzleHttp\Exception\RequestException;

class CheckWebsite extends Command
{
    protected $signature = 'check:website {urlId}';
    protected $description = 'Check the availability of a specific website';

    public function handle()
    {
        $urlId = $this->argument('urlId');
        $url = Url::find($urlId);

        if (!$url) {
            $this->error("URL with ID $urlId not found.");
            return;
        }

        $this->info("Checking URL ID $urlId: {$url->url}");

        $client = new Client();
        try {
            $start = microtime(true);
            $response = $client->get($url->url);
            $end = microtime(true);

            $statusCode = $response->getStatusCode();
            $loadTime = $this->getResponseTime($url->url); // Llama al método correctamente

            // Crear un nuevo registro en la tabla 'Check'
            Check::create([
                'url_id' => $url->id,
                'status_code' => $statusCode,
                'load_time' => $loadTime,
                'content_check' => 1, // Si necesitas verificar algún contenido, ajusta esto
            ]);

            $this->info("Checked URL ID $urlId: {$url->url} - Status $statusCode - Load Time $loadTime seconds");

            // Verificar y borrar los registros más antiguos si hay más de 50
            // $this->deleteOldRecords($url->id);
        } catch (RequestException $e) {
            $this->error("Error checking URL ID $urlId: {$e->getMessage()}");
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

    private function deleteOldRecords($urlId)
    {
        $checksCount = Check::where('url_id', $urlId)->count();
        if ($checksCount > 50) {
            $checksToDelete = Check::where('url_id', $urlId)
                                   ->orderBy('created_at', 'asc')
                                   ->take($checksCount - 50)
                                   ->get();

            foreach ($checksToDelete as $check) {
                $check->delete();
            }

            $this->info("Deleted " . ($checksCount - 50) . " old records for URL ID $urlId.");
        }
    }
}
