<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChecksTable extends Migration
{
    public function up()
    {
        Schema::create('checks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('url_id')->constrained()->onDelete('cascade');
            $table->unsignedSmallInteger('status_code');
            $table->unsignedInteger('load_time')->nullable();
            $table->boolean('content_check');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('checks');
    }
}
