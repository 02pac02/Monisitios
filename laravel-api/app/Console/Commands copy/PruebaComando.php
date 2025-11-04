<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Prueba;


class PruebaComando extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:prueba';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Comando de prueba';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $prueba = new Prueba;
        $prueba->save();
    }
}
