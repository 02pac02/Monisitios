<?php

namespace App\Jobs;

use App\Models\Url;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;

class CheckWebsite implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $urlId;

    public function __construct($urlId)
    {
        $this->urlId = $urlId;
    }

    public function handle()
    {
        try {
            $url = Url::find($this->urlId);
            if ($url) {
                // Ejecutar el comando para verificar la URL
                $command = 'check:website ' . $this->urlId;
                Artisan::call($command);

                // Programar la próxima verificación
                CheckWebsite::dispatch($this->urlId)->delay(now()->addSeconds($url->interval));
            }
        } catch (\Exception $e) {
            Log::error("Error in CheckWebsite Job for URL ID: {$this->urlId} - " . $e->getMessage());
        }
    }
}
