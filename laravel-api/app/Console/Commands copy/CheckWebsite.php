<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use GuzzleHttp\Client;
use App\Models\Url;
use App\Models\Check;

class CheckWebsite extends Command
{
    protected $signature = 'check:website {urlId}';

    protected $description = 'Check the availability of a website';

    public function handle()
    {
        $urlId = $this->argument('urlId');
        $url = Url::findOrFail($urlId);

        $statusCode = $this->isWebsiteAvailable($url->url);
        $loadTime = $statusCode ? intval($this->getResponseTime($url->url)) : 0;

        $check = Check::create([
            'url_id' => $urlId,
            'status_code' => $statusCode,
            'load_time' => $loadTime,
            'content_check' => true,
        ]);

        $this->info("Check for URL ID $urlId completed successfully.");
    }

    private function isWebsiteAvailable($url)
    {
        try {
            $client = new Client(['timeout' => 10]);
            $response = $client->request('GET', $url);
            return $response->getStatusCode();
        }  catch (\GuzzleHttp\Exception\RequestException $e) {
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
}
