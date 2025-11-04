<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('website_checks', function (Blueprint $table) {
            $table->id();
            $table->string('url');
            $table->boolean('status');
            $table->integer('response_time'); // en milisegundos
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('website_checks');
    }
};
