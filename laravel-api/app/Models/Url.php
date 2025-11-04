<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Url extends Model
{
    protected $fillable = ['url', 'interval', 'user_id'];

    public function checks()
    {
        return $this->hasMany(Check::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

