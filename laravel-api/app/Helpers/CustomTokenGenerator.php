<?php 
namespace App\Helpers;

use Firebase\JWT\JWT;

class CustomTokenGenerator
{
    public static function generateToken($tokenData)
    {
        // Configura los datos de tu token
        $tokenId = base64_encode(random_bytes(32)); // Identificador único para el token
        $issuedAt = time(); // Tiempo en que se emitió el token
        $expirationTime = $issuedAt + 60 * 60; // Tiempo de expiración del token (1 hora)

        // Configura el payload del token
        $payload = [
            'iat' => $issuedAt, // Tiempo de emisión del token (issued at)
            'exp' => $expirationTime, // Tiempo de expiración del token
            'data' => $tokenData, // Datos adicionales que deseas incluir en el token
        ];

        // Codifica el token utilizando JWT
        $key = 'uk$$z4@%Yy8>4-!np"cT81QT&-%{VKB1XSIdK}nz26~H]Gv]\4';
        $jwt = JWT::encode($payload, $key, 'HS512');

        return $jwt;
    }
}