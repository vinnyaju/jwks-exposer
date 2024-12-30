import * as jose from 'node-jose';

const pemKey = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAtPaseQPBFI8c9cruRM+x
v48WYJErHTNTEjw3iqh1uRN9asXDt94AzR9Pa0O7VgjVHsbn8wdhyGr/l2resoJb
1lA29SNgnKYefjaG3iUF5LevhekRUx6/vZuzC5V7C3/Jllc2YFqq9O5IaM23p+Ce
GB7xIE7fOs3lO4g2TADu51cINpNQmcx79jojt8MJjGUAiPmT8Z69BDAN4y5L0pXj
BU8jk2IePg5F15NhgQBFZA5wD1Jf3PdpxajbSAMlnk2T77X10megBHUqVpFQO1rH
HKEAKGdkYRMDTMwKKTIDCOyCu3zPIglaFmaoxqO2E62byzJbfITaTpgzU25zGj5V
LAFk9rsZcU8675+gCs04idw5iwz8ObxIembkgQbe3UoMfNOLQiB3pKa0kRVsF3Hp
08w6vLnQ+iDNvwZuI+cJ4jFH8eA0FXwq5ZxzBHoOEQyn2qp4fZTUyKNSHcL/9QqV
Pxiqyp26gWRWfttXsILT89voRuO1fOGOJds8SjLbwS4H3unhCuH+GQHAlcNUF6uV
dO0VC9Vx5lMrmyNJW0vmEkKaV4FyiOUi31qeEWYkBQIAIFv/+WBiwxPUnqhDsqSg
KEDnikVFy5Jy5ejcFN1eEWyor5dftdRfFU1G9BzxUIgRoba01nvQa53AlZuyinrH
t9i/EVZaGFmfLplArcrjV0sCAwEAAQ==
-----END PUBLIC KEY-----`;

async function convertPemToJwk() {
  try {
    // Converte a chave PEM para JWK
    let key = await jose.JWK.asKey(pemKey, 'pem');
    
    // Adiciona informações para uso em JWKS
    const jwk = {
      ...key.toJSON(),
      kid: 'unique-key-id', // Identificador único
      use: 'sig',           // Uso da chave
      alg: 'RS256',         // Algoritmo associado
    };

    const jwks = { keys: [jwk] };

    console.log('JWKS:', JSON.stringify(jwks, null, 2));
  } catch (error) {
    console.error('Erro ao converter chave para JWK:', error.message);
  }
}

convertPemToJwk();
