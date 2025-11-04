<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use \App\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Role::insert([
            ['name' => 'Super Admin'],
            ['name' => 'Author'],
            ['name' => 'Editor']
        ]);
        /*User::insert([
            "name"=> "admin",
            "email"=> "admin@admin.com",
            "password"=> "admin",
            "role_id"=> "1"
        ]);*/
    }
}
