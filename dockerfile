 FROM node:14.15.0
 WORKDIR /app
 COPY . /app
 RUN npm install 
 CMD npm run dev