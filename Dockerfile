ARG CACHEBUST=1

# Use a imagem base do Ubuntu
FROM ubuntu:18.04

# Configurar variáveis de ambiente para o SQL Server
ENV ACCEPT_EULA=Y
ENV MSSQL_SA_PASSWORD=jK3!qY8@rW2#
ENV MSSQL_PID=Express
ENV DEBIAN_FRONTEND=noninteractive

# Instalar o SQL Server
RUN apt-get update \
    && apt-get install -y wget software-properties-common \
    && wget -qO- https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
    && add-apt-repository "$(wget -qO- https://packages.microsoft.com/config/ubuntu/18.04/mssql-server-2019.list)" \
    && apt-get update \
    && apt-get install -y mssql-server

# Instalar utilitários necessários, Node.js, npm, yarn, PM2 e o cliente SQLCMD
RUN apt-get update \
    && apt-get install -y curl apt-transport-https gnupg2

# Instalar Node.js
RUN apt-get update \
    && apt-get install -y curl apt-transport-https gnupg2 \
    && curl -sL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs

# Instalar Yarn
RUN curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | tee /usr/share/keyrings/yarnkey.gpg >/dev/null \
    && echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt-get update && apt-get install yarn

# Instalar PM2 globalmente
RUN yarn global add pm2

RUN curl -sL https://packages.microsoft.com/config/ubuntu/18.04/prod.list | tee /etc/apt/sources.list.d/msprod.list \
    && apt-get update \
    && apt-get install -y mssql-tools unixodbc-dev nginx git

RUN echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bashrc

# Expor a porta do SQL Server e a porta do NGINX
EXPOSE 1433 3000

# Clonar o repositório do projeto

RUN echo $CACHEBUST > /dev/null
RUN echo $CACHEBUST > /dev/null
RUN git clone https://github.com/adrielmendes28/typescript-harvester-tracking-data-classifier /app

# Instalar dependências e construir o frontend
WORKDIR /app/front-end
RUN yarn install

# Instalar dependências e construir o backend
WORKDIR /app/back-end
RUN yarn install && yarn build

RUN echo $CACHEBUST > /dev/null

# Iniciar o SQL Server, o frontend no NGINX e o backend com o PM2
# Criar o script de inicialização start.sh
# Invalidar o cache para garantir que as mudanças sejam aplicadas
RUN echo $CACHEBUST > /dev/null
RUN echo $CACHEBUST > /dev/null
RUN echo $CACHEBUST > /dev/null


# Configurar o NGINX para fazer proxy reverso para a porta do React e para a porta da API
RUN echo 'events {}' > /etc/nginx/nginx.conf \
    && echo 'http {' >> /etc/nginx/nginx.conf \
    && echo '    server {' >> /etc/nginx/nginx.conf \
    && echo '        listen 3000;' >> /etc/nginx/nginx.conf \
    && echo '        location /api {' >> /etc/nginx/nginx.conf \
    && echo '            proxy_pass http://localhost:3333;' >> /etc/nginx/nginx.conf \
    && echo '            proxy_http_version 1.1;' >> /etc/nginx/nginx.conf \
    && echo '            proxy_set_header Upgrade $http_upgrade;' >> /etc/nginx/nginx.conf \
    && echo '            proxy_set_header Connection "upgrade";' >> /etc/nginx/nginx.conf \
    && echo '            proxy_set_header Host $host;' >> /etc/nginx/nginx.conf \
    && echo '            proxy_cache_bypass $http_upgrade;' >> /etc/nginx/nginx.conf \
    && echo '        }' >> /etc/nginx/nginx.conf \
    && echo '        location /spa {' >> /etc/nginx/nginx.conf \
    && echo '            proxy_pass http://localhost:3000;' >> /etc/nginx/nginx.conf \
    && echo '            proxy_http_version 1.1;' >> /etc/nginx/nginx.conf \
    && echo '            proxy_set_header Upgrade $http_upgrade;' >> /etc/nginx/nginx.conf \
    && echo '            proxy_set_header Connection "upgrade";' >> /etc/nginx/nginx.conf \
    && echo '            proxy_set_header Host $host;' >> /etc/nginx/nginx.conf \
    && echo '            proxy_cache_bypass $http_upgrade;' >> /etc/nginx/nginx.conf \
    && echo '        }' >> /etc/nginx/nginx.conf \
    && echo '    }' >> /etc/nginx/nginx.conf \
    && echo '}' >> /etc/nginx/nginx.conf

RUN echo "#!/bin/bash" > /start.sh \
    && echo "/opt/mssql/bin/sqlservr &" >> /start.sh \
    && echo "sleep 60" >> /start.sh \
    && echo "echo 'Iniciando a criação do banco de dados canalog em background...'" >> /start.sh \
    && echo "/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P 'jK3!qY8@rW2#' -Q \"CREATE DATABASE canalog;\" &" >> /start.sh \
    && echo "sleep 20" >> /start.sh \
    && echo "echo 'Iniciando o SPA em modo de desenvolvimento...'" >> /start.sh \
    && echo "cd /app/front-end && yarn start &" >> /start.sh \
    && echo "echo 'Iniciando NGINX...'" >> /start.sh \
    && echo "nginx" >> /start.sh \
    && echo "echo 'Iniciando o aplicativo Node.js...'" >> /start.sh \
    && echo "node /app/back-end/dist/src/index.js" >> /start.sh \
    && chmod +x /start.sh

    
CMD ["/start.sh"]
