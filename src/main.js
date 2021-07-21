// para criar o servidor que ouvirá as requisições
import { createServer } from 'http';

// lerá/exibirá os arquivos (no caso os htmls)
import { readFile } from 'fs';

// pegará o caminho relativo do arquivo que fizer o uso
import { resolve } from 'path';

// faz o 'parse' dos dados recebidos (encoding)
import { parse } from 'querystring';

//servidor que ouvirá as requisições
const server = createServer((request, response) => {

    // tratamento das urls que farão parte do roteamento
    switch (request.url) {
        case '/status': {

            // 200: código para sucesso
            response.writeHead(200, {
                'Content-type': 'application/json'
            });

            // escreve (o JSON abaixo) no document
            response.write(
                JSON.stringify({
                    status: 'successssss'
                })
            );

            // finaliza as tratativas dessa rota
            response.end();
            break;
        }
        case '/sign-in': {

            // lê o dir da pasta onde contém o arquivo que está chamando
            const path = resolve(__dirname, 'pages/sign-in.html');

            // lê o arquivo (no caso o html) para ser exibido
            readFile(path, (error, file) => {
                // por padrão, trata-se primeiro o erro
                if (error) {

                    // 500: código para erro interno (lado do servidor)
                    response.writeHead(500, 'Can\'t process HTML file');

                    // finaliza as tratativas dessa rota
                    response.end();
                    return;
                }
                // depois o sucesso

                // escreve o status da resposta da requisição
                response.writeHead(200);

                // lê/exibe o arquivo (no caso o html)
                response.write(file);

                // finaliza as tratativas dessa rota
                response.end();
            });
            break;
        }
        case '/home': {

            // lê o dir da pasta onde contém o arquivo que está chamando
            const path = resolve(__dirname, 'pages/home.html');

            // lê o arquivo (no caso o html) para ser exibido
            readFile(path, (error, file) => {
                // por padrão, trata-se primeiro o erro
                if (error) {
                    response.writeHead(500, 'Can\'t process HTML file');
                    response.end();
                    return;
                }
                // depois o sucesso

                // escreve o status da resposta da requisição
                response.writeHead(200);
                response.write(file);

                // finaliza as tratativas dessa rota
                response.end();
            });
            break;
        }
        case '/authenticate': {
            let data = '';

            request.on('data', (chunk) => {
                // junta os dados recebidos à variável do escopo da rota
                data += chunk;
            });

            // ao terminar as tratativas, executa...
            request.on('end', () => {

                // guarda na var do escopo, os dados tratados (caracteres) usando o parse
                let params = parse(data);
                // console.log(params);

                // 301: código para redirecionamento
                response.writeHead(301, {
                    Location: '/home',
                });

                // finaliza as tratativas dessa rota
                response.end();
            })
            break;
        }
        default: {
            // rota padrão para quando não for encontrado a rota acessada

            // escreve o status da resposta da requisição
            response.writeHead(404, 'Service not found.');

            // finaliza as tratativas dessa rota
            response.end();
        }
    }

});

// variáveis de ambiente
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8000;
const HOSTNAME = process.env.PORT || '127.0.0.1';

// o servidor sendo executado de fato
server.listen(PORT, URL, () => {
    console.log(`Server's listening at http://${HOSTNAME}:${PORT}`)
});