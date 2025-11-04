<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Url;

class CheckWebsites extends Command
{
    protected $signature = 'check:websites';
    protected $description = 'Check the availability of all websites';

    public function handle()
    {
        $urls = Url::all();

        foreach ($urls as $url) {
            $this->call('check:website', ['urlId' => $url->id]);
        }

        $this->info('Website checks completed.');
    }
}
