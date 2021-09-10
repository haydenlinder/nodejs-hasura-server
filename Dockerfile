FROM node:14.15.0
WORKDIR /app
COPY . /app
RUN npm install --only=production
RUN npm run build
CMD npm start
