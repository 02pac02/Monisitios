<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Check extends Model
{
    protected $fillable = ['url_id', 'status_code', 'load_time', 'content_check'];

    public function url()
    {
        return $this->belongsTo(Url::class);
    }
}

